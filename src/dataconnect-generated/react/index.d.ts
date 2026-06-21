import { CreateTenantData, CreateTenantVariables, UpdateTenantData, UpdateTenantVariables, DeleteTenantData, DeleteTenantVariables, CreateUserData, CreateUserVariables, UpdateUserData, UpdateUserVariables, DeleteUserData, DeleteUserVariables, CreateBusinessData, CreateBusinessVariables, UpdateBusinessData, UpdateBusinessVariables, DeleteBusinessData, DeleteBusinessVariables, CreateProductData, CreateProductVariables, UpdateProductData, UpdateProductVariables, DeleteProductData, DeleteProductVariables, CreateTransactionData, CreateTransactionVariables, UpdateTransactionData, UpdateTransactionVariables, DeleteTransactionData, DeleteTransactionVariables, CreateTaskData, CreateTaskVariables, UpdateTaskData, UpdateTaskVariables, DeleteTaskData, DeleteTaskVariables, CreateEmployeeData, CreateEmployeeVariables, UpdateEmployeeData, UpdateEmployeeVariables, DeleteEmployeeData, DeleteEmployeeVariables, CreateCustomerData, CreateCustomerVariables, UpdateCustomerData, UpdateCustomerVariables, DeleteCustomerData, DeleteCustomerVariables, CreateSupplierData, CreateSupplierVariables, UpdateSupplierData, UpdateSupplierVariables, DeleteSupplierData, DeleteSupplierVariables, CreateDocumentData, CreateDocumentVariables, UpdateDocumentData, UpdateDocumentVariables, DeleteDocumentData, DeleteDocumentVariables, ListTenantsData, ListUsersData, ListUsersVariables, ListBusinessesData, ListBusinessesVariables, ListProductsData, ListProductsVariables, ListTransactionsData, ListTransactionsVariables, ListTasksData, ListTasksVariables, ListEmployeesData, ListEmployeesVariables, ListCustomersData, ListCustomersVariables, ListSuppliersData, ListSuppliersVariables, ListDocumentsData, ListDocumentsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateTenant(options?: useDataConnectMutationOptions<CreateTenantData, FirebaseError, CreateTenantVariables>): UseDataConnectMutationResult<CreateTenantData, CreateTenantVariables>;
export function useCreateTenant(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTenantData, FirebaseError, CreateTenantVariables>): UseDataConnectMutationResult<CreateTenantData, CreateTenantVariables>;

export function useUpdateTenant(options?: useDataConnectMutationOptions<UpdateTenantData, FirebaseError, UpdateTenantVariables>): UseDataConnectMutationResult<UpdateTenantData, UpdateTenantVariables>;
export function useUpdateTenant(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTenantData, FirebaseError, UpdateTenantVariables>): UseDataConnectMutationResult<UpdateTenantData, UpdateTenantVariables>;

export function useDeleteTenant(options?: useDataConnectMutationOptions<DeleteTenantData, FirebaseError, DeleteTenantVariables>): UseDataConnectMutationResult<DeleteTenantData, DeleteTenantVariables>;
export function useDeleteTenant(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTenantData, FirebaseError, DeleteTenantVariables>): UseDataConnectMutationResult<DeleteTenantData, DeleteTenantVariables>;

export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useUpdateUser(options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;
export function useUpdateUser(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserData, FirebaseError, UpdateUserVariables>): UseDataConnectMutationResult<UpdateUserData, UpdateUserVariables>;

export function useDeleteUser(options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;
export function useDeleteUser(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserData, FirebaseError, DeleteUserVariables>): UseDataConnectMutationResult<DeleteUserData, DeleteUserVariables>;

export function useCreateBusiness(options?: useDataConnectMutationOptions<CreateBusinessData, FirebaseError, CreateBusinessVariables>): UseDataConnectMutationResult<CreateBusinessData, CreateBusinessVariables>;
export function useCreateBusiness(dc: DataConnect, options?: useDataConnectMutationOptions<CreateBusinessData, FirebaseError, CreateBusinessVariables>): UseDataConnectMutationResult<CreateBusinessData, CreateBusinessVariables>;

export function useUpdateBusiness(options?: useDataConnectMutationOptions<UpdateBusinessData, FirebaseError, UpdateBusinessVariables>): UseDataConnectMutationResult<UpdateBusinessData, UpdateBusinessVariables>;
export function useUpdateBusiness(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateBusinessData, FirebaseError, UpdateBusinessVariables>): UseDataConnectMutationResult<UpdateBusinessData, UpdateBusinessVariables>;

export function useDeleteBusiness(options?: useDataConnectMutationOptions<DeleteBusinessData, FirebaseError, DeleteBusinessVariables>): UseDataConnectMutationResult<DeleteBusinessData, DeleteBusinessVariables>;
export function useDeleteBusiness(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteBusinessData, FirebaseError, DeleteBusinessVariables>): UseDataConnectMutationResult<DeleteBusinessData, DeleteBusinessVariables>;

export function useCreateProduct(options?: useDataConnectMutationOptions<CreateProductData, FirebaseError, CreateProductVariables>): UseDataConnectMutationResult<CreateProductData, CreateProductVariables>;
export function useCreateProduct(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProductData, FirebaseError, CreateProductVariables>): UseDataConnectMutationResult<CreateProductData, CreateProductVariables>;

export function useUpdateProduct(options?: useDataConnectMutationOptions<UpdateProductData, FirebaseError, UpdateProductVariables>): UseDataConnectMutationResult<UpdateProductData, UpdateProductVariables>;
export function useUpdateProduct(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateProductData, FirebaseError, UpdateProductVariables>): UseDataConnectMutationResult<UpdateProductData, UpdateProductVariables>;

export function useDeleteProduct(options?: useDataConnectMutationOptions<DeleteProductData, FirebaseError, DeleteProductVariables>): UseDataConnectMutationResult<DeleteProductData, DeleteProductVariables>;
export function useDeleteProduct(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteProductData, FirebaseError, DeleteProductVariables>): UseDataConnectMutationResult<DeleteProductData, DeleteProductVariables>;

export function useCreateTransaction(options?: useDataConnectMutationOptions<CreateTransactionData, FirebaseError, CreateTransactionVariables>): UseDataConnectMutationResult<CreateTransactionData, CreateTransactionVariables>;
export function useCreateTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTransactionData, FirebaseError, CreateTransactionVariables>): UseDataConnectMutationResult<CreateTransactionData, CreateTransactionVariables>;

export function useUpdateTransaction(options?: useDataConnectMutationOptions<UpdateTransactionData, FirebaseError, UpdateTransactionVariables>): UseDataConnectMutationResult<UpdateTransactionData, UpdateTransactionVariables>;
export function useUpdateTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTransactionData, FirebaseError, UpdateTransactionVariables>): UseDataConnectMutationResult<UpdateTransactionData, UpdateTransactionVariables>;

export function useDeleteTransaction(options?: useDataConnectMutationOptions<DeleteTransactionData, FirebaseError, DeleteTransactionVariables>): UseDataConnectMutationResult<DeleteTransactionData, DeleteTransactionVariables>;
export function useDeleteTransaction(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTransactionData, FirebaseError, DeleteTransactionVariables>): UseDataConnectMutationResult<DeleteTransactionData, DeleteTransactionVariables>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useUpdateTask(options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
export function useUpdateTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;

export function useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
export function useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;

export function useCreateEmployee(options?: useDataConnectMutationOptions<CreateEmployeeData, FirebaseError, CreateEmployeeVariables>): UseDataConnectMutationResult<CreateEmployeeData, CreateEmployeeVariables>;
export function useCreateEmployee(dc: DataConnect, options?: useDataConnectMutationOptions<CreateEmployeeData, FirebaseError, CreateEmployeeVariables>): UseDataConnectMutationResult<CreateEmployeeData, CreateEmployeeVariables>;

export function useUpdateEmployee(options?: useDataConnectMutationOptions<UpdateEmployeeData, FirebaseError, UpdateEmployeeVariables>): UseDataConnectMutationResult<UpdateEmployeeData, UpdateEmployeeVariables>;
export function useUpdateEmployee(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateEmployeeData, FirebaseError, UpdateEmployeeVariables>): UseDataConnectMutationResult<UpdateEmployeeData, UpdateEmployeeVariables>;

export function useDeleteEmployee(options?: useDataConnectMutationOptions<DeleteEmployeeData, FirebaseError, DeleteEmployeeVariables>): UseDataConnectMutationResult<DeleteEmployeeData, DeleteEmployeeVariables>;
export function useDeleteEmployee(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteEmployeeData, FirebaseError, DeleteEmployeeVariables>): UseDataConnectMutationResult<DeleteEmployeeData, DeleteEmployeeVariables>;

export function useCreateCustomer(options?: useDataConnectMutationOptions<CreateCustomerData, FirebaseError, CreateCustomerVariables>): UseDataConnectMutationResult<CreateCustomerData, CreateCustomerVariables>;
export function useCreateCustomer(dc: DataConnect, options?: useDataConnectMutationOptions<CreateCustomerData, FirebaseError, CreateCustomerVariables>): UseDataConnectMutationResult<CreateCustomerData, CreateCustomerVariables>;

export function useUpdateCustomer(options?: useDataConnectMutationOptions<UpdateCustomerData, FirebaseError, UpdateCustomerVariables>): UseDataConnectMutationResult<UpdateCustomerData, UpdateCustomerVariables>;
export function useUpdateCustomer(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateCustomerData, FirebaseError, UpdateCustomerVariables>): UseDataConnectMutationResult<UpdateCustomerData, UpdateCustomerVariables>;

export function useDeleteCustomer(options?: useDataConnectMutationOptions<DeleteCustomerData, FirebaseError, DeleteCustomerVariables>): UseDataConnectMutationResult<DeleteCustomerData, DeleteCustomerVariables>;
export function useDeleteCustomer(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteCustomerData, FirebaseError, DeleteCustomerVariables>): UseDataConnectMutationResult<DeleteCustomerData, DeleteCustomerVariables>;

export function useCreateSupplier(options?: useDataConnectMutationOptions<CreateSupplierData, FirebaseError, CreateSupplierVariables>): UseDataConnectMutationResult<CreateSupplierData, CreateSupplierVariables>;
export function useCreateSupplier(dc: DataConnect, options?: useDataConnectMutationOptions<CreateSupplierData, FirebaseError, CreateSupplierVariables>): UseDataConnectMutationResult<CreateSupplierData, CreateSupplierVariables>;

export function useUpdateSupplier(options?: useDataConnectMutationOptions<UpdateSupplierData, FirebaseError, UpdateSupplierVariables>): UseDataConnectMutationResult<UpdateSupplierData, UpdateSupplierVariables>;
export function useUpdateSupplier(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateSupplierData, FirebaseError, UpdateSupplierVariables>): UseDataConnectMutationResult<UpdateSupplierData, UpdateSupplierVariables>;

export function useDeleteSupplier(options?: useDataConnectMutationOptions<DeleteSupplierData, FirebaseError, DeleteSupplierVariables>): UseDataConnectMutationResult<DeleteSupplierData, DeleteSupplierVariables>;
export function useDeleteSupplier(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteSupplierData, FirebaseError, DeleteSupplierVariables>): UseDataConnectMutationResult<DeleteSupplierData, DeleteSupplierVariables>;

export function useCreateDocument(options?: useDataConnectMutationOptions<CreateDocumentData, FirebaseError, CreateDocumentVariables>): UseDataConnectMutationResult<CreateDocumentData, CreateDocumentVariables>;
export function useCreateDocument(dc: DataConnect, options?: useDataConnectMutationOptions<CreateDocumentData, FirebaseError, CreateDocumentVariables>): UseDataConnectMutationResult<CreateDocumentData, CreateDocumentVariables>;

export function useUpdateDocument(options?: useDataConnectMutationOptions<UpdateDocumentData, FirebaseError, UpdateDocumentVariables>): UseDataConnectMutationResult<UpdateDocumentData, UpdateDocumentVariables>;
export function useUpdateDocument(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateDocumentData, FirebaseError, UpdateDocumentVariables>): UseDataConnectMutationResult<UpdateDocumentData, UpdateDocumentVariables>;

export function useDeleteDocument(options?: useDataConnectMutationOptions<DeleteDocumentData, FirebaseError, DeleteDocumentVariables>): UseDataConnectMutationResult<DeleteDocumentData, DeleteDocumentVariables>;
export function useDeleteDocument(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteDocumentData, FirebaseError, DeleteDocumentVariables>): UseDataConnectMutationResult<DeleteDocumentData, DeleteDocumentVariables>;

export function useListTenants(options?: useDataConnectQueryOptions<ListTenantsData>): UseDataConnectQueryResult<ListTenantsData, undefined>;
export function useListTenants(dc: DataConnect, options?: useDataConnectQueryOptions<ListTenantsData>): UseDataConnectQueryResult<ListTenantsData, undefined>;

export function useListUsers(vars: ListUsersVariables, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, ListUsersVariables>;
export function useListUsers(dc: DataConnect, vars: ListUsersVariables, options?: useDataConnectQueryOptions<ListUsersData>): UseDataConnectQueryResult<ListUsersData, ListUsersVariables>;

export function useListBusinesses(vars: ListBusinessesVariables, options?: useDataConnectQueryOptions<ListBusinessesData>): UseDataConnectQueryResult<ListBusinessesData, ListBusinessesVariables>;
export function useListBusinesses(dc: DataConnect, vars: ListBusinessesVariables, options?: useDataConnectQueryOptions<ListBusinessesData>): UseDataConnectQueryResult<ListBusinessesData, ListBusinessesVariables>;

export function useListProducts(vars: ListProductsVariables, options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, ListProductsVariables>;
export function useListProducts(dc: DataConnect, vars: ListProductsVariables, options?: useDataConnectQueryOptions<ListProductsData>): UseDataConnectQueryResult<ListProductsData, ListProductsVariables>;

export function useListTransactions(vars: ListTransactionsVariables, options?: useDataConnectQueryOptions<ListTransactionsData>): UseDataConnectQueryResult<ListTransactionsData, ListTransactionsVariables>;
export function useListTransactions(dc: DataConnect, vars: ListTransactionsVariables, options?: useDataConnectQueryOptions<ListTransactionsData>): UseDataConnectQueryResult<ListTransactionsData, ListTransactionsVariables>;

export function useListTasks(vars: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;
export function useListTasks(dc: DataConnect, vars: ListTasksVariables, options?: useDataConnectQueryOptions<ListTasksData>): UseDataConnectQueryResult<ListTasksData, ListTasksVariables>;

export function useListEmployees(vars: ListEmployeesVariables, options?: useDataConnectQueryOptions<ListEmployeesData>): UseDataConnectQueryResult<ListEmployeesData, ListEmployeesVariables>;
export function useListEmployees(dc: DataConnect, vars: ListEmployeesVariables, options?: useDataConnectQueryOptions<ListEmployeesData>): UseDataConnectQueryResult<ListEmployeesData, ListEmployeesVariables>;

export function useListCustomers(vars: ListCustomersVariables, options?: useDataConnectQueryOptions<ListCustomersData>): UseDataConnectQueryResult<ListCustomersData, ListCustomersVariables>;
export function useListCustomers(dc: DataConnect, vars: ListCustomersVariables, options?: useDataConnectQueryOptions<ListCustomersData>): UseDataConnectQueryResult<ListCustomersData, ListCustomersVariables>;

export function useListSuppliers(vars: ListSuppliersVariables, options?: useDataConnectQueryOptions<ListSuppliersData>): UseDataConnectQueryResult<ListSuppliersData, ListSuppliersVariables>;
export function useListSuppliers(dc: DataConnect, vars: ListSuppliersVariables, options?: useDataConnectQueryOptions<ListSuppliersData>): UseDataConnectQueryResult<ListSuppliersData, ListSuppliersVariables>;

export function useListDocuments(vars: ListDocumentsVariables, options?: useDataConnectQueryOptions<ListDocumentsData>): UseDataConnectQueryResult<ListDocumentsData, ListDocumentsVariables>;
export function useListDocuments(dc: DataConnect, vars: ListDocumentsVariables, options?: useDataConnectQueryOptions<ListDocumentsData>): UseDataConnectQueryResult<ListDocumentsData, ListDocumentsVariables>;
