import { neon } from "@neondatabase/serverless"

const databaseUrl = process.env.DATABASE_URL
const expectedHost = process.env.EXPECTED_DATABASE_HOST
if (!databaseUrl) throw new Error("DATABASE_URL is required")
if (!expectedHost) throw new Error("EXPECTED_DATABASE_HOST is required")

const parsed = new URL(databaseUrl)
if (parsed.hostname !== expectedHost) throw new Error("Neon target does not match EXPECTED_DATABASE_HOST")
if (!parsed.hostname.includes("-pooler.")) throw new Error("DATABASE_URL must use Neon's pooled hostname")

const sql = neon(databaseUrl)
const requiredTables = [
  "tenants", "businesses", "business_settings", "users", "products", "product_units",
  "customers", "suppliers", "employees", "transactions", "sales",
  "sale_lines", "inventory_movements", "tasks", "task_comments", "documents",
  "document_intelligence", "document_chunks", "activity_logs", "ai_queries",
  "notifications", "announcements", "announcement_reads", "integration_outbox",
  "request_rate_limits", "app_auth_sessions", "system_migrations",
  "employment_events", "attendance_records", "leave_requests", "payroll_settings",
  "chart_of_accounts", "fiscal_periods", "journal_entries", "journal_lines",
  "payroll_runs", "payroll_items", "bank_accounts", "bank_transactions",
  "receivable_invoices", "payable_bills", "accounting_payments",
  "saas_plans", "saas_subscriptions", "saas_invoices", "saas_payments",
  "platform_audit_logs", "platform_tenant_notes", "platform_support_cases",
  "platform_workspace_invites", "platform_user_invites",
]

const [server] = await sql`SELECT current_setting('server_version') AS server_version`
const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
const present = new Set(tables.map((row) => String(row.table_name)))
const missingTables = requiredTables.filter((table) => !present.has(table))
const [features] = await sql`SELECT
  EXISTS(SELECT 1 FROM pg_extension WHERE extname='vector') AS vector_enabled,
  to_regclass('neon_auth.user') IS NOT NULL AS neon_auth_ready,
  EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='users' AND column_name='auth_user_id'
  ) AS auth_link_ready,
  EXISTS(
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='ai_queries' AND column_name='purpose'
  ) AND EXISTS(
    SELECT 1 FROM pg_constraint WHERE conname='ai_queries_purpose_check'
  ) AND to_regclass('public.ai_queries_conversation_idx') IS NOT NULL AS ai_governance_ready`
const requiredTenantGuards = [
  "businesses_tenant_scope_fkey",
  "business_settings_company_scope_fkey",
  "users_company_scope_fkey",
  "products_company_scope_fkey",
  "transactions_company_scope_fkey",
  "tasks_company_scope_fkey",
  "task_comments_company_scope_fkey",
  "employees_company_scope_fkey",
  "customers_company_scope_fkey",
  "suppliers_company_scope_fkey",
  "documents_company_scope_fkey",
  "document_intelligence_company_scope_fkey",
  "activity_logs_company_scope_fkey",
  "ai_queries_company_scope_fkey",
  "notifications_company_scope_fkey",
  "sales_company_scope_fkey",
  "announcements_company_scope_fkey",
  "integration_outbox_company_scope_fkey",
  "product_units_company_scope_fkey",
  "tasks_assignee_company_scope_fkey",
  "task_comments_task_company_scope_fkey",
  "task_comments_user_company_scope_fkey",
]
const tenantGuards = await sql`SELECT conname FROM pg_constraint
  WHERE conname::text = ANY(${requiredTenantGuards}::text[])`
const presentTenantGuards = new Set(tenantGuards.map((row) => String(row.conname)))
const missingTenantGuards = requiredTenantGuards.filter((name) => !presentTenantGuards.has(name))
const companyScopedTables = [
  "business_settings", "users", "products", "product_units", "transactions", "tasks",
  "task_comments", "employees", "customers", "suppliers", "documents",
  "document_intelligence", "activity_logs", "ai_queries", "notifications",
  "sales", "announcements", "integration_outbox",
  "employment_events", "attendance_records", "leave_requests", "payroll_settings",
  "chart_of_accounts", "fiscal_periods", "journal_entries", "journal_lines",
  "payroll_runs", "payroll_items", "bank_accounts", "bank_transactions",
  "receivable_invoices", "payable_bills", "accounting_payments",
]
// Keep verification reads sequential so local proxies and constrained networks
// are not hit with dozens of simultaneous Neon HTTPS connections.
const businessTenantRows = await sql`SELECT count(*)::int AS count FROM businesses b
  LEFT JOIN tenants t ON t.id=b.tenant_id WHERE t.id IS NULL`
const companyIntegrityRows = []
for (const table of companyScopedTables) {
  companyIntegrityRows.push(await sql.query(
    `SELECT count(*)::int AS count FROM ${table} child
     LEFT JOIN businesses b ON b.id=child.business_id AND b.tenant_id=child.tenant_id
     WHERE b.id IS NULL`,
  ))
}
const taskAssigneeRows = await sql`SELECT count(*)::int AS count FROM tasks task
  LEFT JOIN users u ON u.id=task.assigned_to_id AND u.tenant_id=task.tenant_id AND u.business_id=task.business_id
  WHERE task.assigned_to_id IS NOT NULL AND u.id IS NULL`
const taskCommentTaskRows = await sql`SELECT count(*)::int AS count FROM task_comments comment
  LEFT JOIN tasks task ON task.id=comment.task_id AND task.tenant_id=comment.tenant_id AND task.business_id=comment.business_id
  WHERE task.id IS NULL`
const taskCommentUserRows = await sql`SELECT count(*)::int AS count FROM task_comments comment
  LEFT JOIN users u ON u.id=comment.user_id AND u.tenant_id=comment.tenant_id AND u.business_id=comment.business_id
  WHERE u.id IS NULL`
const orphanCounts = {
  orphan_businesses: Number(businessTenantRows[0]?.count ?? 0),
  ...Object.fromEntries(companyScopedTables.map((table, index) => [
    `orphan_${table}`,
    Number(companyIntegrityRows[index][0]?.count ?? 0),
  ])),
  orphan_task_assignees: Number(taskAssigneeRows[0]?.count ?? 0),
  orphan_task_comment_tasks: Number(taskCommentTaskRows[0]?.count ?? 0),
  orphan_task_comment_users: Number(taskCommentUserRows[0]?.count ?? 0),
}
const result = {
  databaseReachable: true,
  pooledConnection: true,
  serverVersion: String(server.server_version),
  requiredTables: requiredTables.length,
  missingTables,
  vectorEnabled: features.vector_enabled === true,
  neonAuthReady: features.neon_auth_ready === true,
  authLinkReady: features.auth_link_ready === true,
  aiGovernanceReady: features.ai_governance_ready === true,
  tenantGuards: requiredTenantGuards.length,
  missingTenantGuards,
  tenantIntegrity: orphanCounts,
}
console.log(JSON.stringify(result, null, 2))

if (
  missingTables.length
  || !result.vectorEnabled
  || !result.neonAuthReady
  || !result.authLinkReady
  || !result.aiGovernanceReady
  || missingTenantGuards.length
  || Object.values(orphanCounts).some((count) => count > 0)
) process.exitCode = 1
