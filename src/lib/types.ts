
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

export type Product = {
  id: string;
  tenantId: string;
  businessId: string;
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
  purchaseHistory?: string[]; // Array of Sale IDs
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
  productsSupplied: string[]; // Names or IDs of products
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
  customerId?: string;
  productsSold: SaleItem[];
  totalAmount: number;
  paymentMethod: 'Cash' | 'Mobile Money' | 'Bank Transfer' | 'Credit';
  saleDate: string;
  recordedBy: string;
  createdAt: string;
};

// SYCOHADA Account Classes
export type OHADAAccountClass = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type Expense = {
  id: string;
  tenantId: string;
  businessId: string;
  category: 'Rent' | 'Utilities' | 'Salaries' | 'Supplies' | 'Marketing' | 'Transport' | 'Taxes' | 'Other';
  ohadaAccount?: string; // e.g., 601, 621, 641
  amount: number;
  taxAmount?: number; // VAT (TVA)
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
  attendance: number; // Percentage
  salaryPaymentStatus: PaymentStatus;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
};

export type TaskStatus = 'Pending' | 'Ongoing' | 'Completed' | 'Cancelled' | 'Late' | 'Overdue';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

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
  createdAt: string;
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
  timestamp: string;
};

export type FinancialTransaction = {
  id: string;
  tenantId: string;
  businessId: string;
  type: 'DEBIT' | 'CREDIT';
  accountClass: OHADAAccountClass;
  accountNumber: string;
  accountLabel: string;
  amount: number;
  description: string;
  date: string;
  reference: string;
};
