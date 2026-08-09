import { randomUUID } from "crypto"
import { neon } from "@neondatabase/serverless"

function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
  return neon(process.env.DATABASE_URL)
}

const camelProduct = (row: Record<string, unknown>) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, name: row.name,
  category: row.category, quantity: Number(row.quantity), costPrice: row.cost_price == null ? null : Number(row.cost_price),
  sellingPrice: Number(row.selling_price), expiryDate: row.expiry_date, lowStockLevel: row.low_stock_level,
  createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.updated_at, sku: row.sku, version: row.version,
})

const camelTransaction = (row: Record<string, unknown>) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, type: row.type,
  amount: Number(row.amount), date: row.date, category: row.category, receiptUrl: row.receipt_url,
  recordedBy: row.recorded_by, createdAt: row.created_at,
})

export async function listOperationalProducts(tenantId: string, businessId: string) {
  const rows = await db()`SELECT * FROM products WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY name`
  return rows.map(camelProduct)
}

export async function listOperationalTransactions(tenantId: string, businessId: string, type?: string) {
  const sql = db()
  const rows = type
    ? await sql`SELECT * FROM transactions WHERE tenant_id=${tenantId} AND business_id=${businessId} AND type=${type} ORDER BY date DESC`
    : await sql`SELECT * FROM transactions WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY date DESC`
  return rows.map(camelTransaction)
}

export async function executeOperationalOperation(operation: string, variables: Record<string, unknown>) {
  const sql = db()
  const tenantId = String(variables.tenantId)
  const businessId = String(variables.businessId)
  if (operation === "listProductsByBusiness") return { products: await listOperationalProducts(tenantId, businessId) }
  if (operation === "listTransactionsByBusiness") return { transactions: await listOperationalTransactions(tenantId, businessId) }
  if (operation === "listTransactionsByType") return { transactions: await listOperationalTransactions(tenantId, businessId, String(variables.type)) }

  if (operation === "CreateProduct") {
    const id = randomUUID()
    const sku = String(variables.sku || `SKU-${id}`)
    const rows = await sql`INSERT INTO products(id,tenant_id,business_id,name,category,quantity,cost_price,selling_price,expiry_date,low_stock_level,created_by,sku)
      VALUES(${id},${tenantId},${businessId},${String(variables.name)},${variables.category as string | null},${Number(variables.quantity)},${variables.costPrice as number | null},${Number(variables.sellingPrice)},${variables.expiryDate as string | null},${variables.lowStockLevel as number | null},${String(variables.createdBy)},${sku}) RETURNING *`
    return { product_insert: camelProduct(rows[0]) }
  }
  if (operation === "UpdateProduct") {
    const rows = await sql`UPDATE products SET
      name=COALESCE(${variables.name as string | null},name), category=COALESCE(${variables.category as string | null},category),
      quantity=COALESCE(${variables.quantity as number | null},quantity), cost_price=COALESCE(${variables.costPrice as number | null},cost_price),
      selling_price=COALESCE(${variables.sellingPrice as number | null},selling_price), expiry_date=COALESCE(${variables.expiryDate as string | null},expiry_date),
      low_stock_level=COALESCE(${variables.lowStockLevel as number | null},low_stock_level), sku=COALESCE(${variables.sku as string | null},sku),
      version=version+1,updated_at=NOW()
      WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING *`
    if (!rows[0]) throw new Error("Record is outside the authenticated company")
    return { product_update: camelProduct(rows[0]) }
  }
  if (operation === "DeleteProduct") {
    const rows = await sql`DELETE FROM products WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING id`
    if (!rows[0]) throw new Error("Record is outside the authenticated company")
    return { product_delete: { id: rows[0].id } }
  }

  if (operation === "CreateTransaction") {
    if (variables.type !== "EXPENSE") throw new Error("Sales must use the atomic sale endpoint")
    const id = randomUUID()
    const rows = await sql`INSERT INTO transactions(id,tenant_id,business_id,type,amount,date,category,receipt_url,recorded_by)
      VALUES(${id},${tenantId},${businessId},'EXPENSE',${Number(variables.amount)},${variables.date as string},${variables.category as string | null},${variables.receiptUrl as string | null},${String(variables.recordedBy)}) RETURNING *`
    return { transaction_insert: camelTransaction(rows[0]) }
  }
  if (operation === "UpdateTransaction") {
    const rows = await sql`UPDATE transactions SET amount=COALESCE(${variables.amount as number | null},amount),date=COALESCE(${variables.date as string | null},date),
      category=COALESCE(${variables.category as string | null},category),receipt_url=COALESCE(${variables.receiptUrl as string | null},receipt_url)
      WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} AND type='EXPENSE' RETURNING *`
    if (!rows[0]) throw new Error("Record is outside the authenticated company")
    return { transaction_update: camelTransaction(rows[0]) }
  }
  if (operation === "DeleteTransaction") {
    const rows = await sql`DELETE FROM transactions WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} AND type='EXPENSE' RETURNING id`
    if (!rows[0]) throw new Error("Record is outside the authenticated company")
    return { transaction_delete: { id: rows[0].id } }
  }
  return null
}
