
import { UserProfile, Business, Product, Task, Sale, ActivityLog, Expense, Customer, Tenant } from './types';

export const MOCK_USER: UserProfile = {
  uid: 'user123',
  email: 'admin@smarterp.ai',
  fullName: 'Platform Administrator',
  tenantId: 'system_root',
  businessId: 'platform_master',
  role: 'Platform Super Admin',
  permissions: ['*'],
  createdAt: '2023-01-10T08:00:00Z',
};

export const MOCK_TENANTS: Tenant[] = [
  {
    id: 'tenant_douala_001',
    name: 'Superette de l\'Avenir',
    plan: 'Premium',
    status: 'Active',
    createdAt: '2023-01-10T08:00:00Z',
  },
  {
    id: 'tenant_yaounde_002',
    name: 'Boutique Bastos',
    plan: 'Basic',
    status: 'Active',
    createdAt: '2023-03-15T10:00:00Z',
  },
  {
    id: 'tenant_bafoussam_003',
    name: 'Logistics West',
    plan: 'Enterprise',
    status: 'Suspended',
    createdAt: '2023-06-20T14:30:00Z',
  }
];

export const MOCK_BUSINESS: Business = {
  id: 'biz_superette_central',
  tenantId: 'tenant_douala_001',
  name: 'Superette de l\'Avenir',
  type: 'Retail',
  sector: 'Consumer Goods',
  location: 'Akwa',
  city: 'Douala',
  region: 'Littoral',
  phone: '+237 600 000 000',
  email: 'contact@superette-avenir.cm',
  taxId: 'M012345678901L',
  createdAt: '2023-01-10T08:00:00Z',
};

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust1',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    name: 'Samuel Eto\'o',
    phone: '+237 677 123 456',
    email: 'samuel.etoo@football.cm',
    location: 'Bonanjo, Douala',
    notes: 'Premium customer, prefers Mobile Money.',
    totalOrders: 15,
    totalSpent: 450000,
    createdAt: '2023-05-10T08:00:00Z',
  },
  {
    id: 'cust2',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    name: 'Nathalie Koah',
    phone: '+237 699 987 654',
    email: 'n.koah@style.cm',
    location: 'Bastos, Yaoundé',
    notes: 'Frequent buyer of cleaning supplies.',
    totalOrders: 8,
    totalSpent: 120500,
    createdAt: '2023-08-15T14:30:00Z',
  },
  {
    id: 'cust3',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    name: 'Amadou Baba',
    phone: '+237 655 443 322',
    email: 'baba.amadou@trader.cm',
    location: 'Maroua',
    notes: 'Wholesale client for bulk rice.',
    totalOrders: 24,
    totalSpent: 2850000,
    createdAt: '2023-02-20T10:00:00Z',
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod1',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    name: 'Riz Long Grain 5kg',
    category: 'Food',
    quantity: 15,
    costPrice: 4500,
    sellingPrice: 5500,
    supplierId: 'sup1',
    lowStockLevel: 20,
    status: 'active',
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 'prod2',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    name: 'Savon Azur 400g',
    category: 'Cleaning',
    quantity: 120,
    costPrice: 400,
    sellingPrice: 550,
    supplierId: 'sup2',
    lowStockLevel: 50,
    status: 'active',
    createdAt: '2023-01-15T10:30:00Z',
  },
];

export const MOCK_SALES: Sale[] = [
  {
    id: 'SALE-1001',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    customerId: 'cust1',
    productsSold: [{ productId: 'prod1', quantity: 2, priceAtSale: 5500 }],
    totalAmount: 11000,
    paymentMethod: 'Cash',
    saleDate: '2024-05-21T09:30:00Z',
    recordedBy: 'user123',
    createdAt: '2024-05-21T09:30:00Z',
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'EXP-2001',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    category: 'Rent',
    amount: 150000,
    date: '2024-05-01',
    description: 'Monthly warehouse rent',
    recordedBy: 'user123',
    createdAt: '2024-05-01T10:00:00Z',
  },
  {
    id: 'EXP-2002',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    category: 'Utilities',
    amount: 45000,
    date: '2024-05-05',
    description: 'Electricity bill (ENEO)',
    recordedBy: 'user123',
    createdAt: '2024-05-05T14:30:00Z',
  },
  {
    id: 'EXP-2003',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    category: 'Transport',
    amount: 12500,
    date: '2024-05-10',
    description: 'Fuel for delivery truck',
    recordedBy: 'user123',
    createdAt: '2024-05-10T09:00:00Z',
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task1',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    title: 'Re-stock Beverages',
    description: 'Order more sodas and water for the weekend rush.',
    assignedTo: 'staff1',
    assignedToName: 'Marie Claire',
    assignedBy: 'user123',
    department: 'Sales',
    priority: 'High',
    status: 'Pending',
    startDate: '2024-05-20',
    dueDate: '2024-05-22',
    createdAt: '2024-05-19T14:00:00Z',
  }
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log1',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    userId: 'user123',
    userName: 'Jean-Pierre Kamga',
    userRole: 'Business Owner',
    actionType: 'LOGIN',
    module: 'Auth',
    description: 'User logged in to the platform',
    timestamp: new Date().toISOString(),
  }
];
