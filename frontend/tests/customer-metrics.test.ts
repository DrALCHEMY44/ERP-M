import assert from "node:assert/strict"
import test from "node:test"

import { mergeCustomerSalesStats } from "../src/lib/server/operational-data"

test("customer lifetime metrics are derived from committed sales", () => {
  const customers = [
    { id: "customer-a", customerName: "Alpha", totalOrders: 99, totalSpent: 99999 },
    { id: "customer-b", customerName: "Beta", totalOrders: 7, totalSpent: 7000 },
  ]
  const merged = mergeCustomerSalesStats(customers, {
    "customer-a": { totalOrders: 2, totalSpent: 12500 },
  })

  assert.deepEqual(merged, [
    { id: "customer-a", customerName: "Alpha", totalOrders: 2, totalSpent: 12500 },
    { id: "customer-b", customerName: "Beta", totalOrders: 0, totalSpent: 0 },
  ])
})
