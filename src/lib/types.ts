
export type Role = 'Platform Super Admin' | 'Business Owner' | 'Manager' | 'Accountant' | 'HR Officer' | 'Staff' | 'Viewer';

export type UserProfile = {
  uid: string;
  email: string;
  fullName: string;
  tenantId: string;
  businessId: string;
  role: Role;
  permissions: string[];
  photoURL?: string;
  createdAt: string;
};

export type Tenant = {
  id: string;
  name: string;
  plan: 'Basic' | 'Premium' | 'Enterprise';
  status: 'Active' | 'Suspended';
  createdAt: string;
};

export type Business = {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  sector: string;
  location: string;
  city: string;
  region: string;
  phone: string;
  email: string;
  taxId?: string;
  description?: string;
  logo?: string;
  createdAt: string;
};

export type Branch = {
  id: string;
  tenantId: string;
  businessId: string;
  name: string;
  location: string;
  managerId?: string;
  createdAt: string;
};

export type Product = {
  id: string;
  tenantId: string;
  businessId: string;
  branchId?: string;
  name: string;
  category: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplierId: string;
  expiryDate?: string;
  lowStockLevel: number;
  status: 'active' | 'inactive';
  createdAt: string;
};

export type InventoryMovement = {
  id: string;
  tenantId: string;
  businessId: string;
  productId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reason: string;
  userId: string;
  timestamp: string;
};

export type Customer = {
  id: string;
  tenantId: string;
  businessId: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  notes?: string;
  totalOrders: number;
  totalSpent: number;
  purchaseHistory?: string[];
  createdAt: string;
};

export type Supplier = {
  id: string;
  tenantId: string;
  businessId: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  productsSupplied: string[];
  paymentStatus: 'Paid' | 'Pending' | 'Partial' | 'Overdue';
  notes?: string;
  createdAt: string;
};

export type SaleItem = {
  productId: string;
  quantity: number;
  priceAtSale: number;
};

export type Sale = {
  id: string;
  tenantId: string;
  businessId: string;
  branchId?: string;
  customerId?: string;
  productsSold: SaleItem[];
  totalAmount: number;
  paymentMethod: 'Cash' | 'Mobile Money' | 'Bank Transfer' | 'Credit';
  saleDate: string;
  recordedBy: string;
  createdAt: string;
};

export type Expense = {
  id: string;
  tenantId: string;
  businessId: string;
  branchId?: string;
  category: 'Rent' | 'Utilities' | 'Salaries' | 'Supplies' | 'Marketing' | 'Transport' | 'Taxes' | 'Other';
  ohadaAccount?: string;
  amount: number;
  taxAmount?: number;
  date: string;
  description: string;
  receiptUrl?: string;
  recordedBy: string;
  createdAt: string;
};

export type EmployeeStatus = 'Active' | 'On Leave' | 'Suspended' | 'Terminated';
export type PaymentStatus = 'Paid' | 'Pending' | 'Partial' | 'Overdue';

export type Employee = {
  id?: string;
  employeeId: string;
  tenantId: string;
  businessId: string;
  fullName: string;
  position: string;
  department: string;
  salary: number;
  contact: string;
  email: string;
  startDate: string;
  employmentStatus: EmployeeStatus;
  attendance: number;
  salaryPaymentStatus: PaymentStatus;
  createdBy: string;
  createdAt: string;
};

export type Attendance = {
  id: string;
  tenantId: string;
  businessId: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
  notes?: string;
};

export type TaskStatus = 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Late' | 'Overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskComment = {
  id: string;
  tenantId: string;
  businessId: string;
  taskId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
};

export type Task = {
  id: string;
  tenantId: string;
  businessId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  department: string;
  priority: TaskPriority;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  completedAt?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt?: string;
};

export type BusinessDocument = {
  id?: string;
  tenantId: string;
  businessId: string;
  name: string;
  type: 'Receipt' | 'Invoice' | 'Contract' | 'License' | 'Report' | 'Employee' | 'Supplier' | 'Other';
  fileUrl: string;
  fileSize?: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  description?: string;
};

export type AIQueryLog = {
  id: string;
  tenantId: string;
  businessId: string;
  userId: string;
  query: string;
  response: string;
  timestamp: string;
};

export type ActivityLog = {
  id: string;
  tenantId: string;
  businessId: string;
  userId: string;
  userName: string;
  userRole: string;
  actionType: string;
  module: string;
  description: string;
  oldValue?: string;
  newValue?: string;
  recordId?: string;
  deviceInfo?: string;
  timestamp: string;
};

export type Invitation = {
  id: string;
  tenantId: string;
  businessId: string;
  email: string;
  role: Role;
  invitedBy: string;
  status: 'Pending' | 'Accepted' | 'Expired';
  expiresAt: string;
  createdAt: string;
};

export type AppNotification = {
  id?: string;
  tenantId: string;
  businessId: string;
  targetUserId?: string;
  targetRoles?: Role[];
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  module: string;
  readBy: string[];
  createdAt: string;
  link?: string;
};

export type BusinessSettings = {
  id: string;
  tenantId: string;
  businessId: string;
  currency: string;
  timezone: string;
  fiscalYearStart: string;
  taxRate: number;
  lowStockThreshold: number;
  updatedAt: string;
};

export type Report = {
  id: string;
  tenantId: string;
  businessId: string;
  name: string;
  type: string;
  data: any;
  generatedBy: string;
  createdAt: string;
};
