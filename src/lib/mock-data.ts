import { UserProfile, Business, Product, Task } from './types';

export const MOCK_USER: UserProfile = {
  uid: 'user123',
  email: 'owner@kobocore.com',
  fullName: 'Jean-Pierre Kamga',
  tenantId: 'tenant_douala_001',
  businessId: 'biz_superette_central',
  role: 'Business Owner',
  permissions: ['*'],
  createdAt: '2023-01-10T08:00:00Z',
};

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
  },
  {
    id: 'task2',
    tenantId: 'tenant_douala_001',
    businessId: 'biz_superette_central',
    title: 'Monthly Inventory Audit',
    description: 'Verify all physical stock counts against system records.',
    assignedTo: 'user123',
    assignedToName: 'Jean-Pierre Kamga',
    assignedBy: 'user123',
    department: 'Management',
    priority: 'Medium',
    status: 'Ongoing',
    startDate: '2024-05-01',
    dueDate: '2024-05-30',
    createdAt: '2024-04-28T09:00:00Z',
  }
];
