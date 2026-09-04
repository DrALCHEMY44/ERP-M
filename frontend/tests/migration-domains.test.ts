import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { DATA_POLICIES } from "../src/lib/server/data-policies"

type PolicyExpectation = {
  kind: "query" | "mutation"
  permission: string
  scoped?: boolean
}

function assertPolicy(operation: string, expected: PolicyExpectation) {
  const policy = DATA_POLICIES[operation]
  assert.ok(policy, `${operation} must be exposed through the authenticated API`)
  assert.equal(policy.kind, expected.kind)
  assert.equal(policy.permission, expected.permission)
  if (expected.scoped !== undefined) assert.equal(policy.scoped, expected.scoped)
}

async function source(relativePath: string) {
  return readFile(new URL(`../${relativePath}`, import.meta.url), "utf8")
}

test("login uses Neon Auth and revocable Neon employee sessions", async () => {
  const [webPackage, mobilePackage, authServer, employeeRoute, mobileAuth, sessionStore, authMigration] = await Promise.all([
    source("package.json"),
    readFile(new URL("../../mobile/pubspec.yaml", import.meta.url), "utf8"),
    source("src/lib/auth/server.ts"),
    source("src/app/api/auth/employee-token/route.ts"),
    readFile(new URL("../../mobile/lib/services/auth_service.dart", import.meta.url), "utf8"),
    readFile(new URL("../../mobile/lib/services/session_store.dart", import.meta.url), "utf8"),
    source("scripts/migrate-users-to-neon-auth.mjs"),
  ])
  const dependencies = JSON.parse(webPackage).dependencies as Record<string, string>
  assert.ok(dependencies["@neondatabase/auth"])
  assert.equal(dependencies.firebase, undefined)
  assert.doesNotMatch(mobilePackage, /firebase_auth|firebase_core|firebase_data_connect/)
  assert.match(authServer, /createNeonAuth/)
  assert.match(employeeRoute, /verifySecret/)
  assert.match(employeeRoute, /issueAppSession/)
  assert.match(mobileAuth, /\/api\/auth\/sign-in\/email/)
  assert.match(mobileAuth, /\/api\/auth\/employee-token/)
  assert.match(sessionStore, /FlutterSecureStorage/)
  assert.match(authMigration, /JOIN tenants t ON t\.id=u\.tenant_id/)
  assert.match(authMigration, /JOIN businesses b ON b\.id=u\.business_id AND b\.tenant_id=u\.tenant_id/)
  assert.match(authMigration, /Invalid tenant\/business profile links must be resolved before Auth migration/)
})

test("tenant bootstrap is atomic and tenant administration is platform-only", async () => {
  assertPolicy("ListTenants", { kind: "query", permission: "platform:manage" })
  assertPolicy("UpdateTenant", { kind: "mutation", permission: "platform:manage" })
  const [bootstrap, database] = await Promise.all([
    source("src/app/api/bootstrap/route.ts"),
    source("src/lib/server/neon-data.ts"),
  ])
  assert.match(bootstrap, /BootstrapWorkspace/)
  assert.match(bootstrap, /authUserId/)
  assert.match(database, /case "BootstrapWorkspace"[\s\S]*transaction\(async[\s\S]*INSERT INTO tenants[\s\S]*INSERT INTO businesses[\s\S]*INSERT INTO users/)
})

test("product operations are API-authorized and company-scoped", async () => {
  assertPolicy("listProductsByBusiness", { kind: "query", permission: "inventory:read", scoped: true })
  for (const operation of ["CreateProduct", "UpdateProduct", "DeleteProduct"]) {
    assertPolicy(operation, { kind: "mutation", permission: "inventory:write", scoped: true })
  }
  const database = await source("src/lib/server/operational-data.ts")
  assert.match(database, /FROM products p[\s\S]*WHERE p\.tenant_id=\$1 AND p\.business_id=\$2/)
  assert.match(database, /case|operation === "CreateProduct"/)
})

test("customer operations are API-authorized and company-scoped", async () => {
  assertPolicy("listCustomersByBusiness", { kind: "query", permission: "customers:read", scoped: true })
  for (const operation of ["CreateCustomer", "UpdateCustomer", "DeleteCustomer"]) {
    assertPolicy(operation, { kind: "mutation", permission: "customers:write", scoped: true })
  }
  const [route, database] = await Promise.all([
    source("src/app/api/data/route.ts"),
    source("src/lib/server/neon-data.ts"),
  ])
  assert.match(database, /FROM customers WHERE tenant_id=\$\{tenantId\} AND business_id=\$\{businessId\}/)
  assert.match(route, /Customers with recorded sales cannot be deleted/)
})

test("employee lifecycle and login bindings are company-scoped", async () => {
  assertPolicy("listEmployeesByBusiness", { kind: "query", permission: "employees:read", scoped: true })
  for (const operation of [
    "CreateEmployee", "UpdateEmployee", "DeleteEmployee",
    "CreateEmployeeWithAccess", "UpdateEmployeeWithAccess", "DeleteEmployeeWithAccess",
  ]) {
    assertPolicy(operation, { kind: "mutation", permission: "employees:write", scoped: true })
  }
  const database = await source("src/lib/server/neon-data.ts")
  assert.match(database, /case "CreateEmployeeWithAccess"[\s\S]*transaction/)
  assert.match(database, /WHERE id=\$1 AND tenant_id=\$\d+ AND business_id=\$\d+/)
})

test("expense transactions and atomic sales have separate guarded paths", async () => {
  assertPolicy("listTransactionsByBusiness", { kind: "query", permission: "sales:read", scoped: true })
  for (const operation of ["CreateTransaction", "UpdateTransaction", "DeleteTransaction"]) {
    assertPolicy(operation, { kind: "mutation", permission: "expenses:write", scoped: true })
  }
  const [operations, salesRoute, sales] = await Promise.all([
    source("src/lib/server/operational-data.ts"),
    source("src/app/api/sales/route.ts"),
    source("src/lib/server/sales.ts"),
  ])
  assert.match(operations, /Sales must use the atomic sale endpoint/)
  assert.match(salesRoute, /recordSale/)
  assert.match(sales, /FOR UPDATE/)
  assert.match(sales, /idempotency_key/)
})

test("task CRUD and assigned-user completion are company-scoped", async () => {
  assertPolicy("listTasksByBusiness", { kind: "query", permission: "tasks:read", scoped: true })
  for (const operation of ["CreateTask", "UpdateTask", "DeleteTask"]) {
    assertPolicy(operation, { kind: "mutation", permission: "tasks:write", scoped: true })
  }
  assertPolicy("CompleteAssignedTask", { kind: "mutation", permission: "tasks:read", scoped: true })
  const [route, database] = await Promise.all([
    source("src/app/api/data/route.ts"),
    source("src/lib/server/neon-data.ts"),
  ])
  assert.match(route, /variables = companyVariables\(profile, \{ taskId: input\.variables\.taskId, userId: profile\.uid \}\)/)
  assert.match(database, /case "CompleteAssignedTask"[\s\S]*assigned_to_id=\$\{String\(variables\.userId\)\}/)
  assert.match(database, /EXISTS\(SELECT 1 FROM users WHERE id=\$\{String\(variables\.userId\)\} AND tenant_id=\$\{tenantId\} AND business_id=\$\{businessId\}\)/)
})

test("Neon verification is read-only and pooling stays server-side", async () => {
  const [verify, neonServer, environment, clientData, tenantMigration] = await Promise.all([
    source("scripts/verify-neon.mjs"),
    source("src/lib/server/neon.ts"),
    source("src/lib/server/environment.ts"),
    source("src/lib/data-service.ts"),
    source("migrations/010_tenant_integrity_guards.sql"),
  ])
  assert.match(verify, /current_setting\('server_version'\)/)
  assert.doesNotMatch(verify, /sql`\s*(INSERT|UPDATE|DELETE|ALTER|DROP|CREATE|TRUNCATE)\b/i)
  assert.match(neonServer, /new Pool/)
  assert.match(neonServer, /max,/)
  assert.match(environment, /EXPECTED_DATABASE_HOST/)
  assert.match(environment, /-pooler\./)
  assert.doesNotMatch(clientData, /DATABASE_URL|@neondatabase\/serverless/)
  assert.match(tenantMigration, /users_company_scope_fkey/)
  assert.match(tenantMigration, /tasks_assignee_company_scope_fkey/)
  assert.match(tenantMigration, /NOT VALID/)
})
