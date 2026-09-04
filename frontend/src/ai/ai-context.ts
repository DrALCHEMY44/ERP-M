/**
 * @fileOverview RBAC-filtered tenant context fetcher for the AI assistant.
 *
 * Queries the Neon PostgreSQL database for real business data,
 * then filters the results based on the user's role before injecting into the
 * OpenRouter system prompt. This ensures the LLM never sees data the user is not
 * authorized to access.
 *
 * SECURITY: This module runs server-side only. It must never be imported from
 * a "use client" module.
 *
 * CURRENCY: All monetary values are rounded to integers (FCFA has no subdivisions)
 * before being placed in the context to prevent floating-point formatting anomalies.
 */

import { adminDatabase } from '@/lib/server/auth';
import { listOperationalProducts, listOperationalTransactions } from '@/lib/server/operational-data';
import { externalReference, redactForExternalModel } from '@/lib/server/ai-safety';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The structured context object injected into the OpenRouter system prompt. */
export interface TenantContext {
  meta: {
    userRole: string;
    generatedAt: string;
    currency: 'FCFA';
    unavailableModules: string[];
    truncatedModules: string[];
  };
  products?: ProductSummary[];
  inventory?: InventorySummary;
  financials?: FinancialSummary;
  transactions?: TransactionRecord[];
  customers?: CustomerSummary[];
  suppliers?: SupplierSummary[];
  employees?: EmployeeSummary[];
  tasks?: TaskSummary[];
  activityLogs?: ActivityLogEntry[];
  documents?: DocumentSummary[];
  documentEvidence?: DocumentEvidence[];
}

interface DocumentEvidence {
  citation: string;
  title: string;
  classification: string;
  content: string;
  relevance: number;
}

interface ProductSummary {
  name: string;
  category: string | null;
  quantity: number;
  sellingPrice: number; // integer FCFA
  costPrice: number | null; // integer FCFA — null for non-financial roles
  lowStockLevel: number | null;
  isLowStock: boolean;
}

interface InventorySummary {
  totalProducts: number;
  lowStockCount: number;
  totalStockValue: number; // integer FCFA
}

interface FinancialSummary {
  totalSales: number; // integer FCFA
  totalExpenses: number; // integer FCFA
  netProfit: number; // integer FCFA
  transactionCount: number;
  salesCount: number;
  expenseCount: number;
  currentMonth: {
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    transactionCount: number;
  };
}

interface TransactionRecord {
  type: string;
  amount: number; // integer FCFA
  date: string;
  category: string | null;
}

interface CustomerSummary {
  reference: string;
  location: string | null;
  totalOrders: number | null;
  totalSpent: number | null; // integer FCFA
}

interface SupplierSummary {
  reference: string;
}

interface EmployeeSummary {
  reference: string;
  position: string;
  department: string | null;
  status: string | null;
  salary?: number | null; // integer FCFA — only for authorized roles
}

interface TaskSummary {
  reference: string;
  title: string;
  status: string;
  priority: string | null;
  dueDate: string;
}

interface ActivityLogEntry {
  actionType: string;
  module: string;
  description: string | null;
  timestamp: string;
}

interface DocumentSummary {
  title: string;
  documentType: string;
  uploadedAt: string;
}

// ---------------------------------------------------------------------------
// Role → Allowed Modules Mapping
// ---------------------------------------------------------------------------

const ROLE_DATA_ACCESS: Record<string, Set<string>> = {
  'Business Owner': new Set([
    'products', 'inventory', 'financials', 'transactions',
    'customers', 'suppliers', 'employees', 'tasks',
    'activityLogs', 'documents', 'salaries',
  ]),
  'Manager': new Set([
    'products', 'inventory', 'transactions',
    'customers', 'suppliers', 'tasks',
    'activityLogs', 'documents',
  ]),
  'Accountant': new Set([
    'products', 'inventory', 'financials', 'transactions', 'documents',
  ]),
  'HR Officer': new Set([
    'employees', 'tasks', 'documents', 'salaries',
  ]),
  'Staff': new Set([
    'products', 'inventory', 'tasks',
  ]),
  'Viewer': new Set([
    'products', 'inventory', 'tasks',
  ]),
  'Platform Super Admin': new Set([]),
};

function canAccess(role: string, module: string): boolean {
  const allowed = ROLE_DATA_ACCESS[role];
  if (!allowed) return false;
  return allowed.has(module);
}

/** Round to integer — FCFA has no fractional units. */
function fcfa(value: number | null | undefined): number {
  if (value == null) return 0;
  return Math.round(value);
}

// ---------------------------------------------------------------------------
// Main Fetcher
// ---------------------------------------------------------------------------

/**
 * Fetches all authorized business data for a given tenant/business/role
 * from Neon and returns a structured context object.
 *
 * This function makes parallel database queries and filters the results
 * by the user's RBAC role before returning.
 */
export async function fetchTenantContext(
  tenantId: string,
  businessId: string,
  role: string,
  userId: string,
): Promise<TenantContext> {
  const context: TenantContext = {
    meta: {
      userRole: role,
      generatedAt: new Date().toISOString(),
      currency: 'FCFA',
      unavailableModules: [],
      truncatedModules: [],
    },
  };

  // Platform Super Admin has no access to tenant-specific business data
  if (role === 'Platform Super Admin') {
    return context;
  }

  const vars = { tenantId, businessId };
  const database = adminDatabase();
  const query = (name: string, input: Record<string, string> = vars): Promise<any> =>
    database.executeQuery(name, input);
  const taskQuery = () => ['Staff', 'Viewer'].includes(role)
    ? query('listTasksAssignedToUser', { ...vars, userId })
    : query('listTasksByBusiness');
  const bounded = <T>(module: string, values: T[], maximum: number) => {
    if (values.length > maximum) context.meta.truncatedModules.push(module);
    return values.slice(0, maximum);
  };

  // Fire all authorized queries in parallel for performance
  const [
    productsResult,
    transactionsResult,
    customersResult,
    suppliersResult,
    employeesResult,
    tasksResult,
    logsResult,
    docsResult,
  ] = await Promise.allSettled([
    canAccess(role, 'products') ? listOperationalProducts(tenantId, businessId).then((products) => ({ data: { products } })) : null,
    canAccess(role, 'transactions') || canAccess(role, 'financials')
      ? listOperationalTransactions(tenantId, businessId).then((transactions) => ({ data: { transactions } }))
      : null,
    canAccess(role, 'customers') ? query('listCustomersByBusiness') : null,
    canAccess(role, 'suppliers') ? query('listSuppliersByBusiness') : null,
    canAccess(role, 'employees') ? query('listEmployeesByBusiness') : null,
    canAccess(role, 'tasks') ? taskQuery() : null,
    canAccess(role, 'activityLogs') ? query('listActivityLogsByBusiness') : null,
    canAccess(role, 'documents') ? query('listDocumentsByBusiness') : null,
  ]);

  const settledModules = [
    { names: ['products', 'inventory'].filter((name) => canAccess(role, name)), enabled: canAccess(role, 'products'), result: productsResult },
    { names: ['transactions', 'financials'].filter((name) => canAccess(role, name)), enabled: canAccess(role, 'transactions') || canAccess(role, 'financials'), result: transactionsResult },
    { names: ['customers'], enabled: canAccess(role, 'customers'), result: customersResult },
    { names: ['suppliers'], enabled: canAccess(role, 'suppliers'), result: suppliersResult },
    { names: ['employees'], enabled: canAccess(role, 'employees'), result: employeesResult },
    { names: ['tasks'], enabled: canAccess(role, 'tasks'), result: tasksResult },
    { names: ['activityLogs'], enabled: canAccess(role, 'activityLogs'), result: logsResult },
    { names: ['documents'], enabled: canAccess(role, 'documents'), result: docsResult },
  ];
  for (const settledModule of settledModules) {
    if (settledModule.enabled && settledModule.result.status === 'rejected') {
      context.meta.unavailableModules.push(...settledModule.names);
    }
  }

  // --- Products & Inventory ---
  if (canAccess(role, 'products')) {
    const products = extractResult(productsResult)?.data?.products ?? [];
    const showCost = canAccess(role, 'financials');

    const visibleProducts = products.map((p: any) => ({
      name: redactForExternalModel(String(p.name)).slice(0, 160),
      category: p.category ?? null,
      quantity: p.quantity,
      sellingPrice: fcfa(p.sellingPrice),
      costPrice: showCost ? fcfa(p.costPrice) : null,
      lowStockLevel: p.lowStockLevel ?? null,
      isLowStock: p.lowStockLevel != null && p.quantity <= p.lowStockLevel,
    }));
    context.products = bounded('products', visibleProducts, 200);

    if (canAccess(role, 'inventory')) {
      const lowStockCount = visibleProducts.filter((p: any) => p.isLowStock).length;
      const totalStockValue = products.reduce(
        (sum: number, p: any) => sum + fcfa(p.sellingPrice) * p.quantity,
        0,
      );
      context.inventory = {
        totalProducts: products.length,
        lowStockCount,
        totalStockValue,
      };
    }
  }

  // --- Transactions & Financials ---
  if (canAccess(role, 'transactions') || canAccess(role, 'financials')) {
    const transactions = extractResult(transactionsResult)?.data?.transactions ?? [];

    if (canAccess(role, 'transactions')) {
      const visibleTransactions = role === 'Manager'
        ? transactions.filter((transaction: any) => transaction.type === 'SALE')
        : transactions;
      context.transactions = bounded('transactions', visibleTransactions.map((t: any) => ({
        type: t.type,
        amount: fcfa(t.amount),
        date: t.date,
        category: t.category ? redactForExternalModel(String(t.category)).slice(0, 120) : null,
      })), 100);
    }

    if (canAccess(role, 'financials')) {
      const sales = transactions.filter((t: any) => t.type === 'SALE');
      const expenses = transactions.filter((t: any) => t.type === 'EXPENSE');
      const totalSales = sales.reduce((s: number, t: any) => s + fcfa(t.amount), 0);
      const totalExpenses = expenses.reduce((s: number, t: any) => s + fcfa(t.amount), 0);
      const currentMonthStart = new Date();
      currentMonthStart.setUTCDate(1);
      currentMonthStart.setUTCHours(0, 0, 0, 0);
      const currentMonthTransactions = transactions.filter(
        (transaction: any) => new Date(transaction.date) >= currentMonthStart,
      );
      const currentMonthSales = currentMonthTransactions
        .filter((transaction: any) => transaction.type === 'SALE')
        .reduce((sum: number, transaction: any) => sum + fcfa(transaction.amount), 0);
      const currentMonthExpenses = currentMonthTransactions
        .filter((transaction: any) => transaction.type === 'EXPENSE')
        .reduce((sum: number, transaction: any) => sum + fcfa(transaction.amount), 0);

      context.financials = {
        totalSales,
        totalExpenses,
        netProfit: totalSales - totalExpenses,
        transactionCount: transactions.length,
        salesCount: sales.length,
        expenseCount: expenses.length,
        currentMonth: {
          totalSales: currentMonthSales,
          totalExpenses: currentMonthExpenses,
          netProfit: currentMonthSales - currentMonthExpenses,
          transactionCount: currentMonthTransactions.length,
        },
      };
    }
  }

  // --- Customers ---
  if (canAccess(role, 'customers')) {
    const customers = extractResult(customersResult)?.data?.customers ?? [];
    context.customers = bounded('customers', customers.map((c: any) => ({
      reference: externalReference('CUSTOMER', businessId, c.id),
      location: c.location ? redactForExternalModel(String(c.location)).slice(0, 120) : null,
      totalOrders: c.totalOrders ?? null,
      totalSpent: c.totalSpent != null ? fcfa(c.totalSpent) : null,
    })), 100);
  }

  // --- Suppliers ---
  if (canAccess(role, 'suppliers')) {
    const suppliers = extractResult(suppliersResult)?.data?.suppliers ?? [];
    context.suppliers = bounded('suppliers', suppliers.map((s: any) => ({
      reference: externalReference('SUPPLIER', businessId, s.id),
    })), 100);
  }

  // --- Employees ---
  if (canAccess(role, 'employees')) {
    const employees = extractResult(employeesResult)?.data?.employees ?? [];
    const showSalary = canAccess(role, 'salaries');

    context.employees = bounded('employees', employees.map((e: any) => ({
      reference: externalReference('EMPLOYEE', businessId, e.id),
      position: redactForExternalModel(String(e.position)).slice(0, 120),
      department: e.department ? redactForExternalModel(String(e.department)).slice(0, 120) : null,
      status: e.status ?? null,
      ...(showSalary ? { salary: fcfa(e.salary) } : {}),
    })), 100);
  }

  // --- Tasks ---
  if (canAccess(role, 'tasks')) {
    const tasks = extractResult(tasksResult)?.data?.tasks ?? [];
    context.tasks = bounded('tasks', tasks.map((t: any) => ({
      reference: externalReference('TASK', businessId, t.id),
      title: redactForExternalModel(String(t.title)).slice(0, 240),
      status: t.status,
      priority: t.priority ?? null,
      dueDate: t.dueDate,
    })), 100);
  }

  // --- Activity Logs ---
  if (canAccess(role, 'activityLogs')) {
    const logs = extractResult(logsResult)?.data?.activityLogs ?? [];
    // Limit to most recent 50 to avoid bloating the prompt
    context.activityLogs = logs.slice(0, 50).map((l: any) => ({
      actionType: l.actionType,
      module: l.module,
      description: l.description ? redactForExternalModel(String(l.description)).slice(0, 500) : null,
      timestamp: l.timestamp,
    }));
  }

  // --- Documents ---
  if (canAccess(role, 'documents')) {
    const docs = extractResult(docsResult)?.data?.documents ?? [];
    context.documents = bounded('documents', docs.map((d: any) => ({
      title: redactForExternalModel(String(d.title)).slice(0, 240),
      documentType: d.documentType,
      uploadedAt: d.uploadedAt,
    })), 50);
  }

  return context;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Safely extracts the value from a PromiseSettledResult.
 * Returns null if the promise was rejected or resolved to null.
 */
function extractResult<T>(result: PromiseSettledResult<T | null>): T | null {
  if (result.status === 'fulfilled') {
    return result.value;
  }
  console.error('[AI Context] Query failed:', result.reason);
  return null;
}
