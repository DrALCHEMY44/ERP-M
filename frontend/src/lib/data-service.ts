import { ApiOperationError } from "@/lib/api-operation-error"

type CreateUserVariables = {
  id: string
  tenantId: string
  businessId: string
  email: string
  role: string
  fullName?: string | null
  department?: string | null
  phoneNumber?: string | null
  accessCode?: string
}
type UpdateUserVariables = CreateUserVariables
type UpdateTenantVariables = {
  id: string
  name?: string | null
  businessSector?: string | null
  location?: string | null
  ownerEmail?: string | null
  taxId?: string | null
  logoUrl?: string | null
  subscriptionTier?: string | null
  status?: string | null
}

export { ApiOperationError } from "@/lib/api-operation-error"

async function secureOperation<T = any>(operation: string, variables: Record<string, unknown> = {}): Promise<{ data: T }> {
  if (typeof window === "undefined") throw new Error(`${operation} must be called through a trusted server service`)
  const response = await fetch("/api/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ operation, variables }),
  })
  const body = await response.json().catch(() => ({})) as { error?: unknown; data?: T }
  if (!response.ok) {
    const message = typeof body.error === "string" ? body.error : `${operation} failed`
    throw new ApiOperationError(message, response.status)
  }
  return body as { data: T }
}

const operation = (name: string) => (variables: Record<string, unknown> = {}) => secureOperation(name, variables)

export const getUserByEmailQuery = operation("getUserByEmail")
export const getBusinessByIdQuery = operation("getBusinessById")
export const getBusinessSettingsQuery = operation("getBusinessSettings")
export const listProductsByBusinessQuery = operation("listProductsByBusiness")
export const listCustomersByBusinessQuery = operation("listCustomersByBusiness")
export const listSaleCustomersByBusinessQuery = operation("listSaleCustomersByBusiness")
export const listSaleProductsByBusinessQuery = operation("listSaleProductsByBusiness")
export const listSuppliersByBusinessQuery = operation("listSuppliersByBusiness")
export const listTasksByBusinessQuery = operation("listTasksByBusiness")
export const listTaskAssigneesByBusinessQuery = operation("listTaskAssigneesByBusiness")
export const listTransactionsByBusinessQuery = operation("listTransactionsByBusiness")
export const listTransactionsByTypeQuery = operation("listTransactionsByType")
export const listEmployeesByBusinessQuery = operation("listEmployeesByBusiness")
export const listDocumentsByBusinessQuery = operation("listDocumentsByBusiness")
export const listActivityLogsByUserQuery = operation("listActivityLogsByUser")
export const listActivityLogsByBusinessQuery = operation("listActivityLogsByBusiness")
export const listUsersByBusinessQuery = operation("listUsersByBusiness")
export const listTenantsQuery = operation("ListTenants")
export const listUsersQuery = operation("ListUsers")

export const createProductMutation = operation("CreateProduct")
export const updateProductMutation = operation("UpdateProduct")
export const deleteProductMutation = operation("DeleteProduct")
export const createTransactionMutation = operation("CreateTransaction")
export const updateTransactionMutation = operation("UpdateTransaction")
export const deleteTransactionMutation = operation("DeleteTransaction")
export const createTaskMutation = operation("CreateTask")
export const updateTaskMutation = operation("UpdateTask")
export const deleteTaskMutation = operation("DeleteTask")
export const completeAssignedTaskMutation = operation("CompleteAssignedTask")
export const createEmployeeMutation = operation("CreateEmployee")
export const createEmployeeWithAccessMutation = operation("CreateEmployeeWithAccess")
export const updateEmployeeMutation = operation("UpdateEmployee")
export const updateEmployeeWithAccessMutation = operation("UpdateEmployeeWithAccess")
export const deleteEmployeeMutation = operation("DeleteEmployee")
export const deleteEmployeeWithAccessMutation = operation("DeleteEmployeeWithAccess")
export const createCustomerMutation = operation("CreateCustomer")
export const updateCustomerMutation = operation("UpdateCustomer")
export const deleteCustomerMutation = operation("DeleteCustomer")
export const createSupplierMutation = operation("CreateSupplier")
export const updateSupplierMutation = operation("UpdateSupplier")
export const deleteSupplierMutation = operation("DeleteSupplier")
export const createDocumentMutation = operation("CreateDocument")
export const deleteDocumentMutation = operation("DeleteDocument")
export const updateUserMutation = operation("UpdateUser")
export const updateTenantMutation = operation("UpdateTenant")
export const updateBusinessMutation = operation("UpdateBusiness")
export const upsertBusinessSettingsMutation = operation("UpsertBusinessSettings")
export const provisionEmployeeUserMutation = operation("ProvisionEmployeeUser")

// Audit creation is intentionally not exported to clients. Trusted API routes
// append audit records alongside the operation they perform.
export const createActivityLogMutation = async () => {
  throw new Error("Audit records can only be created by trusted server code")
}

export async function getUserByEmail(email: string) {
  const result = await getUserByEmailQuery({ email: email.trim().toLowerCase() })
  return result.data.users?.[0] ?? null
}

export async function getBusinessById(id: string) {
  const result = await getBusinessByIdQuery({ id })
  return result.data.business ?? null
}

export async function createUser(data: CreateUserVariables) {
  const result = await provisionEmployeeUserMutation(data as unknown as Record<string, unknown>)
  return result.data.user_insert
}

export async function createBusiness(params: { name: string; country: string; ownerId: string }) {
  const normalizedName = params.name.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
  const result = await secureOperation<any>("CreateBusiness", {
    name: params.name,
    location: params.country,
    code: `${normalizedName}_${new Date().toISOString().slice(0, 10)}`,
  })
  return { id: result.data.business_insert.id }
}

export async function updateUser(id: string, data: Partial<Omit<UpdateUserVariables, "id">>) {
  const result = await updateUserMutation({ id, ...data })
  return result.data.user_update
}

export async function updateTenant(id: string, data: Partial<Omit<UpdateTenantVariables, "id">>) {
  const result = await updateTenantMutation({ id, ...data })
  return result.data.tenant_update
}

// Registration now uses one authenticated server bootstrap transaction.
export const createTenantMutation = async () => { throw new Error("Use /api/bootstrap") }
export const createBusinessMutation = operation("CreateBusiness")
export const createUserMutation = async () => { throw new Error("Use /api/bootstrap") }

export type ReportSummary = {
  totalRevenue: number | null
  totalExpenses: number | null
  netProfit: number | null
  inventoryValue: number | null
  totalItems: number | null
  lowStockCount: number | null
  activeCustomers: number | null
  taskTotal: number | null
  taskCompleted: number | null
  taskOverdue: number | null
  taskCompletionRate: number | null
  mostValuableCategory: string | null
  revenueTrend: Array<{ month: string; sales: number }>
  topProducts: Array<{ id: string; name: string; quantity: number; revenue: number }>
}

export async function getReportSummaryQuery(): Promise<{ data: ReportSummary }> {
  if (typeof window === "undefined") throw new Error("Report summaries must be requested from the browser")
  const response = await fetch("/api/reports/summary")
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Report summary failed")
  return { data: body as ReportSummary }
}

export async function getSalesQuery(): Promise<{ data: { sales: unknown[] } }> {
  if (typeof window === "undefined") throw new Error("Sales must be requested from the browser")
  const response = await fetch("/api/sales")
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Could not load sales")
  return { data: body }
}
