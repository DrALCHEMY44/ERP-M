import type { Permission } from "./authorization"

export type OperationPolicy = {
  kind: "query" | "mutation"
  permission: Permission
  scoped?: boolean
  actor?: boolean
  targetList?: string
  targetField?: string
}

export const DATA_POLICIES: Readonly<Record<string, OperationPolicy>> = {
  listProductsByBusiness: { kind: "query", permission: "inventory:read", scoped: true },
  listSaleProductsByBusiness: { kind: "query", permission: "sales:write", scoped: true },
  listTransactionsByBusiness: { kind: "query", permission: "sales:read", scoped: true },
  listTransactionsByType: { kind: "query", permission: "expenses:read", scoped: true },
  listCustomersByBusiness: { kind: "query", permission: "customers:read", scoped: true },
  listSaleCustomersByBusiness: { kind: "query", permission: "sales:write", scoped: true },
  listTaskAssigneesByBusiness: { kind: "query", permission: "tasks:write", scoped: true },
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
  getBusinessById: { kind: "query", permission: "sales:read" },
  getBusinessSettings: { kind: "query", permission: "sales:read", scoped: true },

  CreateProduct: { kind: "mutation", permission: "inventory:write", scoped: true, actor: true },
  UpdateProduct: { kind: "mutation", permission: "inventory:write", scoped: true, actor: true, targetList: "listProductsByBusiness", targetField: "products" },
  DeleteProduct: { kind: "mutation", permission: "inventory:write", scoped: true, targetList: "listProductsByBusiness", targetField: "products" },
  CreateTransaction: { kind: "mutation", permission: "expenses:write", scoped: true, actor: true },
  UpdateTransaction: { kind: "mutation", permission: "expenses:write", scoped: true, actor: true, targetList: "listTransactionsByBusiness", targetField: "transactions" },
  DeleteTransaction: { kind: "mutation", permission: "expenses:write", scoped: true, targetList: "listTransactionsByBusiness", targetField: "transactions" },
  CreateTask: { kind: "mutation", permission: "tasks:write", scoped: true, actor: true },
  UpdateTask: { kind: "mutation", permission: "tasks:write", scoped: true, actor: true, targetList: "listTasksByBusiness", targetField: "tasks" },
  DeleteTask: { kind: "mutation", permission: "tasks:write", scoped: true, targetList: "listTasksByBusiness", targetField: "tasks" },
  CompleteAssignedTask: { kind: "mutation", permission: "tasks:read", scoped: true },
  CreateEmployee: { kind: "mutation", permission: "employees:write", scoped: true },
  CreateEmployeeWithAccess: { kind: "mutation", permission: "employees:write", scoped: true },
  UpdateEmployee: { kind: "mutation", permission: "employees:write", scoped: true, targetList: "listEmployeesByBusiness", targetField: "employees" },
  UpdateEmployeeWithAccess: { kind: "mutation", permission: "employees:write", scoped: true, targetList: "listEmployeesByBusiness", targetField: "employees" },
  DeleteEmployee: { kind: "mutation", permission: "employees:write", scoped: true, targetList: "listEmployeesByBusiness", targetField: "employees" },
  DeleteEmployeeWithAccess: { kind: "mutation", permission: "employees:write", scoped: true, targetList: "listEmployeesByBusiness", targetField: "employees" },
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
  UpdateBusiness: { kind: "mutation", permission: "company:manage", scoped: true },
  UpsertBusinessSettings: { kind: "mutation", permission: "company:manage", scoped: true },
  UpdateTenant: { kind: "mutation", permission: "platform:manage" },
}
