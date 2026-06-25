import {
  getUserByEmail as getUserByEmailQuery,
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
  createProduct as createProductMutation,
  updateProduct as updateProductMutation,
  deleteProduct as deleteProductMutation,
  createTransaction as createTransactionMutation,
  updateTransaction as updateTransactionMutation,
  deleteTransaction as deleteTransactionMutation,
  listActivityLogsByBusiness as listActivityLogsByBusinessQuery,
  createTask as createTaskMutation,
  updateTask as updateTaskMutation,
  deleteTask as deleteTaskMutation,
  createEmployee as createEmployeeMutation,
  updateEmployee as updateEmployeeMutation,
  deleteEmployee as deleteEmployeeMutation,
  createSupplier as createSupplierMutation,
  updateSupplier as updateSupplierMutation,
  deleteSupplier as deleteSupplierMutation,
  createTenant as createTenantMutation,
  createCustomer as createCustomerMutation,
  updateCustomer as updateCustomerMutation,
  deleteCustomer as deleteCustomerMutation,
  listUsersByBusiness as listUsersByBusinessQuery,
  createDocument as createDocumentMutation,
  deleteDocument as deleteDocumentMutation,
  createActivityLog as createActivityLogMutation,
  type GetUserByEmailData,
  type CreateUserVariables,
  type CreateBusinessVariables,
  type UpdateUserVariables,
} from "@dataconnect/generated";

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
  const result = await createBusinessMutation({
    tenantId: params.ownerId,
    name: params.name,
    location: params.country,
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

export {
  createBusinessMutation,
  createCustomerMutation,
  updateCustomerMutation,
  deleteCustomerMutation,
  createEmployeeMutation,
  createProductMutation,
  createSupplierMutation,
  createTenantMutation,
  createTaskMutation,
  createTransactionMutation,
  createUserMutation,
  deleteEmployeeMutation,
  deleteProductMutation,
  deleteSupplierMutation,
  deleteTaskMutation,
  deleteTransactionMutation,
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
  updateEmployeeMutation,
  updateProductMutation,
  updateSupplierMutation,
  updateTaskMutation,
  updateTransactionMutation,
  updateUserMutation,
  listUsersByBusinessQuery,
  createDocumentMutation,
  deleteDocumentMutation,
  createActivityLogMutation,
}
