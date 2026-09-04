import assert from "node:assert/strict"
import { scrypt as scryptCallback } from "node:crypto"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import test from "node:test"

import { parseAiQueryRequest } from "../src/lib/server/ai-request"
import { parseDocumentAnalysis, redactForExternalModel } from "../src/lib/server/document-intelligence"
import { buildDeterministicDashboardInsight } from "../src/lib/server/ai-insights"
import { externalReference } from "../src/lib/server/ai-safety"
import { freeCompletion, getOpenRouterModelPipeline } from "../src/lib/server/openrouter"
import { hashSecret, verifySecret } from "../src/lib/server/secret-hash"

test("AI request role and actor spoofing fields are discarded", () => {
  assert.deepEqual(parseAiQueryRequest({ queryText: "sales summary", role: "Business Owner", tenantId: "other", userId: "admin" }), {
    queryText: "sales summary",
    purpose: "assistant",
  })
})

test("AI request supports a bounded server-recognized purpose", () => {
  assert.deepEqual(parseAiQueryRequest({ queryText: " monthly view ", purpose: "dashboard" }), {
    queryText: "monthly view",
    purpose: "dashboard",
  })
  assert.throws(() => parseAiQueryRequest({ queryText: "sales", purpose: "admin" }))
})

test("employee secrets use salted hashes and constant verification contract", async () => {
  const first = await hashSecret("EMPLOYEE-CODE")
  const second = await hashSecret("EMPLOYEE-CODE")
  assert.notEqual(first, second)
  assert.equal(await verifySecret("EMPLOYEE-CODE", first), true)
  assert.equal(await verifySecret("WRONG-CODE", first), false)
  assert.doesNotMatch(first, /EMPLOYEE-CODE/)
})

test("employee login accepts hashes imported from the legacy Data Connect backfill", async () => {
  const salt = Buffer.alloc(16, 7)
  const key = await new Promise<Buffer>((resolve, reject) => {
    scryptCallback("EMPLOYEE-CODE", salt, 64, { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 }, (error, derived) => {
      if (error) reject(error)
      else resolve(derived)
    })
  })
  const legacy = `scrypt$32768$8$1$${salt.toString("base64url")}$${key.toString("base64url")}`
  assert.equal(await verifySecret("EMPLOYEE-CODE", legacy), true)
  assert.equal(await verifySecret("WRONG-CODE", legacy), false)
})

test("malformed and over-permissive model output is rejected", () => {
  assert.throws(() => parseDocumentAnalysis("not-json"), /JSON/)
  assert.throws(() => parseDocumentAnalysis('{"classification":"Invoice","summary":"ok","ignoreRules":true}'))
  assert.equal(parseDocumentAnalysis('```json\n{"classification":"Invoice","summary":"ok","anomalies":[]}\n```').classification, "Invoice")
})

test("external-model context redacts common email and Cameroon phone PII", () => {
  const result = redactForExternalModel("Email jane@example.com phone +237 699 12 34 56 key sk-or-v1-abcdefghijklmnop")
  assert.doesNotMatch(result, /jane@example\.com|699 12 34 56|sk-or-v1-abcdefghijklmnop/)
  assert.match(result, /REDACTED_EMAIL/)
  assert.match(result, /REDACTED_PHONE/)
  assert.match(result, /REDACTED_CREDENTIAL/)
})

test("external references are stable and do not expose internal record ids", () => {
  const first = externalReference("EMPLOYEE", "company-a", "private-id-123")
  assert.equal(first, externalReference("EMPLOYEE", "company-a", "private-id-123"))
  assert.doesNotMatch(first, /private-id-123/)
})

test("OpenRouter pipeline keeps current free fallbacks and accepts safe overrides", () => {
  const defaults = getOpenRouterModelPipeline("")
  assert.equal(defaults[0], "openrouter/free")
  assert.ok(defaults.length >= 8)
  assert.ok(defaults.every((model) => model === "openrouter/free" || model.endsWith(":free")))
  const configured = getOpenRouterModelPipeline("vendor/custom:free,invalid value,vendor/custom:free")
  assert.equal(configured[0], "vendor/custom:free")
  assert.equal(configured.filter((model) => model === "vendor/custom:free").length, 1)
})

test("OpenRouter completion advances to the next free model after provider failure", async () => {
  const originalFetch = globalThis.fetch
  const originalKey = process.env.OPENROUTER_API_KEY
  const originalModels = process.env.OPENROUTER_MODELS
  const attempted: string[] = []
  process.env.OPENROUTER_API_KEY = "test-openrouter-key"
  process.env.OPENROUTER_MODELS = "vendor/first:free,vendor/second:free"
  globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    const payload = JSON.parse(String(init?.body))
    attempted.push(payload.model)
    if (payload.model === "vendor/first:free") {
      return new Response("unavailable", { status: 503 })
    }
    return Response.json({
      model: payload.model,
      choices: [{ message: { content: "OK" } }],
    })
  }) as typeof fetch

  try {
    const response = await freeCompletion({
      messages: [{ role: "user", content: "test" }],
      totalTimeoutMs: 5_000,
    })
    assert.deepEqual(attempted, ["vendor/first:free", "vendor/second:free"])
    assert.equal(response.content, "OK")
    assert.equal(response.model, "vendor/second:free")
  } finally {
    globalThis.fetch = originalFetch
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY
    else process.env.OPENROUTER_API_KEY = originalKey
    if (originalModels === undefined) delete process.env.OPENROUTER_MODELS
    else process.env.OPENROUTER_MODELS = originalModels
  }
})

test("dashboard insight has a deterministic provider-outage fallback", () => {
  const response = buildDeterministicDashboardInsight({
    meta: {
      userRole: "Business Owner",
      generatedAt: "2026-09-03T00:00:00.000Z",
      currency: "FCFA",
      unavailableModules: [],
      truncatedModules: [],
    },
    financials: {
      totalSales: 1000,
      totalExpenses: 300,
      netProfit: 700,
      transactionCount: 2,
      salesCount: 1,
      expenseCount: 1,
      currentMonth: {
        totalSales: 1000,
        totalExpenses: 300,
        netProfit: 700,
        transactionCount: 2,
      },
    },
  })
  assert.match(response, /1[\s.,]000 FCFA/)
  assert.match(response, /based solely on the data available/)
})

test("AI context and document processing enforce least privilege in source", async () => {
  const root = resolve(import.meta.dirname, "..")
  const [context, documentRoute, queryRoute] = await Promise.all([
    readFile(resolve(root, "src/ai/ai-context.ts"), "utf8"),
    readFile(resolve(root, "src/app/api/documents/process/route.ts"), "utf8"),
    readFile(resolve(root, "src/app/api/ai/query/route.ts"), "utf8"),
  ])
  assert.match(context, /\['Staff', 'Viewer'\]\.includes\(role\)/)
  assert.match(context, /listTasksAssignedToUser/)
  assert.doesNotMatch(context, /phone:\s*c\.phoneNumber|email:\s*s\.email|fullName:\s*e\.fullName/)
  assert.match(documentRoute, /hasPermission\(profile, "documents:write"\)/)
  assert.match(documentRoute, /SELECT file_url FROM documents/)
  assert.match(queryRoute, /hasPermission\(authorized, "documents:read"\)/)
  assert.match(queryRoute, /sanitizeConversationText\(String\(item\.content/)
})
