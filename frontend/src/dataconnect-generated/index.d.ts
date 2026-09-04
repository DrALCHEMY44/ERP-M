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

export interface BootstrapWorkspaceData {
  tenant_insert: Tenant_Key;
  business_insert: Business_Key;
  businessSetting_insert: BusinessSetting_Key;
  user_insert: User_Key;
}

export interface BootstrapWorkspaceVariables {
  tenantId: string;
  businessId: string;
  userId: string;
  name: string;
  businessSector: string;
  location: string;
  region: string;
  ownerEmail: string;
  fullName: string;
  code: string;
}

export interface BusinessSetting_Key {
  businessId: string;
  __typename?: 'BusinessSetting_Key';
}

export interface Business_Key {
  id: string;
  __typename?: 'Business_Key';
}

export interface ClearLegacyAccessCodeData {
  user_update?: User_Key | null;
}

export interface ClearLegacyAccessCodeVariables {
  id: string;
}

export interface CompleteAssignedTaskData {
  task_update?: Task_Key | null;
}

export interface CompleteAssignedTaskVariables {
  taskId: string;
  userId: string;
  tenantId: string;
  businessId: string;
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
  code: string;
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
  location?: string | null;
  notes?: string | null;
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
  description?: string | null;
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
  role?: string | null;
  salary?: number | null;
  department?: string | null;
  email?: string | null;
  contact?: string | null;
  startDate?: DateString | null;
  status?: string | null;
  attendance?: number | null;
  salaryPaymentStatus?: string | null;
  code?: string | null;
}

export interface CreateEmployeeWithAccessData {
  employee_insert: Employee_Key;
  user_insert: User_Key;
}

export interface CreateEmployeeWithAccessVariables {
  tenantId: string;
  businessId: string;
  fullName: string;
  position: string;
  role?: string | null;
  userRole: string;
  salary?: number | null;
  department?: string | null;
  email: string;
  contact?: string | null;
  startDate?: DateString | null;
  status?: string | null;
  attendance?: number | null;
  salaryPaymentStatus?: string | null;
  accessCodeHash: string;
}

export interface CreateMirrorOutboxData {
  mirrorOutbox_insert: MirrorOutbox_Key;
}

export interface CreateMirrorOutboxVariables {
  tenantId: string;
  businessId: string;
  entityType: string;
  operation: string;
  recordId: string;
  payload: unknown;
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
  status?: string | null;
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
  location?: string | null;
  productsSupplied?: string | null;
  paymentStatus?: string | null;
  notes?: string | null;
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
  status?: string | null;
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
  description?: string | null;
  receiptUrl?: string | null;
  recordedBy: string;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  tenantId: string;
  businessId: string;
  email: string;
  role: string;
  fullName?: string | null;
  department?: string | null;
  phoneNumber?: string | null;
  accessCodeHash?: string | null;
}

export interface Customer_Key {
  id: string;
  __typename?: 'Customer_Key';
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

export interface DeleteEmployeeWithAccessData {
  employee_delete?: Employee_Key | null;
  user_deleteMany: number;
}

export interface DeleteEmployeeWithAccessVariables {
  id: string;
  tenantId: string;
  businessId: string;
  currentEmail: string;
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

export interface GetBusinessByCodeData {
  businesses: ({
    id: string;
    tenantId: string;
    name: string;
  } & Business_Key)[];
}

export interface GetBusinessByCodeVariables {
  code: string;
}

export interface GetBusinessByIdData {
  business?: {
    id: string;
    tenantId: string;
    name: string;
    location: string;
    businessType?: string | null;
    entityType?: string | null;
    city?: string | null;
    region?: string | null;
    phone?: string | null;
    email?: string | null;
    taxId?: string | null;
    description?: string | null;
    logoUrl?: string | null;
    createdAt: TimestampString;
    code: string;
  } & Business_Key;
}

export interface GetBusinessByIdVariables {
  id: string;
}

export interface GetBusinessSettingsData {
  businessSettings: ({
    businessId: string;
    tenantId: string;
    currency: string;
    timezone: string;
    fiscalYearStart: string;
    taxRate: number;
    lowStockThreshold: number;
    updatedAt: TimestampString;
  } & BusinessSetting_Key)[];
}

export interface GetBusinessSettingsVariables {
  tenantId: string;
  businessId: string;
}

export interface GetBusinessesByNameData {
  businesses: ({
    id: string;
    tenantId: string;
    name: string;
    code: string;
  } & Business_Key)[];
}

export interface GetBusinessesByNameVariables {
  name: string;
}

export interface GetCustomerForCompanyData {
  customer?: {
    id: string;
  } & Customer_Key;
}

export interface GetCustomerForCompanyVariables {
  id: string;
  tenantId: string;
  businessId: string;
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

export interface GetUserByIdData {
  user?: {
    id: string;
    email: string;
    role: string;
    department?: string | null;
    phoneNumber?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
    fullName?: string | null;
  } & User_Key;
}

export interface GetUserByIdVariables {
  id: string;
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
    location?: string | null;
    totalOrders?: number | null;
    totalSpent?: number | null;
    notes?: string | null;
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
    description?: string | null;
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
    role?: string | null;
    salary?: number | null;
    department?: string | null;
    email?: string | null;
    contact?: string | null;
    startDate?: DateString | null;
    status?: string | null;
    attendance?: number | null;
    salaryPaymentStatus?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Employee_Key)[];
}

export interface ListEmployeesByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListLegacyAccessCodesData {
  users: ({
    id: string;
    accessCode?: string | null;
  } & User_Key)[];
}

export interface ListNotificationsData {
  notifications: ({
    id: string;
    tenantId: string;
    businessId: string;
    userId: string;
    message: string;
    isRead: boolean;
    createdAt: TimestampString;
  } & Notification_Key)[];
}

export interface ListNotificationsVariables {
  tenantId: string;
  businessId: string;
  userId: string;
}

export interface ListPendingMirrorOutboxData {
  mirrorOutboxes: ({
    id: string;
    tenantId: string;
    businessId: string;
    entityType: string;
    operation: string;
    recordId: string;
    payload: unknown;
    status: string;
    attempts: number;
    nextAttemptAt: TimestampString;
    lastError?: string | null;
    createdAt: TimestampString;
  } & MirrorOutbox_Key)[];
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
    status?: string | null;
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

export interface ListSaleCustomersByBusinessData {
  customers: ({
    id: string;
    customerName: string;
    tenantId: string;
    businessId: string;
  } & Customer_Key)[];
}

export interface ListSaleCustomersByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListSuppliersByBusinessData {
  suppliers: ({
    id: string;
    supplierName: string;
    phoneNumber?: string | null;
    email?: string | null;
    location?: string | null;
    productsSupplied?: string | null;
    paymentStatus?: string | null;
    notes?: string | null;
    createdAt: TimestampString;
    tenantId: string;
    businessId: string;
  } & Supplier_Key)[];
}

export interface ListSuppliersByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListTaskAssigneesByBusinessData {
  users: ({
    id: string;
    email: string;
    role: string;
    fullName?: string | null;
    department?: string | null;
    tenantId: string;
    businessId: string;
  } & User_Key)[];
}

export interface ListTaskAssigneesByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListTasksAssignedToUserData {
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
      fullName?: string | null;
      department?: string | null;
    } & User_Key;
    createdBy: string;
    createdAt: TimestampString;
    updatedAt?: TimestampString | null;
    tenantId: string;
    businessId: string;
  } & Task_Key)[];
}

export interface ListTasksAssignedToUserVariables {
  tenantId: string;
  businessId: string;
  userId: string;
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
      fullName?: string | null;
      department?: string | null;
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
    location: string;
    ownerEmail: string;
    taxId?: string | null;
    logoUrl?: string | null;
    subscriptionTier?: string | null;
    status?: string | null;
    createdAt: TimestampString;
  } & Tenant_Key)[];
}

export interface ListTransactionsByBusinessData {
  transactions: ({
    id: string;
    type: TransactionType;
    amount: number;
    date: TimestampString;
    category?: string | null;
    description?: string | null;
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
    description?: string | null;
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

export interface ListUsersByBusinessData {
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
    accessCodeHash?: string | null;
  } & User_Key)[];
}

export interface ListUsersByBusinessVariables {
  tenantId: string;
  businessId: string;
}

export interface ListUsersData {
  users: ({
    id: string;
  } & User_Key)[];
}

export interface MirrorOutbox_Key {
  id: string;
  __typename?: 'MirrorOutbox_Key';
}

export interface Notification_Key {
  id: string;
  __typename?: 'Notification_Key';
}

export interface Product_Key {
  id: string;
  __typename?: 'Product_Key';
}

export interface ProvisionEmployeeUserData {
  user_insert: User_Key;
}

export interface ProvisionEmployeeUserVariables {
  tenantId: string;
  businessId: string;
  email: string;
  role: string;
  fullName: string;
  department?: string | null;
  phoneNumber?: string | null;
  accessCodeHash: string;
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
  entityType?: string | null;
  city?: string | null;
  region?: string | null;
  phone?: string | null;
  email?: string | null;
  taxId?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  code?: string | null;
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
  location?: string | null;
  notes?: string | null;
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
  description?: string | null;
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
  role?: string | null;
  salary?: number | null;
  department?: string | null;
  email?: string | null;
  contact?: string | null;
  startDate?: DateString | null;
  status?: string | null;
  attendance?: number | null;
  salaryPaymentStatus?: string | null;
}

export interface UpdateEmployeeWithAccessData {
  employee_update?: Employee_Key | null;
  user_updateMany: number;
}

export interface UpdateEmployeeWithAccessVariables {
  id: string;
  tenantId: string;
  businessId: string;
  currentEmail: string;
  fullName: string;
  position: string;
  role?: string | null;
  userRole: string;
  salary?: number | null;
  department?: string | null;
  email: string;
  contact?: string | null;
  startDate?: DateString | null;
  status?: string | null;
  attendance?: number | null;
  salaryPaymentStatus?: string | null;
}

export interface UpdateMirrorOutboxData {
  mirrorOutbox_update?: MirrorOutbox_Key | null;
}

export interface UpdateMirrorOutboxVariables {
  id: string;
  status: string;
  attempts: number;
  nextAttemptAt: TimestampString;
  lastError?: string | null;
  deliveredAt?: TimestampString | null;
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
  status?: string | null;
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
  location?: string | null;
  productsSupplied?: string | null;
  paymentStatus?: string | null;
  notes?: string | null;
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
  status?: string | null;
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
  description?: string | null;
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
  accessCodeHash?: string | null;
}

export interface UpsertBusinessSettingsData {
  businessSetting_upsert: BusinessSetting_Key;
}

export interface UpsertBusinessSettingsVariables {
  tenantId: string;
  businessId: string;
  currency: string;
  timezone: string;
  fiscalYearStart: string;
  taxRate: number;
  lowStockThreshold: number;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

export interface VerifyEmployeeAccessData {
  users: ({
    id: string;
    email: string;
    role: string;
    fullName?: string | null;
    tenantId: string;
    businessId: string;
  } & User_Key)[];
}

export interface VerifyEmployeeAccessVariables {
  fullName: string;
  role: string;
  accessCodeHash: string;
  tenantId: string;
  businessId: string;
}

export interface VerifyUserLoginData {
  users: ({
    id: string;
    email: string;
    role: string;
    fullName?: string | null;
    tenantId: string;
    businessId: string;
  } & User_Key)[];
}

export interface VerifyUserLoginVariables {
  email: string;
  fullName: string;
  role: string;
  accessCodeHash: string;
  tenantId: string;
  businessId: string;
}

interface BootstrapWorkspaceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: BootstrapWorkspaceVariables): MutationRef<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: BootstrapWorkspaceVariables): MutationRef<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
  operationName: string;
}
export const bootstrapWorkspaceRef: BootstrapWorkspaceRef;

export function bootstrapWorkspace(vars: BootstrapWorkspaceVariables): MutationPromise<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;
export function bootstrapWorkspace(dc: DataConnect, vars: BootstrapWorkspaceVariables): MutationPromise<BootstrapWorkspaceData, BootstrapWorkspaceVariables>;

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

interface ClearLegacyAccessCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ClearLegacyAccessCodeVariables): MutationRef<ClearLegacyAccessCodeData, ClearLegacyAccessCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ClearLegacyAccessCodeVariables): MutationRef<ClearLegacyAccessCodeData, ClearLegacyAccessCodeVariables>;
  operationName: string;
}
export const clearLegacyAccessCodeRef: ClearLegacyAccessCodeRef;

export function clearLegacyAccessCode(vars: ClearLegacyAccessCodeVariables): MutationPromise<ClearLegacyAccessCodeData, ClearLegacyAccessCodeVariables>;
export function clearLegacyAccessCode(dc: DataConnect, vars: ClearLegacyAccessCodeVariables): MutationPromise<ClearLegacyAccessCodeData, ClearLegacyAccessCodeVariables>;

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

interface UpsertBusinessSettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertBusinessSettingsVariables): MutationRef<UpsertBusinessSettingsData, UpsertBusinessSettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertBusinessSettingsVariables): MutationRef<UpsertBusinessSettingsData, UpsertBusinessSettingsVariables>;
  operationName: string;
}
export const upsertBusinessSettingsRef: UpsertBusinessSettingsRef;

export function upsertBusinessSettings(vars: UpsertBusinessSettingsVariables): MutationPromise<UpsertBusinessSettingsData, UpsertBusinessSettingsVariables>;
export function upsertBusinessSettings(dc: DataConnect, vars: UpsertBusinessSettingsVariables): MutationPromise<UpsertBusinessSettingsData, UpsertBusinessSettingsVariables>;

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

interface ProvisionEmployeeUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ProvisionEmployeeUserVariables): MutationRef<ProvisionEmployeeUserData, ProvisionEmployeeUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ProvisionEmployeeUserVariables): MutationRef<ProvisionEmployeeUserData, ProvisionEmployeeUserVariables>;
  operationName: string;
}
export const provisionEmployeeUserRef: ProvisionEmployeeUserRef;

export function provisionEmployeeUser(vars: ProvisionEmployeeUserVariables): MutationPromise<ProvisionEmployeeUserData, ProvisionEmployeeUserVariables>;
export function provisionEmployeeUser(dc: DataConnect, vars: ProvisionEmployeeUserVariables): MutationPromise<ProvisionEmployeeUserData, ProvisionEmployeeUserVariables>;

interface CompleteAssignedTaskRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CompleteAssignedTaskVariables): MutationRef<CompleteAssignedTaskData, CompleteAssignedTaskVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CompleteAssignedTaskVariables): MutationRef<CompleteAssignedTaskData, CompleteAssignedTaskVariables>;
  operationName: string;
}
export const completeAssignedTaskRef: CompleteAssignedTaskRef;

export function completeAssignedTask(vars: CompleteAssignedTaskVariables): MutationPromise<CompleteAssignedTaskData, CompleteAssignedTaskVariables>;
export function completeAssignedTask(dc: DataConnect, vars: CompleteAssignedTaskVariables): MutationPromise<CompleteAssignedTaskData, CompleteAssignedTaskVariables>;

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

interface CreateEmployeeWithAccessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateEmployeeWithAccessVariables): MutationRef<CreateEmployeeWithAccessData, CreateEmployeeWithAccessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateEmployeeWithAccessVariables): MutationRef<CreateEmployeeWithAccessData, CreateEmployeeWithAccessVariables>;
  operationName: string;
}
export const createEmployeeWithAccessRef: CreateEmployeeWithAccessRef;

export function createEmployeeWithAccess(vars: CreateEmployeeWithAccessVariables): MutationPromise<CreateEmployeeWithAccessData, CreateEmployeeWithAccessVariables>;
export function createEmployeeWithAccess(dc: DataConnect, vars: CreateEmployeeWithAccessVariables): MutationPromise<CreateEmployeeWithAccessData, CreateEmployeeWithAccessVariables>;

interface UpdateEmployeeWithAccessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEmployeeWithAccessVariables): MutationRef<UpdateEmployeeWithAccessData, UpdateEmployeeWithAccessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEmployeeWithAccessVariables): MutationRef<UpdateEmployeeWithAccessData, UpdateEmployeeWithAccessVariables>;
  operationName: string;
}
export const updateEmployeeWithAccessRef: UpdateEmployeeWithAccessRef;

export function updateEmployeeWithAccess(vars: UpdateEmployeeWithAccessVariables): MutationPromise<UpdateEmployeeWithAccessData, UpdateEmployeeWithAccessVariables>;
export function updateEmployeeWithAccess(dc: DataConnect, vars: UpdateEmployeeWithAccessVariables): MutationPromise<UpdateEmployeeWithAccessData, UpdateEmployeeWithAccessVariables>;

interface DeleteEmployeeWithAccessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEmployeeWithAccessVariables): MutationRef<DeleteEmployeeWithAccessData, DeleteEmployeeWithAccessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEmployeeWithAccessVariables): MutationRef<DeleteEmployeeWithAccessData, DeleteEmployeeWithAccessVariables>;
  operationName: string;
}
export const deleteEmployeeWithAccessRef: DeleteEmployeeWithAccessRef;

export function deleteEmployeeWithAccess(vars: DeleteEmployeeWithAccessVariables): MutationPromise<DeleteEmployeeWithAccessData, DeleteEmployeeWithAccessVariables>;
export function deleteEmployeeWithAccess(dc: DataConnect, vars: DeleteEmployeeWithAccessVariables): MutationPromise<DeleteEmployeeWithAccessData, DeleteEmployeeWithAccessVariables>;

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

interface CreateMirrorOutboxRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMirrorOutboxVariables): MutationRef<CreateMirrorOutboxData, CreateMirrorOutboxVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMirrorOutboxVariables): MutationRef<CreateMirrorOutboxData, CreateMirrorOutboxVariables>;
  operationName: string;
}
export const createMirrorOutboxRef: CreateMirrorOutboxRef;

export function createMirrorOutbox(vars: CreateMirrorOutboxVariables): MutationPromise<CreateMirrorOutboxData, CreateMirrorOutboxVariables>;
export function createMirrorOutbox(dc: DataConnect, vars: CreateMirrorOutboxVariables): MutationPromise<CreateMirrorOutboxData, CreateMirrorOutboxVariables>;

interface UpdateMirrorOutboxRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateMirrorOutboxVariables): MutationRef<UpdateMirrorOutboxData, UpdateMirrorOutboxVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateMirrorOutboxVariables): MutationRef<UpdateMirrorOutboxData, UpdateMirrorOutboxVariables>;
  operationName: string;
}
export const updateMirrorOutboxRef: UpdateMirrorOutboxRef;

export function updateMirrorOutbox(vars: UpdateMirrorOutboxVariables): MutationPromise<UpdateMirrorOutboxData, UpdateMirrorOutboxVariables>;
export function updateMirrorOutbox(dc: DataConnect, vars: UpdateMirrorOutboxVariables): MutationPromise<UpdateMirrorOutboxData, UpdateMirrorOutboxVariables>;

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

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListLegacyAccessCodesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListLegacyAccessCodesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListLegacyAccessCodesData, undefined>;
  operationName: string;
}
export const listLegacyAccessCodesRef: ListLegacyAccessCodesRef;

export function listLegacyAccessCodes(options?: ExecuteQueryOptions): QueryPromise<ListLegacyAccessCodesData, undefined>;
export function listLegacyAccessCodes(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListLegacyAccessCodesData, undefined>;

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

interface GetBusinessByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessByIdVariables): QueryRef<GetBusinessByIdData, GetBusinessByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessByIdVariables): QueryRef<GetBusinessByIdData, GetBusinessByIdVariables>;
  operationName: string;
}
export const getBusinessByIdRef: GetBusinessByIdRef;

export function getBusinessById(vars: GetBusinessByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessByIdData, GetBusinessByIdVariables>;
export function getBusinessById(dc: DataConnect, vars: GetBusinessByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessByIdData, GetBusinessByIdVariables>;

interface GetBusinessSettingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessSettingsVariables): QueryRef<GetBusinessSettingsData, GetBusinessSettingsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessSettingsVariables): QueryRef<GetBusinessSettingsData, GetBusinessSettingsVariables>;
  operationName: string;
}
export const getBusinessSettingsRef: GetBusinessSettingsRef;

export function getBusinessSettings(vars: GetBusinessSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessSettingsData, GetBusinessSettingsVariables>;
export function getBusinessSettings(dc: DataConnect, vars: GetBusinessSettingsVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessSettingsData, GetBusinessSettingsVariables>;

interface GetBusinessByCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessByCodeVariables): QueryRef<GetBusinessByCodeData, GetBusinessByCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessByCodeVariables): QueryRef<GetBusinessByCodeData, GetBusinessByCodeVariables>;
  operationName: string;
}
export const getBusinessByCodeRef: GetBusinessByCodeRef;

export function getBusinessByCode(vars: GetBusinessByCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessByCodeData, GetBusinessByCodeVariables>;
export function getBusinessByCode(dc: DataConnect, vars: GetBusinessByCodeVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessByCodeData, GetBusinessByCodeVariables>;

interface GetBusinessesByNameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessesByNameVariables): QueryRef<GetBusinessesByNameData, GetBusinessesByNameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessesByNameVariables): QueryRef<GetBusinessesByNameData, GetBusinessesByNameVariables>;
  operationName: string;
}
export const getBusinessesByNameRef: GetBusinessesByNameRef;

export function getBusinessesByName(vars: GetBusinessesByNameVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessesByNameData, GetBusinessesByNameVariables>;
export function getBusinessesByName(dc: DataConnect, vars: GetBusinessesByNameVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessesByNameData, GetBusinessesByNameVariables>;

interface VerifyEmployeeAccessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: VerifyEmployeeAccessVariables): QueryRef<VerifyEmployeeAccessData, VerifyEmployeeAccessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: VerifyEmployeeAccessVariables): QueryRef<VerifyEmployeeAccessData, VerifyEmployeeAccessVariables>;
  operationName: string;
}
export const verifyEmployeeAccessRef: VerifyEmployeeAccessRef;

export function verifyEmployeeAccess(vars: VerifyEmployeeAccessVariables, options?: ExecuteQueryOptions): QueryPromise<VerifyEmployeeAccessData, VerifyEmployeeAccessVariables>;
export function verifyEmployeeAccess(dc: DataConnect, vars: VerifyEmployeeAccessVariables, options?: ExecuteQueryOptions): QueryPromise<VerifyEmployeeAccessData, VerifyEmployeeAccessVariables>;

interface VerifyUserLoginRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: VerifyUserLoginVariables): QueryRef<VerifyUserLoginData, VerifyUserLoginVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: VerifyUserLoginVariables): QueryRef<VerifyUserLoginData, VerifyUserLoginVariables>;
  operationName: string;
}
export const verifyUserLoginRef: VerifyUserLoginRef;

export function verifyUserLogin(vars: VerifyUserLoginVariables, options?: ExecuteQueryOptions): QueryPromise<VerifyUserLoginData, VerifyUserLoginVariables>;
export function verifyUserLogin(dc: DataConnect, vars: VerifyUserLoginVariables, options?: ExecuteQueryOptions): QueryPromise<VerifyUserLoginData, VerifyUserLoginVariables>;

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

interface GetCustomerForCompanyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetCustomerForCompanyVariables): QueryRef<GetCustomerForCompanyData, GetCustomerForCompanyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetCustomerForCompanyVariables): QueryRef<GetCustomerForCompanyData, GetCustomerForCompanyVariables>;
  operationName: string;
}
export const getCustomerForCompanyRef: GetCustomerForCompanyRef;

export function getCustomerForCompany(vars: GetCustomerForCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCustomerForCompanyData, GetCustomerForCompanyVariables>;
export function getCustomerForCompany(dc: DataConnect, vars: GetCustomerForCompanyVariables, options?: ExecuteQueryOptions): QueryPromise<GetCustomerForCompanyData, GetCustomerForCompanyVariables>;

interface ListSaleCustomersByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListSaleCustomersByBusinessVariables): QueryRef<ListSaleCustomersByBusinessData, ListSaleCustomersByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListSaleCustomersByBusinessVariables): QueryRef<ListSaleCustomersByBusinessData, ListSaleCustomersByBusinessVariables>;
  operationName: string;
}
export const listSaleCustomersByBusinessRef: ListSaleCustomersByBusinessRef;

export function listSaleCustomersByBusiness(vars: ListSaleCustomersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListSaleCustomersByBusinessData, ListSaleCustomersByBusinessVariables>;
export function listSaleCustomersByBusiness(dc: DataConnect, vars: ListSaleCustomersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListSaleCustomersByBusinessData, ListSaleCustomersByBusinessVariables>;

interface ListTaskAssigneesByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTaskAssigneesByBusinessVariables): QueryRef<ListTaskAssigneesByBusinessData, ListTaskAssigneesByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTaskAssigneesByBusinessVariables): QueryRef<ListTaskAssigneesByBusinessData, ListTaskAssigneesByBusinessVariables>;
  operationName: string;
}
export const listTaskAssigneesByBusinessRef: ListTaskAssigneesByBusinessRef;

export function listTaskAssigneesByBusiness(vars: ListTaskAssigneesByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTaskAssigneesByBusinessData, ListTaskAssigneesByBusinessVariables>;
export function listTaskAssigneesByBusiness(dc: DataConnect, vars: ListTaskAssigneesByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListTaskAssigneesByBusinessData, ListTaskAssigneesByBusinessVariables>;

interface ListUsersByBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUsersByBusinessVariables): QueryRef<ListUsersByBusinessData, ListUsersByBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUsersByBusinessVariables): QueryRef<ListUsersByBusinessData, ListUsersByBusinessVariables>;
  operationName: string;
}
export const listUsersByBusinessRef: ListUsersByBusinessRef;

export function listUsersByBusiness(vars: ListUsersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListUsersByBusinessData, ListUsersByBusinessVariables>;
export function listUsersByBusiness(dc: DataConnect, vars: ListUsersByBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<ListUsersByBusinessData, ListUsersByBusinessVariables>;

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

interface ListTasksAssignedToUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListTasksAssignedToUserVariables): QueryRef<ListTasksAssignedToUserData, ListTasksAssignedToUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListTasksAssignedToUserVariables): QueryRef<ListTasksAssignedToUserData, ListTasksAssignedToUserVariables>;
  operationName: string;
}
export const listTasksAssignedToUserRef: ListTasksAssignedToUserRef;

export function listTasksAssignedToUser(vars: ListTasksAssignedToUserVariables, options?: ExecuteQueryOptions): QueryPromise<ListTasksAssignedToUserData, ListTasksAssignedToUserVariables>;
export function listTasksAssignedToUser(dc: DataConnect, vars: ListTasksAssignedToUserVariables, options?: ExecuteQueryOptions): QueryPromise<ListTasksAssignedToUserData, ListTasksAssignedToUserVariables>;

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

interface GetUserByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByIdVariables): QueryRef<GetUserByIdData, GetUserByIdVariables>;
  operationName: string;
}
export const getUserByIdRef: GetUserByIdRef;

export function getUserById(vars: GetUserByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByIdData, GetUserByIdVariables>;
export function getUserById(dc: DataConnect, vars: GetUserByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserByIdData, GetUserByIdVariables>;

interface ListNotificationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListNotificationsVariables): QueryRef<ListNotificationsData, ListNotificationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListNotificationsVariables): QueryRef<ListNotificationsData, ListNotificationsVariables>;
  operationName: string;
}
export const listNotificationsRef: ListNotificationsRef;

export function listNotifications(vars: ListNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNotificationsData, ListNotificationsVariables>;
export function listNotifications(dc: DataConnect, vars: ListNotificationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListNotificationsData, ListNotificationsVariables>;

interface ListPendingMirrorOutboxRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPendingMirrorOutboxData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPendingMirrorOutboxData, undefined>;
  operationName: string;
}
export const listPendingMirrorOutboxRef: ListPendingMirrorOutboxRef;

export function listPendingMirrorOutbox(options?: ExecuteQueryOptions): QueryPromise<ListPendingMirrorOutboxData, undefined>;
export function listPendingMirrorOutbox(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPendingMirrorOutboxData, undefined>;

