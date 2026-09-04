import assert from "node:assert/strict"
import test from "node:test"

import { recordSaleWithPool, type RecordSaleInput } from "../src/lib/server/sales"

type Row = { id: string; quantity: number; selling_price: string; cost_price: string; base_unit: string; status: string }

class FakeDatabase {
  stock = 1
  sales = 0
  transactions = 0
  movements = 0
  outbox = 0
  saleTotal = 0
  private queue = Promise.resolve()

  async connect() {
    let releaseLock = () => {}
    const previous = this.queue
    this.queue = new Promise<void>((resolve) => { releaseLock = resolve })
    const pending: Array<() => void> = []
    let locked = false
    let workingStock = this.stock
    return {
      query: async (sql: string, params?: unknown[]) => {
        if (sql === "BEGIN") return { rows: [] }
        if (sql.includes("FROM sales WHERE")) return { rows: [] }
        if (sql.includes("FROM products") && sql.includes("FOR UPDATE")) {
          await previous
          locked = true
          workingStock = this.stock
          return { rows: [{ id: "product-1", quantity: workingStock, selling_price: "100.00", cost_price: "60.00", base_unit: "piece", status: "active" }] satisfies Row[] }
        }
        if (sql.includes("FROM product_units")) {
          const rows: Array<Record<string, unknown>> = [{ id: "unit-1", product_id: "product-1", unit_name: "piece", conversion_factor: 1, selling_price: null, is_base: true }]
          if ((params?.[3] as string[] | undefined)?.includes("carton-1")) {
            rows.push({ id: "carton-1", product_id: "product-1", unit_name: "carton", conversion_factor: 24, selling_price: 2200, is_base: false })
          }
          return { rows }
        }
        if (sql.startsWith("UPDATE products")) {
          workingStock = Number(params?.[0] ?? 0)
          pending.push(() => { this.stock = workingStock })
          return { rows: [] }
        }
        if (sql.startsWith("INSERT INTO sales")) pending.push(() => { this.sales++; this.saleTotal = Number(params?.[5] ?? 0) })
        if (sql.startsWith("INSERT INTO transactions")) pending.push(() => { this.transactions++ })
        if (sql.startsWith("INSERT INTO inventory_movements")) pending.push(() => { this.movements++ })
        if (sql.startsWith("INSERT INTO integration_outbox")) pending.push(() => { this.outbox++ })
        if (sql === "COMMIT") { pending.forEach((apply) => apply()); if (locked) releaseLock() }
        if (sql === "ROLLBACK") { if (locked) releaseLock() }
        return { rows: [] }
      },
      release: () => {},
    }
  }
  async end() {}
}

const sale: RecordSaleInput = {
  tenantId: "tenant-a", businessId: "business-a", actorId: "owner-a",
  idempotencyKey: "request-0000000001", paymentMethod: "CASH",
  items: [{ productId: "product-1", quantity: 1 }],
}

const postJournal = async () => ({ id: "journal-1", duplicate: false })

test("two concurrent sales cannot consume the same unit of locked stock", async () => {
  const database = new FakeDatabase()
  const results = await Promise.allSettled([
    recordSaleWithPool(sale, database as never, false, postJournal),
    recordSaleWithPool({ ...sale, idempotencyKey: "request-0000000002" }, database as never, false, postJournal),
  ])
  assert.equal(results.filter((result) => result.status === "fulfilled").length, 1)
  assert.equal(results.filter((result) => result.status === "rejected").length, 1)
  assert.equal(database.stock, 0)
  assert.equal(database.sales, 1)
  assert.equal(database.transactions, 1)
  assert.equal(database.movements, 1)
  assert.equal(database.outbox, 1)
})

test("a failure rolls back all staged sale side effects", async () => {
  const database = new FakeDatabase()
  database.stock = 0
  await assert.rejects(() => recordSaleWithPool(sale, database as never, false, postJournal), /Insufficient stock/)
  assert.equal(database.sales, 0)
  assert.equal(database.transactions, 0)
  assert.equal(database.movements, 0)
  assert.equal(database.outbox, 0)
})

test("a packaged-unit sale charges per package and deducts base units", async () => {
  const database = new FakeDatabase()
  database.stock = 48
  const result = await recordSaleWithPool({
    ...sale,
    items: [{ productId: "product-1", unitId: "carton-1", quantity: 2 }],
  }, database as never, false, postJournal)
  assert.equal(result.totalAmount, 4400)
  assert.equal(database.saleTotal, 4400)
  assert.equal(database.stock, 0)
})
