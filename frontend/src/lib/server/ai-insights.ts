import type { TenantContext } from "@/ai/ai-context"

const formatFcfa = (value: number) => `${Math.round(value).toLocaleString("fr-FR")} FCFA`
const FOOTER = "*This analysis is based solely on the data available in your business account and your current permission level.*"

export function buildDeterministicDashboardInsight(context: TenantContext) {
  const lines: string[] = ["**Business performance snapshot**"]
  const financials = context.financials?.currentMonth

  if (financials) {
    lines.push(
      `- Revenue/Sales: ${formatFcfa(financials.totalSales)}`,
      `- Expenses: ${formatFcfa(financials.totalExpenses)}`,
      `- Net: ${formatFcfa(financials.netProfit)}`,
    )
  }
  if (context.inventory) {
    lines.push(
      `- Inventory: ${context.inventory.totalProducts} products; ${context.inventory.lowStockCount} low-stock alerts.`,
    )
  }
  if (context.tasks) {
    const overdue = context.tasks.filter((task) => {
      const due = new Date(task.dueDate)
      return !Number.isNaN(due.getTime()) && due < new Date() && !["Completed", "Done"].includes(task.status)
    }).length
    lines.push(`- Tasks: ${context.tasks.length} visible; ${overdue} currently overdue.`)
  }
  if (context.meta.unavailableModules.length) {
    lines.push(`- Temporarily unavailable: ${context.meta.unavailableModules.join(", ")}.`)
  }
  if (lines.length === 1) {
    lines.push("- No business metrics are available under your current authorization.")
  }

  if (financials && financials.netProfit < 0) {
    lines.push("- Action: Review this month's expense categories and protect short-term cash flow.")
  } else if (context.inventory?.lowStockCount) {
    lines.push("- Action: Replenish low-stock items before they interrupt sales.")
  } else {
    lines.push("- Action: Continue monitoring cash flow, inventory and overdue tasks.")
  }

  lines.push("", FOOTER)
  return lines.join("\n")
}
