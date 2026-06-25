import { CreateTenantData, CreateTenantVariables, UpdateTenantData, UpdateTenantVariables, DeleteTenantData, DeleteTenantVariables, CreateUserData, CreateUserVariables, UpdateUserData, UpdateUserVariables, DeleteUserData, DeleteUserVariables, CreateBusinessData, CreateBusinessVariables, UpdateBusinessData, UpdateBusinessVariables, DeleteBusinessData, DeleteBusinessVariables, CreateProductData, CreateProductVariables, UpdateProductData, UpdateProductVariables, DeleteProductData, DeleteProductVariables, CreateTransactionData, CreateTransactionVariables, UpdateTransactionData, UpdateTransactionVariables, DeleteTransactionData, DeleteTransactionVariables, CreateTaskCommentData, CreateTaskCommentVariables, UpdateTaskCommentData, UpdateTaskCommentVariables, DeleteTaskCommentData, DeleteTaskCommentVariables, CreateEmployeeData, CreateEmployeeVariables, UpdateEmployeeData, UpdateEmployeeVariables, DeleteEmployeeData, DeleteEmployeeVariables, CreateCustomerData, CreateCustomerVariables, UpdateCustomerData, UpdateCustomerVariables, DeleteCustomerData, DeleteCustomerVariables, CreateSupplierData, CreateSupplierVariables, UpdateSupplierData, UpdateSupplierVariables, DeleteSupplierData, DeleteSupplierVariables, CreateDocumentData, CreateDocumentVariables, UpdateDocumentData, UpdateDocumentVariables, DeleteDocumentData, DeleteDocumentVariables, CreateActivityLogData, CreateActivityLogVariables, UpdateActivityLogData, UpdateActivityLogVariables, DeleteActivityLogData, DeleteActivityLogVariables, CreateAiQueryData, CreateAiQueryVariables, UpdateAiQueryData, UpdateAiQueryVariables, DeleteAiQueryData, DeleteAiQueryVariables, CreateNotificationData, CreateNotificationVariables, UpdateNotificationData, UpdateNotificationVariables, DeleteNotificationData, DeleteNotificationVariables, CreateTaskData, CreateTaskVariables, UpdateTaskData, UpdateTaskVariables, DeleteTaskData, DeleteTaskVariables, ListTenantsData, ListBusinessesData, ListBusinessesVariables, GetUserByEmailData, GetUserByEmailVariables, ListProductsByBusinessData, ListProductsByBusinessVariables, ListCustomersByBusinessData, ListCustomersByBusinessVariables, ListUsersByBusinessData, ListUsersByBusinessVariables, ListSuppliersByBusinessData, ListSuppliersByBusinessVariables, ListTasksByBusinessData, ListTasksByBusinessVariables, ListTransactionsByBusinessData, ListTransactionsByBusinessVariables, ListTransactionsByTypeData, ListTransactionsByTypeVariables, ListEmployeesByBusinessData, ListEmployeesByBusinessVariables, ListDocumentsByBusinessData, ListDocumentsByBusinessVariables, ListActivityLogsByUserData, ListActivityLogsByUserVariables, ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables } from '../';
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

export function useCreateTaskComment(options?: useDataConnectMutationOptions<CreateTaskCommentData, FirebaseError, CreateTaskCommentVariables>): UseDataConnectMutationResult<CreateTaskCommentData, CreateTaskCommentVariables>;
export function useCreateTaskComment(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskCommentData, FirebaseError, CreateTaskCommentVariables>): UseDataConnectMutationResult<CreateTaskCommentData, CreateTaskCommentVariables>;

export function useUpdateTaskComment(options?: useDataConnectMutationOptions<UpdateTaskCommentData, FirebaseError, UpdateTaskCommentVariables>): UseDataConnectMutationResult<UpdateTaskCommentData, UpdateTaskCommentVariables>;
export function useUpdateTaskComment(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskCommentData, FirebaseError, UpdateTaskCommentVariables>): UseDataConnectMutationResult<UpdateTaskCommentData, UpdateTaskCommentVariables>;

export function useDeleteTaskComment(options?: useDataConnectMutationOptions<DeleteTaskCommentData, FirebaseError, DeleteTaskCommentVariables>): UseDataConnectMutationResult<DeleteTaskCommentData, DeleteTaskCommentVariables>;
export function useDeleteTaskComment(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskCommentData, FirebaseError, DeleteTaskCommentVariables>): UseDataConnectMutationResult<DeleteTaskCommentData, DeleteTaskCommentVariables>;

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

export function useCreateActivityLog(options?: useDataConnectMutationOptions<CreateActivityLogData, FirebaseError, CreateActivityLogVariables>): UseDataConnectMutationResult<CreateActivityLogData, CreateActivityLogVariables>;
export function useCreateActivityLog(dc: DataConnect, options?: useDataConnectMutationOptions<CreateActivityLogData, FirebaseError, CreateActivityLogVariables>): UseDataConnectMutationResult<CreateActivityLogData, CreateActivityLogVariables>;

export function useUpdateActivityLog(options?: useDataConnectMutationOptions<UpdateActivityLogData, FirebaseError, UpdateActivityLogVariables>): UseDataConnectMutationResult<UpdateActivityLogData, UpdateActivityLogVariables>;
export function useUpdateActivityLog(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateActivityLogData, FirebaseError, UpdateActivityLogVariables>): UseDataConnectMutationResult<UpdateActivityLogData, UpdateActivityLogVariables>;

export function useDeleteActivityLog(options?: useDataConnectMutationOptions<DeleteActivityLogData, FirebaseError, DeleteActivityLogVariables>): UseDataConnectMutationResult<DeleteActivityLogData, DeleteActivityLogVariables>;
export function useDeleteActivityLog(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteActivityLogData, FirebaseError, DeleteActivityLogVariables>): UseDataConnectMutationResult<DeleteActivityLogData, DeleteActivityLogVariables>;

export function useCreateAiQuery(options?: useDataConnectMutationOptions<CreateAiQueryData, FirebaseError, CreateAiQueryVariables>): UseDataConnectMutationResult<CreateAiQueryData, CreateAiQueryVariables>;
export function useCreateAiQuery(dc: DataConnect, options?: useDataConnectMutationOptions<CreateAiQueryData, FirebaseError, CreateAiQueryVariables>): UseDataConnectMutationResult<CreateAiQueryData, CreateAiQueryVariables>;

export function useUpdateAiQuery(options?: useDataConnectMutationOptions<UpdateAiQueryData, FirebaseError, UpdateAiQueryVariables>): UseDataConnectMutationResult<UpdateAiQueryData, UpdateAiQueryVariables>;
export function useUpdateAiQuery(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateAiQueryData, FirebaseError, UpdateAiQueryVariables>): UseDataConnectMutationResult<UpdateAiQueryData, UpdateAiQueryVariables>;

export function useDeleteAiQuery(options?: useDataConnectMutationOptions<DeleteAiQueryData, FirebaseError, DeleteAiQueryVariables>): UseDataConnectMutationResult<DeleteAiQueryData, DeleteAiQueryVariables>;
export function useDeleteAiQuery(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteAiQueryData, FirebaseError, DeleteAiQueryVariables>): UseDataConnectMutationResult<DeleteAiQueryData, DeleteAiQueryVariables>;

export function useCreateNotification(options?: useDataConnectMutationOptions<CreateNotificationData, FirebaseError, CreateNotificationVariables>): UseDataConnectMutationResult<CreateNotificationData, CreateNotificationVariables>;
export function useCreateNotification(dc: DataConnect, options?: useDataConnectMutationOptions<CreateNotificationData, FirebaseError, CreateNotificationVariables>): UseDataConnectMutationResult<CreateNotificationData, CreateNotificationVariables>;

export function useUpdateNotification(options?: useDataConnectMutationOptions<UpdateNotificationData, FirebaseError, UpdateNotificationVariables>): UseDataConnectMutationResult<UpdateNotificationData, UpdateNotificationVariables>;
export function useUpdateNotification(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateNotificationData, FirebaseError, UpdateNotificationVariables>): UseDataConnectMutationResult<UpdateNotificationData, UpdateNotificationVariables>;

export function useDeleteNotification(options?: useDataConnectMutationOptions<DeleteNotificationData, FirebaseError, DeleteNotificationVariables>): UseDataConnectMutationResult<DeleteNotificationData, DeleteNotificationVariables>;
export function useDeleteNotification(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteNotificationData, FirebaseError, DeleteNotificationVariables>): UseDataConnectMutationResult<DeleteNotificationData, DeleteNotificationVariables>;

export function useCreateTask(options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;
export function useCreateTask(dc: DataConnect, options?: useDataConnectMutationOptions<CreateTaskData, FirebaseError, CreateTaskVariables>): UseDataConnectMutationResult<CreateTaskData, CreateTaskVariables>;

export function useUpdateTask(options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;
export function useUpdateTask(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateTaskData, FirebaseError, UpdateTaskVariables>): UseDataConnectMutationResult<UpdateTaskData, UpdateTaskVariables>;

export function useDeleteTask(options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;
export function useDeleteTask(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteTaskData, FirebaseError, DeleteTaskVariables>): UseDataConnectMutationResult<DeleteTaskData, DeleteTaskVariables>;

export function useListTenants(options?: useDataConnectQueryOptions<ListTenantsData>): UseDataConnectQueryResult<ListTenantsData, undefined>;
export function useListTenants(dc: DataConnect, options?: useDataConnectQueryOptions<ListTenantsData>): UseDataConnectQueryResult<ListTenantsData, undefined>;

export function useListBusinesses(vars: ListBusinessesVariables, options?: useDataConnectQueryOptions<ListBusinessesData>): UseDataConnectQueryResult<ListBusinessesData, ListBusinessesVariables>;
export function useListBusinesses(dc: DataConnect, vars: ListBusinessesVariables, options?: useDataConnectQueryOptions<ListBusinessesData>): UseDataConnectQueryResult<ListBusinessesData, ListBusinessesVariables>;

export function useGetUserByEmail(vars: GetUserByEmailVariables, options?: useDataConnectQueryOptions<GetUserByEmailData>): UseDataConnectQueryResult<GetUserByEmailData, GetUserByEmailVariables>;
export function useGetUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: useDataConnectQueryOptions<GetUserByEmailData>): UseDataConnectQueryResult<GetUserByEmailData, GetUserByEmailVariables>;

export function useListProductsByBusiness(vars: ListProductsByBusinessVariables, options?: useDataConnectQueryOptions<ListProductsByBusinessData>): UseDataConnectQueryResult<ListProductsByBusinessData, ListProductsByBusinessVariables>;
export function useListProductsByBusiness(dc: DataConnect, vars: ListProductsByBusinessVariables, options?: useDataConnectQueryOptions<ListProductsByBusinessData>): UseDataConnectQueryResult<ListProductsByBusinessData, ListProductsByBusinessVariables>;

export function useListCustomersByBusiness(vars: ListCustomersByBusinessVariables, options?: useDataConnectQueryOptions<ListCustomersByBusinessData>): UseDataConnectQueryResult<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;
export function useListCustomersByBusiness(dc: DataConnect, vars: ListCustomersByBusinessVariables, options?: useDataConnectQueryOptions<ListCustomersByBusinessData>): UseDataConnectQueryResult<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;

export function useListUsersByBusiness(vars: ListUsersByBusinessVariables, options?: useDataConnectQueryOptions<ListUsersByBusinessData>): UseDataConnectQueryResult<ListUsersByBusinessData, ListUsersByBusinessVariables>;
export function useListUsersByBusiness(dc: DataConnect, vars: ListUsersByBusinessVariables, options?: useDataConnectQueryOptions<ListUsersByBusinessData>): UseDataConnectQueryResult<ListUsersByBusinessData, ListUsersByBusinessVariables>;

export function useListSuppliersByBusiness(vars: ListSuppliersByBusinessVariables, options?: useDataConnectQueryOptions<ListSuppliersByBusinessData>): UseDataConnectQueryResult<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;
export function useListSuppliersByBusiness(dc: DataConnect, vars: ListSuppliersByBusinessVariables, options?: useDataConnectQueryOptions<ListSuppliersByBusinessData>): UseDataConnectQueryResult<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;

export function useListTasksByBusiness(vars: ListTasksByBusinessVariables, options?: useDataConnectQueryOptions<ListTasksByBusinessData>): UseDataConnectQueryResult<ListTasksByBusinessData, ListTasksByBusinessVariables>;
export function useListTasksByBusiness(dc: DataConnect, vars: ListTasksByBusinessVariables, options?: useDataConnectQueryOptions<ListTasksByBusinessData>): UseDataConnectQueryResult<ListTasksByBusinessData, ListTasksByBusinessVariables>;

export function useListTransactionsByBusiness(vars: ListTransactionsByBusinessVariables, options?: useDataConnectQueryOptions<ListTransactionsByBusinessData>): UseDataConnectQueryResult<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;
export function useListTransactionsByBusiness(dc: DataConnect, vars: ListTransactionsByBusinessVariables, options?: useDataConnectQueryOptions<ListTransactionsByBusinessData>): UseDataConnectQueryResult<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;

export function useListTransactionsByType(vars: ListTransactionsByTypeVariables, options?: useDataConnectQueryOptions<ListTransactionsByTypeData>): UseDataConnectQueryResult<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;
export function useListTransactionsByType(dc: DataConnect, vars: ListTransactionsByTypeVariables, options?: useDataConnectQueryOptions<ListTransactionsByTypeData>): UseDataConnectQueryResult<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;

export function useListEmployeesByBusiness(vars: ListEmployeesByBusinessVariables, options?: useDataConnectQueryOptions<ListEmployeesByBusinessData>): UseDataConnectQueryResult<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;
export function useListEmployeesByBusiness(dc: DataConnect, vars: ListEmployeesByBusinessVariables, options?: useDataConnectQueryOptions<ListEmployeesByBusinessData>): UseDataConnectQueryResult<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;

export function useListDocumentsByBusiness(vars: ListDocumentsByBusinessVariables, options?: useDataConnectQueryOptions<ListDocumentsByBusinessData>): UseDataConnectQueryResult<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;
export function useListDocumentsByBusiness(dc: DataConnect, vars: ListDocumentsByBusinessVariables, options?: useDataConnectQueryOptions<ListDocumentsByBusinessData>): UseDataConnectQueryResult<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;

export function useListActivityLogsByUser(vars: ListActivityLogsByUserVariables, options?: useDataConnectQueryOptions<ListActivityLogsByUserData>): UseDataConnectQueryResult<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;
export function useListActivityLogsByUser(dc: DataConnect, vars: ListActivityLogsByUserVariables, options?: useDataConnectQueryOptions<ListActivityLogsByUserData>): UseDataConnectQueryResult<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;

export function useListActivityLogsByBusiness(vars: ListActivityLogsByBusinessVariables, options?: useDataConnectQueryOptions<ListActivityLogsByBusinessData>): UseDataConnectQueryResult<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;
export function useListActivityLogsByBusiness(dc: DataConnect, vars: ListActivityLogsByBusinessVariables, options?: useDataConnectQueryOptions<ListActivityLogsByBusinessData>): UseDataConnectQueryResult<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;
