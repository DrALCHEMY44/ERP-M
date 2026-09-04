import { randomUUID } from "crypto"
import type { PoolClient } from "@neondatabase/serverless"
import { db, pooledDb, withTransientDatabaseRetry } from "./neon"
import { recordExpense, voidExpense } from "./accounting"

const has = (variables: Record<string, unknown>, key: string) => Object.prototype.hasOwnProperty.call(variables, key)

const camelProductUnit = (row: Record<string, unknown>) => ({
  id: row.id, productId: row.product_id, unitName: row.unit_name,
  abbreviation: row.abbreviation, conversionFactor: Number(row.conversion_factor),
  barcode: row.barcode, sellingPrice: row.selling_price == null ? null : Number(row.selling_price),
  isBase: row.is_base === true,
})

const camelProduct = (row: Record<string, unknown>) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, name: row.name,
  category: row.category, quantity: Number(row.quantity), costPrice: row.cost_price == null ? null : Number(row.cost_price),
  sellingPrice: Number(row.selling_price), expiryDate: row.expiry_date, lowStockLevel: row.low_stock_level,
  status: row.status ?? "active", createdBy: row.created_by, createdAt: row.created_at,
  updatedAt: row.updated_at, sku: row.sku, version: row.version, baseUnit: row.base_unit ?? "piece",
  barcode: productUnits(row).find((unit) => unit.barcode)?.barcode ?? null,
  units: productUnits(row).map(camelProductUnit),
})

function productUnits(row: Record<string, unknown>): Array<Record<string, unknown>> {
  if (Array.isArray(row.product_units)) return row.product_units as Array<Record<string, unknown>>
  if (typeof row.product_units === "string") {
    try { return JSON.parse(row.product_units) as Array<Record<string, unknown>> } catch { return [] }
  }
  return []
}

const productsSelect = `SELECT p.*,
  COALESCE(jsonb_agg(jsonb_build_object(
    'id',pu.id,'product_id',pu.product_id,'unit_name',pu.unit_name,
    'abbreviation',pu.abbreviation,'conversion_factor',pu.conversion_factor,
    'barcode',pu.barcode,'selling_price',pu.selling_price,'is_base',pu.is_base
  ) ORDER BY pu.is_base DESC,pu.conversion_factor,pu.unit_name)
  FILTER (WHERE pu.id IS NOT NULL),'[]'::jsonb) AS product_units
  FROM products p
  LEFT JOIN product_units pu ON pu.tenant_id=p.tenant_id
    AND pu.business_id=p.business_id AND pu.product_id=p.id`

function cleanUnit(value: unknown, fallback: string) {
  const unit = String(value ?? fallback).trim()
  if (!unit || unit.length > 40) throw new Error("Unit names must contain 1 to 40 characters")
  return unit
}

function cleanBarcode(value: unknown) {
  if (value == null) return null
  const barcode = String(value).trim()
  if (!barcode) return null
  if (barcode.length > 128) throw new Error("Barcode is too long")
  return barcode
}

function positiveInteger(value: unknown, fallback: number) {
  const result = value == null || value === "" ? fallback : Number(value)
  if (!Number.isInteger(result) || result <= 0 || result > 1_000_000) {
    throw new Error("Units per package must be a positive whole number")
  }
  return result
}

async function inTransaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await pooledDb().connect()
  try {
    await client.query("BEGIN")
    const result = await work(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    try { await client.query("ROLLBACK") } catch {}
    throw error
  } finally {
    client.release()
  }
}

async function ensureBarcodeAvailable(
  client: PoolClient,
  tenantId: string,
  businessId: string,
  barcode: string | null,
  productId: string,
) {
  if (!barcode) return
  const duplicate = await client.query(
    "SELECT product_id FROM product_units WHERE tenant_id=$1 AND business_id=$2 AND barcode=$3 AND product_id<>$4 LIMIT 1",
    [tenantId, businessId, barcode, productId],
  )
  if (duplicate.rows[0]) throw new Error("This barcode is already assigned to another product")
}

async function configureProductUnits(
  client: PoolClient,
  input: {
    tenantId: string
    businessId: string
    productId: string
    baseUnit: string
    scanUnit: string
    conversionFactor: number
    barcode: string | null
    scanUnitId?: string | null
    scanSellingPrice?: number | null
  },
) {
  await ensureBarcodeAvailable(client, input.tenantId, input.businessId, input.barcode, input.productId)
  const existingBase = await client.query(
    "SELECT id FROM product_units WHERE tenant_id=$1 AND business_id=$2 AND product_id=$3 AND is_base LIMIT 1 FOR UPDATE",
    [input.tenantId, input.businessId, input.productId],
  )
  const baseId = String(existingBase.rows[0]?.id ?? randomUUID())
  const barcodeBelongsToBase = input.conversionFactor === 1
    && input.scanUnit.toLowerCase() === input.baseUnit.toLowerCase()

  if (existingBase.rows[0]) {
    await client.query(
      "UPDATE product_units SET unit_name=$1,abbreviation=$2,barcode=$3,conversion_factor=1,selling_price=NULL,updated_at=NOW() WHERE tenant_id=$4 AND business_id=$5 AND product_id=$6 AND id=$7",
      [input.baseUnit, input.baseUnit.slice(0, 12), barcodeBelongsToBase ? input.barcode : null, input.tenantId, input.businessId, input.productId, baseId],
    )
  } else {
    await client.query(
      "INSERT INTO product_units(id,tenant_id,business_id,product_id,unit_name,abbreviation,conversion_factor,barcode,is_base) VALUES($1,$2,$3,$4,$5,$6,1,$7,TRUE)",
      [baseId, input.tenantId, input.businessId, input.productId, input.baseUnit, input.baseUnit.slice(0, 12), barcodeBelongsToBase ? input.barcode : null],
    )
  }

  if (!barcodeBelongsToBase) {
    const existingPackage = input.scanUnitId
      ? await client.query(
        "SELECT id FROM product_units WHERE tenant_id=$1 AND business_id=$2 AND product_id=$3 AND id=$4 AND NOT is_base LIMIT 1",
        [input.tenantId, input.businessId, input.productId, input.scanUnitId],
      )
      : await client.query(
        "SELECT id FROM product_units WHERE tenant_id=$1 AND business_id=$2 AND product_id=$3 AND lower(unit_name)=lower($4) AND NOT is_base LIMIT 1",
        [input.tenantId, input.businessId, input.productId, input.scanUnit],
      )
    if (existingPackage.rows[0]) {
      await client.query(
        "UPDATE product_units SET unit_name=$1,abbreviation=$2,conversion_factor=$3,barcode=$4,selling_price=$5,updated_at=NOW() WHERE tenant_id=$6 AND business_id=$7 AND product_id=$8 AND id=$9",
        [input.scanUnit, input.scanUnit.slice(0, 12), input.conversionFactor, input.barcode, input.scanSellingPrice ?? null, input.tenantId, input.businessId, input.productId, existingPackage.rows[0].id],
      )
    } else {
      await client.query(
        "INSERT INTO product_units(id,tenant_id,business_id,product_id,unit_name,abbreviation,conversion_factor,barcode,selling_price,is_base) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,FALSE)",
        [randomUUID(), input.tenantId, input.businessId, input.productId, input.scanUnit, input.scanUnit.slice(0, 12), input.conversionFactor, input.barcode, input.scanSellingPrice ?? null],
      )
    }
  }
}

const camelTransaction = (row: Record<string, unknown>) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, type: row.type,
  amount: Number(row.amount), date: row.date, category: row.category, receiptUrl: row.receipt_url,
  description: row.description, recordedBy: row.recorded_by, createdAt: row.created_at,
})

export async function listOperationalProducts(tenantId: string, businessId: string) {
  return withTransientDatabaseRetry(async () => {
    const rows = await db().query(`${productsSelect}
      WHERE p.tenant_id=$1 AND p.business_id=$2 GROUP BY p.id ORDER BY p.name`, [tenantId, businessId])
    return rows.map(camelProduct)
  })
}

export async function listOperationalTransactions(tenantId: string, businessId: string, type?: string) {
  return withTransientDatabaseRetry(async () => {
    const sql = db()
    const rows = type
      ? await sql`SELECT * FROM transactions WHERE tenant_id=${tenantId} AND business_id=${businessId} AND type=${type} AND voided_at IS NULL ORDER BY date DESC`
      : await sql`SELECT * FROM transactions WHERE tenant_id=${tenantId} AND business_id=${businessId} AND voided_at IS NULL ORDER BY date DESC`
    return rows.map(camelTransaction)
  })
}

export async function listCustomerSalesStats(tenantId: string, businessId: string) {
  return withTransientDatabaseRetry(async () => {
    const rows = await db()`SELECT customer_id, COUNT(*)::integer AS total_orders,
      COALESCE(SUM(total_amount), 0) AS total_spent
      FROM sales
      WHERE tenant_id=${tenantId} AND business_id=${businessId} AND customer_id IS NOT NULL
      GROUP BY customer_id`
    return Object.fromEntries(rows.map((row) => [String(row.customer_id), {
      totalOrders: Number(row.total_orders),
      totalSpent: Number(row.total_spent),
    }]))
  })
}

export function mergeCustomerSalesStats(
  customers: Array<Record<string, unknown>>,
  salesStats: Record<string, { totalOrders: number; totalSpent: number }>,
) {
  return customers.map((customer) => ({
    ...customer,
    ...(salesStats[String(customer.id)] ?? { totalOrders: 0, totalSpent: 0 }),
  }))
}

export async function customerHasRecordedSales(tenantId: string, businessId: string, customerId: string) {
  return withTransientDatabaseRetry(async () => {
    const rows = await db()`SELECT EXISTS(
      SELECT 1 FROM sales
      WHERE tenant_id=${tenantId} AND business_id=${businessId} AND customer_id=${customerId}
    ) AS has_sales`
    return rows[0]?.has_sales === true
  })
}

export async function executeOperationalOperation(operation: string, variables: Record<string, unknown>) {
  const sql = db()
  const tenantId = String(variables.tenantId)
  const businessId = String(variables.businessId)
  if (operation === "listProductsByBusiness") return { products: await listOperationalProducts(tenantId, businessId) }
  if (operation === "listSaleProductsByBusiness") return { products: await listOperationalProducts(tenantId, businessId) }
  if (operation === "listTransactionsByBusiness") return { transactions: await listOperationalTransactions(tenantId, businessId) }
  if (operation === "listTransactionsByType") return { transactions: await listOperationalTransactions(tenantId, businessId, String(variables.type)) }

  if (operation === "CreateProduct") {
    const id = randomUUID()
    const sku = String(variables.sku || `SKU-${id}`)
    if (!["active", "inactive"].includes(String(variables.status || "active"))) throw new Error("Invalid product status")
    const baseUnit = cleanUnit(variables.baseUnit, "piece")
    const scanUnit = cleanUnit(variables.scanUnit, baseUnit)
    const conversionFactor = positiveInteger(variables.conversionFactor, 1)
    const barcode = cleanBarcode(variables.barcode)
    const quantity = Number(variables.quantity)
    const sellingPrice = Number(variables.sellingPrice)
    if (!Number.isInteger(quantity) || quantity < 0) throw new Error("Product quantity must be a non-negative whole number")
    if (!Number.isFinite(sellingPrice) || sellingPrice < 0) throw new Error("Selling price must be non-negative")
    const product = await inTransaction(async (client) => {
      const rows = await client.query(
        "INSERT INTO products(id,tenant_id,business_id,name,category,quantity,cost_price,selling_price,expiry_date,low_stock_level,status,created_by,sku,base_unit) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *",
        [id, tenantId, businessId, String(variables.name), variables.category ?? null, quantity, variables.costPrice ?? null, sellingPrice, variables.expiryDate ?? null, variables.lowStockLevel ?? null, String(variables.status || "active"), String(variables.createdBy), sku, baseUnit],
      )
      await configureProductUnits(client, {
        tenantId, businessId, productId: id, baseUnit, scanUnit, conversionFactor, barcode,
        scanSellingPrice: variables.scanSellingPrice == null || variables.scanSellingPrice === "" ? null : Number(variables.scanSellingPrice),
      })
      if (quantity > 0) {
        await client.query(
          "INSERT INTO inventory_movements(id,tenant_id,business_id,product_id,movement_type,quantity_delta,resulting_quantity,reason,recorded_by) VALUES($1,$2,$3,$4,'OPENING',$5,$5,'Opening inventory',$6)",
          [randomUUID(), tenantId, businessId, id, quantity, String(variables.createdBy)],
        )
      }
      return rows.rows[0] as Record<string, unknown>
    })
    const [created] = await listOperationalProducts(tenantId, businessId).then((products) => products.filter((item) => item.id === id))
    return { product_insert: created ?? camelProduct(product) }
  }
  if (operation === "UpdateProduct") {
    if (variables.status && !["active", "inactive"].includes(String(variables.status))) throw new Error("Invalid product status")
    const id = String(variables.id)
    await inTransaction(async (client) => {
      const rows = await client.query(
        `UPDATE products SET name=COALESCE($1,name),category=COALESCE($2,category),
          quantity=COALESCE($3,quantity),cost_price=COALESCE($4,cost_price),
          selling_price=COALESCE($5,selling_price),expiry_date=COALESCE($6,expiry_date),
          low_stock_level=COALESCE($7,low_stock_level),status=COALESCE($8,status),
          sku=COALESCE($9,sku),base_unit=COALESCE($10,base_unit),version=version+1,updated_at=NOW()
          WHERE id=$11 AND tenant_id=$12 AND business_id=$13 RETURNING base_unit`,
        [variables.name ?? null, variables.category ?? null, variables.quantity ?? null, variables.costPrice ?? null, variables.sellingPrice ?? null, variables.expiryDate ?? null, variables.lowStockLevel ?? null, variables.status ?? null, variables.sku ?? null, has(variables, "baseUnit") ? cleanUnit(variables.baseUnit, "piece") : null, id, tenantId, businessId],
      )
      if (!rows.rows[0]) throw new Error("Record is outside the authenticated company")
      if (["baseUnit", "scanUnit", "conversionFactor", "barcode", "scanUnitId", "scanSellingPrice"].some((key) => has(variables, key))) {
        const baseUnit = cleanUnit(variables.baseUnit, String(rows.rows[0].base_unit || "piece"))
        await configureProductUnits(client, {
          tenantId, businessId, productId: id, baseUnit,
          scanUnit: cleanUnit(variables.scanUnit, baseUnit),
          conversionFactor: positiveInteger(variables.conversionFactor, 1),
          barcode: cleanBarcode(variables.barcode),
          scanUnitId: variables.scanUnitId ? String(variables.scanUnitId) : null,
          scanSellingPrice: variables.scanSellingPrice == null || variables.scanSellingPrice === "" ? null : Number(variables.scanSellingPrice),
        })
      }
    })
    const product = (await listOperationalProducts(tenantId, businessId)).find((item) => item.id === id)
    if (!product) throw new Error("Record is outside the authenticated company")
    return { product_update: product }
  }
  if (operation === "DeleteProduct") {
    const rows = await sql`DELETE FROM products WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING id`
    if (!rows[0]) throw new Error("Record is outside the authenticated company")
    return { product_delete: { id: rows[0].id } }
  }

  if (operation === "CreateTransaction") {
    if (variables.type !== "EXPENSE") throw new Error("Sales must use the atomic sale endpoint")
    const row = await recordExpense({
      tenantId,
      businessId,
      actorId: String(variables.recordedBy),
      amount: Number(variables.amount),
      date: String(variables.date),
      category: variables.category ? String(variables.category) : null,
      description: variables.description ? String(variables.description) : null,
      receiptUrl: variables.receiptUrl ? String(variables.receiptUrl) : null,
    })
    return { transaction_insert: camelTransaction(row) }
  }
  if (operation === "UpdateTransaction") {
    throw new Error("Posted expenses are immutable; void and re-enter the expense")
  }
  if (operation === "DeleteTransaction") {
    const result = await voidExpense({ tenantId, businessId, actorId: String(variables.recordedBy) }, String(variables.id))
    return { transaction_delete: result }
  }
  return null
}
