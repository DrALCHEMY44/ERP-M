import { createHash, randomBytes, randomUUID } from "crypto"
import type { PoolClient } from "@neondatabase/serverless"

import type {
  PlatformAuditEntry,
  PlatformOverview,
  PlatformSupportCase,
  PlatformTenant,
  PlatformTenantDetails,
  PlatformTenantNote,
  PlatformUser,
  PlatformUserDetails,
  PlatformUserDirectory,
  SaaSInvoice,
  SaaSPlan,
  SaaSPlanCode,
} from "@/lib/platform-types"
import type { AuthorizedProfile } from "./auth"
import { db, pooledDb, withTransientDatabaseRetry } from "./neon"
import { ensureDefaultAccounts } from "./accounting"

type Row = Record<string, unknown>

const asNumber = (value: unknown) => Number(value ?? 0)
const asString = (value: unknown) => value == null ? "" : String(value)
const asNullableString = (value: unknown) => value == null ? null : String(value)

const tenantSelect = `
  SELECT t.id,t.name,t.business_sector,t.location,t.owner_email,t.status,t.suspension_reason,
    t.archived_at,t.created_at,t.updated_at,
    COALESCE(s.plan_code,t.subscription_tier,'Basic') AS plan_code,
    COALESCE(s.status,'active') AS subscription_status,
    COALESCE(s.billing_interval,'monthly') AS billing_interval,
    COALESCE(s.amount_fcfa,p.monthly_price_fcfa,0) AS amount_fcfa,
    s.current_period_end,s.cancel_at_period_end,
    (SELECT COUNT(*) FROM users u WHERE u.tenant_id=t.id)::integer AS user_count,
    (SELECT COUNT(*) FROM businesses b WHERE b.tenant_id=t.id)::integer AS business_count,
    (SELECT COUNT(*) FROM documents d WHERE d.tenant_id=t.id)::integer AS document_count,
    (SELECT COUNT(*) FROM ai_queries aq WHERE aq.tenant_id=t.id
      AND aq.timestamp>=date_trunc('month',NOW()))::integer AS ai_requests_this_month,
    (SELECT MAX(al.timestamp) FROM activity_logs al WHERE al.tenant_id=t.id) AS last_activity_at
  FROM tenants t
  LEFT JOIN saas_subscriptions s ON s.tenant_id=t.id
  LEFT JOIN saas_plans p ON p.code=COALESCE(s.plan_code,t.subscription_tier,'Basic')`

const userSelect = `
  SELECT u.*,t.name AS tenant_name,b.name AS business_name,
    (SELECT COUNT(*) FROM app_auth_sessions s
      WHERE s.user_id=u.id AND s.revoked_at IS NULL AND s.expires_at>NOW())::integer AS active_sessions,
    CASE
      WHEN i.id IS NULL THEN NULL
      WHEN i.accepted_at IS NOT NULL THEN 'accepted'
      WHEN i.revoked_at IS NOT NULL THEN 'revoked'
      WHEN i.expires_at<=NOW() THEN 'expired'
      ELSE 'pending'
    END AS invitation_status,
    i.expires_at AS invitation_expires_at
  FROM users u
  JOIN tenants t ON t.id=u.tenant_id
  JOIN businesses b ON b.id=u.business_id AND b.tenant_id=u.tenant_id
  LEFT JOIN platform_user_invites i ON i.user_id=u.id`

function mapPlan(row: Row): SaaSPlan {
  return {
    code: asString(row.code) as SaaSPlanCode,
    displayName: asString(row.display_name),
    monthlyPriceFcfa: asNumber(row.monthly_price_fcfa),
    annualPriceFcfa: asNumber(row.annual_price_fcfa),
    maxUsers: row.max_users == null ? null : asNumber(row.max_users),
    maxBusinesses: row.max_businesses == null ? null : asNumber(row.max_businesses),
    maxDocuments: row.max_documents == null ? null : asNumber(row.max_documents),
    monthlyAiRequests: row.monthly_ai_requests == null ? null : asNumber(row.monthly_ai_requests),
    features: (row.features ?? {}) as Record<string, boolean>,
  }
}

function mapTenant(row: Row): PlatformTenant {
  return {
    id: asString(row.id),
    name: asString(row.name),
    businessSector: asString(row.business_sector),
    location: asString(row.location),
    ownerEmail: asString(row.owner_email),
    plan: asString(row.plan_code) as SaaSPlanCode,
    status: row.archived_at ? "Archived" : asString(row.status) as PlatformTenant["status"],
    subscriptionStatus: asString(row.subscription_status) as PlatformTenant["subscriptionStatus"],
    billingInterval: asString(row.billing_interval) as PlatformTenant["billingInterval"],
    amountFcfa: asNumber(row.amount_fcfa),
    currentPeriodEnd: asNullableString(row.current_period_end),
    cancelAtPeriodEnd: Boolean(row.cancel_at_period_end),
    suspensionReason: asNullableString(row.suspension_reason),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
    userCount: asNumber(row.user_count),
    businessCount: asNumber(row.business_count),
    documentCount: asNumber(row.document_count),
    aiRequestsThisMonth: asNumber(row.ai_requests_this_month),
    lastActivityAt: asNullableString(row.last_activity_at),
  }
}

function mapUser(row: Row): PlatformUser {
  return {
    id: asString(row.id),
    tenantId: asString(row.tenant_id),
    tenantName: asString(row.tenant_name),
    businessId: asString(row.business_id),
    businessName: asString(row.business_name),
    email: asString(row.email),
    fullName: asString(row.full_name),
    department: asNullableString(row.department),
    phoneNumber: asNullableString(row.phone_number),
    role: asString(row.role),
    status: asString(row.account_status || "Active") as PlatformUser["status"],
    authLinked: Boolean(row.auth_user_id),
    activeSessions: asNumber(row.active_sessions),
    lastLoginAt: asNullableString(row.last_login_at),
    createdAt: asString(row.created_at),
    invitationStatus: asNullableString(row.invitation_status) as PlatformUser["invitationStatus"],
    invitationExpiresAt: asNullableString(row.invitation_expires_at),
  }
}

function mapInvoice(row: Row): SaaSInvoice {
  return {
    id: asString(row.id),
    tenantId: asString(row.tenant_id),
    tenantName: asString(row.tenant_name),
    invoiceNumber: asString(row.invoice_number),
    status: asString(row.status) as SaaSInvoice["status"],
    currency: asString(row.currency),
    amountDueFcfa: asNumber(row.amount_due_fcfa),
    amountPaidFcfa: asNumber(row.amount_paid_fcfa),
    description: asNullableString(row.description),
    dueAt: asNullableString(row.due_at),
    paidAt: asNullableString(row.paid_at),
    createdAt: asString(row.created_at),
  }
}

function mapAudit(row: Row): PlatformAuditEntry {
  return {
    id: asString(row.id),
    actorEmail: asString(row.actor_email),
    action: asString(row.action),
    targetType: asString(row.target_type),
    targetId: asString(row.target_id),
    details: (row.details ?? {}) as Record<string, unknown>,
    createdAt: asString(row.created_at),
  }
}

function mapSupport(row: Row): PlatformSupportCase {
  return {
    id: asString(row.id),
    tenantId: asString(row.tenant_id),
    tenantName: asString(row.tenant_name),
    subject: asString(row.subject),
    description: asNullableString(row.description),
    priority: asString(row.priority) as PlatformSupportCase["priority"],
    status: asString(row.status) as PlatformSupportCase["status"],
    assignedTo: asNullableString(row.assigned_to),
    createdAt: asString(row.created_at),
    updatedAt: asString(row.updated_at),
  }
}

function mapNote(row: Row): PlatformTenantNote {
  return {
    id: asString(row.id),
    tenantId: asString(row.tenant_id),
    body: asString(row.body),
    createdByEmail: asString(row.created_by_email),
    createdAt: asString(row.created_at),
  }
}

export type PlatformOverviewFilters = {
  search?: string
  plan?: "all" | SaaSPlanCode
  status?: "all" | PlatformTenant["status"]
  sort?: "newest" | "oldest" | "name" | "value"
  page?: number
  pageSize?: number
}

async function listTenantRows(filters: PlatformOverviewFilters = {}) {
  const search = filters.search?.trim() ?? ""
  const page = Math.max(1, Math.floor(filters.page ?? 1))
  const pageSize = Math.min(50, Math.max(5, Math.floor(filters.pageSize ?? 10)))
  const clauses: string[] = []
  const params: unknown[] = []
  if (search) {
    params.push(`%${search.toLowerCase()}%`)
    clauses.push(`(LOWER(t.name) LIKE $${params.length} OR LOWER(t.owner_email) LIKE $${params.length}
      OR LOWER(t.business_sector) LIKE $${params.length} OR LOWER(t.id) LIKE $${params.length})`)
  }
  if (filters.plan && filters.plan !== "all") {
    params.push(filters.plan)
    clauses.push(`COALESCE(s.plan_code,t.subscription_tier,'Basic')=$${params.length}`)
  }
  if (filters.status && filters.status !== "all") {
    if (filters.status === "Archived") clauses.push("t.archived_at IS NOT NULL")
    else {
      params.push(filters.status)
      clauses.push(`t.archived_at IS NULL AND t.status=$${params.length}`)
    }
  }
  const where = clauses.length ? ` WHERE ${clauses.join(" AND ")}` : ""
  const sort = {
    newest: "t.created_at DESC",
    oldest: "t.created_at ASC",
    name: "LOWER(t.name) ASC",
    value: "amount_fcfa DESC,t.created_at DESC",
  }[filters.sort ?? "newest"]
  const countRows = await db().query(`SELECT COUNT(*)::integer AS count FROM tenants t
    LEFT JOIN saas_subscriptions s ON s.tenant_id=t.id${where}`, params) as unknown as Row[]
  params.push(pageSize, (page - 1) * pageSize)
  const rows = await db().query(`${tenantSelect}${where} ORDER BY ${sort}
    LIMIT $${params.length - 1} OFFSET $${params.length}`, params) as unknown as Row[]
  return { tenants: rows.map(mapTenant), total: asNumber(countRows[0]?.count), page, pageSize }
}

async function listPlans() {
  const rows = await db()`SELECT * FROM saas_plans WHERE is_active=TRUE ORDER BY monthly_price_fcfa` as unknown as Row[]
  return rows.map(mapPlan)
}

async function listUsers(limit = 100, tenantId?: string) {
  const rows = tenantId
    ? await db().query(`${userSelect} WHERE u.tenant_id=$1 ORDER BY u.created_at DESC LIMIT $2`, [tenantId, limit]) as unknown as Row[]
    : await db().query(`${userSelect} ORDER BY u.created_at DESC LIMIT $1`, [limit]) as unknown as Row[]
  return rows.map(mapUser)
}

export type PlatformUserFilters = {
  search?: string
  tenantId?: string
  role?: string
  status?: "all" | "Active" | "Suspended"
  authState?: "all" | "linked" | "pending"
  sort?: "newest" | "oldest" | "name" | "lastActive"
  page?: number
  pageSize?: number
}

export async function getPlatformUsers(filters: PlatformUserFilters = {}): Promise<PlatformUserDirectory> {
  return withTransientDatabaseRetry(async () => {
    const search = filters.search?.trim().toLowerCase() ?? ""
    const page = Math.max(1, Math.floor(filters.page ?? 1))
    const pageSize = Math.min(100, Math.max(5, Math.floor(filters.pageSize ?? 20)))
    const clauses: string[] = []
    const params: unknown[] = []
    if (search) {
      params.push(`%${search}%`)
      clauses.push(`(LOWER(u.full_name) LIKE $${params.length} OR LOWER(u.email) LIKE $${params.length}
        OR LOWER(t.name) LIKE $${params.length} OR LOWER(b.name) LIKE $${params.length}
        OR LOWER(COALESCE(u.department,'')) LIKE $${params.length})`)
    }
    if (filters.tenantId && filters.tenantId !== "all") {
      params.push(filters.tenantId)
      clauses.push(`u.tenant_id=$${params.length}`)
    }
    if (filters.role && filters.role !== "all") {
      params.push(filters.role)
      clauses.push(`u.role=$${params.length}`)
    }
    if (filters.status && filters.status !== "all") {
      params.push(filters.status)
      clauses.push(`u.account_status=$${params.length}`)
    }
    if (filters.authState === "linked") clauses.push("u.auth_user_id IS NOT NULL")
    if (filters.authState === "pending") clauses.push("u.auth_user_id IS NULL")
    const where = clauses.length ? ` WHERE ${clauses.join(" AND ")}` : ""
    const sort = {
      newest: "u.created_at DESC",
      oldest: "u.created_at ASC",
      name: "LOWER(COALESCE(u.full_name,u.email)) ASC",
      lastActive: "u.last_login_at DESC NULLS LAST,u.created_at DESC",
    }[filters.sort ?? "newest"]

    // Keep Neon HTTP reads sequential. On constrained development networks a
    // burst of parallel TLS connections can exhaust the proxy/NAT path.
    const countRows = await db().query(`SELECT COUNT(*)::integer AS count FROM users u
      JOIN tenants t ON t.id=u.tenant_id JOIN businesses b ON b.id=u.business_id AND b.tenant_id=u.tenant_id${where}`, params) as unknown as Row[]
    const totalRows = await db()`SELECT
        COUNT(*)::integer AS users,
        COUNT(*) FILTER (WHERE account_status='Active')::integer AS active,
        COUNT(*) FILTER (WHERE account_status='Suspended')::integer AS suspended,
        COUNT(*) FILTER (WHERE auth_user_id IS NOT NULL)::integer AS auth_linked,
        COUNT(*) FILTER (WHERE last_login_at>=NOW()-INTERVAL '30 days')::integer AS active_30d,
        COUNT(*) FILTER (WHERE role='Platform Super Admin' AND account_status='Active' AND auth_user_id IS NOT NULL)::integer AS super_admins,
        (SELECT COUNT(*) FROM platform_user_invites
          WHERE accepted_at IS NULL AND revoked_at IS NULL AND expires_at>NOW())::integer AS pending_invitations
        FROM users` as unknown as Row[]
    const tenantRows = await db()`SELECT id,name FROM tenants WHERE archived_at IS NULL ORDER BY LOWER(name)` as unknown as Row[]
    const businessRows = await db()`SELECT b.id,b.tenant_id,b.name FROM businesses b JOIN tenants t ON t.id=b.tenant_id
      WHERE t.archived_at IS NULL ORDER BY LOWER(t.name),LOWER(b.name)` as unknown as Row[]
    const pageParams = [...params, pageSize, (page - 1) * pageSize]
    const rows = await db().query(`${userSelect}${where} ORDER BY ${sort}
      LIMIT $${pageParams.length - 1} OFFSET $${pageParams.length}`, pageParams) as unknown as Row[]
    const totals = totalRows[0] ?? {}
    return {
      totals: {
        users: asNumber(totals.users), active: asNumber(totals.active), suspended: asNumber(totals.suspended),
        authLinked: asNumber(totals.auth_linked), pendingInvitations: asNumber(totals.pending_invitations),
        active30d: asNumber(totals.active_30d), superAdmins: asNumber(totals.super_admins),
      },
      users: rows.map(mapUser), total: asNumber(countRows[0]?.count), page, pageSize,
      tenantOptions: tenantRows.map((row) => ({ id: asString(row.id), name: asString(row.name) })),
      businessOptions: businessRows.map((row) => ({ id: asString(row.id), tenantId: asString(row.tenant_id), name: asString(row.name) })),
      generatedAt: new Date().toISOString(),
    }
  })
}

export async function getPlatformUserDetails(id: string): Promise<PlatformUserDetails> {
  return withTransientDatabaseRetry(async () => {
    const userRows = await db().query(`${userSelect} WHERE u.id=$1 LIMIT 1`, [id]) as unknown as Row[]
    const sessionRows = await db()`SELECT id,created_at,last_used_at,expires_at,revoked_at,user_agent FROM app_auth_sessions
      WHERE user_id=${id} ORDER BY created_at DESC LIMIT 50` as unknown as Row[]
    const activityRows = await db()`SELECT id,action_type,module,description,timestamp FROM activity_logs
      WHERE user_id=${id} ORDER BY timestamp DESC LIMIT 50` as unknown as Row[]
    const auditEntries = await listAudit(100, id)
    if (!userRows[0]) throw new Error("User not found")
    return {
      user: mapUser(userRows[0]),
      sessions: sessionRows.map((row) => ({
        id: asString(row.id), createdAt: asString(row.created_at), lastUsedAt: asString(row.last_used_at),
        expiresAt: asString(row.expires_at), revokedAt: asNullableString(row.revoked_at), userAgent: asNullableString(row.user_agent),
      })),
      activity: activityRows.map((row) => ({
        id: asString(row.id), actionType: asString(row.action_type), module: asString(row.module),
        description: asNullableString(row.description), timestamp: asString(row.timestamp),
      })),
      audit: auditEntries,
    }
  })
}

async function listInvoices(limit = 50, tenantId?: string) {
  const rows = tenantId
    ? await db()`SELECT i.*,t.name AS tenant_name FROM saas_invoices i JOIN tenants t ON t.id=i.tenant_id
      WHERE i.tenant_id=${tenantId} ORDER BY i.created_at DESC LIMIT ${limit}` as unknown as Row[]
    : await db()`SELECT i.*,t.name AS tenant_name FROM saas_invoices i JOIN tenants t ON t.id=i.tenant_id
      ORDER BY i.created_at DESC LIMIT ${limit}` as unknown as Row[]
  return rows.map(mapInvoice)
}

async function listAudit(limit = 50, targetId?: string) {
  const rows = targetId
    ? await db()`SELECT * FROM platform_audit_logs WHERE target_id=${targetId}
      ORDER BY created_at DESC LIMIT ${limit}` as unknown as Row[]
    : await db()`SELECT * FROM platform_audit_logs ORDER BY created_at DESC LIMIT ${limit}` as unknown as Row[]
  return rows.map(mapAudit)
}

async function listSupport(limit = 50, tenantId?: string) {
  const rows = tenantId
    ? await db()`SELECT c.*,t.name AS tenant_name FROM platform_support_cases c JOIN tenants t ON t.id=c.tenant_id
      WHERE c.tenant_id=${tenantId} ORDER BY c.updated_at DESC LIMIT ${limit}` as unknown as Row[]
    : await db()`SELECT c.*,t.name AS tenant_name FROM platform_support_cases c JOIN tenants t ON t.id=c.tenant_id
      ORDER BY CASE c.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END,
      c.updated_at DESC LIMIT ${limit}` as unknown as Row[]
  return rows.map(mapSupport)
}

export async function getPlatformOverview(filters: PlatformOverviewFilters = {}): Promise<PlatformOverview> {
  return withTransientDatabaseRetry(async () => {
    const tenantPage = await listTenantRows(filters)
    const tenantOptionRows = await db()`SELECT id,name FROM tenants WHERE archived_at IS NULL ORDER BY LOWER(name)`
    const plans = await listPlans()
    const users = await listUsers()
    const invoices = await listInvoices()
    const audit = await listAudit()
    const supportCases = await listSupport()
    const totalRows = await db()`SELECT
        (SELECT COUNT(*) FROM tenants)::integer AS tenants,
        (SELECT COUNT(*) FROM tenants WHERE status='Active' AND archived_at IS NULL)::integer AS active_tenants,
        (SELECT COUNT(*) FROM tenants WHERE status='Suspended' AND archived_at IS NULL)::integer AS suspended_tenants,
        (SELECT COUNT(*) FROM users)::integer AS users,
        (SELECT COUNT(*) FROM users WHERE last_login_at>=NOW()-INTERVAL '30 days')::integer AS active_users_30d,
        (SELECT COUNT(*) FROM saas_subscriptions WHERE plan_code<>'Basic' AND status IN ('trialing','active'))::integer AS paid_tenants,
        (SELECT COALESCE(SUM(CASE WHEN billing_interval='annual' THEN amount_fcfa/12 ELSE amount_fcfa END),0)
          FROM saas_subscriptions WHERE status IN ('trialing','active'))::bigint AS mrr_fcfa,
        (SELECT COALESCE(SUM(amount_fcfa),0) FROM saas_payments WHERE paid_at>=NOW()-INTERVAL '30 days')::bigint AS collected_30d_fcfa,
        (SELECT COALESCE(SUM(amount_due_fcfa-amount_paid_fcfa),0) FROM saas_invoices WHERE status IN ('open','uncollectible'))::bigint AS outstanding_fcfa,
        (SELECT COUNT(*) FROM platform_support_cases WHERE status IN ('open','in_progress'))::integer AS open_support_cases,
        (SELECT COUNT(*) FROM integration_outbox WHERE status='FAILED')::integer AS failed_jobs,
        (SELECT COUNT(*) FROM documents)::integer AS documents,
        (SELECT COUNT(*) FROM ai_queries WHERE timestamp>=date_trunc('month',NOW()))::integer AS ai_requests_this_month`
    const trendRows = await db()`WITH months AS (
          SELECT generate_series(date_trunc('month',NOW())-INTERVAL '5 months',date_trunc('month',NOW()),INTERVAL '1 month') AS month
        ) SELECT to_char(m.month,'Mon') AS month,
          COALESCE((SELECT SUM(p.amount_fcfa) FROM saas_payments p
            WHERE p.paid_at>=m.month AND p.paid_at<m.month+INTERVAL '1 month'),0)::bigint AS collected_fcfa,
          (SELECT COUNT(*) FROM tenants t WHERE t.created_at<m.month+INTERVAL '1 month')::integer AS workspaces
        FROM months m ORDER BY m.month`
    const totals = (totalRows as unknown as Row[])[0] ?? {}
    return {
      totals: {
        tenants: asNumber(totals.tenants), activeTenants: asNumber(totals.active_tenants),
        suspendedTenants: asNumber(totals.suspended_tenants), users: asNumber(totals.users),
        activeUsers30d: asNumber(totals.active_users_30d), paidTenants: asNumber(totals.paid_tenants),
        mrrFcfa: asNumber(totals.mrr_fcfa), collected30dFcfa: asNumber(totals.collected_30d_fcfa),
        outstandingFcfa: asNumber(totals.outstanding_fcfa), openSupportCases: asNumber(totals.open_support_cases),
        failedJobs: asNumber(totals.failed_jobs), documents: asNumber(totals.documents),
        aiRequestsThisMonth: asNumber(totals.ai_requests_this_month),
      },
      tenants: tenantPage.tenants,
      tenantOptions: (tenantOptionRows as unknown as Row[]).map((row) => ({ id: asString(row.id), name: asString(row.name) })),
      tenantTotal: tenantPage.total,
      page: tenantPage.page,
      pageSize: tenantPage.pageSize,
      plans, users, invoices, audit, supportCases,
      trend: (trendRows as unknown as Row[]).map((row) => ({
        month: asString(row.month), collectedFcfa: asNumber(row.collected_fcfa), workspaces: asNumber(row.workspaces),
      })),
      databaseHealthy: true,
      generatedAt: new Date().toISOString(),
    }
  })
}

export async function getPlatformTenantDetails(id: string): Promise<PlatformTenantDetails> {
  return withTransientDatabaseRetry(async () => {
    const tenantRows = await db().query(`${tenantSelect} WHERE t.id=$1 LIMIT 1`, [id]) as unknown as Row[]
    const plans = await listPlans()
    const users = await listUsers(200, id)
    const invoices = await listInvoices(100, id)
    const notes = await db()`SELECT * FROM platform_tenant_notes WHERE tenant_id=${id} ORDER BY created_at DESC LIMIT 100` as unknown as Row[]
    const supportCases = await listSupport(100, id)
    const audit = await listAudit(100, id)
    const businesses = await db()`SELECT id,name,location,created_at FROM businesses WHERE tenant_id=${id} ORDER BY created_at` as unknown as Row[]
    if (!tenantRows[0]) throw new Error("Tenant not found")
    const tenant = mapTenant(tenantRows[0])
    const plan = plans.find((item) => item.code === tenant.plan)
    if (!plan) throw new Error("Tenant plan is unavailable")
    return {
      tenant, plan, users, invoices, notes: notes.map(mapNote), supportCases, audit,
      businesses: businesses.map((row) => ({
        id: asString(row.id), name: asString(row.name), location: asString(row.location), createdAt: asString(row.created_at),
      })),
    }
  })
}

type Actor = Pick<AuthorizedProfile, "uid" | "email">

async function audit(client: PoolClient, actor: Actor, action: string, targetType: string, targetId: string, details: Record<string, unknown>) {
  await client.query(
    "INSERT INTO platform_audit_logs(id,actor_user_id,actor_email,action,target_type,target_id,details) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb)",
    [randomUUID(), actor.uid, actor.email, action, targetType, targetId, JSON.stringify(details)],
  )
}

async function transact<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await pooledDb().connect()
  try {
    await client.query("BEGIN")
    const value = await work(client)
    await client.query("COMMIT")
    return value
  } catch (error) {
    try { await client.query("ROLLBACK") } catch {}
    throw error
  } finally {
    client.release()
  }
}

export async function managePlatformTenant(actor: Actor, input: {
  id: string
  name?: string
  businessSector?: string
  location?: string
  ownerEmail?: string
  plan?: SaaSPlanCode
  status?: "Active" | "Suspended"
  suspensionReason?: string | null
  billingInterval?: "monthly" | "annual"
  cancelAtPeriodEnd?: boolean
  lifecycle?: "archive" | "restore"
}) {
  await transact(async (client) => {
    const current = await client.query(`SELECT t.*,s.billing_interval,s.cancel_at_period_end
      FROM tenants t LEFT JOIN saas_subscriptions s ON s.tenant_id=t.id
      WHERE t.id=$1 FOR UPDATE OF t`, [input.id])
    if (!current.rows[0]) throw new Error("Tenant not found")
    const before = current.rows[0]
    if (input.name || input.businessSector || input.location || input.ownerEmail) {
      await client.query(`UPDATE tenants SET name=COALESCE($2,name),business_sector=COALESCE($3,business_sector),
        location=COALESCE($4,location),owner_email=COALESCE($5,owner_email),updated_at=NOW() WHERE id=$1`,
      [input.id, input.name ?? null, input.businessSector ?? null, input.location ?? null, input.ownerEmail ?? null])
    }
    if (input.lifecycle === "archive") {
      await client.query("UPDATE tenants SET status='Suspended',archived_at=NOW(),suspension_reason=$2,updated_at=NOW() WHERE id=$1", [input.id, input.suspensionReason || "Archived by platform administrator"])
      await client.query("UPDATE saas_subscriptions SET status='paused',updated_at=NOW() WHERE tenant_id=$1 AND status<>'canceled'", [input.id])
      await client.query("UPDATE app_auth_sessions SET revoked_at=NOW() WHERE user_id IN (SELECT id FROM users WHERE tenant_id=$1) AND revoked_at IS NULL", [input.id])
    } else if (input.lifecycle === "restore") {
      await client.query("UPDATE tenants SET status='Active',archived_at=NULL,suspension_reason=NULL,updated_at=NOW() WHERE id=$1", [input.id])
      await client.query("UPDATE saas_subscriptions SET status=CASE WHEN status='paused' THEN 'active' ELSE status END,updated_at=NOW() WHERE tenant_id=$1", [input.id])
    }
    if (input.status) {
      await client.query("UPDATE tenants SET status=$2,suspension_reason=$3,updated_at=NOW() WHERE id=$1", [input.id, input.status, input.status === "Suspended" ? input.suspensionReason || "Suspended by platform administrator" : null])
      if (input.status === "Suspended") {
        await client.query("UPDATE app_auth_sessions SET revoked_at=NOW() WHERE user_id IN (SELECT id FROM users WHERE tenant_id=$1) AND revoked_at IS NULL", [input.id])
      }
    }
    if (input.plan || input.billingInterval || input.cancelAtPeriodEnd != null) {
      const nextPlan = input.plan || before.subscription_tier || "Basic"
      const plan = await client.query("SELECT * FROM saas_plans WHERE code=$1 AND is_active=TRUE", [nextPlan])
      if (!plan.rows[0]) throw new Error("Plan is unavailable")
      const interval = input.billingInterval || before.billing_interval || "monthly"
      const amount = interval === "annual" ? plan.rows[0].annual_price_fcfa : plan.rows[0].monthly_price_fcfa
      await client.query("UPDATE tenants SET subscription_tier=$2,updated_at=NOW() WHERE id=$1", [input.id, nextPlan])
      await client.query(`INSERT INTO saas_subscriptions(tenant_id,plan_code,billing_interval,amount_fcfa,cancel_at_period_end)
        VALUES($1,$2,$3,$4,$5) ON CONFLICT(tenant_id) DO UPDATE SET plan_code=EXCLUDED.plan_code,
        billing_interval=EXCLUDED.billing_interval,amount_fcfa=EXCLUDED.amount_fcfa,
        cancel_at_period_end=EXCLUDED.cancel_at_period_end,updated_at=NOW()`,
      [input.id, nextPlan, interval, amount, input.cancelAtPeriodEnd ?? before.cancel_at_period_end ?? false])
    }
    await audit(client, actor, "tenant.updated", "tenant", input.id, { before: {
      status: before.status, plan: before.subscription_tier, archivedAt: before.archived_at,
    }, requested: input })
  })
  return getPlatformTenantDetails(input.id)
}

export async function createPlatformTenant(actor: Actor, input: {
  name: string
  businessSector: string
  location: string
  ownerEmail: string
  ownerName: string
  plan: SaaSPlanCode
}) {
  const tenantId = randomUUID()
  const businessId = randomUUID()
  const userId = randomUUID()
  const invitationToken = randomBytes(32).toString("base64url")
  const invitationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const normalized = input.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "workspace"
  await transact(async (client) => {
    const duplicate = await client.query(`SELECT 1 FROM users WHERE LOWER(email)=LOWER($1)
      UNION ALL SELECT 1 FROM platform_workspace_invites WHERE LOWER(email)=LOWER($1) AND accepted_at IS NULL AND revoked_at IS NULL LIMIT 1`, [input.ownerEmail])
    if (duplicate.rows[0]) throw new Error("This owner email already has an account or pending invitation")
    const plan = await client.query("SELECT * FROM saas_plans WHERE code=$1 AND is_active=TRUE", [input.plan])
    if (!plan.rows[0]) throw new Error("Plan is unavailable")
    await client.query(`INSERT INTO tenants(id,name,business_sector,location,owner_email,subscription_tier,status)
      VALUES($1,$2,$3,$4,$5,$6,'Active')`, [tenantId, input.name, input.businessSector, input.location, input.ownerEmail, input.plan])
    await client.query(`INSERT INTO businesses(id,tenant_id,name,location,business_type,region,code)
      VALUES($1,$2,$3,$4,$5,$4,$6)`, [businessId, tenantId, input.name, input.location, input.businessSector, `${normalized}_${tenantId.slice(0, 8)}`])
    await client.query(`INSERT INTO business_settings(business_id,tenant_id,currency,timezone,fiscal_year_start,tax_rate,low_stock_threshold)
      VALUES($1,$2,'FCFA','Africa/Douala','01-01',0,10)`, [businessId, tenantId])
    await client.query(`INSERT INTO users(id,tenant_id,business_id,email,role,full_name,account_status)
      VALUES($1,$2,$3,$4,'Business Owner',$5,'Active')`, [userId, tenantId, businessId, input.ownerEmail, input.ownerName])
    await client.query(`INSERT INTO saas_subscriptions(tenant_id,plan_code,amount_fcfa,status)
      VALUES($1,$2,$3,'active')`, [tenantId, input.plan, plan.rows[0].monthly_price_fcfa])
    await client.query(`INSERT INTO platform_user_invites(id,user_id,tenant_id,business_id,email,role,token_hash,invited_by,expires_at)
      VALUES($1,$2,$3,$4,$5,'Business Owner',$6,$7,$8)`, [randomUUID(), userId, tenantId, businessId,
      input.ownerEmail, createHash("sha256").update(invitationToken).digest("hex"), actor.uid, invitationExpiresAt])
    await ensureDefaultAccounts(client, { tenantId, businessId, actorId: userId })
    await audit(client, actor, "tenant.created", "tenant", tenantId, { name: input.name, ownerEmail: input.ownerEmail, plan: input.plan })
  })
  return { tenantId, businessId, ownerEmail: input.ownerEmail, invitationToken, invitationExpiresAt: invitationExpiresAt.toISOString() }
}

export async function createPlatformUserInvite(actor: Actor, input: {
  tenantId: string
  businessId: string
  email: string
  fullName: string
  role: string
  department?: string | null
  phoneNumber?: string | null
}) {
  const userId = randomUUID()
  const invitationToken = randomBytes(32).toString("base64url")
  const invitationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return transact(async (client) => {
    const duplicate = await client.query("SELECT id FROM users WHERE LOWER(email)=LOWER($1) LIMIT 1", [input.email])
    if (duplicate.rows[0]) throw new Error("A platform user with this email already exists")
    if (input.role === "Business Owner") throw new Error("Invite this user with another role, then transfer ownership after registration")
    const workspace = await client.query(`SELECT t.id,t.archived_at,t.status,p.max_users,
        (SELECT COUNT(*) FROM users u WHERE u.tenant_id=t.id)::integer AS user_count
      FROM tenants t LEFT JOIN saas_subscriptions s ON s.tenant_id=t.id
      LEFT JOIN saas_plans p ON p.code=COALESCE(s.plan_code,t.subscription_tier,'Basic')
      WHERE t.id=$1 FOR UPDATE OF t`, [input.tenantId])
    const tenant = workspace.rows[0]
    if (!tenant) throw new Error("Tenant not found")
    if (tenant.archived_at || tenant.status !== "Active") throw new Error("Users cannot be invited to an inactive workspace")
    const business = await client.query("SELECT id FROM businesses WHERE id=$1 AND tenant_id=$2", [input.businessId, input.tenantId])
    if (!business.rows[0]) throw new Error("Business does not belong to the selected workspace")
    if (tenant.max_users != null && Number(tenant.user_count) >= Number(tenant.max_users)) {
      throw new Error("This workspace has reached its plan user limit")
    }
    await client.query(`INSERT INTO users(id,tenant_id,business_id,email,role,full_name,department,phone_number,account_status)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,'Active')`, [userId, input.tenantId, input.businessId, input.email,
      input.role, input.fullName, input.department ?? null, input.phoneNumber ?? null])
    await client.query(`INSERT INTO platform_user_invites(id,user_id,tenant_id,business_id,email,role,token_hash,invited_by,expires_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [randomUUID(), userId, input.tenantId, input.businessId,
      input.email, input.role, createHash("sha256").update(invitationToken).digest("hex"), actor.uid, invitationExpiresAt])
    await audit(client, actor, "user.invited", "user", userId, {
      tenantId: input.tenantId, businessId: input.businessId, email: input.email, role: input.role,
    })
    return { userId, email: input.email, invitationToken, invitationExpiresAt: invitationExpiresAt.toISOString() }
  })
}

export async function renewPlatformUserInvite(actor: Actor, userId: string) {
  const invitationToken = randomBytes(32).toString("base64url")
  const invitationExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  return transact(async (client) => {
    const result = await client.query("SELECT id,tenant_id,business_id,email,role,auth_user_id FROM users WHERE id=$1 FOR UPDATE", [userId])
    const user = result.rows[0]
    if (!user) throw new Error("User not found")
    if (user.auth_user_id) throw new Error("This user has already accepted an invitation")
    await client.query(`INSERT INTO platform_user_invites(id,user_id,tenant_id,business_id,email,role,token_hash,invited_by,expires_at)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT(user_id) DO UPDATE SET email=EXCLUDED.email,role=EXCLUDED.role,token_hash=EXCLUDED.token_hash,
        invited_by=EXCLUDED.invited_by,created_at=NOW(),expires_at=EXCLUDED.expires_at,accepted_at=NULL,revoked_at=NULL`,
    [randomUUID(), user.id, user.tenant_id, user.business_id, user.email, user.role,
      createHash("sha256").update(invitationToken).digest("hex"), actor.uid, invitationExpiresAt])
    await client.query("UPDATE users SET account_status='Active' WHERE id=$1", [userId])
    await audit(client, actor, "user.invitation_renewed", "user", userId, { email: user.email })
    return { userId, email: user.email, invitationToken, invitationExpiresAt: invitationExpiresAt.toISOString() }
  })
}

export async function revokePlatformUserInvite(actor: Actor, userId: string) {
  return transact(async (client) => {
    const user = await client.query("SELECT role FROM users WHERE id=$1 FOR UPDATE", [userId])
    if (!user.rows[0]) throw new Error("User not found")
    if (user.rows[0].role === "Business Owner") throw new Error("A workspace owner's invitation cannot be revoked; archive the workspace instead")
    const result = await client.query(`UPDATE platform_user_invites SET revoked_at=NOW()
      WHERE user_id=$1 AND accepted_at IS NULL AND revoked_at IS NULL RETURNING id,email`, [userId])
    if (!result.rows[0]) throw new Error("No active invitation was found")
    await client.query("UPDATE users SET account_status='Suspended' WHERE id=$1 AND auth_user_id IS NULL", [userId])
    await audit(client, actor, "user.invitation_revoked", "user", userId, { email: result.rows[0].email })
    return { userId }
  })
}

export async function managePlatformUser(actor: Actor, input: {
  id: string
  email?: string
  fullName?: string
  department?: string | null
  phoneNumber?: string | null
  businessId?: string
  role?: string
  status?: "Active" | "Suspended"
}) {
  if (actor.uid === input.id && input.status === "Suspended") throw new Error("You cannot suspend your own account")
  return transact(async (client) => {
    const result = await client.query("SELECT id,email,role,account_status,tenant_id,business_id,full_name,department,phone_number,auth_user_id FROM users WHERE id=$1 FOR UPDATE", [input.id])
    const user = result.rows[0]
    if (!user) throw new Error("User not found")
    const nextRole = input.role ?? user.role
    const nextStatus = input.status ?? user.account_status
    const removesSuperAdmin = user.auth_user_id && user.role === "Platform Super Admin"
      && (input.role && input.role !== "Platform Super Admin" || input.status === "Suspended")
    if (removesSuperAdmin) {
      const admins = await client.query("SELECT COUNT(*)::integer AS count FROM users WHERE role='Platform Super Admin' AND account_status='Active' AND auth_user_id IS NOT NULL")
      if (Number(admins.rows[0].count) <= 1) throw new Error("At least one active Platform Super Admin is required")
    }
    if (input.email && input.email.toLowerCase() !== String(user.email).toLowerCase()) {
      if (user.auth_user_id) throw new Error("The email of a registered authentication account cannot be changed here")
      const duplicate = await client.query("SELECT id FROM users WHERE LOWER(email)=LOWER($1) AND id<>$2 LIMIT 1", [input.email, input.id])
      if (duplicate.rows[0]) throw new Error("A platform user with this email already exists")
    }
    if (input.businessId) {
      const business = await client.query("SELECT id FROM businesses WHERE id=$1 AND tenant_id=$2", [input.businessId, user.tenant_id])
      if (!business.rows[0]) throw new Error("Business does not belong to the user's workspace")
    }
    if (user.role === "Business Owner" && input.role && input.role !== "Business Owner") {
      const owners = await client.query("SELECT COUNT(*)::integer AS count FROM users WHERE tenant_id=$1 AND role='Business Owner' AND account_status='Active' AND auth_user_id IS NOT NULL AND id<>$2", [user.tenant_id, input.id])
      if (Number(owners.rows[0].count) === 0) throw new Error("Transfer workspace ownership before changing this owner's role")
    }
    if (user.role === "Business Owner" && input.status === "Suspended") {
      const owners = await client.query("SELECT COUNT(*)::integer AS count FROM users WHERE tenant_id=$1 AND role='Business Owner' AND account_status='Active' AND id<>$2", [user.tenant_id, input.id])
      if (Number(owners.rows[0].count) === 0) throw new Error("Transfer ownership or suspend the entire workspace instead")
    }
    if (input.role === "Business Owner" && !user.auth_user_id) throw new Error("The user must accept their invitation before ownership can be transferred")
    if (nextRole === "Business Owner" && nextStatus === "Suspended") throw new Error("A workspace owner must have active account access")
    if (input.role === "Business Owner") {
      await client.query("UPDATE users SET role='Manager' WHERE tenant_id=$1 AND role='Business Owner' AND id<>$2", [user.tenant_id, input.id])
    }
    const updated = await client.query(`UPDATE users SET
        email=CASE WHEN $2 THEN $3 ELSE email END,
        full_name=CASE WHEN $4 THEN $5 ELSE full_name END,
        department=CASE WHEN $6 THEN $7 ELSE department END,
        phone_number=CASE WHEN $8 THEN $9 ELSE phone_number END,
        business_id=CASE WHEN $10 THEN $11 ELSE business_id END,
        role=COALESCE($12,role),account_status=COALESCE($13,account_status)
      WHERE id=$1 RETURNING id,email,role,account_status`, [input.id,
      input.email !== undefined, input.email ?? null, input.fullName !== undefined, input.fullName ?? null,
      input.department !== undefined, input.department ?? null, input.phoneNumber !== undefined, input.phoneNumber ?? null,
      input.businessId !== undefined, input.businessId ?? null, input.role ?? null, input.status ?? null])
    const nextEmail = input.email ?? user.email
    if (nextRole === "Business Owner") {
      await client.query("UPDATE tenants SET owner_email=$2,updated_at=NOW() WHERE id=$1", [user.tenant_id, nextEmail])
    }
    await client.query(`UPDATE platform_user_invites SET
        email=CASE WHEN $2 THEN $3 ELSE email END,
        role=COALESCE($4,role),business_id=CASE WHEN $5 THEN $6 ELSE business_id END
      WHERE user_id=$1 AND accepted_at IS NULL`, [input.id, input.email !== undefined, input.email ?? null,
      input.role ?? null, input.businessId !== undefined, input.businessId ?? null])
    if (input.status === "Suspended") {
      await client.query("UPDATE app_auth_sessions SET revoked_at=NOW() WHERE user_id=$1 AND revoked_at IS NULL", [input.id])
    }
    await audit(client, actor, "user.updated", "user", input.id, {
      before: { email: user.email, fullName: user.full_name, department: user.department, phoneNumber: user.phone_number,
        businessId: user.business_id, role: user.role, status: user.account_status }, requested: input,
    })
    return updated.rows[0]
  })
}

export async function updatePlatformPlan(actor: Actor, input: {
  code: SaaSPlanCode
  monthlyPriceFcfa: number
  annualPriceFcfa: number
  maxUsers: number | null
  maxBusinesses: number | null
  maxDocuments: number | null
  monthlyAiRequests: number | null
}) {
  return transact(async (client) => {
    const before = await client.query("SELECT * FROM saas_plans WHERE code=$1 FOR UPDATE", [input.code])
    if (!before.rows[0]) throw new Error("Plan not found")
    await client.query(`UPDATE saas_plans SET monthly_price_fcfa=$2,annual_price_fcfa=$3,max_users=$4,
      max_businesses=$5,max_documents=$6,monthly_ai_requests=$7,updated_at=NOW() WHERE code=$1`,
    [input.code, input.monthlyPriceFcfa, input.annualPriceFcfa, input.maxUsers, input.maxBusinesses, input.maxDocuments, input.monthlyAiRequests])
    await client.query(`UPDATE saas_subscriptions SET amount_fcfa=CASE WHEN billing_interval='annual' THEN $3 ELSE $2 END,
      updated_at=NOW() WHERE plan_code=$1 AND provider='manual'`, [input.code, input.monthlyPriceFcfa, input.annualPriceFcfa])
    await audit(client, actor, "plan.updated", "plan", input.code, { before: before.rows[0], after: input })
    return { code: input.code }
  })
}

export async function publishPlatformAnnouncement(actor: Actor, input: {
  tenantId?: string | null
  title: string
  message: string
  priority: "NORMAL" | "IMPORTANT" | "URGENT"
  expiresAt?: string | null
}) {
  return transact(async (client) => {
    const businesses = input.tenantId
      ? await client.query("SELECT id,tenant_id FROM businesses WHERE tenant_id=$1", [input.tenantId])
      : await client.query("SELECT businesses.id,businesses.tenant_id FROM businesses JOIN tenants t ON t.id=businesses.tenant_id WHERE t.archived_at IS NULL")
    for (const business of businesses.rows) {
      await client.query(`INSERT INTO announcements(id,tenant_id,business_id,title,message,priority,created_by_uid,created_by_name,expires_at)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [randomUUID(), business.tenant_id, business.id, input.title, input.message, input.priority, actor.uid, actor.email, input.expiresAt ?? null])
    }
    const targetId = input.tenantId || "all-active-tenants"
    await audit(client, actor, "announcement.published", input.tenantId ? "tenant" : "platform", targetId, { title: input.title, priority: input.priority, businesses: businesses.rowCount ?? 0 })
    return { published: businesses.rowCount ?? 0 }
  })
}

export async function revokePlatformUserSessions(actor: Actor, userId: string) {
  return transact(async (client) => {
    const user = await client.query("SELECT email FROM users WHERE id=$1", [userId])
    if (!user.rows[0]) throw new Error("User not found")
    const revoked = await client.query("UPDATE app_auth_sessions SET revoked_at=NOW() WHERE user_id=$1 AND revoked_at IS NULL RETURNING id", [userId])
    await audit(client, actor, "user.sessions_revoked", "user", userId, { count: revoked.rowCount ?? 0 })
    return { revoked: revoked.rowCount ?? 0 }
  })
}

export async function createPlatformInvoice(actor: Actor, input: { tenantId: string; amountFcfa: number; dueAt?: string | null; description?: string | null }) {
  const id = randomUUID()
  const invoiceNumber = `SaaS-${new Date().toISOString().slice(0, 7).replace("-", "")}-${id.slice(0, 8).toUpperCase()}`
  return transact(async (client) => {
    const tenant = await client.query("SELECT id FROM tenants WHERE id=$1", [input.tenantId])
    if (!tenant.rows[0]) throw new Error("Tenant not found")
    await client.query(`INSERT INTO saas_invoices(id,tenant_id,invoice_number,status,amount_due_fcfa,description,due_at)
      VALUES($1,$2,$3,'open',$4,$5,$6)`, [id, input.tenantId, invoiceNumber, input.amountFcfa, input.description ?? null, input.dueAt ?? null])
    await audit(client, actor, "invoice.created", "invoice", id, { tenantId: input.tenantId, amountFcfa: input.amountFcfa, invoiceNumber })
    return { id, invoiceNumber }
  })
}

export async function recordPlatformPayment(actor: Actor, input: { invoiceId: string; amountFcfa?: number; method?: string }) {
  return transact(async (client) => {
    const result = await client.query("SELECT * FROM saas_invoices WHERE id=$1 FOR UPDATE", [input.invoiceId])
    const invoice = result.rows[0]
    if (!invoice) throw new Error("Invoice not found")
    if (["paid", "void"].includes(invoice.status)) throw new Error("Invoice cannot accept a payment")
    const remaining = Number(invoice.amount_due_fcfa) - Number(invoice.amount_paid_fcfa)
    const amount = input.amountFcfa ?? remaining
    if (!Number.isFinite(amount) || amount <= 0 || amount > remaining) throw new Error("Payment must be within the outstanding balance")
    const paymentId = randomUUID()
    await client.query(`INSERT INTO saas_payments(id,tenant_id,invoice_id,amount_fcfa,method,recorded_by)
      VALUES($1,$2,$3,$4,$5,$6)`, [paymentId, invoice.tenant_id, input.invoiceId, amount, input.method || "manual", actor.uid])
    const nextPaid = Number(invoice.amount_paid_fcfa) + amount
    await client.query(`UPDATE saas_invoices SET amount_paid_fcfa=$2,status=CASE WHEN $2>=amount_due_fcfa THEN 'paid' ELSE 'open' END,
      paid_at=CASE WHEN $2>=amount_due_fcfa THEN NOW() ELSE paid_at END,updated_at=NOW() WHERE id=$1`, [input.invoiceId, nextPaid])
    await client.query("UPDATE saas_subscriptions SET status=CASE WHEN status='past_due' THEN 'active' ELSE status END,updated_at=NOW() WHERE tenant_id=$1", [invoice.tenant_id])
    await audit(client, actor, "payment.recorded", "invoice", input.invoiceId, { paymentId, amountFcfa: amount, method: input.method || "manual" })
    return { paymentId, amountFcfa: amount }
  })
}

export async function voidPlatformInvoice(actor: Actor, invoiceId: string) {
  return transact(async (client) => {
    const result = await client.query("UPDATE saas_invoices SET status='void',updated_at=NOW() WHERE id=$1 AND status IN ('draft','open','uncollectible') RETURNING id", [invoiceId])
    if (!result.rows[0]) throw new Error("Invoice cannot be voided")
    await audit(client, actor, "invoice.voided", "invoice", invoiceId, {})
    return { id: invoiceId }
  })
}

export async function addPlatformTenantNote(actor: Actor, tenantId: string, body: string) {
  const id = randomUUID()
  return transact(async (client) => {
    const result = await client.query(`INSERT INTO platform_tenant_notes(id,tenant_id,body,created_by,created_by_email)
      VALUES($1,$2,$3,$4,$5) RETURNING *`, [id, tenantId, body, actor.uid, actor.email])
    await audit(client, actor, "tenant.note_added", "tenant", tenantId, { noteId: id })
    return mapNote(result.rows[0] as Row)
  })
}

export async function createPlatformSupportCase(actor: Actor, input: { tenantId: string; subject: string; description?: string | null; priority: PlatformSupportCase["priority"] }) {
  const id = randomUUID()
  return transact(async (client) => {
    const result = await client.query(`INSERT INTO platform_support_cases(id,tenant_id,subject,description,priority,created_by)
      VALUES($1,$2,$3,$4,$5,$6) RETURNING *`, [id, input.tenantId, input.subject, input.description ?? null, input.priority, actor.uid])
    await audit(client, actor, "support.created", "support_case", id, { tenantId: input.tenantId, subject: input.subject, priority: input.priority })
    return { id: result.rows[0].id }
  })
}

export async function updatePlatformSupportCase(actor: Actor, input: { id: string; status: PlatformSupportCase["status"]; assignedTo?: string | null }) {
  return transact(async (client) => {
    const result = await client.query(`UPDATE platform_support_cases SET status=$2,assigned_to=COALESCE($3,assigned_to),updated_at=NOW()
      WHERE id=$1 RETURNING id,tenant_id`, [input.id, input.status, input.assignedTo ?? null])
    if (!result.rows[0]) throw new Error("Support case not found")
    await audit(client, actor, "support.updated", "support_case", input.id, { status: input.status, assignedTo: input.assignedTo })
    return { id: input.id }
  })
}
