import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

async function source(relativePath: string) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

test("SaaS migration defines plans, subscriptions, billing, audit, support and invitations", async () => {
  const migration = await source("migrations/013_saas_control_plane.sql")
  for (const table of [
    "saas_plans", "saas_subscriptions", "saas_invoices", "saas_payments",
    "platform_audit_logs", "platform_tenant_notes", "platform_support_cases",
    "platform_workspace_invites",
  ]) assert.match(migration, new RegExp(`CREATE TABLE IF NOT EXISTS ${table}`))
  assert.match(migration, /users_account_status_check/)
  assert.match(migration, /INSERT INTO saas_plans/)
})

test("workspace and user suspension is enforced while super admins retain platform recovery access", async () => {
  const auth = await source("src/lib/server/auth.ts")
  assert.match(auth, /account_status !== "Active"/)
  assert.match(auth, /profile\.role !== "Platform Super Admin"/)
  assert.match(auth, /Workspace is suspended/)
  assert.match(auth, /UPDATE users SET last_login_at=NOW\(\)/)
})

test("plan capacity is enforced on users, businesses, documents and AI", async () => {
  const [entitlements, dataRoute, aiRoute, filesRoute] = await Promise.all([
    source("src/lib/server/saas-entitlements.ts"),
    source("src/app/api/data/route.ts"),
    source("src/app/api/ai/query/route.ts"),
    source("src/app/api/files/route.ts"),
  ])
  assert.match(entitlements, /CreateBusiness: "businesses"/)
  assert.match(entitlements, /CreateEmployeeWithAccess: "users"/)
  assert.match(entitlements, /CreateDocument: "documents"/)
  assert.match(dataRoute, /requireOperationEntitlement/)
  assert.match(aiRoute, /requireFeatureEntitlement\(authorized, "ai"\)/)
  assert.match(filesRoute, /requireFeatureEntitlement\(profile, "documents"\)/)
})

test("platform mutations are permission checked, origin checked and audited", async () => {
  const [route, service] = await Promise.all([
    source("src/app/api/platform/route.ts"),
    source("src/lib/server/platform-admin.ts"),
  ])
  assert.match(route, /requirePermission\(profile, "platform:manage"\)/)
  assert.match(route, /requireTrustedMutationOrigin\(request\)/)
  assert.match(service, /INSERT INTO platform_audit_logs/)
  assert.match(service, /UPDATE app_auth_sessions SET revoked_at=NOW\(\)/)
  assert.match(service, /invoice\.created/)
  assert.match(service, /payment\.recorded/)
  assert.match(service, /plan\.updated/)
  assert.match(service, /announcement\.published/)
})

test("dashboard uses payment-backed platform overview instead of hardcoded plan revenue", async () => {
  const dashboard = await source("src/app/admin/dashboard/page.tsx")
  assert.match(dashboard, /platformOverviewQuery/)
  assert.match(dashboard, /overview\.totals\.collected30dFcfa/)
  assert.match(dashboard, /Workspace directory/)
  assert.match(dashboard, /Platform user administration/)
  assert.doesNotMatch(dashboard, /const planPrice/)
})

test("platform user administration is paginated, auditable and invitation-token protected", async () => {
  const [migration, route, service, page, auth, access] = await Promise.all([
    source("migrations/014_platform_user_administration.sql"),
    source("src/app/api/platform/route.ts"),
    source("src/lib/server/platform-admin.ts"),
    source("src/app/admin/users/page.tsx"),
    source("src/lib/server/auth.ts"),
    source("src/lib/client-access.ts"),
  ])
  assert.match(migration, /CREATE TABLE IF NOT EXISTS platform_user_invites/)
  assert.match(migration, /token_hash TEXT NOT NULL UNIQUE/)
  assert.match(route, /users\.list/)
  assert.match(route, /user\.invite\.renew/)
  assert.match(service, /getPlatformUsers/)
  assert.match(service, /user\.invited/)
  assert.match(service, /At least one active Platform Super Admin is required/)
  assert.match(page, /Platform users/)
  assert.match(page, /Export CSV/)
  assert.match(page, /Revoke sessions/)
  assert.match(auth, /i\.token_hash=\$\{invitationHash\}/)
  assert.match(access, /"\/admin\/users": \["Platform Super Admin"\]/)
})
