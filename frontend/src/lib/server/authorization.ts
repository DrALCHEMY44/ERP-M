import type { AuthorizedProfile } from "./firebase-token"

export const ROLES = [
  "Platform Super Admin", "Business Owner", "Manager", "Accountant",
  "HR Officer", "Staff", "Viewer",
] as const
export type Role = (typeof ROLES)[number]

export type Permission =
  | "platform:manage" | "company:manage" | "users:manage"
  | "inventory:read" | "inventory:write" | "sales:read" | "sales:write"
  | "expenses:read" | "expenses:write" | "tasks:read" | "tasks:write"
  | "employees:read" | "employees:write" | "customers:read" | "customers:write"
  | "suppliers:read" | "suppliers:write" | "documents:read" | "documents:write"
  | "reports:read" | "audit:read" | "ai:use"

const ALL_COMPANY: Permission[] = [
  "company:manage", "users:manage", "inventory:read", "inventory:write",
  "sales:read", "sales:write", "expenses:read", "expenses:write",
  "tasks:read", "tasks:write", "employees:read", "employees:write",
  "customers:read", "customers:write", "suppliers:read", "suppliers:write",
  "documents:read", "documents:write", "reports:read", "audit:read", "ai:use",
]

export const ROLE_PERMISSIONS: Record<Role, ReadonlySet<Permission>> = {
  "Platform Super Admin": new Set(["platform:manage"]),
  "Business Owner": new Set(ALL_COMPANY),
  Manager: new Set(ALL_COMPANY.filter((p) => !["company:manage", "users:manage", "employees:write"].includes(p))),
  Accountant: new Set(["sales:read", "sales:write", "expenses:read", "expenses:write", "documents:read", "reports:read", "ai:use"]),
  "HR Officer": new Set(["employees:read", "employees:write", "tasks:read", "tasks:write", "documents:read", "documents:write", "reports:read", "ai:use"]),
  Staff: new Set(["inventory:read", "sales:read", "tasks:read", "documents:read", "ai:use"]),
  Viewer: new Set(["inventory:read", "sales:read", "tasks:read", "documents:read", "reports:read", "ai:use"]),
}

export function hasPermission(profile: Pick<AuthorizedProfile, "role">, permission: Permission) {
  return ROLE_PERMISSIONS[profile.role as Role]?.has(permission) ?? false
}

export function requirePermission(profile: Pick<AuthorizedProfile, "role">, permission: Permission) {
  if (!hasPermission(profile, permission)) throw new Error(`Forbidden: ${permission}`)
}

export function companyVariables(profile: AuthorizedProfile, input: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    ...input,
    tenantId: profile.tenantId,
    businessId: profile.businessId,
  }
}

export function trustedActorVariables(profile: AuthorizedProfile, input: Record<string, unknown> = {}): Record<string, unknown> {
  const variables = companyVariables(profile, input)
  for (const key of ["createdBy", "recordedBy", "uploadedBy", "userId", "userName"] as const) {
    if (key in variables) delete (variables as Record<string, unknown>)[key]
  }
  return variables
}
