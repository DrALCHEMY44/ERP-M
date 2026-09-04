import assert from "node:assert/strict"
import test from "node:test"

import { ApiOperationError } from "../src/lib/data-service"
import { isAuthenticationFailure } from "../src/lib/auth/session-recovery"

test("API operation errors preserve HTTP authentication status", () => {
  const error = new ApiOperationError("Request failed", 401)
  assert.equal(error.status, 401)
  assert.equal(isAuthenticationFailure(error), true)
})

test("missing and expired session errors trigger authentication recovery", () => {
  assert.equal(isAuthenticationFailure(new Error("Missing Neon authentication session")), true)
  assert.equal(isAuthenticationFailure(new Error("Employee session is invalid or expired")), true)
  assert.equal(isAuthenticationFailure(new ApiOperationError("Forbidden", 403)), false)
})
