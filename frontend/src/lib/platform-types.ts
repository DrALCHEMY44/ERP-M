export type SaaSPlanCode = "Basic" | "Premium" | "Enterprise"
export type TenantAccessStatus = "Active" | "Suspended" | "Archived"
export type PlatformUserStatus = "Active" | "Suspended"

export type SaaSPlan = {
  code: SaaSPlanCode
  displayName: string
  monthlyPriceFcfa: number
  annualPriceFcfa: number
  maxUsers: number | null
  maxBusinesses: number | null
  maxDocuments: number | null
  monthlyAiRequests: number | null
  features: Record<string, boolean>
}

export type PlatformTenant = {
  id: string
  name: string
  businessSector: string
  location: string
  ownerEmail: string
  plan: SaaSPlanCode
  status: TenantAccessStatus
  subscriptionStatus: "trialing" | "active" | "past_due" | "paused" | "canceled"
  billingInterval: "monthly" | "annual"
  amountFcfa: number
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  suspensionReason: string | null
  createdAt: string
  updatedAt: string
  userCount: number
  businessCount: number
  documentCount: number
  aiRequestsThisMonth: number
  lastActivityAt: string | null
}

export type PlatformUser = {
  id: string
  tenantId: string
  tenantName: string
  businessId: string
  businessName: string
  email: string
  fullName: string
  department: string | null
  phoneNumber: string | null
  role: string
  status: PlatformUserStatus
  authLinked: boolean
  activeSessions: number
  lastLoginAt: string | null
  createdAt: string
  invitationStatus: "pending" | "accepted" | "expired" | "revoked" | null
  invitationExpiresAt: string | null
}

export type PlatformUserDirectory = {
  totals: {
    users: number
    active: number
    suspended: number
    authLinked: number
    pendingInvitations: number
    active30d: number
    superAdmins: number
  }
  users: PlatformUser[]
  total: number
  page: number
  pageSize: number
  tenantOptions: Array<{ id: string; name: string }>
  businessOptions: Array<{ id: string; tenantId: string; name: string }>
  generatedAt: string
}

export type PlatformUserDetails = {
  user: PlatformUser
  sessions: Array<{
    id: string
    createdAt: string
    lastUsedAt: string
    expiresAt: string
    revokedAt: string | null
    userAgent: string | null
  }>
  activity: Array<{
    id: string
    actionType: string
    module: string
    description: string | null
    timestamp: string
  }>
  audit: PlatformAuditEntry[]
}

export type SaaSInvoice = {
  id: string
  tenantId: string
  tenantName: string
  invoiceNumber: string
  status: "draft" | "open" | "paid" | "void" | "uncollectible"
  currency: string
  amountDueFcfa: number
  amountPaidFcfa: number
  description: string | null
  dueAt: string | null
  paidAt: string | null
  createdAt: string
}

export type PlatformAuditEntry = {
  id: string
  actorEmail: string
  action: string
  targetType: string
  targetId: string
  details: Record<string, unknown>
  createdAt: string
}

export type PlatformSupportCase = {
  id: string
  tenantId: string
  tenantName: string
  subject: string
  description: string | null
  priority: "low" | "normal" | "high" | "urgent"
  status: "open" | "in_progress" | "resolved" | "closed"
  assignedTo: string | null
  createdAt: string
  updatedAt: string
}

export type PlatformTenantNote = {
  id: string
  tenantId: string
  body: string
  createdByEmail: string
  createdAt: string
}

export type PlatformOverview = {
  totals: {
    tenants: number
    activeTenants: number
    suspendedTenants: number
    users: number
    activeUsers30d: number
    paidTenants: number
    mrrFcfa: number
    collected30dFcfa: number
    outstandingFcfa: number
    openSupportCases: number
    failedJobs: number
    documents: number
    aiRequestsThisMonth: number
  }
  tenants: PlatformTenant[]
  tenantOptions: Array<{ id: string; name: string }>
  tenantTotal: number
  page: number
  pageSize: number
  plans: SaaSPlan[]
  users: PlatformUser[]
  invoices: SaaSInvoice[]
  audit: PlatformAuditEntry[]
  supportCases: PlatformSupportCase[]
  trend: Array<{ month: string; collectedFcfa: number; workspaces: number }>
  databaseHealthy: boolean
  generatedAt: string
}

export type PlatformTenantDetails = {
  tenant: PlatformTenant
  plan: SaaSPlan
  users: PlatformUser[]
  invoices: SaaSInvoice[]
  notes: PlatformTenantNote[]
  supportCases: PlatformSupportCase[]
  audit: PlatformAuditEntry[]
  businesses: Array<{ id: string; name: string; location: string; createdAt: string }>
}
