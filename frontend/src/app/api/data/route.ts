import { NextResponse } from "next/server"
import { z } from "zod"

import { companyVariables, requirePermission, trustedActorVariables, type Permission } from "@/lib/server/authorization"
import { adminDataConnect, profileForIdentity, verifyRequestIdentity } from "@/lib/server/firebase-token"
import { hashSecret } from "@/lib/server/secret-hash"
import { randomUUID } from "crypto"
import { executeOperationalOperation } from "@/lib/server/operational-data"

export const runtime = "nodejs"

const requestSchema = z.object({
  operation: z.string().min(1).max(80),
  variables: z.record(z.unknown()).default({}),
})

type OperationPolicy = {
  kind: "query" | "mutation"
  permission: Permission
  scoped?: boolean
  actor?: boolean
  targetList?: string
  targetField?: string
}

const POLICIES: Record<string, OperationPolicy> = {
  listProductsByBusiness: { kind: "query", permission: "inventory:read", scoped: true },
  listTransactionsByBusiness: { kind: "query", permission: "sales:read", scoped: true },
  listTransactionsByType: { kind: "query", permission: "expenses:read", scoped: true },
  listCustomersByBusiness: { kind: "query", permission: "customers:read", scoped: true },
  listSuppliersByBusiness: { kind: "query", permission: "suppliers:read", scoped: true },
  listTasksByBusiness: { kind: "query", permission: "tasks:read", scoped: true },
  listTasksAssignedToUser: { kind: "query", permission: "tasks:read", scoped: true, actor: true },
  listEmployeesByBusiness: { kind: "query", permission: "employees:read", scoped: true },
  listDocumentsByBusiness: { kind: "query", permission: "documents:read", scoped: true },
  listActivityLogsByBusiness: { kind: "query", permission: "audit:read", scoped: true },
  listActivityLogsByUser: { kind: "query", permission: "audit:read", scoped: true, actor: true },
  listUsersByBusiness: { kind: "query", permission: "users:manage", scoped: true },
  ListTenants: { kind: "query", permission: "platform:manage" },
  ListUsers: { kind: "query", permission: "platform:manage" },
  getBusinessById: { kind: "query", permission: "company:manage" },

  CreateProduct: { kind: "mutation", permission: "inventory:write", scoped: true, actor: true },
  UpdateProduct: { kind: "mutation", permission: "inventory:write", scoped: true, actor: true, targetList: "listProductsByBusiness", targetField: "products" },
  DeleteProduct: { kind: "mutation", permission: "inventory:write", scoped: true, targetList: "listProductsByBusiness", targetField: "products" },
  CreateTransaction: { kind: "mutation", permission: "expenses:write", scoped: true, actor: true },
  UpdateTransaction: { kind: "mutation", permission: "expenses:write", scoped: true, actor: true, targetList: "listTransactionsByBusiness", targetField: "transactions" },
  DeleteTransaction: { kind: "mutation", permission: "expenses:write", scoped: true, targetList: "listTransactionsByBusiness", targetField: "transactions" },
  CreateTask: { kind: "mutation", permission: "tasks:write", scoped: true, actor: true },
  UpdateTask: { kind: "mutation", permission: "tasks:write", scoped: true, actor: true, targetList: "listTasksByBusiness", targetField: "tasks" },
  DeleteTask: { kind: "mutation", permission: "tasks:write", scoped: true, targetList: "listTasksByBusiness", targetField: "tasks" },
  CompleteAssignedTask: { kind: "mutation", permission: "tasks:read" },
  CreateEmployee: { kind: "mutation", permission: "employees:write", scoped: true },
  UpdateEmployee: { kind: "mutation", permission: "employees:write", scoped: true, targetList: "listEmployeesByBusiness", targetField: "employees" },
  DeleteEmployee: { kind: "mutation", permission: "employees:write", scoped: true, targetList: "listEmployeesByBusiness", targetField: "employees" },
  CreateCustomer: { kind: "mutation", permission: "customers:write", scoped: true },
  UpdateCustomer: { kind: "mutation", permission: "customers:write", scoped: true, targetList: "listCustomersByBusiness", targetField: "customers" },
  DeleteCustomer: { kind: "mutation", permission: "customers:write", scoped: true, targetList: "listCustomersByBusiness", targetField: "customers" },
  CreateSupplier: { kind: "mutation", permission: "suppliers:write", scoped: true },
  UpdateSupplier: { kind: "mutation", permission: "suppliers:write", scoped: true, targetList: "listSuppliersByBusiness", targetField: "suppliers" },
  DeleteSupplier: { kind: "mutation", permission: "suppliers:write", scoped: true, targetList: "listSuppliersByBusiness", targetField: "suppliers" },
  CreateDocument: { kind: "mutation", permission: "documents:write", scoped: true, actor: true },
  DeleteDocument: { kind: "mutation", permission: "documents:write", scoped: true, targetList: "listDocumentsByBusiness", targetField: "documents" },
  UpdateUser: { kind: "mutation", permission: "users:manage", scoped: true, targetList: "listUsersByBusiness", targetField: "users" },
  ProvisionEmployeeUser: { kind: "mutation", permission: "users:manage", scoped: true },
  CreateBusiness: { kind: "mutation", permission: "company:manage", scoped: true },
  UpdateTenant: { kind: "mutation", permission: "platform:manage" },
}

const OUTBOX_ENTITY: Record<string, string> = {
  Product: "product", Transaction: "transaction", Task: "task", Employee: "employee",
  Customer: "customer", Supplier: "supplier", Document: "document", User: "user",
  Business: "business", Tenant: "tenant",
}

function outboxEntity(operation: string) {
  const noun = operation.replace(/^(Create|Update|Delete|Complete|Provision)/, "")
  return OUTBOX_ENTITY[noun] ?? noun.replace(/[A-Z]/g, (letter, index) => `${index ? "_" : ""}${letter.toLowerCase()}`)
}

async function targetBelongsToCompany(
  operation: string,
  field: string,
  id: unknown,
  variables: Record<string, unknown>,
) {
  if (typeof id !== "string" || !id) return false
  const result = await adminDataConnect().executeQuery<Record<string, Array<{ id: string }>>, Record<string, unknown>>(operation, variables)
  return result.data[field]?.some((row) => row.id === id) ?? false
}

export async function POST(request: Request) {
  try {
    const decoded = await verifyRequestIdentity(request)
    const profile = await profileForIdentity(decoded)
    const input = requestSchema.parse(await request.json())
    const policy = POLICIES[input.operation]
    if (!profile || !policy) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    requirePermission(profile, policy.permission)

    let variables: Record<string, unknown> = policy.actor
      ? trustedActorVariables(profile, input.variables)
      : policy.scoped
        ? companyVariables(profile, input.variables)
        : { ...input.variables }

    if (input.operation === "CreateProduct" || input.operation === "CreateTask") variables.createdBy = profile.uid
    if (input.operation === "CreateTransaction") variables.recordedBy = profile.uid
    if (input.operation === "CreateDocument") variables.uploadedBy = profile.uid
    if (input.operation === "listTasksAssignedToUser" || input.operation === "listActivityLogsByUser") variables.userId = profile.uid

    const operational = await executeOperationalOperation(input.operation, variables)
    if (operational) {
      if (policy.kind === "mutation") {
        const value = Object.values(operational)[0] as { id?: string } | undefined
        await adminDataConnect().executeMutation("CreateActivityLog", {
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
    if (input.operation === "CompleteAssignedTask") {
      variables = { taskId: input.variables.taskId, userId: profile.uid }
    }

    const dc = adminDataConnect()
    const result = policy.kind === "query"
      ? await dc.executeQuery(input.operation, variables)
      : await dc.executeMutation(input.operation, variables)
    if (policy.kind === "mutation") {
      const firstValue = Object.values(result.data as Record<string, any>)[0]
      const recordId = String(firstValue?.id ?? variables.id ?? randomUUID())
      await dc.executeMutation("CreateMirrorOutbox", {
        tenantId: profile.tenantId,
        businessId: profile.businessId,
        entityType: outboxEntity(input.operation),
        operation: input.operation.startsWith("Delete") ? "delete" : "upsert",
        recordId,
        payload: { ...variables, id: recordId },
      })
      await dc.executeMutation("CreateActivityLog", {
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
    const message = error instanceof Error ? error.message : "Request failed"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
