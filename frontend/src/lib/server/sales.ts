import { randomUUID } from "crypto"
import type { Pool, PoolClient } from "@neondatabase/serverless"

import { pooledDb } from "./neon"
import { postJournalEntryWithClient, type JournalInput } from "./accounting"

export type SaleItemInput = { productId: string; quantity: number; unitId?: string }
export type RecordSaleInput = {
  tenantId: string
  businessId: string
  actorId: string
  idempotencyKey: string
  customerId?: string
  paymentMethod: "CASH" | "MOBILE_MONEY" | "BANK_TRANSFER" | "CREDIT"
  items: SaleItemInput[]
}

export async function recordSale(input: RecordSaleInput) {
  return recordSaleWithPool(input, pooledDb())
}

/** Injectable boundary used by deterministic rollback/concurrency tests. */
type JournalPoster = (client: PoolClient, input: JournalInput) => Promise<{ id: string; duplicate: boolean }>

export async function recordSaleWithPool(
  input: RecordSaleInput,
  pool: Pick<Pool, "connect" | "end">,
  closePool = false,
  postJournal: JournalPoster = postJournalEntryWithClient,
) {
  if (!input.items.length) throw new Error("A sale requires at least one item")
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const duplicate = await client.query(
      "SELECT id,total_amount FROM sales WHERE tenant_id=$1 AND business_id=$2 AND idempotency_key=$3",
      [input.tenantId, input.businessId, input.idempotencyKey],
    )
    if (duplicate.rows[0]) {
      await client.query("COMMIT")
      return { id: duplicate.rows[0].id as string, totalAmount: Number(duplicate.rows[0].total_amount), duplicate: true }
    }

    const requestedLines = new Map<string, SaleItemInput>()
    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) throw new Error("Sale quantities must be positive integers")
      const key = `${item.productId}\u0000${item.unitId ?? ""}`
      const existing = requestedLines.get(key)
      requestedLines.set(key, { ...item, quantity: item.quantity + (existing?.quantity ?? 0) })
    }
    const productIds = [...new Set([...requestedLines.values()].map((item) => item.productId))].sort()
    const products = await client.query(
      "SELECT id,quantity,selling_price,cost_price,base_unit,status FROM products WHERE tenant_id=$1 AND business_id=$2 AND id=ANY($3::text[]) ORDER BY id FOR UPDATE",
      [input.tenantId, input.businessId, productIds],
    )
    if (products.rows.length !== productIds.length) throw new Error("One or more products were not found in this company")

    const requestedUnitIds = [...new Set([...requestedLines.values()].flatMap((item) => item.unitId ? [item.unitId] : []))]
    const unitRows = await client.query(
      `SELECT id,product_id,unit_name,conversion_factor,selling_price,is_base
       FROM product_units
       WHERE tenant_id=$1 AND business_id=$2 AND product_id=ANY($3::text[])
         AND (is_base OR id=ANY($4::text[]))`,
      [input.tenantId, input.businessId, productIds, requestedUnitIds],
    )
    const productsById = new Map(products.rows.map((product) => [String(product.id), product]))
    const unitsById = new Map(unitRows.rows.map((unit) => [String(unit.id), unit]))
    const baseUnitsByProduct = new Map(unitRows.rows.filter((unit) => unit.is_base === true).map((unit) => [String(unit.product_id), unit]))
    const resolvedLines = [...requestedLines.values()].map((item) => {
      const product = productsById.get(item.productId)
      if (!product || product.status === "inactive") throw new Error("One or more products are inactive or unavailable")
      const unit = item.unitId ? unitsById.get(item.unitId) : baseUnitsByProduct.get(item.productId)
      if (!unit || String(unit.product_id) !== item.productId) throw new Error("The selected product unit was not found in this company")
      const conversionFactor = Number(unit.conversion_factor)
      const baseQuantity = item.quantity * conversionFactor
      if (!Number.isSafeInteger(baseQuantity) || baseQuantity <= 0) throw new Error("Sale quantity is too large")
      const unitPrice = unit.selling_price == null
        ? Number(product.selling_price) * conversionFactor
        : Number(unit.selling_price)
      return { ...item, product, unit, conversionFactor, baseQuantity, unitPrice }
    })
    const requested = new Map<string, number>()
    for (const line of resolvedLines) {
      requested.set(line.productId, (requested.get(line.productId) ?? 0) + line.baseQuantity)
    }

    let total = 0
    let costTotal = 0
    for (const product of products.rows) {
      const quantity = requested.get(product.id)!
      if (Number(product.quantity) < quantity) throw new Error(`Insufficient stock for product ${product.id}`)
      costTotal += Number(product.cost_price || 0) * quantity
    }
    for (const line of resolvedLines) total += line.unitPrice * line.quantity
    if (!Number.isFinite(total) || total <= 0) throw new Error("Sale total is invalid")

    const saleId = randomUUID()
    await client.query(
      "INSERT INTO sales(id,tenant_id,business_id,customer_id,payment_method,total_amount,recorded_by,idempotency_key) VALUES($1,$2,$3,$4,$5,$6,$7,$8)",
      [saleId, input.tenantId, input.businessId, input.customerId || null, input.paymentMethod, total, input.actorId, input.idempotencyKey],
    )
    for (const product of products.rows) {
      const quantity = requested.get(product.id)!
      const resulting = Number(product.quantity) - quantity
      await client.query("UPDATE products SET quantity=$1,version=version+1,updated_at=NOW() WHERE tenant_id=$2 AND business_id=$3 AND id=$4", [resulting, input.tenantId, input.businessId, product.id])
      await client.query("INSERT INTO inventory_movements(id,tenant_id,business_id,product_id,sale_id,movement_type,quantity_delta,resulting_quantity,recorded_by) VALUES($1,$2,$3,$4,$5,'SALE',$6,$7,$8)", [randomUUID(), input.tenantId, input.businessId, product.id, saleId, -quantity, resulting, input.actorId])
    }
    for (const line of resolvedLines) {
      await client.query(
        "INSERT INTO sale_lines(tenant_id,business_id,sale_id,product_id,unit_id,unit_name,conversion_factor,quantity,unit_price) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",
        [input.tenantId, input.businessId, saleId, line.productId, line.unit.id, line.unit.unit_name, line.conversionFactor, line.quantity, line.unitPrice],
      )
    }
    const transactionId = randomUUID()
    await client.query("INSERT INTO transactions(id,tenant_id,business_id,type,amount,date,category,recorded_by,created_at) VALUES($1,$2,$3,'SALE',$4,NOW(),'Sale',$5,NOW())", [transactionId, input.tenantId, input.businessId, total, input.actorId])
    const settlementAccount = input.paymentMethod === "CREDIT"
      ? "AR"
      : input.paymentMethod === "CASH" ? "CASH" : "BANK"
    const journal = await postJournal(client, {
      tenantId: input.tenantId,
      businessId: input.businessId,
      actorId: input.actorId,
      entryDate: new Date().toISOString().slice(0, 10),
      reference: `SALE-${saleId.slice(0, 16)}`,
      description: `Sale ${saleId}`,
      sourceType: "TRANSACTION",
      sourceId: transactionId,
      lines: [
        { systemCode: settlementAccount, debit: total, customerId: input.customerId || null },
        { systemCode: "SALES", credit: total, customerId: input.customerId || null },
        ...(costTotal > 0 ? [
          { systemCode: "COGS", debit: costTotal },
          { systemCode: "INVENTORY", credit: costTotal },
        ] : []),
      ],
    })
    await client.query(
      "UPDATE transactions SET accounting_journal_entry_id=$1 WHERE id=$2 AND tenant_id=$3 AND business_id=$4",
      [journal.id, transactionId, input.tenantId, input.businessId],
    )
    await client.query("INSERT INTO activity_logs(id,tenant_id,business_id,user_id,user_name,action_type,module,description,record_id,timestamp) VALUES($1,$2,$3,$4,$4,'CREATE','Sales',$5,$6,NOW())", [randomUUID(), input.tenantId, input.businessId, input.actorId, `Recorded sale ${saleId}`, saleId])
    await client.query("INSERT INTO integration_outbox(id,event_type,aggregate_id,tenant_id,business_id,payload) VALUES($1,'SALE_RECORDED',$2,$3,$4,$5::jsonb)", [randomUUID(), saleId, input.tenantId, input.businessId, JSON.stringify({ saleId, total })])
    await client.query("COMMIT")
    return { id: saleId, totalAmount: total, duplicate: false }
  } catch (error) {
    await rollback(client)
    throw error
  } finally {
    client.release()
    if (closePool) await pool.end()
  }
}

async function rollback(client: PoolClient) {
  try { await client.query("ROLLBACK") } catch { /* preserve original failure */ }
}
