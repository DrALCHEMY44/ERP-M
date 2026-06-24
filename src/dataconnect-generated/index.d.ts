import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
};

export enum TaskStatus {
  PENDING = "PENDING",
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  LATE = "LATE",
};

export enum TransactionType {
  SALE = "SALE",
  EXPENSE = "EXPENSE",
};



export interface ActivityLog_Key {
  id: string;
  __typename?: 'ActivityLog_Key';
}

export interface AiQuery_Key {
  id: string;
  __typename?: 'AiQuery_Key';
}

export interface Business_Key {
  id: string;
  __typename?: 'Business_Key';
}

export interface CreateActivityLogData {
  activityLog_insert: ActivityLog_Key;
}

export interface CreateActivityLogVariables {
  tenantId: string;
  businessId: string;
  userId: string;
  userName: string;
  actionType: string;
  module: string;
  description?: string | null;
  recordId?: string | null;
}

export interface CreateAiQueryData {
  aiQuery_insert: AiQuery_Key;
}

export interface CreateAiQueryVariables {
  tenantId: string;
  businessId: string;
  userId: string;
  queryText: string;
  response?: string | null;
}

export interface CreateBusinessData {
  business_insert: Business_Key;
}

export interface CreateBusinessVariables {
  tenantId: string;
  name: string;
  location: string;
  businessType?: string | null;
  region?: string | null;
}

export interface CreateCustomerData {
  customer_insert: Customer_Key;
}

export interface CreateCustomerVariables {
  tenantId: string;
  businessId: string;
  customerName: string;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface CreateDocumentData {
  document_insert: Document_Key;
}

export interface CreateDocumentVariables {
  tenantId: string;
  businessId: string;
  title: string;
  documentType: string;
  fileUrl: string;
  uploadedBy: string;
}

export interface CreateEmployeeData {
  employee_insert: Employee_Key;
}

export interface CreateEmployeeVariables {
  tenantId: string;
  businessId: string;
  fullName: string;
  position: string;
  salary?: number | null;
  department?: string | null;
  startDate?: DateString | null;
  status?: string | null;
}

export interface CreateNotificationData {
  notification_insert: Notification_Key;
}

export interface CreateNotificationVariables {
  tenantId: string;
  businessId: string;
  userId: string;
  message: string;
  isRead: boolean;
}

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  tenantId: string;
  businessId: string;
  name: string;
  category?: string | null;
  quantity: number;
  costPrice?: number | null;
  sellingPrice: number;
  expiryDate?: DateString | null;
  lowStockLevel?: number | null;
  createdBy: string;
}

export interface CreateSupplierData {
  supplier_insert: Supplier_Key;
}

export interface CreateSupplierVariables {
  tenantId: string;
  businessId: string;
  supplierName: string;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface CreateTaskCommentData {
  taskComment_insert: TaskComment_Key;
}

export interface CreateTaskCommentVariables {
  tenantId: string;
  businessId: string;
  taskId: string;
  userId: string;
  content: string;
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  tenantId: string;
  businessId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: TaskPriority | null;
  dueDate: TimestampString;
  assignedToId?: string | null;
  createdBy: string;
}

export interface CreateTenantData {
  tenant_insert: Tenant_Key;
}

export interface CreateTenantVariables {
  name: string;
  businessSector: string;
  location: string;
  ownerEmail: string;
  taxId?: string | null;
  logoUrl?: string | null;
  subscriptionTier?: string | null;
}

export interface CreateTransactionData {
  transaction_insert: Transaction_Key;
}

export interface CreateTransactionVariables {
  tenantId: string;
  businessId: string;
  type: TransactionType;
  amount: number;
  date: TimestampString;
  category?: string | null;
  receiptUrl?: string | null;
  recordedBy: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  tenantId: string;
  businessId: string;
  email: string;
  role: string;
  fullName?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
}

export interface Customer_Key {
  id: string;
  __typename?: 'Customer_Key';
}

export interface DeleteActivityLogData {
  activityLog_delete?: ActivityLog_Key | null;
}

export interface DeleteActivityLogVariables {
  id: string;
}

export interface DeleteAiQueryData {
  aiQuery_delete?: AiQuery_Key | null;
}

export interface DeleteAiQueryVariables {
  id: string;
}

export interface DeleteBusinessData {
  business_delete?: Business_Key | null;
}

export interface DeleteBusinessVariables {
  id: string;
}

export interface DeleteCustomerData {
  customer_delete?: Customer_Key | null;
}

export interface DeleteCustomerVariables {
  id: string;
}

export interface DeleteDocumentData {
  document_delete?: Document_Key | null;
}

export interface DeleteDocumentVariables {
  id: string;
}

export interface DeleteEmployeeData {
  employee_delete?: Employee_Key | null;
}

export interface DeleteEmployeeVariables {
  id: string;
}

export interface DeleteNotificationData {
  notification_delete?: Notification_Key | null;
}

export interface DeleteNotificationVariables {
  id: string;
}

export interface DeleteProductData {
  product_delete?: Product_Key | null;
}

export interface DeleteProductVariables {
  id: string;
}

export interface DeleteSupplierData {
  supplier_delete?: Supplier_Key | null;
}

export interface DeleteSupplierVariables {
  id: string;
}

export interface DeleteTaskCommentData {
  taskComment_delete?: TaskComment_Key | null;
}

export interface DeleteTaskCommentVariables {
  id: string;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: string;
}

export interface DeleteTenantData {
  tenant_delete?: Tenant_Key | null;
}

export interface DeleteTenantVariables {
  id: string;
}

export interface DeleteTransactionData {
  transaction_delete?: Transaction_Key | null;
}

export interface DeleteTransactionVariables {
  id: string;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface DeleteUserVariables {
  id: string;
}

export interface Document_Key {
  id: string;
  __typename?: 'Document_Key';
}

export interface Employee_Key {
  id: string;
  __typename?: 'Employee_Key';
}

export interface GetUserByEmailData {
  users: ({
    id: string;
    email: string;
    role: string;
    department?: string | null;
    phoneNumber?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
    fullName?: string | null;
  } & User_Key)[];
}

export interface GetUserByEmailVariables {
  email: string;
}

export interface ListActivityLogsByBusinessData {
  activityLogs: ({
    id: string;
    tenantId: string;
    businessId: string;
    userId: string;
    userName: string;
    actionType: string;
    module: string;
    description?: string | null;
    recordId?: string | null;
    timestamp: TimestampString;
  } & ActivityLog_Key)[];
}

export interface ListActivityLogsByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListActivityLogsByUserData {
  activityLogs: ({
    id: string;
    tenantId: string;
    businessId: string;
    userId: string;
    userName: string;
    actionType: string;
    module: string;
    description?: string | null;
    recordId?: string | null;
    timestamp: TimestampString;
  } & ActivityLog_Key)[];
}

export interface ListActivityLogsByUserVariables {
  tenantId: string;
  businessId: string;
  userId: string;
}

export interface ListBusinessesData {
  businesses: ({
    id: string;
    name: string;
    location: string;
  } & Business_Key)[];
}

export interface ListBusinessesVariables {
  tenantId: string;
}

export interface ListCustomersByBusinessData {
  customers: ({
    id: string;
    customerName: string;
    phoneNumber?: string | null;
    email?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Customer_Key)[];
}

export interface ListCustomersByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListDocumentsByBusinessData {
  documents: ({
    id: string;
    title: string;
    documentType: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Document_Key)[];
}

export interface ListDocumentsByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListEmployeesByBusinessData {
  employees: ({
    id: string;
    fullName: string;
    position: string;
    salary?: number | null;
    department?: string | null;
    startDate?: DateString | null;
    status?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Employee_Key)[];
}

export interface ListEmployeesByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListProductsByBusinessData {
  products: ({
    id: string;
    name: string;
    category?: string | null;
    quantity: number;
    costPrice?: number | null;
    sellingPrice: number;
    expiryDate?: DateString | null;
    lowStockLevel?: number | null;
    createdBy: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    tenantId: string;
    businessId: string;
  } & Product_Key)[];
}

export interface ListProductsByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListSuppliersByBusinessData {
  suppliers: ({
    id: string;
    supplierName: string;
    phoneNumber?: string | null;
    email?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Supplier_Key)[];
}

export interface ListSuppliersByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListTasksByBusinessData {
  tasks: ({
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority?: TaskPriority | null;
    dueDate: TimestampString;
    assignedTo?: {
      id: string;
      email: string;
      role: string;
    } & User_Key;
    createdBy: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    tenantId: string;
    businessId: string;
  } & Task_Key)[];
}

export interface ListTasksByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListTenantsData {
  tenants: ({
    id: string;
    name: string;
    businessSector: string;
  } & Tenant_Key)[];
}

export interface ListTransactionsByBusinessData {
  transactions: ({
    id: string;
    type: TransactionType;
    amount: number;
    date: TimestampString;
    category?: string | null;
    receiptUrl?: string | null;
    recordedBy: string;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Transaction_Key)[];
}

export interface ListTransactionsByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListTransactionsByTypeData {
  transactions: ({
    id: string;
    type: TransactionType;
    amount: number;
    date: TimestampString;
    category?: string | null;
    receiptUrl?: string | null;
    recordedBy: string;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Transaction_Key)[];
}

export interface ListTransactionsByTypeVariables {
  tenantId: string;
  businessId: string;
  type: TransactionType;
}

export interface Notification_Key {
  id: string;
  __typename?: 'Notification_Key';
}

export interface Product_Key {
  id: string;
  __typename?: 'Product_Key';
}

export interface Supplier_Key {
  id: string;
  __typename?: 'Supplier_Key';
}

export interface TaskComment_Key {
  id: string;
  __typename?: 'TaskComment_Key';
}

export interface Task_Key {
  id: string;
  __typename?: 'Task_Key';
}

export interface Tenant_Key {
  id: string;
  __typename?: 'Tenant_Key';
}

export interface Transaction_Key {
  id: string;
  __typename?: 'Transaction_Key';
}

export interface UpdateActivityLogData {
  activityLog_update?: ActivityLog_Key | null;
}

export interface UpdateActivityLogVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  userId?: string | null;
  userName?: string | null;
  actionType?: string | null;
  module?: string | null;
  description?: string | null;
  recordId?: string | null;
}

export interface UpdateAiQueryData {
  aiQuery_update?: AiQuery_Key | null;
}

export interface UpdateAiQueryVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  userId?: string | null;
  queryText?: string | null;
  response?: string | null;
}

export interface UpdateBusinessData {
  business_update?: Business_Key | null;
}

export interface UpdateBusinessVariables {
  id: string;
  tenantId?: string | null;
  name?: string | null;
  location?: string | null;
  businessType?: string | null;
  region?: string | null;
}

export interface UpdateCustomerData {
  customer_update?: Customer_Key | null;
}

export interface UpdateCustomerVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  customerName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface UpdateDocumentData {
  document_update?: Document_Key | null;
}

export interface UpdateDocumentVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  title?: string | null;
  documentType?: string | null;
  fileUrl?: string | null;
  uploadedBy?: string | null;
}

export interface UpdateEmployeeData {
  employee_update?: Employee_Key | null;
}

export interface UpdateEmployeeVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  fullName?: string | null;
  position?: string | null;
  salary?: number | null;
  department?: string | null;
  startDate?: DateString | null;
  status?: string | null;
}

export interface UpdateNotificationData {
  notification_update?: Notification_Key | null;
}

export interface UpdateNotificationVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  userId?: string | null;
  message?: string | null;
  isRead?: boolean | null;
}

export interface UpdateProductData {
  product_update?: Product_Key | null;
}

export interface UpdateProductVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  name?: string | null;
  category?: string | null;
  quantity?: number | null;
  costPrice?: number | null;
  sellingPrice?: number | null;
  expiryDate?: DateString | null;
  lowStockLevel?: number | null;
  createdBy?: string | null;
}

export interface UpdateSupplierData {
  supplier_update?: Supplier_Key | null;
}

export interface UpdateSupplierVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  supplierName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface UpdateTaskCommentData {
  taskComment_update?: TaskComment_Key | null;
}

export interface UpdateTaskCommentVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  taskId?: string | null;
  userId?: string | null;
  content?: string | null;
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
  priority?: TaskPriority | null;
  dueDate?: TimestampString | null;
  assignedToId?: string | null;
}

export interface UpdateTenantData {
  tenant_update?: Tenant_Key | null;
}

export interface UpdateTenantVariables {
  id: string;
  name?: string | null;
  businessSector?: string | null;
  location?: string | null;
  ownerEmail?: string | null;
  taxId?: string | null;
  logoUrl?: string | null;
  subscriptionTier?: string | null;
}

export interface UpdateTransactionData {
  transaction_update?: Transaction_Key | null;
}

export interface UpdateTransactionVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  type?: TransactionType | null;
  amount?: number | null;
  date?: TimestampString | null;
  category?: string | null;
  receiptUrl?: string | null;
  recordedBy?: string | null;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface UpdateUserVariables {
  id: string;
  tenantId?: string | null;
  businessId?: string | null;
  email?: string | null;
  role?: string | null;
  fullName?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateTenantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTenantVariables): MutationRef<CreateTenantData, CreateTenantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTenantVariables): MutationRef<CreateTenantData, CreateTenantVariables>;
  operationName: string;
}
export const createTenantRef: CreateTenantRef;

export function createTenant(vars: CreateTenantVariables): MutationPromise<CreateTenantData, CreateTenantVariables>;
export function createTenant(dc: DataConnect, vars: CreateTenantVariables): MutationPromise<CreateTenantData, CreateTenantVariables>;

interface UpdateTenantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTenantVariables): MutationRef<UpdateTenantData, UpdateTenantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTenantVariables): MutationRef<UpdateTenantData, UpdateTenantVariables>;
  operationName: string;
}
export const updateTenantRef: UpdateTenantRef;

export function updateTenant(vars: UpdateTenantVariables): MutationPromise<UpdateTenantData, UpdateTenantVariables>;
export function updateTenant(dc: DataConnect, vars: UpdateTenantVariables): MutationPromise<UpdateTenantData, UpdateTenantVariables>;

interface DeleteTenantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTenantVariables): MutationRef<DeleteTenantData, DeleteTenantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTenantVariables): MutationRef<DeleteTenantData, DeleteTenantVariables>;
  operationName: string;
}
export const deleteTenantRef: DeleteTenantRef;

export function deleteTenant(vars: DeleteTenantVariables): MutationPromise<DeleteTenantData, DeleteTenantVariables>;
export function deleteTenant(dc: DataConnect, vars: DeleteTenantVariables): MutationPromise<DeleteTenantData, DeleteTenantVariables>;

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserVariables): MutationRef<UpdateUserData, UpdateUserVariables>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;
export function updateUser(dc: DataConnect, vars: UpdateUserVariables): MutationPromise<UpdateUserData, UpdateUserVariables>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserVariables): MutationRef<DeleteUserData, DeleteUserVariables>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;
export function deleteUser(dc: DataConnect, vars: DeleteUserVariables): MutationPromise<DeleteUserData, DeleteUserVariables>;

interface CreateBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
  operationName: string;
}
export const createBusinessRef: CreateBusinessRef;

export function createBusiness(vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;
export function createBusiness(dc: DataConnect, vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface UpdateBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
  operationName: string;
}
export const updateBusinessRef: UpdateBusinessRef;

export function updateBusiness(vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;
export function updateBusiness(dc: DataConnect, vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;

interface DeleteBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
  operationName: string;
}
export const deleteBusinessRef: DeleteBusinessRef;

export function deleteBusiness(vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;
export function deleteBusiness(dc: DataConnect, vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;

interface CreateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateProductVariables): MutationRef<CreateProductData, CreateProductVariables>;
  operationName: string;
}
export const createProductRef: CreateProductRef;

export function createProduct(vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;
export function createProduct(dc: DataConnect, vars: CreateProductVariables): MutationPromise<CreateProductData, CreateProductVariables>;

interface UpdateProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateProductVariables): MutationRef<UpdateProductData, UpdateProductVariables>;
  operationName: string;
}
export const updateProductRef: UpdateProductRef;

export function updateProduct(vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;
export function updateProduct(dc: DataConnect, vars: UpdateProductVariables): MutationPromise<UpdateProductData, UpdateProductVariables>;

interface DeleteProductRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteProductVariables): MutationRef<DeleteProductData, DeleteProductVariables>;
  operationName: string;
}
export const deleteProductRef: DeleteProductRef;

export function deleteProduct(vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;
export function deleteProduct(dc: DataConnect, vars: DeleteProductVariables): MutationPromise<DeleteProductData, DeleteProductVariables>;

interface CreateTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTransactionVariables): MutationRef<CreateTransactionData, CreateTransactionVariables>;
  operationName: string;
}
export const createTransactionRef: CreateTransactionRef;

export function createTransaction(vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;
export function createTransaction(dc: DataConnect, vars: CreateTransactionVariables): MutationPromise<CreateTransactionData, CreateTransactionVariables>;

interface UpdateTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTransactionVariables): MutationRef<UpdateTransactionData, UpdateTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTransactionVariables): MutationRef<UpdateTransactionData, UpdateTransactionVariables>;
  operationName: string;
}
export const updateTransactionRef: UpdateTransactionRef;

export function updateTransaction(vars: UpdateTransactionVariables): MutationPromise<UpdateTransactionData, UpdateTransactionVariables>;
export function updateTransaction(dc: DataConnect, vars: UpdateTransactionVariables): MutationPromise<UpdateTransactionData, UpdateTransactionVariables>;

interface DeleteTransactionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTransactionVariables): MutationRef<DeleteTransactionData, DeleteTransactionVariables>;
  operationName: string;
}
export const deleteTransactionRef: DeleteTransactionRef;

export function deleteTransaction(vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;
export function deleteTransaction(dc: DataConnect, vars: DeleteTransactionVariables): MutationPromise<DeleteTransactionData, DeleteTransactionVariables>;

interface CreateTaskCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskCommentVariables): MutationRef<CreateTaskCommentData, CreateTaskCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskCommentVariables): MutationRef<CreateTaskCommentData, CreateTaskCommentVariables>;
  operationName: string;
}
export const createTaskCommentRef: CreateTaskCommentRef;

export function createTaskComment(vars: CreateTaskCommentVariables): MutationPromise<CreateTaskCommentData, CreateTaskCommentVariables>;
export function createTaskComment(dc: DataConnect, vars: CreateTaskCommentVariables): MutationPromise<CreateTaskCommentData, CreateTaskCommentVariables>;

interface UpdateTaskCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskCommentVariables): MutationRef<UpdateTaskCommentData, UpdateTaskCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskCommentVariables): MutationRef<UpdateTaskCommentData, UpdateTaskCommentVariables>;
  operationName: string;
}
export const updateTaskCommentRef: UpdateTaskCommentRef;

export function updateTaskComment(vars: UpdateTaskCommentVariables): MutationPromise<UpdateTaskCommentData, UpdateTaskCommentVariables>;
export function updateTaskComment(dc: DataConnect, vars: UpdateTaskCommentVariables): MutationPromise<UpdateTaskCommentData, UpdateTaskCommentVariables>;

interface DeleteTaskCommentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskCommentVariables): MutationRef<DeleteTaskCommentData, DeleteTaskCommentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTaskCommentVariables): MutationRef<DeleteTaskCommentData, DeleteTaskCommentVariables>;
  operationName: string;
}
export const deleteTaskCommentRef: DeleteTaskCommentRef;

export function deleteTaskComment(vars: DeleteTaskCommentVariables): MutationPromise<DeleteTaskCommentData, DeleteTaskCommentVariables>;
export function deleteTaskComment(dc: DataConnect, vars: DeleteTaskCommentVariables): MutationPromise<DeleteTaskCommentData, DeleteTaskCommentVariables>;

interface CreateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEmployeeVariables): MutationRef<CreateEmployeeData, CreateEmployeeVariables>;
  operationName: string;
}
export const createEmployeeRef: CreateEmployeeRef;

export function createEmployee(vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;
export function createEmployee(dc: DataConnect, vars: CreateEmployeeVariables): MutationPromise<CreateEmployeeData, CreateEmployeeVariables>;

interface UpdateEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEmployeeVariables): MutationRef<UpdateEmployeeData, UpdateEmployeeVariables>;
  operationName: string;
}
export const updateEmployeeRef: UpdateEmployeeRef;

export function updateEmployee(vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;
export function updateEmployee(dc: DataConnect, vars: UpdateEmployeeVariables): MutationPromise<UpdateEmployeeData, UpdateEmployeeVariables>;

interface DeleteEmployeeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEmployeeVariables): MutationRef<DeleteEmployeeData, DeleteEmployeeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEmployeeVariables): MutationRef<DeleteEmployeeData, DeleteEmployeeVariables>;
  operationName: string;
}
export const deleteEmployeeRef: DeleteEmployeeRef;

export function deleteEmployee(vars: DeleteEmployeeVariables): MutationPromise<DeleteEmployeeData, DeleteEmployeeVariables>;
export function deleteEmployee(dc: DataConnect, vars: DeleteEmployeeVariables): MutationPromise<DeleteEmployeeData, DeleteEmployeeVariables>;

interface CreateCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateCustomerVariables): MutationRef<CreateCustomerData, CreateCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateCustomerVariables): MutationRef<CreateCustomerData, CreateCustomerVariables>;
  operationName: string;
}
export const createCustomerRef: CreateCustomerRef;

export function createCustomer(vars: CreateCustomerVariables): MutationPromise<CreateCustomerData, CreateCustomerVariables>;
export function createCustomer(dc: DataConnect, vars: CreateCustomerVariables): MutationPromise<CreateCustomerData, CreateCustomerVariables>;

interface UpdateCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCustomerVariables): MutationRef<UpdateCustomerData, UpdateCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCustomerVariables): MutationRef<UpdateCustomerData, UpdateCustomerVariables>;
  operationName: string;
}
export const updateCustomerRef: UpdateCustomerRef;

export function updateCustomer(vars: UpdateCustomerVariables): MutationPromise<UpdateCustomerData, UpdateCustomerVariables>;
export function updateCustomer(dc: DataConnect, vars: UpdateCustomerVariables): MutationPromise<UpdateCustomerData, UpdateCustomerVariables>;

interface DeleteCustomerRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteCustomerVariables): MutationRef<DeleteCustomerData, DeleteCustomerVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteCustomerVariables): MutationRef<DeleteCustomerData, DeleteCustomerVariables>;
  operationName: string;
}
export const deleteCustomerRef: DeleteCustomerRef;

export function deleteCustomer(vars: DeleteCustomerVariables): MutationPromise<DeleteCustomerData, DeleteCustomerVariables>;
export function deleteCustomer(dc: DataConnect, vars: DeleteCustomerVariables): MutationPromise<DeleteCustomerData, DeleteCustomerVariables>;

interface CreateSupplierRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateSupplierVariables): MutationRef<CreateSupplierData, CreateSupplierVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateSupplierVariables): MutationRef<CreateSupplierData, CreateSupplierVariables>;
  operationName: string;
}
export const createSupplierRef: CreateSupplierRef;

export function createSupplier(vars: CreateSupplierVariables): MutationPromise<CreateSupplierData, CreateSupplierVariables>;
export function createSupplier(dc: DataConnect, vars: CreateSupplierVariables): MutationPromise<CreateSupplierData, CreateSupplierVariables>;

interface UpdateSupplierRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateSupplierVariables): MutationRef<UpdateSupplierData, UpdateSupplierVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateSupplierVariables): MutationRef<UpdateSupplierData, UpdateSupplierVariables>;
  operationName: string;
}
export const updateSupplierRef: UpdateSupplierRef;

export function updateSupplier(vars: UpdateSupplierVariables): MutationPromise<UpdateSupplierData, UpdateSupplierVariables>;
export function updateSupplier(dc: DataConnect, vars: UpdateSupplierVariables): MutationPromise<UpdateSupplierData, UpdateSupplierVariables>;

interface DeleteSupplierRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteSupplierVariables): MutationRef<DeleteSupplierData, DeleteSupplierVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteSupplierVariables): MutationRef<DeleteSupplierData, DeleteSupplierVariables>;
  operationName: string;
}
export const deleteSupplierRef: DeleteSupplierRef;

export function deleteSupplier(vars: DeleteSupplierVariables): MutationPromise<DeleteSupplierData, DeleteSupplierVariables>;
export function deleteSupplier(dc: DataConnect, vars: DeleteSupplierVariables): MutationPromise<DeleteSupplierData, DeleteSupplierVariables>;

interface CreateDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateDocumentVariables): MutationRef<CreateDocumentData, CreateDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateDocumentVariables): MutationRef<CreateDocumentData, CreateDocumentVariables>;
  operationName: string;
}
export const createDocumentRef: CreateDocumentRef;

export function createDocument(vars: CreateDocumentVariables): MutationPromise<CreateDocumentData, CreateDocumentVariables>;
export function createDocument(dc: DataConnect, vars: CreateDocumentVariables): MutationPromise<CreateDocumentData, CreateDocumentVariables>;

interface UpdateDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateDocumentVariables): MutationRef<UpdateDocumentData, UpdateDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateDocumentVariables): MutationRef<UpdateDocumentData, UpdateDocumentVariables>;
  operationName: string;
}
export const updateDocumentRef: UpdateDocumentRef;

export function updateDocument(vars: UpdateDocumentVariables): MutationPromise<UpdateDocumentData, UpdateDocumentVariables>;
export function updateDocument(dc: DataConnect, vars: UpdateDocumentVariables): MutationPromise<UpdateDocumentData, UpdateDocumentVariables>;

interface DeleteDocumentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteDocumentVariables): MutationRef<DeleteDocumentData, DeleteDocumentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteDocumentVariables): MutationRef<DeleteDocumentData, DeleteDocumentVariables>;
  operationName: string;
}
export const deleteDocumentRef: DeleteDocumentRef;

export function deleteDocument(vars: DeleteDocumentVariables): MutationPromise<DeleteDocumentData, DeleteDocumentVariables>;
export function deleteDocument(dc: DataConnect, vars: DeleteDocumentVariables): MutationPromise<DeleteDocumentData, DeleteDocumentVariables>;

interface CreateActivityLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateActivityLogVariables): MutationRef<CreateActivityLogData, CreateActivityLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateActivityLogVariables): MutationRef<CreateActivityLogData, CreateActivityLogVariables>;
  operationName: string;
}
export const createActivityLogRef: CreateActivityLogRef;

export function createActivityLog(vars: CreateActivityLogVariables): MutationPromise<CreateActivityLogData, CreateActivityLogVariables>;
export function createActivityLog(dc: DataConnect, vars: CreateActivityLogVariables): MutationPromise<CreateActivityLogData, CreateActivityLogVariables>;

interface UpdateActivityLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateActivityLogVariables): MutationRef<UpdateActivityLogData, UpdateActivityLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateActivityLogVariables): MutationRef<UpdateActivityLogData, UpdateActivityLogVariables>;
  operationName: string;
}
export const updateActivityLogRef: UpdateActivityLogRef;

export function updateActivityLog(vars: UpdateActivityLogVariables): MutationPromise<UpdateActivityLogData, UpdateActivityLogVariables>;
export function updateActivityLog(dc: DataConnect, vars: UpdateActivityLogVariables): MutationPromise<UpdateActivityLogData, UpdateActivityLogVariables>;

interface DeleteActivityLogRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteActivityLogVariables): MutationRef<DeleteActivityLogData, DeleteActivityLogVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteActivityLogVariables): MutationRef<DeleteActivityLogData, DeleteActivityLogVariables>;
  operationName: string;
}
export const deleteActivityLogRef: DeleteActivityLogRef;

export function deleteActivityLog(vars: DeleteActivityLogVariables): MutationPromise<DeleteActivityLogData, DeleteActivityLogVariables>;
export function deleteActivityLog(dc: DataConnect, vars: DeleteActivityLogVariables): MutationPromise<DeleteActivityLogData, DeleteActivityLogVariables>;

interface CreateAiQueryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAiQueryVariables): MutationRef<CreateAiQueryData, CreateAiQueryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAiQueryVariables): MutationRef<CreateAiQueryData, CreateAiQueryVariables>;
  operationName: string;
}
export const createAiQueryRef: CreateAiQueryRef;

export function createAiQuery(vars: CreateAiQueryVariables): MutationPromise<CreateAiQueryData, CreateAiQueryVariables>;
export function createAiQuery(dc: DataConnect, vars: CreateAiQueryVariables): MutationPromise<CreateAiQueryData, CreateAiQueryVariables>;

interface UpdateAiQueryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAiQueryVariables): MutationRef<UpdateAiQueryData, UpdateAiQueryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAiQueryVariables): MutationRef<UpdateAiQueryData, UpdateAiQueryVariables>;
  operationName: string;
}
export const updateAiQueryRef: UpdateAiQueryRef;

export function updateAiQuery(vars: UpdateAiQueryVariables): MutationPromise<UpdateAiQueryData, UpdateAiQueryVariables>;
export function updateAiQuery(dc: DataConnect, vars: UpdateAiQueryVariables): MutationPromise<UpdateAiQueryData, UpdateAiQueryVariables>;

interface DeleteAiQueryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAiQueryVariables): MutationRef<DeleteAiQueryData, DeleteAiQueryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAiQueryVariables): MutationRef<DeleteAiQueryData, DeleteAiQueryVariables>;
  operationName: string;
}
export const deleteAiQueryRef: DeleteAiQueryRef;

export function deleteAiQuery(vars: DeleteAiQueryVariables): MutationPromise<DeleteAiQueryData, DeleteAiQueryVariables>;
export function deleteAiQuery(dc: DataConnect, vars: DeleteAiQueryVariables): MutationPromise<DeleteAiQueryData, DeleteAiQueryVariables>;

interface CreateNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateNotificationVariables): MutationRef<CreateNotificationData, CreateNotificationVariables>;
  operationName: string;
}
export const createNotificationRef: CreateNotificationRef;

export function createNotification(vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;
export function createNotification(dc: DataConnect, vars: CreateNotificationVariables): MutationPromise<CreateNotificationData, CreateNotificationVariables>;

interface UpdateNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateNotificationVariables): MutationRef<UpdateNotificationData, UpdateNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateNotificationVariables): MutationRef<UpdateNotificationData, UpdateNotificationVariables>;
  operationName: string;
}
export const updateNotificationRef: UpdateNotificationRef;

export function updateNotification(vars: UpdateNotificationVariables): MutationPromise<UpdateNotificationData, UpdateNotificationVariables>;
export function updateNotification(dc: DataConnect, vars: UpdateNotificationVariables): MutationPromise<UpdateNotificationData, UpdateNotificationVariables>;

interface DeleteNotificationRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteNotificationVariables): MutationRef<DeleteNotificationData, DeleteNotificationVariables>;
  operationName: string;
}
export const deleteNotificationRef: DeleteNotificationRef;

export function deleteNotification(vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;
export function deleteNotification(dc: DataConnect, vars: DeleteNotificationVariables): MutationPromise<DeleteNotificationData, DeleteNotificationVariables>;

interface CreateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTaskVariables): MutationRef<CreateTaskData, CreateTaskVariables>;
  operationName: string;
}
export const createTaskRef: CreateTaskRef;

export function createTask(vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;
export function createTask(dc: DataConnect, vars: CreateTaskVariables): MutationPromise<CreateTaskData, CreateTaskVariables>;

interface UpdateTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateTaskVariables): MutationRef<UpdateTaskData, UpdateTaskVariables>;
  operationName: string;
}
export const updateTaskRef: UpdateTaskRef;

export function updateTask(vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;
export function updateTask(dc: DataConnect, vars: UpdateTaskVariables): MutationPromise<UpdateTaskData, UpdateTaskVariables>;

interface DeleteTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTaskVariables): MutationRef<DeleteTaskData, DeleteTaskVariables>;
  operationName: string;
}
export const deleteTaskRef: DeleteTaskRef;

export function deleteTask(vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;
export function deleteTask(dc: DataConnect, vars: DeleteTaskVariables): MutationPromise<DeleteTaskData, DeleteTaskVariables>;

interface ListTenantsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTenantsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTenantsData, undefined>;
  operationName: string;
}
export const listTenantsRef: ListTenantsRef;

export function listTenants(options?: ExecuteQueryOptions): QueryPromise<ListTenantsData, undefined>;
export function listTenants(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListTenantsData, undefined>;

interface ListBusinessesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListBusinessesVariables): QueryRef<ListBusinessesData, ListBusinessesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListBusinessesVariables): QueryRef<ListBusinessesData, ListBusinessesVariables>;
  operationName: string;
}
export const listBusinessesRef: ListBusinessesRef;

export function listBusinesses(vars: ListBusinessesVariables, options?: ExecuteQueryOptions): QueryPromise<ListBusinessesData, ListBusinessesVariables>;
export function listBusinesses(dc: DataConnect, vars: ListBusinessesVariables, options?: ExecuteQueryOptions): QueryPromise<ListBusinessesData, ListBusinessesVariables>;

interface GetUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  operationName: string;
}
export const getUserByEmailRef: GetUserByEmailRef;

export function getUserByEmail(vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;
export function getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface ListProductsByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsByBusinessVariables): QueryRef<ListProductsByBusinessData, ListProductsByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProductsByBusinessVariables): QueryRef<ListProductsByBusinessData, ListProductsByBusinessVariables>;
  operationName: string;
}
export const listProductsByBusinessRef: ListProductsByBusinessRef;

export function listProductsByBusiness(vars: ListProductsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductsByBusinessData, ListProductsByBusinessVariables>;
export function listProductsByBusiness(dc: DataConnect, vars: ListProductsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListProductsByBusinessData, ListProductsByBusinessVariables>;

interface ListCustomersByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCustomersByBusinessVariables): QueryRef<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCustomersByBusinessVariables): QueryRef<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;
  operationName: string;
}
export const listCustomersByBusinessRef: ListCustomersByBusinessRef;

export function listCustomersByBusiness(vars: ListCustomersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;
export function listCustomersByBusiness(dc: DataConnect, vars: ListCustomersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListCustomersByBusinessData, ListCustomersByBusinessVariables>;

interface ListSuppliersByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSuppliersByBusinessVariables): QueryRef<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSuppliersByBusinessVariables): QueryRef<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;
  operationName: string;
}
export const listSuppliersByBusinessRef: ListSuppliersByBusinessRef;

export function listSuppliersByBusiness(vars: ListSuppliersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;
export function listSuppliersByBusiness(dc: DataConnect, vars: ListSuppliersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListSuppliersByBusinessData, ListSuppliersByBusinessVariables>;

interface ListTasksByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTasksByBusinessVariables): QueryRef<ListTasksByBusinessData, ListTasksByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTasksByBusinessVariables): QueryRef<ListTasksByBusinessData, ListTasksByBusinessVariables>;
  operationName: string;
}
export const listTasksByBusinessRef: ListTasksByBusinessRef;

export function listTasksByBusiness(vars: ListTasksByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTasksByBusinessData, ListTasksByBusinessVariables>;
export function listTasksByBusiness(dc: DataConnect, vars: ListTasksByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTasksByBusinessData, ListTasksByBusinessVariables>;

interface ListTransactionsByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsByBusinessVariables): QueryRef<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTransactionsByBusinessVariables): QueryRef<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;
  operationName: string;
}
export const listTransactionsByBusinessRef: ListTransactionsByBusinessRef;

export function listTransactionsByBusiness(vars: ListTransactionsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;
export function listTransactionsByBusiness(dc: DataConnect, vars: ListTransactionsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsByBusinessData, ListTransactionsByBusinessVariables>;

interface ListTransactionsByTypeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsByTypeVariables): QueryRef<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTransactionsByTypeVariables): QueryRef<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;
  operationName: string;
}
export const listTransactionsByTypeRef: ListTransactionsByTypeRef;

export function listTransactionsByType(vars: ListTransactionsByTypeVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;
export function listTransactionsByType(dc: DataConnect, vars: ListTransactionsByTypeVariables, options?: ExecuteQueryOptions): QueryPromise<ListTransactionsByTypeData, ListTransactionsByTypeVariables>;

interface ListEmployeesByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeesByBusinessVariables): QueryRef<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListEmployeesByBusinessVariables): QueryRef<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;
  operationName: string;
}
export const listEmployeesByBusinessRef: ListEmployeesByBusinessRef;

export function listEmployeesByBusiness(vars: ListEmployeesByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;
export function listEmployeesByBusiness(dc: DataConnect, vars: ListEmployeesByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListEmployeesByBusinessData, ListEmployeesByBusinessVariables>;

interface ListDocumentsByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListDocumentsByBusinessVariables): QueryRef<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListDocumentsByBusinessVariables): QueryRef<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;
  operationName: string;
}
export const listDocumentsByBusinessRef: ListDocumentsByBusinessRef;

export function listDocumentsByBusiness(vars: ListDocumentsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;
export function listDocumentsByBusiness(dc: DataConnect, vars: ListDocumentsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListDocumentsByBusinessData, ListDocumentsByBusinessVariables>;

interface ListActivityLogsByUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListActivityLogsByUserVariables): QueryRef<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListActivityLogsByUserVariables): QueryRef<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;
  operationName: string;
}
export const listActivityLogsByUserRef: ListActivityLogsByUserRef;

export function listActivityLogsByUser(vars: ListActivityLogsByUserVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;
export function listActivityLogsByUser(dc: DataConnect, vars: ListActivityLogsByUserVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivityLogsByUserData, ListActivityLogsByUserVariables>;

interface ListActivityLogsByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListActivityLogsByBusinessVariables): QueryRef<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListActivityLogsByBusinessVariables): QueryRef<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;
  operationName: string;
}
export const listActivityLogsByBusinessRef: ListActivityLogsByBusinessRef;

export function listActivityLogsByBusiness(vars: ListActivityLogsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;
export function listActivityLogsByBusiness(dc: DataConnect, vars: ListActivityLogsByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListActivityLogsByBusinessData, ListActivityLogsByBusinessVariables>;

