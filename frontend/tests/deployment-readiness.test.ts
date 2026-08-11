import assert from "node:assert/strict"
import test from "node:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import { validateServerEnvironment } from "../src/lib/server/environment"
import { isAuthorizedReconciliationRequest } from "../scripts/reconcile-outbox-core.mjs"

const validEnvironment = {
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "smarterp-ai-defence-demo-test",
  FIREBASE_ADMIN_CLIENT_EMAIL: "firebase-admin@example.test",
  FIREBASE_ADMIN_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nplaceholder-placeholder\n-----END PRIVATE KEY-----",
  FIREBASE_DATACONNECT_LOCATION: "us-east4",
  FIREBASE_DATACONNECT_SERVICE_ID: "smarterp-demo-service",
  FIREBASE_DATACONNECT_CONNECTOR_ID: "example",
  DATABASE_URL: "postgresql://user:password@example.test/demo",
  AWS_ENDPOINT_URL_S3: "https://objects.example.test",
  AWS_REGION: "us-east-1",
  AWS_ACCESS_KEY_ID: "test-access-key",
  AWS_SECRET_ACCESS_KEY: "test-secret-key",
  S3_BUCKET: "smarterp-demo-private",
  OPENROUTER_API_KEY: "test-openrouter-key",
  CRON_SECRET: "c".repeat(32),
  RATE_LIMIT_SECRET: "r".repeat(32),
  NEXT_PUBLIC_APP_URL: "https://smarterp.example.test",
  ALLOWED_ORIGINS: "https://smarterp.example.test",
  AI_RETENTION_DAYS: "30",
} as unknown as NodeJS.ProcessEnv

test("deployment environment validation reports variable names without values", () => {
  const invalid = { ...validEnvironment }
  delete invalid.DATABASE_URL
  assert.throws(
    () => validateServerEnvironment(invalid),
    (error: Error) => error.message.includes("DATABASE_URL") && !error.message.includes("password"),
  )
})

test("deployment environment accepts the complete redacted fixture", () => {
  assert.equal(validateServerEnvironment(validEnvironment).AI_RETENTION_DAYS, 30)
})

test("reconciliation endpoint requires an exact, sufficiently strong bearer secret", () => {
  const secret = "s".repeat(32)
  assert.equal(isAuthorizedReconciliationRequest(new Request("https://example.test"), secret), false)
  assert.equal(isAuthorizedReconciliationRequest(new Request("https://example.test", {
    headers: { authorization: "Bearer wrong" },
  }), secret), false)
  assert.equal(isAuthorizedReconciliationRequest(new Request("https://example.test", {
    headers: { authorization: `Bearer ${secret}` },
  }), secret), true)
  assert.equal(isAuthorizedReconciliationRequest(new Request("https://example.test", {
    headers: { authorization: "Bearer short" },
  }), "short"), false)
})

test("real client workflows contain no fixture authority or successful storage fallback", async () => {
  const root = resolve(import.meta.dirname, "..")
  const files = [
    "src/components/customers/customer-dialog.tsx",
    "src/components/inventory/product-dialog.tsx",
    "src/components/employees/employee-dialog.tsx",
    "src/components/tasks/task-dialog.tsx",
    "src/components/suppliers/supplier-dialog.tsx",
    "src/hooks/use-firestore.ts",
  ]
  const source = (await Promise.all(files.map((file) => readFile(resolve(root, file), "utf8")))).join("\n")
  assert.doesNotMatch(source, /MOCK_USER|erp_fallback_|localStorage\.setItem/)
})

test("mobile release API configuration requires HTTPS and contains no demo project", async () => {
  const mobileRoot = resolve(import.meta.dirname, "../../mobile/lib")
  const config = await readFile(resolve(mobileRoot, "services/api_config.dart"), "utf8")
  const auth = await readFile(resolve(mobileRoot, "services/auth_service.dart"), "utf8")
  const firebase = await readFile(resolve(mobileRoot, "services/database_service.dart"), "utf8")
  assert.match(config, /dart\.vm\.product/)
  assert.match(config, /uri\.scheme != 'https'/)
  assert.doesNotMatch(auth + firebase, /demoUsers|loginWithUser|studio-8058744913-5a601|AIza/)
})
