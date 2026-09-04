import assert from "node:assert/strict"
import test from "node:test"

import { isTransientDatabaseError, withTransientDatabaseRetry } from "../src/lib/server/neon"

test("recognizes nested Neon transport failures", () => {
  const error = {
    message: "Error connecting to database: TypeError: fetch failed",
    sourceError: {
      cause: {
        code: "ETIMEDOUT",
        errors: [{ code: "ENETUNREACH" }],
      },
    },
  }

  assert.equal(isTransientDatabaseError(error), true)
  assert.equal(isTransientDatabaseError(new Error("duplicate key value violates unique constraint")), false)
})

test("retries a transient read and returns its eventual result", async () => {
  let attempts = 0
  const result = await withTransientDatabaseRetry(async () => {
    attempts += 1
    if (attempts < 3) throw Object.assign(new Error("fetch failed"), { code: "ETIMEDOUT" })
    return "ready"
  }, [0, 0])

  assert.equal(result, "ready")
  assert.equal(attempts, 3)
})

test("does not retry non-transient database errors", async () => {
  let attempts = 0

  await assert.rejects(
    withTransientDatabaseRetry(async () => {
      attempts += 1
      throw new Error("permission denied")
    }, [0, 0]),
    /permission denied/,
  )
  assert.equal(attempts, 1)
})
