import assert from "node:assert/strict"
import test from "node:test"

// Runtime JavaScript is shared directly with the reconciliation command.
import { reconcileBatch, retryDelaySeconds } from "../scripts/outbox-reconciliation.mjs"

test("temporary mirror failure remains durable and later recovers idempotently", async () => {
  const event = { id: "event-1", attempts: 0, nextAttemptAt: "2026-01-01T00:00:00.000Z" }
  const states: Array<Record<string, unknown>> = []
  let available = false
  const deliver = async () => {
    if (!available) throw new Error("temporary Neon outage")
  }
  const update = async (_event: unknown, state: Record<string, unknown>) => { states.push(state) }
  const clock = () => new Date("2026-01-01T00:00:10.000Z")

  const failed = await reconcileBatch([event], deliver, update, clock)
  assert.deepEqual(failed, { examined: 1, delivered: 0, failed: 1 })
  assert.equal(states[0].status, "FAILED")
  assert.equal(states[0].attempts, 1)

  available = true
  const retry = { ...event, attempts: 1, nextAttemptAt: "2026-01-01T00:00:09.000Z" }
  const recovered = await reconcileBatch([retry], deliver, update, clock)
  assert.deepEqual(recovered, { examined: 1, delivered: 1, failed: 0 })
  assert.equal(states[1].status, "DELIVERED")
})

test("retry backoff is exponential and bounded", () => {
  assert.equal(retryDelaySeconds(1), 2)
  assert.equal(retryDelaySeconds(8), 256)
  assert.equal(retryDelaySeconds(100), 1024)
})
