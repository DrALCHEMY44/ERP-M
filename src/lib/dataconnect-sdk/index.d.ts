import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface ActivityLog_Key {
  id: UUIDString;
  __typename?: 'ActivityLog_Key';
}

export interface AiQuery_Key {
  id: UUIDString;
  __typename?: 'AiQuery_Key';
}

export interface Business_Key {
  id: UUIDString;
  __typename?: 'Business_Key';
}

export interface CreateBusinessData {
  business_insert: Business_Key;
}

export interface CreateBusinessVariables {
  tenantId: UUIDString;
  name: string;
  location: string;
  businessType?: string | null;
  region?: string | null;
}

export interface CreateCustomerData {
  customer_insert: Customer_Key;
}

export interface CreateCustomerVariables {
  tenantId: UUIDString;
  businessId: UUIDString;
  customerName: string;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface CreateEmployeeData {
  employee_insert: Employee_Key;
}

export interface CreateEmployeeVariables {
  tenantId: UUIDString;
  businessId: UUIDString;
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
  tenantId: UUIDString;
  businessId: UUIDString;
  userId: UUIDString;
  message: string;
}

export interface CreateProductData {
  product_insert: Product_Key;
}

export interface CreateProductVariables {
  tenantId: UUIDString;
  businessId: UUIDString;
  name: string;
  category?: string | null;
  quantity: number;
  costPrice?: number | null;
  sellingPrice: number;
  expiryDate?: DateString | null;
  lowStockLevel?: number | null;
  creatorId: UUIDString;
}

export interface CreateSupplierData {
  supplier_insert: Supplier_Key;
}

export interface CreateSupplierVariables {
  tenantId: UUIDString;
  businessId: UUIDString;
  supplierName: string;
  phoneNumber?: string | null;
  email?: string | null;
}

export interface CreateTaskData {
  task_insert: Task_Key;
}

export interface CreateTaskVariables {
  tenantId: UUIDString;
  businessId: UUIDString;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  dueDate: TimestampString;
  assignedToId?: UUIDString | null;
  creatorId: UUIDString;
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
  tenantId: UUIDString;
  businessId: UUIDString;
  type: string;
  amount: number;
  date: TimestampString;
  category?: string | null;
  receiptUrl?: string | null;
  recorderId: UUIDString;
}

export interface Customer_Key {
  id: UUIDString;
  __typename?: 'Customer_Key';
}

export interface DeleteEmployeeData {
  employee_delete?: Employee_Key | null;
}

export interface DeleteEmployeeVariables {
  id: UUIDString;
}

export interface DeleteProductData {
  product_delete?: Product_Key | null;
}

export interface DeleteProductVariables {
  id: UUIDString;
}

export interface DeleteTaskData {
  task_delete?: Task_Key | null;
}

export interface DeleteTaskVariables {
  id: UUIDString;
}

export interface Document_Key {
  id: UUIDString;
  __typename?: 'Document_Key';
}

export interface Employee_Key {
  id: UUIDString;
  __typename?: 'Employee_Key';
}

export interface GetTenantData {
  tenant?: {
    id: UUIDString;
    name: string;
    businessSector: string;
    location: string;
    ownerEmail: string;
    taxId?: string | null;
    logoUrl?: string | null;
    subscriptionTier?: string | null;
    createdAt: TimestampString;
  } & Tenant_Key;
}

export interface GetTenantVariables {
  id: UUIDString;
}

export interface ListCustomersData {
  customers: ({
    id: UUIDString;
    customerName: string;
    phoneNumber?: string | null;
    email?: string | null;
    createdAt: TimestampString;
  } & Customer_Key)[];
}

export interface ListCustomersVariables {
  businessId: UUIDString;
}

export interface ListEmployeesData {
  employees: ({
    id: UUIDString;
    fullName: string;
    position: string;
    salary?: number | null;
    department?: string | null;
    startDate?: DateString | null;
    status?: string | null;
    createdAt: TimestampString;
  } & Employee_Key)[];
}

export interface ListEmployeesVariables {
  businessId: UUIDString;
}

export interface ListNotificationsData {
  notifications: ({
    id: UUIDString;
    message: string;
    isRead: boolean;
    createdAt: TimestampString;
  } & Notification_Key)[];
}

export interface ListNotificationsVariables {
  userId: UUIDString;
}

export interface ListProductsData {
  products: ({
    id: UUIDString;
    name: string;
    category?: string | null;
    quantity: number;
    costPrice?: number | null;
    sellingPrice: number;
    expiryDate?: DateString | null;
    lowStockLevel?: number | null;
    createdAt: TimestampString;
  } & Product_Key)[];
}

export interface ListProductsVariables {
  businessId: UUIDString;
}

export interface ListSuppliersData {
  suppliers: ({
    id: UUIDString;
    supplierName: string;
    phoneNumber?: string | null;
    email?: string | null;
    createdAt: TimestampString;
  } & Supplier_Key)[];
}

export interface ListSuppliersVariables {
  businessId: UUIDString;
}

export interface ListTasksData {
  tasks: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    status: string;
    priority?: string | null;
    dueDate: TimestampString;
    assignedTo?: {
      id: UUIDString;
      email: string;
      role: string;
    } & User_Key;
      createdAt: TimestampString;
  } & Task_Key)[];
}

export interface ListTasksVariables {
  businessId: UUIDString;
}

export interface ListTransactionsData {
  transactions: ({
    id: UUIDString;
    type: string;
    amount: number;
    date: TimestampString;
    category?: string | null;
    receiptUrl?: string | null;
    createdAt: TimestampString;
  } & Transaction_Key)[];
}

export interface ListTransactionsVariables {
  businessId: UUIDString;
}

export interface ListUsersData {
  users: ({
    id: UUIDString;
    email: string;
    role: string;
    department?: string | null;
    phoneNumber?: string | null;
    createdAt: TimestampString;
  } & User_Key)[];
}

export interface ListUsersVariables {
  businessId: UUIDString;
}

export interface MarkNotificationReadData {
  notification_update?: Notification_Key | null;
}

export interface MarkNotificationReadVariables {
  id: UUIDString;
}

export interface Notification_Key {
  id: UUIDString;
  __typename?: 'Notification_Key';
}

export interface Product_Key {
  id: UUIDString;
  __typename?: 'Product_Key';
}

export interface Supplier_Key {
  id: UUIDString;
  __typename?: 'Supplier_Key';
}

export interface TaskComment_Key {
  id: UUIDString;
  __typename?: 'TaskComment_Key';
}

export interface Task_Key {
  id: UUIDString;
  __typename?: 'Task_Key';
}

export interface Tenant_Key {
  id: UUIDString;
  __typename?: 'Tenant_Key';
}

export interface Transaction_Key {
  id: UUIDString;
  __typename?: 'Transaction_Key';
}

export interface UpdateProductData {
  product_update?: Product_Key | null;
}

export interface UpdateProductVariables {
  id: UUIDString;
  quantity?: number | null;
  sellingPrice?: number | null;
  costPrice?: number | null;
}

export interface UpdateTaskData {
  task_update?: Task_Key | null;
}

export interface UpdateTaskVariables {
  id: UUIDString;
  status?: string | null;
  priority?: string | null;
}

export interface User_Key {
  id: UUIDString;
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

interface MarkNotificationReadRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkNotificationReadVariables): MutationRef<MarkNotificationReadData, MarkNotificationReadVariables>;
  operationName: string;
}
export const markNotificationReadRef: MarkNotificationReadRef;

export function markNotificationRead(vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;
export function markNotificationRead(dc: DataConnect, vars: MarkNotificationReadVariables): MutationPromise<MarkNotificationReadData, MarkNotificationReadVariables>;

interface GetTenantRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetTenantVariables): QueryRef<GetTenantData, GetTenantVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetTenantVariables): QueryRef<GetTenantData, GetTenantVariables>;
  operationName: string;
}
export const getTenantRef: GetTenantRef;

export function getTenant(vars: GetTenantVariables): QueryPromise<GetTenantData, GetTenantVariables>;
export function getTenant(dc: DataConnect, vars: GetTenantVariables): QueryPromise<GetTenantData, GetTenantVariables>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsersVariables): QueryRef<ListUsersData, ListUsersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUsersVariables): QueryRef<ListUsersData, ListUsersVariables>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(vars: ListUsersVariables): QueryPromise<ListUsersData, ListUsersVariables>;
export function listUsers(dc: DataConnect, vars: ListUsersVariables): QueryPromise<ListUsersData, ListUsersVariables>;

interface ListProductsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListProductsVariables): QueryRef<ListProductsData, ListProductsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListProductsVariables): QueryRef<ListProductsData, ListProductsVariables>;
  operationName: string;
}
export const listProductsRef: ListProductsRef;

export function listProducts(vars: ListProductsVariables): QueryPromise<ListProductsData, ListProductsVariables>;
export function listProducts(dc: DataConnect, vars: ListProductsVariables): QueryPromise<ListProductsData, ListProductsVariables>;

interface ListTransactionsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTransactionsVariables): QueryRef<ListTransactionsData, ListTransactionsVariables>;
  operationName: string;
}
export const listTransactionsRef: ListTransactionsRef;

export function listTransactions(vars: ListTransactionsVariables): QueryPromise<ListTransactionsData, ListTransactionsVariables>;
export function listTransactions(dc: DataConnect, vars: ListTransactionsVariables): QueryPromise<ListTransactionsData, ListTransactionsVariables>;

interface ListTasksRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTasksVariables): QueryRef<ListTasksData, ListTasksVariables>;
  operationName: string;
}
export const listTasksRef: ListTasksRef;

export function listTasks(vars: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;
export function listTasks(dc: DataConnect, vars: ListTasksVariables): QueryPromise<ListTasksData, ListTasksVariables>;

interface ListEmployeesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEmployeesVariables): QueryRef<ListEmployeesData, ListEmployeesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListEmployeesVariables): QueryRef<ListEmployeesData, ListEmployeesVariables>;
  operationName: string;
}
export const listEmployeesRef: ListEmployeesRef;

export function listEmployees(vars: ListEmployeesVariables): QueryPromise<ListEmployeesData, ListEmployeesVariables>;
export function listEmployees(dc: DataConnect, vars: ListEmployeesVariables): QueryPromise<ListEmployeesData, ListEmployeesVariables>;

interface ListCustomersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListCustomersVariables): QueryRef<ListCustomersData, ListCustomersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListCustomersVariables): QueryRef<ListCustomersData, ListCustomersVariables>;
  operationName: string;
}
export const listCustomersRef: ListCustomersRef;

export function listCustomers(vars: ListCustomersVariables): QueryPromise<ListCustomersData, ListCustomersVariables>;
export function listCustomers(dc: DataConnect, vars: ListCustomersVariables): QueryPromise<ListCustomersData, ListCustomersVariables>;

interface ListSuppliersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSuppliersVariables): QueryRef<ListSuppliersData, ListSuppliersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSuppliersVariables): QueryRef<ListSuppliersData, ListSuppliersVariables>;
  operationName: string;
}
export const listSuppliersRef: ListSuppliersRef;

export function listSuppliers(vars: ListSuppliersVariables): QueryPromise<ListSuppliersData, ListSuppliersVariables>;
export function listSuppliers(dc: DataConnect, vars: ListSuppliersVariables): QueryPromise<ListSuppliersData, ListSuppliersVariables>;

interface ListNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListNotificationsVariables): QueryRef<ListNotificationsData, ListNotificationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListNotificationsVariables): QueryRef<ListNotificationsData, ListNotificationsVariables>;
  operationName: string;
}
export const listNotificationsRef: ListNotificationsRef;

export function listNotifications(vars: ListNotificationsVariables): QueryPromise<ListNotificationsData, ListNotificationsVariables>;
export function listNotifications(dc: DataConnect, vars: ListNotificationsVariables): QueryPromise<ListNotificationsData, ListNotificationsVariables>;

