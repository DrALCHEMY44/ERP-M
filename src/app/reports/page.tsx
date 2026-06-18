
"use client"

import * as React from "react"
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  Receipt, 
  FileText, 
  History, 
  PieChart, 
  ArrowRight,
  ShoppingCart,
  Truck,
  ShieldCheck,
  ClipboardList
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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
      { name: "Tax Readiness", href: "/finance" }
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
    title: "Audit & Compliance",
    description: "Activity logs, document vaults, and system integrity.",
    icon: ShieldCheck,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    links: [
      { name: "Activity Logs", href: "/activity-logs" },
      { name: "Document Vault", href: "/documents" },
      { name: "Audit Trail", href: "/activity-logs" }
    ]
  }
]

export default function ReportsHubPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Reports & Analytics Hub</h1>
        <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Central Intelligence Command • Cameroon SME Platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCategories.map((cat, i) => (
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
                  <Link key={j} href={link.href}>
                    <Button variant="ghost" className="w-full justify-between text-[11px] font-bold uppercase tracking-widest h-10 group">
                      {link.name}
                      <ArrowRight className="size-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
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
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Most Profitable Category</p>
            <p className="text-xl font-bold">Food & Beverage</p>
            <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase">32% of Margin</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Operational Efficiency</p>
            <p className="text-xl font-bold">84% On-Time</p>
            <Badge className="bg-blue-100 text-blue-700 text-[9px] font-bold uppercase">+5% from last month</Badge>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Customer Retention</p>
            <p className="text-xl font-bold">12 Active VIPs</p>
            <Badge className="bg-amber-100 text-amber-700 text-[9px] font-bold uppercase">Loyalty Sync Active</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
