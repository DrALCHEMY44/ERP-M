import assert from "node:assert/strict"
import test from "node:test"

import { parseAiQueryRequest } from "../src/lib/server/ai-request"
import { parseDocumentAnalysis, redactForExternalModel } from "../src/lib/server/document-intelligence"
import { hashSecret, verifySecret } from "../src/lib/server/secret-hash"

test("AI request role and actor spoofing fields are discarded", () => {
  assert.deepEqual(parseAiQueryRequest({ queryText: "sales summary", role: "Business Owner", tenantId: "other", userId: "admin" }), {
    queryText: "sales summary",
  })
})

test("employee secrets use salted hashes and constant verification contract", async () => {
  const first = await hashSecret("EMPLOYEE-CODE")
  const second = await hashSecret("EMPLOYEE-CODE")
  assert.notEqual(first, second)
  assert.equal(await verifySecret("EMPLOYEE-CODE", first), true)
  assert.equal(await verifySecret("WRONG-CODE", first), false)
  assert.doesNotMatch(first, /EMPLOYEE-CODE/)
})

test("malformed and over-permissive model output is rejected", () => {
  assert.throws(() => parseDocumentAnalysis("not-json"), /JSON/)
  assert.throws(() => parseDocumentAnalysis('{"classification":"Invoice","summary":"ok","ignoreRules":true}'))
  assert.equal(parseDocumentAnalysis('```json\n{"classification":"Invoice","summary":"ok","anomalies":[]}\n```').classification, "Invoice")
})

test("external-model context redacts common email and Cameroon phone PII", () => {
  const result = redactForExternalModel("Email jane@example.com phone +237 699 12 34 56")
  assert.doesNotMatch(result, /jane@example\.com|699 12 34 56/)
  assert.match(result, /REDACTED_EMAIL/)
  assert.match(result, /REDACTED_PHONE/)
})
