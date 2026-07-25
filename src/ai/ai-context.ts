/**
 * @fileOverview RBAC-filtered tenant context fetcher for the AI assistant.
 *
 * Queries the Firebase Data Connect PostgreSQL database for real business data,
 * then filters the results based on the user's role before injecting into the
 * Gemma 4 system prompt. This ensures the LLM never sees data the user is not
 * authorized to access.
 *
 * SECURITY: This module runs server-side only. It must never be imported from
 * a "use client" module.
 *
 * CURRENCY: All monetary values are rounded to integers (FCFA has no subdivisions)
 * before being placed in the context to prevent floating-point formatting anomalies.
 */

import type { Role } from '@/lib/types';
// Side-effect import: ensures Firebase initializeApp() has been called
// before any Data Connect SDK queries execute in this server-side context.
import '@/lib/firebase';
import {
  listProductsByBusinessQuery,
  listTransactionsByBusinessQuery,
  listCustomersByBusinessQuery,
  listSuppliersByBusinessQuery,
  listEmployeesByBusinessQuery,
  listTasksByBusinessQuery,
  listActivityLogsByBusinessQuery,
  listDocumentsByBusinessQuery,
} from '@/lib/data-service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The structured context object injected into the Gemma 4 system prompt. */
export interface TenantContext {
  meta: {
    tenantId: string;
    businessId: string;
    userRole: string;
    generatedAt: string;
    currency: 'FCFA';
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
}

interface ProductSummary {
  id: string;
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
}

interface TransactionRecord {
  id: string;
  type: string;
  amount: number; // integer FCFA
  date: string;
  category: string | null;
  recordedBy: string;
}

interface CustomerSummary {
  id: string;
  name: string;
  phone: string | null;
  location: string | null;
  totalOrders: number | null;
  totalSpent: number | null; // integer FCFA
}

interface SupplierSummary {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
}

interface EmployeeSummary {
  id: string;
  fullName: string;
  position: string;
  department: string | null;
  status: string | null;
  salary?: number | null; // integer FCFA — only for authorized roles
}

interface TaskSummary {
  id: string;
  title: string;
  status: string;
  priority: string | null;
  dueDate: string;
  assignedTo: string | null;
}

interface ActivityLogEntry {
  userName: string;
  actionType: string;
  module: string;
  description: string | null;
  timestamp: string;
}

interface DocumentSummary {
  title: string;
  documentType: string;
  uploadedBy: string;
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
 * from Firebase Data Connect and returns a structured context object.
 *
 * This function makes parallel database queries and filters the results
 * by the user's RBAC role before returning.
 */
export async function fetchTenantContext(
  tenantId: string,
  businessId: string,
  role: string,
): Promise<TenantContext> {
  const context: TenantContext = {
    meta: {
      tenantId,
      businessId,
      userRole: role,
      generatedAt: new Date().toISOString(),
      currency: 'FCFA',
    },
  };

  // Platform Super Admin has no access to tenant-specific business data
  if (role === 'Platform Super Admin') {
    return context;
  }

  const vars = { tenantId, businessId };

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
    canAccess(role, 'products') ? listProductsByBusinessQuery(vars) : null,
    canAccess(role, 'transactions') || canAccess(role, 'financials')
      ? listTransactionsByBusinessQuery(vars)
      : null,
    canAccess(role, 'customers') ? listCustomersByBusinessQuery(vars) : null,
    canAccess(role, 'suppliers') ? listSuppliersByBusinessQuery(vars) : null,
    canAccess(role, 'employees') ? listEmployeesByBusinessQuery(vars) : null,
    canAccess(role, 'tasks') ? listTasksByBusinessQuery(vars) : null,
    canAccess(role, 'activityLogs') ? listActivityLogsByBusinessQuery(vars) : null,
    canAccess(role, 'documents') ? listDocumentsByBusinessQuery(vars) : null,
  ]);

  // --- Products & Inventory ---
  if (canAccess(role, 'products')) {
    const products = extractResult(productsResult)?.data?.products ?? [];
    const showCost = canAccess(role, 'financials') || canAccess(role, 'transactions');

    context.products = products.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category ?? null,
      quantity: p.quantity,
      sellingPrice: fcfa(p.sellingPrice),
      costPrice: showCost ? fcfa(p.costPrice) : null,
      lowStockLevel: p.lowStockLevel ?? null,
      isLowStock: p.lowStockLevel != null && p.quantity <= p.lowStockLevel,
    }));

    if (canAccess(role, 'inventory')) {
      const lowStockCount = context.products.filter((p) => p.isLowStock).length;
      const totalStockValue = products.reduce(
        (sum, p) => sum + fcfa(p.sellingPrice) * p.quantity,
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
      context.transactions = transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: fcfa(t.amount),
        date: t.date,
        category: t.category ?? null,
        recordedBy: t.recordedBy,
      }));
    }

    if (canAccess(role, 'financials')) {
      const sales = transactions.filter((t) => t.type === 'SALE');
      const expenses = transactions.filter((t) => t.type === 'EXPENSE');
      const totalSales = sales.reduce((s, t) => s + fcfa(t.amount), 0);
      const totalExpenses = expenses.reduce((s, t) => s + fcfa(t.amount), 0);

      context.financials = {
        totalSales,
        totalExpenses,
        netProfit: totalSales - totalExpenses,
        transactionCount: transactions.length,
        salesCount: sales.length,
        expenseCount: expenses.length,
      };
    }
  }

  // --- Customers ---
  if (canAccess(role, 'customers')) {
    const customers = extractResult(customersResult)?.data?.customers ?? [];
    context.customers = customers.map((c) => ({
      id: c.id,
      name: c.customerName,
      phone: c.phoneNumber ?? null,
      location: c.location ?? null,
      totalOrders: c.totalOrders ?? null,
      totalSpent: c.totalSpent != null ? fcfa(c.totalSpent) : null,
    }));
  }

  // --- Suppliers ---
  if (canAccess(role, 'suppliers')) {
    const suppliers = extractResult(suppliersResult)?.data?.suppliers ?? [];
    context.suppliers = suppliers.map((s) => ({
      id: s.id,
      name: s.supplierName,
      phone: s.phoneNumber ?? null,
      email: s.email ?? null,
    }));
  }

  // --- Employees ---
  if (canAccess(role, 'employees')) {
    const employees = extractResult(employeesResult)?.data?.employees ?? [];
    const showSalary = canAccess(role, 'salaries');

    context.employees = employees.map((e) => ({
      id: e.id,
      fullName: e.fullName,
      position: e.position,
      department: e.department ?? null,
      status: e.status ?? null,
      ...(showSalary ? { salary: fcfa(e.salary) } : {}),
    }));
  }

  // --- Tasks ---
  if (canAccess(role, 'tasks')) {
    const tasks = extractResult(tasksResult)?.data?.tasks ?? [];
    context.tasks = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority ?? null,
      dueDate: t.dueDate,
      assignedTo: t.assignedTo?.fullName ?? null,
    }));
  }

  // --- Activity Logs ---
  if (canAccess(role, 'activityLogs')) {
    const logs = extractResult(logsResult)?.data?.activityLogs ?? [];
    // Limit to most recent 50 to avoid bloating the prompt
    context.activityLogs = logs.slice(0, 50).map((l) => ({
      userName: l.userName,
      actionType: l.actionType,
      module: l.module,
      description: l.description ?? null,
      timestamp: l.timestamp,
    }));
  }

  // --- Documents ---
  if (canAccess(role, 'documents')) {
    const docs = extractResult(docsResult)?.data?.documents ?? [];
    context.documents = docs.map((d) => ({
      title: d.title,
      documentType: d.documentType,
      uploadedBy: d.uploadedBy,
      uploadedAt: d.uploadedAt,
    }));
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
