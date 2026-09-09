import { NextResponse } from "next/server"
import { z } from "zod"

import { companyVariables, requirePermission, trustedActorVariables } from "@/lib/server/authorization"
import { adminDatabase, authorizeRequest } from "@/lib/server/auth"
import { DATA_POLICIES } from "@/lib/server/data-policies"
import { hashSecret } from "@/lib/server/secret-hash"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"
import { isTransientDatabaseError } from "@/lib/server/neon"
import { randomUUID } from "crypto"
import {
  customerHasRecordedSales,
  executeOperationalOperation,
  listCustomerSalesStats,
  mergeCustomerSalesStats,
} from "@/lib/server/operational-data"
import { requireOperationEntitlement } from "@/lib/server/saas-entitlements"

export const runtime = "nodejs"

const requestSchema = z.object({
  operation: z.string().min(1).max(80),
  variables: z.record(z.unknown()).default({}),
})

function isAllowedDocumentUrl(value: unknown) {
  if (typeof value !== "string" || !value || value.length > 2048) return false
  if (value.startsWith("/api/files?")) {
    const key = new URL(value, "https://local.invalid").searchParams.get("key")
    return Boolean(key)
  }
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

async function targetBelongsToCompany(
  operation: string,
  field: string,
  id: unknown,
  variables: Record<string, unknown>,
) {
  if (typeof id !== "string" || !id) return false
  const result = await adminDatabase().executeQuery<Record<string, Array<{ id: string }>>, Record<string, unknown>>(operation, variables)
  return result.data[field]?.some((row) => row.id === id) ?? false
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requireTrustedMutationOrigin(request)
    const input = requestSchema.parse(await request.json())
    const policy = DATA_POLICIES[input.operation]
    if (!policy) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    requirePermission(profile, policy.permission)
    if (policy.kind === "mutation") await requireOperationEntitlement(profile, input.operation)

    let variables: Record<string, unknown> = policy.actor
      ? trustedActorVariables(profile, input.variables)
      : policy.scoped
        ? companyVariables(profile, input.variables)
        : { ...input.variables }

    if (input.operation === "CreateProduct" || input.operation === "CreateTask") variables.createdBy = profile.uid
    if (["CreateTransaction", "DeleteTransaction"].includes(input.operation)) variables.recordedBy = profile.uid
    if (input.operation === "CreateDocument") {
      if (!isAllowedDocumentUrl(variables.fileUrl)) {
        return NextResponse.json({ error: "Document URL must use managed storage or HTTPS" }, { status: 400 })
      }
      variables.uploadedBy = profile.uid
    }
    if (input.operation === "listTasksAssignedToUser" || input.operation === "listActivityLogsByUser") variables.userId = profile.uid
    if (input.operation === "getBusinessById" || input.operation === "UpdateBusiness") variables.id = profile.businessId
    if (input.operation === "UpdateTenant") {
      if (variables.status && !["Active", "Suspended"].includes(String(variables.status))) {
        return NextResponse.json({ error: "Invalid tenant status" }, { status: 400 })
      }
      if (variables.subscriptionTier && !["Basic", "Premium", "Enterprise"].includes(String(variables.subscriptionTier))) {
        return NextResponse.json({ error: "Invalid subscription tier" }, { status: 400 })
      }
    }

    const operational = await executeOperationalOperation(input.operation, variables)
    if (operational) {
      if (policy.kind === "mutation") {
        const value = Object.values(operational)[0] as { id?: string } | undefined
        await adminDatabase().executeMutation("CreateActivityLog", {
          tenantId: profile.tenantId, businessId: profile.businessId, userId: profile.uid,
          userName: profile.fullName || profile.email, actionType: input.operation,
          module: input.operation.includes("Product") ? "Inventory" : "Finance",
          description: `Authenticated ${input.operation} operation in the authoritative Neon store`,
          recordId: value?.id ?? String(variables.id ?? ""),
        })
      }
      return NextResponse.json({ data: operational })
    }

    if (policy.targetList && policy.targetField) {
      const scope = companyVariables(profile)
      if (!await targetBelongsToCompany(policy.targetList, policy.targetField, variables.id, scope)) {
        return NextResponse.json({ error: "Record is outside the authenticated company" }, { status: 403 })
      }
    }

    if (input.operation === "UpdateUser" || input.operation === "ProvisionEmployeeUser") {
      variables = companyVariables(profile, variables)
      const accessCode = typeof variables.accessCode === "string" ? variables.accessCode : ""
      delete variables.accessCode
      if (input.operation === "ProvisionEmployeeUser") {
        if (accessCode.length < 8) return NextResponse.json({ error: "Employee code must contain at least 8 characters" }, { status: 400 })
        variables.accessCodeHash = await hashSecret(accessCode.toUpperCase())
      }
      if (variables.role && !["Manager", "Accountant", "HR Officer", "Staff", "Viewer"].includes(String(variables.role))) {
        return NextResponse.json({ error: "Invalid assignable role" }, { status: 400 })
      }
    }
    if (["CreateEmployeeWithAccess", "UpdateEmployeeWithAccess"].includes(input.operation)) {
      const email = z.string().email().max(254).parse(variables.email).trim().toLowerCase()
      variables.email = email
      const userRole = String(variables.userRole || "")
      const allowedRoles = profile.role === "Business Owner" ? ["Manager", "Staff"] : ["Staff"]
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.json({ error: "This role cannot assign the requested employee access" }, { status: 403 })
      }
      if (input.operation === "CreateEmployeeWithAccess" || typeof variables.accessCode === "string") {
        const accessCode = typeof variables.accessCode === "string" ? variables.accessCode : ""
        delete variables.accessCode
        if (accessCode.length < 16) {
          return NextResponse.json({ error: "Employee code must contain at least 16 characters" }, { status: 400 })
        }
        variables.accessCodeHash = await hashSecret(accessCode.toUpperCase())
      }
    }
    if (["UpdateEmployeeWithAccess", "DeleteEmployeeWithAccess"].includes(input.operation)) {
      const directory = await adminDatabase().executeQuery<
        { employees: Array<{ id: string; email?: string | null; role?: string | null }> },
        { tenantId: string; businessId: string }
      >("listEmployeesByBusiness", companyVariables(profile) as { tenantId: string; businessId: string })
      const employee = directory.data.employees.find((item) => item.id === variables.id)
      if (!employee?.email) return NextResponse.json({ error: "Employee login binding is missing" }, { status: 409 })
      if (profile.role === "HR Officer" && employee.role === "Manager") {
        return NextResponse.json({ error: "HR officers cannot change manager access" }, { status: 403 })
      }
      variables.currentEmail = employee.email.trim().toLowerCase()
    }
    if (input.operation === "DeleteEmployee") {
      const directory = await adminDatabase().executeQuery<
        { employees: Array<{ id: string; email?: string | null }> },
        { tenantId: string; businessId: string }
      >("listEmployeesByBusiness", companyVariables(profile) as { tenantId: string; businessId: string })
      const employee = directory.data.employees.find((item) => item.id === variables.id)
      if (employee?.email) {
        return NextResponse.json({ error: "Linked employee access must be revoked with the employee record" }, { status: 409 })
      }
    }
    if (["CreateEmployeeWithAccess", "UpdateEmployeeWithAccess"].includes(input.operation)) {
      const users = await adminDatabase().executeQuery<
        { users: Array<{ id: string; email: string }> },
        { tenantId: string; businessId: string }
      >("listTaskAssigneesByBusiness", companyVariables(profile) as { tenantId: string; businessId: string })
      const newEmail = String(variables.email)
      const currentEmail = String(variables.currentEmail || "")
      if (newEmail !== currentEmail && users.data.users.some((user) => user.email.trim().toLowerCase() === newEmail)) {
        return NextResponse.json({ error: "An employee login already uses this email" }, { status: 409 })
      }
    }
    if (input.operation === "CompleteAssignedTask") {
      variables = companyVariables(profile, { taskId: input.variables.taskId, userId: profile.uid })
    }
    if (["CreateTask", "UpdateTask"].includes(input.operation) && typeof variables.assignedToId === "string" && variables.assignedToId) {
      const assigneeExists = await targetBelongsToCompany(
        "listTaskAssigneesByBusiness",
        "users",
        variables.assignedToId,
        companyVariables(profile),
      )
      if (!assigneeExists) return NextResponse.json({ error: "Assignee is outside the authenticated company" }, { status: 400 })
    }
    if (input.operation === "DeleteCustomer" && await customerHasRecordedSales(
      profile.tenantId,
      profile.businessId,
      String(variables.id),
    )) {
      return NextResponse.json({ error: "Customers with recorded sales cannot be deleted" }, { status: 409 })
    }

    const database = adminDatabase()
    const result = policy.kind === "query"
      ? await database.executeQuery(input.operation, variables)
      : await database.executeMutation(input.operation, variables)
    if (input.operation === "listCustomersByBusiness") {
      const data = result.data as { customers?: Array<Record<string, unknown>> }
      const salesStats = await listCustomerSalesStats(profile.tenantId, profile.businessId)
      data.customers = mergeCustomerSalesStats(data.customers ?? [], salesStats)
    }
    if (policy.kind === "mutation") {
      const firstValue = Object.values(result.data as Record<string, any>)[0]
      const recordId = String(firstValue?.id ?? variables.id ?? randomUUID())
      await database.executeMutation("CreateActivityLog", {
        tenantId: profile.tenantId,
        businessId: profile.businessId,
        userId: profile.uid,
        userName: profile.fullName || profile.email,
        actionType: input.operation,
        module: input.operation.replace(/^(Create|Update|Delete|Complete|Provision)/, "") || "System",
        description: `Authenticated ${input.operation} operation`,
        recordId,
      })
    }
    return NextResponse.json({ data: result.data })
  } catch (error) {
    if (isTransientDatabaseError(error)) {
      console.warn("Neon database is temporarily unavailable", error)
      return NextResponse.json(
        { error: "Database is temporarily unavailable. Please retry." },
        { status: 503, headers: { "Retry-After": "1" } },
      )
    }
    const message = error instanceof Error ? error.message : "Request failed"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
