import type { AuthorizedProfile } from "./auth"
import { db } from "./neon"

type Limits = {
  plan: string
  maxUsers: number | null
  maxBusinesses: number | null
  maxDocuments: number | null
  monthlyAiRequests: number | null
  users: number
  businesses: number
  documents: number
  aiRequests: number
}

async function loadLimits(profile: AuthorizedProfile): Promise<Limits> {
  const rows = await db()`SELECT COALESCE(s.plan_code,t.subscription_tier,'Basic') AS plan,
      p.max_users,p.max_businesses,p.max_documents,p.monthly_ai_requests,
      (SELECT COUNT(*) FROM users WHERE tenant_id=t.id)::integer AS users,
      (SELECT COUNT(*) FROM businesses WHERE tenant_id=t.id)::integer AS businesses,
      (SELECT COUNT(*) FROM documents WHERE tenant_id=t.id)::integer AS documents,
      (SELECT COUNT(*) FROM ai_queries WHERE tenant_id=t.id AND timestamp>=date_trunc('month',NOW()))::integer AS ai_requests
    FROM tenants t
    LEFT JOIN saas_subscriptions s ON s.tenant_id=t.id
    JOIN saas_plans p ON p.code=COALESCE(s.plan_code,t.subscription_tier,'Basic')
    WHERE t.id=${profile.tenantId} LIMIT 1`
  const row = rows[0]
  if (!row) throw new Error("Forbidden: Subscription plan is unavailable")
  return {
    plan: String(row.plan),
    maxUsers: row.max_users == null ? null : Number(row.max_users),
    maxBusinesses: row.max_businesses == null ? null : Number(row.max_businesses),
    maxDocuments: row.max_documents == null ? null : Number(row.max_documents),
    monthlyAiRequests: row.monthly_ai_requests == null ? null : Number(row.monthly_ai_requests),
    users: Number(row.users), businesses: Number(row.businesses), documents: Number(row.documents),
    aiRequests: Number(row.ai_requests),
  }
}

function requireCapacity(plan: string, resource: string, current: number, maximum: number | null) {
  if (maximum != null && current >= maximum) {
    throw new Error(`Forbidden: ${plan} plan ${resource} limit reached (${maximum}). Upgrade the workspace plan to continue.`)
  }
}

export async function requireOperationEntitlement(profile: AuthorizedProfile, operation: string) {
  if (profile.role === "Platform Super Admin") return
  const resource = {
    CreateBusiness: "businesses",
    ProvisionEmployeeUser: "users",
    CreateEmployeeWithAccess: "users",
    CreateDocument: "documents",
  }[operation]
  if (!resource) return
  const limits = await loadLimits(profile)
  if (resource === "businesses") requireCapacity(limits.plan, resource, limits.businesses, limits.maxBusinesses)
  if (resource === "users") requireCapacity(limits.plan, resource, limits.users, limits.maxUsers)
  if (resource === "documents") requireCapacity(limits.plan, resource, limits.documents, limits.maxDocuments)
}

export async function requireFeatureEntitlement(profile: AuthorizedProfile, feature: "ai" | "documents") {
  if (profile.role === "Platform Super Admin") return
  const limits = await loadLimits(profile)
  if (feature === "ai") requireCapacity(limits.plan, "monthly AI request", limits.aiRequests, limits.monthlyAiRequests)
  if (feature === "documents") requireCapacity(limits.plan, "document", limits.documents, limits.maxDocuments)
}
