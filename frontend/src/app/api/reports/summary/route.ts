import { NextResponse } from "next/server"

import { hasPermission, requirePermission } from "@/lib/server/authorization"
import { adminDatabase, authorizeRequest } from "@/lib/server/auth"
import { db } from "@/lib/server/neon"

export const runtime = "nodejs"

type NumberRow = Record<string, string | number | null>

function number(value: unknown) {
  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

export async function GET(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "reports:read")
    const sql = db()
    const database = adminDatabase()
    const canReadSales = hasPermission(profile, "sales:read")
    const canReadExpenses = hasPermission(profile, "expenses:read")
    const canReadInventory = hasPermission(profile, "inventory:read")
    const canReadTasks = hasPermission(profile, "tasks:read")
    const canReadCustomers = hasPermission(profile, "customers:read")
    const [financialRows, inventoryRows, trendRows, topProductRows, categoryRows, taskResult, customerResult] = await Promise.all([
      canReadSales || canReadExpenses ? sql`SELECT
            COALESCE(SUM(CASE WHEN type='SALE' THEN amount ELSE 0 END),0) AS total_revenue,
            COALESCE(SUM(CASE WHEN type='EXPENSE' THEN amount ELSE 0 END),0) AS total_expenses
          FROM transactions
          WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId}` : Promise.resolve([]),
      canReadInventory ? sql`SELECT
            COALESCE(SUM(quantity * COALESCE(cost_price,0)),0) AS inventory_value,
            COALESCE(SUM(quantity),0) AS total_items,
            COUNT(*) FILTER (WHERE quantity <= COALESCE(low_stock_level,0)) AS low_stock_count
          FROM products
          WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId}` : Promise.resolve([]),
      canReadSales ? sql`SELECT TO_CHAR(DATE_TRUNC('month', date), 'YYYY-MM') AS month, COALESCE(SUM(amount),0) AS sales
          FROM transactions
          WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId}
            AND type='SALE' AND date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
          GROUP BY DATE_TRUNC('month', date)
          ORDER BY DATE_TRUNC('month', date)` : Promise.resolve([]),
      canReadSales ? sql`SELECT p.id, p.name, COALESCE(SUM(sl.quantity),0) AS quantity, COALESCE(SUM(sl.line_total),0) AS revenue
          FROM sale_lines sl
          JOIN products p ON p.id=sl.product_id AND p.tenant_id=sl.tenant_id AND p.business_id=sl.business_id
          WHERE sl.tenant_id=${profile.tenantId} AND sl.business_id=${profile.businessId}
          GROUP BY p.id,p.name
          ORDER BY revenue DESC
          LIMIT 5` : Promise.resolve([]),
      canReadInventory ? sql`SELECT COALESCE(category,'Uncategorized') AS category,
            COALESCE(SUM(quantity * COALESCE(cost_price,0)),0) AS value
          FROM products
          WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId}
          GROUP BY COALESCE(category,'Uncategorized')
          ORDER BY value DESC
          LIMIT 1` : Promise.resolve([]),
      canReadTasks ? database.executeQuery<{ tasks: Array<{ status?: string; dueDate?: string }> }, Record<string, unknown>>(
        "listTasksByBusiness",
        { tenantId: profile.tenantId, businessId: profile.businessId },
      ) : Promise.resolve({ data: { tasks: [] } }),
      canReadCustomers ? database.executeQuery<{ customers: Array<{ id: string }> }, Record<string, unknown>>(
        "listCustomersByBusiness",
        { tenantId: profile.tenantId, businessId: profile.businessId },
      ) : Promise.resolve({ data: { customers: [] } }),
    ])

    const financial = financialRows[0] as NumberRow | undefined
    const inventory = inventoryRows[0] as NumberRow | undefined
    const totalRevenue = number(financial?.total_revenue)
    const totalExpenses = number(financial?.total_expenses)
    const tasks = taskResult.data.tasks ?? []
    const now = Date.now()
    const taskCompleted = tasks.filter((task) => task.status === "COMPLETED").length
    const taskOverdue = tasks.filter((task) => {
      if (task.status === "COMPLETED") return false
      if (task.status === "LATE") return true
      const due = task.dueDate ? new Date(task.dueDate).getTime() : Number.NaN
      return Number.isFinite(due) && due < now
    }).length

    return NextResponse.json({
      totalRevenue: canReadSales ? totalRevenue : null,
      totalExpenses: canReadExpenses ? totalExpenses : null,
      netProfit: canReadSales && canReadExpenses ? totalRevenue - totalExpenses : null,
      inventoryValue: canReadInventory ? number(inventory?.inventory_value) : null,
      totalItems: canReadInventory ? number(inventory?.total_items) : null,
      lowStockCount: canReadInventory ? number(inventory?.low_stock_count) : null,
      activeCustomers: canReadCustomers ? customerResult.data.customers?.length ?? 0 : null,
      taskTotal: canReadTasks ? tasks.length : null,
      taskCompleted: canReadTasks ? taskCompleted : null,
      taskOverdue: canReadTasks ? taskOverdue : null,
      taskCompletionRate: canReadTasks ? (tasks.length ? Math.round((taskCompleted / tasks.length) * 100) : 0) : null,
      mostValuableCategory: canReadInventory ? String((categoryRows[0] as NumberRow | undefined)?.category ?? "") || null : null,
      revenueTrend: trendRows.map((row) => ({
        month: String((row as NumberRow).month),
        sales: number((row as NumberRow).sales),
      })),
      topProducts: topProductRows.map((row) => ({
        id: String((row as NumberRow).id),
        name: String((row as NumberRow).name),
        quantity: number((row as NumberRow).quantity),
        revenue: number((row as NumberRow).revenue),
      })),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Report summary failed"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
