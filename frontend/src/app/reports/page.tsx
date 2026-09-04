
"use client"

import * as React from "react"
import {
  BarChart3,
  PieChart,
  ArrowRight,
  ShoppingCart,
  ShieldCheck,
  ClipboardList,
  Download,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useNeonData } from "@/hooks/use-neon-data"
import { useToast } from "@/hooks/use-toast"
import { getReportSummaryQuery } from "@/lib/data-service"
import { canAccessRoute } from "@/lib/client-access"

const reportCategories = [
  {
    title: "Operations & Sales",
    description: "Revenue trends, product movement, and stock intelligence.",
    icon: ShoppingCart,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    links: [
      { name: "Sales Performance", href: "/reports/sales-inventory" },
      { name: "Inventory Valuation", href: "/reports/sales-inventory" },
      { name: "Top Products", href: "/reports/sales-inventory" }
    ]
  },
  {
    title: "Finance & Profitability",
    description: "P&L statements, expense categorization, and cash flow.",
    icon: BarChart3,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    links: [
      { name: "P&L Summary", href: "/finance" },
      { name: "Expense Analysis", href: "/expenses" },
      { name: "Finance Worksheet", href: "/finance" }
    ]
  },
  {
    title: "Workforce & Tasks",
    description: "Employee utilization, completion rates, and delays.",
    icon: ClipboardList,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    links: [
      { name: "Operational Intelligence", href: "/reports/tasks" },
      { name: "Staff Performance", href: "/reports/tasks" },
      { name: "HR Directory", href: "/employees" }
    ]
  },
  {
    title: "Records & Governance",
    description: "Activity records and tenant-scoped document storage.",
    icon: ShieldCheck,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    links: [
      { name: "Activity Logs", href: "/activity-logs" },
      { name: "Document Vault", href: "/documents" },
      { name: "Activity Trail", href: "/activity-logs" }
    ]
  }
]

export default function ReportsHubPage() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [generating, setGenerating] = React.useState<string | null>(null)
  const { data: summary, loading: summaryLoading } = useNeonData({
    query: getReportSummaryQuery,
    skip: !profile,
    refreshInterval: 30000,
  })
  const role = profile?.role
  const canReadSales = canAccessRoute("/sales", role)
  const canReadExpenses = canAccessRoute("/expenses", role)
  const canReadInventory = canAccessRoute("/inventory", role)
  const canReadTasks = canAccessRoute("/tasks", role)
  const canReadCustomers = canAccessRoute("/customers", role)
  const reportTypes = ([
    ["sales", canReadSales],
    ["expenses", canReadExpenses],
    ["inventory", canReadInventory],
    ["tasks", canReadTasks],
  ] as const).filter((entry) => entry[1]).map((entry) => entry[0])
  const visibleCategories = reportCategories
    .map((category) => ({
      ...category,
      links: category.links.filter((link) => canAccessRoute(link.href, role)),
    }))
    .filter((category) => category.links.length > 0)

  const generateReport = async (reportType: "sales" | "expenses" | "inventory" | "tasks") => {
    if (!user || !profile) return
    setGenerating(reportType)
    try {
      const headers = {
        "Content-Type": "application/json",
      }
      const generated = await fetch("/api/reports/generate", { method: "POST", headers, body: JSON.stringify({ reportType }) })
      if (!generated.ok) throw new Error("Report generation failed")
      const result = await generated.json()
      const download = await fetch(result.fileUrl, { headers })
      if (!download.ok) throw new Error("Report download failed")
      const url = URL.createObjectURL(await download.blob())
      const link = document.createElement("a")
      link.href = url
      link.download = result.filename
      link.click()
      URL.revokeObjectURL(url)
      toast({ title: "Report generated", description: `${result.records} records saved to the document vault.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Generation failed", description: error instanceof Error ? error.message : "Unable to generate report." })
    } finally {
      setGenerating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports & Analytics Hub</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Central Intelligence Command • Cameroon SME Platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase flex items-center gap-2"><Download className="size-4" /> Generate & Store Reports</CardTitle>
          <CardDescription>Creates a private CSV, stores it in the configured S3-compatible object store, and submits it to document-vault indexing.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {reportTypes.map(type => (
            <Button key={type} variant="outline" disabled={!!generating || !user} onClick={() => generateReport(type)} className="capitalize">
              {generating === type && <Loader2 className="size-4 mr-2 animate-spin" />}{type}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleCategories.map((cat, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className={`p-3 rounded-xl ${cat.bgColor} ${cat.color}`}>
                <cat.icon className="size-6" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold">{cat.title}</CardTitle>
                <CardDescription className="text-xs">{cat.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {cat.links.map((link, j) => (
                  <Button key={j} asChild variant="ghost" className="w-full justify-between text-[11px] font-bold uppercase tracking-widest h-10 group">
                    <Link href={link.href}>
                      {link.name}
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-sm font-bold uppercase flex items-center gap-2 text-primary">
            <PieChart className="size-4" />
            Quick Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {canReadSales && <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Recorded Revenue</p>
            <p className="text-xl font-bold">{summaryLoading ? "Loading…" : `${(summary?.totalRevenue || 0).toLocaleString()} FCFA`}</p>
            <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase">Tenant-scoped sales</Badge>
          </div>}
          {canReadInventory && <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Highest-Value Stock Category</p>
            <p className="text-xl font-bold">{summaryLoading ? "Loading…" : summary?.mostValuableCategory || "No inventory"}</p>
            <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase">{(summary?.inventoryValue || 0).toLocaleString()} FCFA stock</Badge>
          </div>}
          {canReadTasks && <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Operational Efficiency</p>
            <p className="text-xl font-bold">{summaryLoading ? "Loading…" : `${summary?.taskCompletionRate || 0}% Completed`}</p>
            <Badge className="bg-blue-100 text-blue-700 text-[9px] font-bold uppercase">{summary?.taskOverdue || 0} overdue</Badge>
          </div>}
          {canReadCustomers && <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Customer Directory</p>
            <p className="text-xl font-bold">{summaryLoading ? "Loading…" : `${summary?.activeCustomers || 0} Records`}</p>
            <Badge className="bg-amber-100 text-amber-700 text-[9px] font-bold uppercase">Tenant-scoped records</Badge>
          </div>}
        </CardContent>
      </Card>
    </div>
  )
}
