import assert from "node:assert/strict"
import test from "node:test"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import { validateServerEnvironment } from "../src/lib/server/environment"
import { isAuthorizedReconciliationRequest } from "../scripts/reconcile-outbox-core.mjs"

const validEnvironment = {
  NEON_AUTH_BASE_URL: "https://ep-test.neonauth.eu-central-1.aws.neon.tech/neondb/auth",
  NEON_AUTH_COOKIE_SECRET: "a".repeat(32),
  DATABASE_URL: "postgresql://user:password@ep-test-pooler.example.test/demo",
  EXPECTED_DATABASE_HOST: "ep-test-pooler.example.test",
  NEON_POOL_MAX: "5",
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
  const environment = validateServerEnvironment(validEnvironment)
  assert.equal(environment.AI_RETENTION_DAYS, 30)
  assert.equal(environment.AI_INSIGHT_CACHE_MINUTES, 15)
  assert.equal(environment.OPENROUTER_DATA_COLLECTION, "deny")
  assert.equal(environment.OPENROUTER_REQUIRE_ZDR, "false")
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

test("AI history retention and dashboard caching are migration-backed and scheduled", async () => {
  const root = resolve(import.meta.dirname, "..")
  const [migration, maintenance, vercel, governance] = await Promise.all([
    readFile(resolve(root, "migrations/012_ai_governance.sql"), "utf8"),
    readFile(resolve(root, "src/app/api/internal/ai-maintenance/route.ts"), "utf8"),
    readFile(resolve(root, "vercel.json"), "utf8"),
    readFile(resolve(root, "src/lib/server/ai-governance.ts"), "utf8"),
  ])
  assert.match(migration, /purpose IN \('assistant', 'dashboard'\)/)
  assert.match(governance, /DELETE FROM ai_queries/)
  assert.match(governance, /purpose='dashboard'/)
  assert.match(maintenance, /AI_RETENTION_DAYS/)
  assert.match(vercel, /\/api\/internal\/ai-maintenance/)
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

test("mobile release API configuration requires HTTPS, shares enterprise APIs, and contains no demo project", async () => {
  const mobileRoot = resolve(import.meta.dirname, "../../mobile/lib")
  const config = await readFile(resolve(mobileRoot, "services/api_config.dart"), "utf8")
  const auth = await readFile(resolve(mobileRoot, "services/auth_service.dart"), "utf8")
  const sessionStore = await readFile(resolve(mobileRoot, "services/session_store.dart"), "utf8")
  const enterpriseApi = await readFile(resolve(mobileRoot, "services/enterprise_api.dart"), "utf8")
  assert.match(config, /dart\.vm\.product/)
  assert.match(config, /uri\.scheme != 'https'/)
  assert.match(sessionStore, /FlutterSecureStorage/)
  assert.match(enterpriseApi, /\/api\/hr/)
  assert.match(enterpriseApi, /\/api\/payroll/)
  assert.match(enterpriseApi, /\/api\/accounting/)
  assert.doesNotMatch(enterpriseApi, /tenantId|businessId|DATABASE_URL/)
  assert.doesNotMatch(auth + sessionStore, /demoUsers|loginWithUser|studio-8058744913-5a601|AIza|firebase_auth/)
})

test("release configuration fails closed and local Firebase scripts cannot touch the legacy project", async () => {
  const repositoryRoot = resolve(import.meta.dirname, "../..")
  const [androidBuild, androidManifest, authClient, firebaseRc, rootPackage, migrationRunner] = await Promise.all([
    readFile(resolve(repositoryRoot, "mobile/android/app/build.gradle.kts"), "utf8"),
    readFile(resolve(repositoryRoot, "mobile/android/app/src/main/AndroidManifest.xml"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/src/lib/auth/client.ts"), "utf8"),
    readFile(resolve(repositoryRoot, "backend/.firebaserc"), "utf8"),
    readFile(resolve(repositoryRoot, "package.json"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/scripts/apply-neon-migrations.mjs"), "utf8"),
  ])
  assert.match(androidBuild, /check\(releaseSigningReady\)/)
  assert.doesNotMatch(androidBuild, /signingConfigs\.getByName\("debug"\)/)
  assert.match(androidManifest, /android:usesCleartextTraffic="false"/)
  assert.match(authClient, /@neondatabase\/auth/)
  assert.equal(JSON.parse(firebaseRc).projects.default, "demo-smarterp-ai-defence-local")
  assert.match(rootPackage, /--project demo-smarterp-ai-defence-local/)
  assert.doesNotMatch(rootPackage, /--project studio-8058744913-5a601/)
  assert.match(migrationRunner, /006_operational_fields\.sql/)
  assert.match(migrationRunner, /007_cross_store_customer_reference\.sql/)
  assert.match(migrationRunner, /008_neon_system_of_record\.sql/)
  assert.match(migrationRunner, /009_neon_auth\.sql/)
  assert.match(migrationRunner, /010_tenant_integrity_guards\.sql/)
  assert.match(migrationRunner, /011_hr_payroll_accounting\.sql/)
  assert.match(migrationRunner, /012_ai_governance\.sql/)
})

test("continuous integration covers web, Android, browser security, and guarded production smoke checks", async () => {
  const repositoryRoot = resolve(import.meta.dirname, "../..")
  const [ci, productionSmoke, frontendPackage, playwright, mobileNavigation, releaseChecklist] = await Promise.all([
    readFile(resolve(repositoryRoot, ".github/workflows/ci.yml"), "utf8"),
    readFile(resolve(repositoryRoot, ".github/workflows/production-smoke.yml"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/package.json"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/playwright.config.ts"), "utf8"),
    readFile(resolve(repositoryRoot, "mobile/test/widget_test.dart"), "utf8"),
    readFile(resolve(repositoryRoot, "docs/RELEASE_CHECKLIST.md"), "utf8"),
  ])

  assert.match(ci, /npm run typecheck/)
  assert.match(ci, /npm run lint/)
  assert.match(ci, /npm run test:e2e/)
  assert.match(ci, /flutter analyze/)
  assert.match(ci, /flutter test/)
  assert.doesNotMatch(ci, /gradle|android-emulator|flutter build apk/i)
  assert.match(productionSmoke, /SMOKE_OWNER_EMAIL: \$\{\{ secrets\.SMOKE_OWNER_EMAIL \}\}/)
  assert.match(productionSmoke, /npm run test:e2e:smoke/)
  assert.match(frontendPackage, /"test:e2e"/)
  assert.match(playwright, /PLAYWRIGHT_BASE_URL must use HTTPS/)
  assert.match(mobileNavigation, /welcome flow reaches login and tenant registration/)
  assert.match(releaseChecklist, /factory-reset database still reports zero application rows/)
})

test("factory reset is host-guarded, explicit, and preserves migration history", async () => {
  const reset = await readFile(resolve(import.meta.dirname, "../scripts/reset-neon-data.mjs"), "utf8")
  assert.match(reset, /RESET_ALL_SMARTERP_DATA/)
  assert.match(reset, /url\.hostname !== expectedHost/)
  assert.match(reset, /tablename <> 'system_migrations'/)
  assert.match(reset, /TRUNCATE TABLE/)
  assert.match(reset, /Reset verification failed: migration history changed/)
  assert.doesNotMatch(reset, /DROP SCHEMA|DROP TABLE|neon_auth\."user"\s*(?:;|CASCADE)/i)
})

test("object-storage reset is separately guarded and verifies an empty bucket", async () => {
  const reset = await readFile(resolve(import.meta.dirname, "../scripts/reset-object-storage.mjs"), "utf8")
  assert.match(reset, /RESET_ALL_SMARTERP_OBJECTS/)
  assert.match(reset, /ListObjectVersionsCommand/)
  assert.match(reset, /DeleteObjectsCommand/)
  assert.match(reset, /Object reset verification failed/)
  assert.doesNotMatch(reset, /console\.log\([^)]*(?:Key|bucket)/)
})

test("Neon is the sole relational runtime and the guarded final import preserves tenant controls", async () => {
  const repositoryRoot = resolve(import.meta.dirname, "../..")
  const [migration, authMigration, tenantMigration, salesRoute, dataRoute, neonData, tokenService, environment, frontendPackage, mobilePackage, firebaseConfig, importScript] = await Promise.all([
    readFile(resolve(repositoryRoot, "frontend/migrations/008_neon_system_of_record.sql"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/migrations/009_neon_auth.sql"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/migrations/010_tenant_integrity_guards.sql"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/src/app/api/sales/route.ts"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/src/app/api/data/route.ts"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/src/lib/server/neon-data.ts"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/src/lib/server/auth.ts"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/src/lib/server/environment.ts"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/package.json"), "utf8"),
    readFile(resolve(repositoryRoot, "mobile/pubspec.yaml"), "utf8"),
    readFile(resolve(repositoryRoot, "backend/firebase.json"), "utf8"),
    readFile(resolve(repositoryRoot, "frontend/scripts/backfill-firebase-to-neon.mjs"), "utf8"),
  ])
  assert.match(migration, /CREATE TABLE IF NOT EXISTS business_settings/)
  assert.match(authMigration, /ADD COLUMN IF NOT EXISTS auth_user_id UUID/)
  assert.match(authMigration, /CREATE TABLE IF NOT EXISTS app_auth_sessions/)
  assert.match(tenantMigration, /users_company_scope_fkey/)
  assert.match(tenantMigration, /FOREIGN KEY \(tenant_id, business_id\)/)
  assert.match(tenantMigration, /NOT VALID/)
  assert.match(migration, /DROP COLUMN IF EXISTS access_code/)
  assert.match(migration, /sales_customer_scope_fkey/)
  assert.match(migration, /payment_method IN \('CASH','MOBILE_MONEY','BANK_TRANSFER','CREDIT','UNKNOWN'\)/)
  assert.match(salesRoute, /getCustomerForCompany/)
  assert.match(dataRoute, /Customers with recorded sales cannot be deleted/)
  assert.match(neonData, /case "CompleteAssignedTask"[\s\S]*assigned_to_id/)
  assert.match(neonData, /case "CreateEmployeeWithAccess"[\s\S]*transaction/)
  assert.match(neonData, /case "UpdateEmployeeWithAccess"[\s\S]*user\.rowCount !== 1/)
  assert.match(neonData, /case "DeleteEmployeeWithAccess"[\s\S]*user\.rowCount !== 1/)
  assert.doesNotMatch(tokenService + environment + frontendPackage + mobilePackage + firebaseConfig, /firebase-admin\/data-connect|FIREBASE_DATACONNECT|@dataconnect\/generated|firebase_data_connect|"dataconnect"/)
  assert.doesNotMatch(tokenService + environment + mobilePackage, /firebase-admin\/auth|firebase_auth|firebase_core/)
  assert.match(importScript, /SOURCE_FIREBASE_DATACONNECT_SERVICE_ID/)
  assert.match(importScript, /MIGRATE_DATACONNECT_TO_NEON/)
  assert.match(importScript, /INSERT INTO system_migrations/)
  assert.match(importScript, /offset: \$offset/)
  assert.match(importScript, /hasAnotherPage/)
  assert.doesNotMatch(importScript, /businessSettings\(limit:/)
  assert.match(importScript, /synthesizedBusinessSettingsCount/)
  assert.match(importScript, /=ANY\(\$1::text\[\]\)/)
  assert.match(importScript, /legacySaleTransactions[\s\S]*INSERT INTO sales[\s\S]*'UNKNOWN'/)
  assert.match(importScript, /INSERT INTO products[\s\S]*ON CONFLICT\(id\) DO UPDATE SET/)
  assert.match(importScript, /INSERT INTO transactions[\s\S]*ON CONFLICT\(id\) DO UPDATE SET/)
  assert.match(importScript, /Neon record verification failed for legacy sales/)
  assert.match(importScript, /VALIDATE CONSTRAINT sales_customer_scope_fkey/)
  assert.match(importScript, /ROLLBACK/)
})
