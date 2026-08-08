import {
  getUserByEmail as getUserByEmailQuery,
  getBusinessById as getBusinessByIdQuery,
  createUser as createUserMutation,
  createBusiness as createBusinessMutation,
  updateUser as updateUserMutation,
  listProductsByBusiness as listProductsByBusinessQuery,
  listCustomersByBusiness as listCustomersByBusinessQuery,
  listSuppliersByBusiness as listSuppliersByBusinessQuery,
  listTasksByBusiness as listTasksByBusinessQuery,
  listTransactionsByBusiness as listTransactionsByBusinessQuery,
  listTransactionsByType as listTransactionsByTypeQuery,
  listEmployeesByBusiness as listEmployeesByBusinessQuery,
  listDocumentsByBusiness as listDocumentsByBusinessQuery,
  listActivityLogsByUser as listActivityLogsByUserQuery,
  createProduct as firebaseCreateProductMutation,
  updateProduct as firebaseUpdateProductMutation,
  deleteProduct as firebaseDeleteProductMutation,
  createTransaction as firebaseCreateTransactionMutation,
  updateTransaction as firebaseUpdateTransactionMutation,
  deleteTransaction as firebaseDeleteTransactionMutation,
  listActivityLogsByBusiness as listActivityLogsByBusinessQuery,
  createTask as firebaseCreateTaskMutation,
  updateTask as firebaseUpdateTaskMutation,
  deleteTask as firebaseDeleteTaskMutation,
  createEmployee as firebaseCreateEmployeeMutation,
  updateEmployee as firebaseUpdateEmployeeMutation,
  deleteEmployee as firebaseDeleteEmployeeMutation,
  createSupplier as firebaseCreateSupplierMutation,
  updateSupplier as firebaseUpdateSupplierMutation,
  deleteSupplier as firebaseDeleteSupplierMutation,
  createTenant as createTenantMutation,
  createCustomer as firebaseCreateCustomerMutation,
  updateCustomer as firebaseUpdateCustomerMutation,
  deleteCustomer as firebaseDeleteCustomerMutation,
  listUsersByBusiness as listUsersByBusinessQuery,
  createDocument as firebaseCreateDocumentMutation,
  deleteDocument as firebaseDeleteDocumentMutation,
  createActivityLog as firebaseCreateActivityLogMutation,
  listTenants as listTenantsQuery,
  listUsers as listUsersQuery,
  updateTenant as updateTenantMutation,
  provisionEmployeeUser as provisionEmployeeUserMutation,
  type GetUserByEmailData,
  type CreateUserVariables,
  type CreateBusinessVariables,
  type UpdateUserVariables,
  type UpdateTenantVariables,
} from "@dataconnect/generated";

type MirrorEntity = "product" | "transaction" | "task" | "employee" | "customer" |
  "supplier" | "document" | "activity_log";

async function mirrorSuccessfulMutation<T>(
  entity: MirrorEntity,
  operation: "upsert" | "delete",
  variables: Record<string, unknown>,
  execute: () => Promise<T>,
  resultField: string,
): Promise<T> {
  const result = await execute();
  if (typeof window !== "undefined") {
    const detail = { entity, operation, timestamp: Date.now() };
    window.dispatchEvent(new CustomEvent("smarterp:data-changed", { detail }));
    // Notify other open SmartERP tabs as well.
    localStorage.setItem("smarterp:last-change", JSON.stringify(detail));
  }

  // Firebase is the primary database. Synchronize Neon in the background so a
  // temporary secondary outage never blocks the UI or delays the fresh record.
  void (async () => {
    try {
      const resultData = (result as any)?.data?.[resultField];
      const recordId = String(resultData?.id ?? variables.id ?? "");
      if (!recordId) throw new Error(`Firebase did not return an ID for ${entity}`);
      const { auth } = await import("@/lib/firebase");
      const token = await auth.currentUser?.getIdToken();
      if (!token) throw new Error("No authenticated user is available for Neon mirroring");
      const account = auth.currentUser?.email
        ? (await getUserByEmailQuery({ email: auth.currentUser.email })).data.users[0]
        : null;
      const tenantId = String(variables.tenantId ?? account?.tenantId ?? "");
      const businessId = String(variables.businessId ?? account?.businessId ?? "");
      if (!tenantId || !businessId) throw new Error("Company scope is unavailable for Neon mirroring");
      const response = await fetch("/api/sync/neon", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ entity, operation, recordId, payload: { ...variables, id: recordId } }),
      });
      if (!response.ok) throw new Error(`Neon mirror returned ${response.status}`);
    } catch (error) {
      // A warning remains visible to developers without triggering Next's red
      // runtime overlay for a write that already succeeded in the primary DB.
      console.warn(`Firebase ${entity} write succeeded; Neon will need to catch up`, error);
    }
  })();
  return result;
}

export const createProductMutation = (variables: any) => mirrorSuccessfulMutation(
  "product", "upsert", variables, () => firebaseCreateProductMutation(variables), "product_insert",
);
export const updateProductMutation = (variables: any) => mirrorSuccessfulMutation(
  "product", "upsert", variables, () => firebaseUpdateProductMutation(variables), "product_update",
);
export const deleteProductMutation = (variables: any) => mirrorSuccessfulMutation(
  "product", "delete", variables, () => firebaseDeleteProductMutation(variables), "product_delete",
);
export const createTransactionMutation = (variables: any) => mirrorSuccessfulMutation(
  "transaction", "upsert", variables, () => firebaseCreateTransactionMutation(variables), "transaction_insert",
);
export const updateTransactionMutation = (variables: any) => mirrorSuccessfulMutation(
  "transaction", "upsert", variables, () => firebaseUpdateTransactionMutation(variables), "transaction_update",
);
export const deleteTransactionMutation = (variables: any) => mirrorSuccessfulMutation(
  "transaction", "delete", variables, () => firebaseDeleteTransactionMutation(variables), "transaction_delete",
);
export const createTaskMutation = (variables: any) => mirrorSuccessfulMutation(
  "task", "upsert", variables, () => firebaseCreateTaskMutation(variables), "task_insert",
);
export const updateTaskMutation = (variables: any) => mirrorSuccessfulMutation(
  "task", "upsert", variables, () => firebaseUpdateTaskMutation(variables), "task_update",
);
export const deleteTaskMutation = (variables: any) => mirrorSuccessfulMutation(
  "task", "delete", variables, () => firebaseDeleteTaskMutation(variables), "task_delete",
);
export const createEmployeeMutation = (variables: any) => mirrorSuccessfulMutation(
  "employee", "upsert", variables, () => firebaseCreateEmployeeMutation(variables), "employee_insert",
);
export const updateEmployeeMutation = (variables: any) => mirrorSuccessfulMutation(
  "employee", "upsert", variables, () => firebaseUpdateEmployeeMutation(variables), "employee_update",
);
export const deleteEmployeeMutation = (variables: any) => mirrorSuccessfulMutation(
  "employee", "delete", variables, () => firebaseDeleteEmployeeMutation(variables), "employee_delete",
);
export const createCustomerMutation = (variables: any) => mirrorSuccessfulMutation(
  "customer", "upsert", variables, () => firebaseCreateCustomerMutation(variables), "customer_insert",
);
export const updateCustomerMutation = (variables: any) => mirrorSuccessfulMutation(
  "customer", "upsert", variables, () => firebaseUpdateCustomerMutation(variables), "customer_update",
);
export const deleteCustomerMutation = (variables: any) => mirrorSuccessfulMutation(
  "customer", "delete", variables, () => firebaseDeleteCustomerMutation(variables), "customer_delete",
);
export const createSupplierMutation = (variables: any) => mirrorSuccessfulMutation(
  "supplier", "upsert", variables, () => firebaseCreateSupplierMutation(variables), "supplier_insert",
);
export const updateSupplierMutation = (variables: any) => mirrorSuccessfulMutation(
  "supplier", "upsert", variables, () => firebaseUpdateSupplierMutation(variables), "supplier_update",
);
export const deleteSupplierMutation = (variables: any) => mirrorSuccessfulMutation(
  "supplier", "delete", variables, () => firebaseDeleteSupplierMutation(variables), "supplier_delete",
);
export const createDocumentMutation = (variables: any) => mirrorSuccessfulMutation(
  "document", "upsert", variables, () => firebaseCreateDocumentMutation(variables), "document_insert",
);
export const deleteDocumentMutation = (variables: any) => mirrorSuccessfulMutation(
  "document", "delete", variables, () => firebaseDeleteDocumentMutation(variables), "document_delete",
);
export const createActivityLogMutation = (variables: any) => mirrorSuccessfulMutation(
  "activity_log", "upsert", variables, () => firebaseCreateActivityLogMutation(variables), "activityLog_insert",
);

/**
 * Fetches a user by their email address from the database.
 *
 * @param email - The email of the user to retrieve.
 * @returns The user object if found, otherwise null.
 */
export async function getUserByEmail(email: string) {
  const result = await getUserByEmailQuery({ email });
  const users = result.data.users;
  return users.length > 0 ? users[0] : null;
}

/**
 * Fetches a business by its ID from the database.
 *
 * @param id - The ID of the business to retrieve.
 * @returns The business object if found, otherwise null.
 */
export async function getBusinessById(id: string) {
  const result = await getBusinessByIdQuery({ id });
  return result.data.business;
}

/**
 * Creates a new user in the database.
 */
export async function createUser(data: CreateUserVariables) {
  const result = await createUserMutation(data);
  return result.data.user_insert;
}

/**
 * Creates a new business in the database.
 */
export async function createBusiness(params: {
  name: string;
  country: string;
  ownerId: string;
}) {
  const dateStr = new Date().toISOString().split('T')[0];
  const normalizedName = params.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const code = `${normalizedName}_${dateStr}`;

  const result = await createBusinessMutation({
    tenantId: params.ownerId,
    name: params.name,
    location: params.country,
    code: code,
  });
  return { id: result.data.business_insert.id };
}

/**
 * Updates an existing user by ID.
 */
export async function updateUser(
  id: string,
  data: Partial<Omit<UpdateUserVariables, "id">>,
) {
  const result = await updateUserMutation({
    id,
    ...data,
  });
  return result.data.user_update;
}

/**
 * Updates an existing tenant by ID.
 */
export async function updateTenant(
  id: string,
  data: Partial<Omit<UpdateTenantVariables, "id">>,
) {
  const result = await updateTenantMutation({
    id,
    ...data,
  });
  return result.data.tenant_update;
}

export {
  createBusinessMutation,
  createTenantMutation,
  createUserMutation,
  getUserByEmailQuery,
  listActivityLogsByBusinessQuery,
  listActivityLogsByUserQuery,
  listCustomersByBusinessQuery,
  listDocumentsByBusinessQuery,
  listEmployeesByBusinessQuery,
  listProductsByBusinessQuery,
  listSuppliersByBusinessQuery,
  listTasksByBusinessQuery,
  listTransactionsByBusinessQuery,
  listTransactionsByTypeQuery,
  updateUserMutation,
  listUsersByBusinessQuery,
  listTenantsQuery,
  listUsersQuery,
  updateTenantMutation,
  provisionEmployeeUserMutation,
}
