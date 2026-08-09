import { randomUUID } from "crypto"
import { Pool, type PoolClient } from "@neondatabase/serverless"

export type SaleItemInput = { productId: string; quantity: number }
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
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return recordSaleWithPool(input, pool, true)
}

/** Injectable boundary used by deterministic rollback/concurrency tests. */
export async function recordSaleWithPool(input: RecordSaleInput, pool: Pick<Pool, "connect" | "end">, closePool = false) {
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

    const requested = new Map<string, number>()
    for (const item of input.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) throw new Error("Sale quantities must be positive integers")
      requested.set(item.productId, (requested.get(item.productId) ?? 0) + item.quantity)
    }
    const productIds = [...requested.keys()].sort()
    const products = await client.query(
      "SELECT id,quantity,selling_price FROM products WHERE tenant_id=$1 AND business_id=$2 AND id=ANY($3::text[]) ORDER BY id FOR UPDATE",
      [input.tenantId, input.businessId, productIds],
    )
    if (products.rows.length !== productIds.length) throw new Error("One or more products were not found in this company")

    let total = 0
    for (const product of products.rows) {
      const quantity = requested.get(product.id)!
      if (Number(product.quantity) < quantity) throw new Error(`Insufficient stock for product ${product.id}`)
      total += Number(product.selling_price) * quantity
    }
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
      await client.query("INSERT INTO sale_lines(tenant_id,business_id,sale_id,product_id,quantity,unit_price) VALUES($1,$2,$3,$4,$5,$6)", [input.tenantId, input.businessId, saleId, product.id, quantity, product.selling_price])
      await client.query("INSERT INTO inventory_movements(id,tenant_id,business_id,product_id,sale_id,movement_type,quantity_delta,resulting_quantity,recorded_by) VALUES($1,$2,$3,$4,$5,'SALE',$6,$7,$8)", [randomUUID(), input.tenantId, input.businessId, product.id, saleId, -quantity, resulting, input.actorId])
    }
    await client.query("INSERT INTO transactions(id,tenant_id,business_id,type,amount,date,category,recorded_by,created_at) VALUES($1,$2,$3,'SALE',$4,NOW(),'Sale',$5,NOW())", [randomUUID(), input.tenantId, input.businessId, total, input.actorId])
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
