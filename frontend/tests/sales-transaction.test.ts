import assert from "node:assert/strict"
import test from "node:test"

import { recordSaleWithPool, type RecordSaleInput } from "../src/lib/server/sales"

type Row = { id: string; quantity: number; selling_price: string }

class FakeDatabase {
  stock = 1
  sales = 0
  transactions = 0
  movements = 0
  outbox = 0
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
          return { rows: [{ id: "product-1", quantity: workingStock, selling_price: "100.00" }] satisfies Row[] }
        }
        if (sql.startsWith("UPDATE products")) {
          workingStock = Number(params?.[0] ?? 0)
          pending.push(() => { this.stock = workingStock })
          return { rows: [] }
        }
        if (sql.startsWith("INSERT INTO sales")) pending.push(() => { this.sales++ })
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

test("two concurrent sales cannot consume the same unit of locked stock", async () => {
  const database = new FakeDatabase()
  const results = await Promise.allSettled([
    recordSaleWithPool(sale, database as never),
    recordSaleWithPool({ ...sale, idempotencyKey: "request-0000000002" }, database as never),
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
  await assert.rejects(() => recordSaleWithPool(sale, database as never), /Insufficient stock/)
  assert.equal(database.sales, 0)
  assert.equal(database.transactions, 0)
  assert.equal(database.movements, 0)
  assert.equal(database.outbox, 0)
})
