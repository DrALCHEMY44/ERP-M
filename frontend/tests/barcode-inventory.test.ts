import assert from "node:assert/strict"
import test from "node:test"

import { receiveBarcodeStockWithPool, type ReceiveBarcodeStockInput } from "../src/lib/server/barcode-inventory"

class FakeBarcodeDatabase {
  stock = 10
  movementCount = 0
  outboxCount = 0
  hasMatch = true

  async connect() {
    const pending: Array<() => void> = []
    return {
      query: async (sql: string, params?: unknown[]) => {
        if (sql.includes("FROM product_units") && sql.includes("FOR UPDATE")) {
          return { rows: this.hasMatch ? [{
            id: "carton-1", product_id: "product-1", unit_name: "carton",
            abbreviation: "ctn", conversion_factor: 24, barcode: "629000001",
            unit_selling_price: "2200.00", name: "Mineral water", category: "Beverages",
            quantity: this.stock, base_unit: "bottle", cost_price: "60.00",
            selling_price: "100.00", low_stock_level: 12, status: "active",
          }] : [] }
        }
        if (sql.startsWith("UPDATE products")) {
          const resulting = Number(params?.[0])
          pending.push(() => { this.stock = resulting })
        }
        if (sql.startsWith("INSERT INTO inventory_movements")) {
          pending.push(() => { this.movementCount += 1 })
        }
        if (sql.startsWith("INSERT INTO integration_outbox")) {
          pending.push(() => { this.outboxCount += 1 })
        }
        if (sql === "COMMIT") pending.forEach((apply) => apply())
        return { rows: [] }
      },
      release: () => {},
    }
  }
}

const receipt: ReceiveBarcodeStockInput = {
  tenantId: "tenant-a",
  businessId: "business-a",
  actorId: "owner-a",
  barcode: "629000001",
  packageQuantity: 2,
}

test("barcode receipt converts cartons into base stock atomically", async () => {
  const database = new FakeBarcodeDatabase()
  const result = await receiveBarcodeStockWithPool(receipt, database as never)
  assert.equal(result.baseQuantityAdded, 48)
  assert.equal(result.resultingQuantity, 58)
  assert.equal(database.stock, 58)
  assert.equal(database.movementCount, 1)
  assert.equal(database.outboxCount, 1)
})

test("an unknown company barcode does not change inventory", async () => {
  const database = new FakeBarcodeDatabase()
  database.hasMatch = false
  await assert.rejects(
    () => receiveBarcodeStockWithPool(receipt, database as never),
    /not registered for this business/,
  )
  assert.equal(database.stock, 10)
  assert.equal(database.movementCount, 0)
  assert.equal(database.outboxCount, 0)
})
