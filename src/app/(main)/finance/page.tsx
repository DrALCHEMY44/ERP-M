"use client"

import * as React from "react"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  FileSpreadsheet, 
  ArrowUpRight, 
  ArrowDownRight,
  Download,
  Filter,
  Eye,
  Lock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { MOCK_USER, MOCK_SALES, MOCK_EXPENSES } from "@/lib/mock-data"

const financialData = [
  { month: "Jan", revenue: 2500000, expenses: 1800000 },
  { month: "Feb", revenue: 2800000, expenses: 1900000 },
  { month: "Mar", revenue: 3200000, expenses: 2100000 },
  { month: "Apr", revenue: 2900000, expenses: 2000000 },
  { month: "May", revenue: 3500000, expenses: 2200000 },
  { month: "Jun", revenue: 3800000, expenses: 2400000 },
]

export default function FinancePage() {
  const isAuthorized = ["Business Owner", "Accountant", "Manager"].includes(MOCK_USER.role)

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <div className="bg-muted p-6 rounded-full">
          <Lock className="size-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md">
          You do not have the necessary permissions to view detailed financial records. Please contact your administrator.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  const totalRevenue = financialData.reduce((acc, curr) => acc + curr.revenue, 0)
  const totalExpenses = financialData.reduce((acc, curr) => acc + curr.expenses, 0)
  const netProfit = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Finance & Accounting</h1>
          <p className="text-muted-foreground">Manage cash flow, profit margins, and financial reports.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-2" /> Export PDF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <FileSpreadsheet className="size-4 mr-2" /> Tax Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-500 border-t-4 shadow-sm bg-blue-50/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total Revenue (YTD)</CardDescription>
            <CardTitle className="text-2xl font-bold">{totalRevenue.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <ArrowUpRight className="size-3" /> +15.2%
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500 border-t-4 shadow-sm bg-amber-50/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total Expenses (YTD)</CardDescription>
            <CardTitle className="text-2xl font-bold">{totalExpenses.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-destructive font-bold">
              <ArrowUpRight className="size-3" /> +4.8%
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500 border-t-4 shadow-sm bg-emerald-50/10">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Net Profit</CardDescription>
            <CardTitle className="text-2xl font-bold">{netProfit.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <TrendingUp className="size-3" /> Healthy Margin
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary border-t-4 shadow-sm bg-primary/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Cash on Hand</CardDescription>
            <CardTitle className="text-2xl font-bold">4,250,000 FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Wallet className="size-3" /> Bank & Mobile Money
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Comparative monthly analysis (Current Year)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer
              config={{
                revenue: { label: "Revenue", color: "hsl(var(--primary))" },
                expenses: { label: "Expenses", color: "hsl(var(--destructive))" },
              }}
            >
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(val) => `${val / 1000000}M`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Financial management tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <ArrowUpRight className="size-4 mr-2 text-emerald-500" /> Create Invoice
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ArrowDownRight className="size-4 mr-2 text-destructive" /> Pay Supplier
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Wallet className="size-4 mr-2 text-blue-500" /> Bank Reconciliation
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Download className="size-4 mr-2" /> Export Ledger (CSV)
            </Button>
            <div className="pt-4 border-t mt-4">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Tax Compliance</p>
              <div className="bg-muted/50 p-3 rounded-lg">
                <div className="flex justify-between text-xs mb-1">
                  <span>VAT Estimated</span>
                  <span className="font-bold">450,200 FCFA</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Next Filing Date</span>
                  <span className="font-bold text-amber-600">June 15, 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Invoices, payments, and expense logs</CardDescription>
          </div>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { ref: "INV-8821", type: "Invoice", entity: "Boulangerie du Centre", date: "2024-05-21", status: "Paid", amount: 450000, color: "text-emerald-600" },
                { ref: "EXP-2002", type: "Expense", entity: "ENEO Cameroon", date: "2024-05-20", status: "Completed", amount: -45000, color: "text-destructive" },
                { ref: "INV-8822", type: "Invoice", entity: "Hotel de la Paix", date: "2024-05-19", status: "Pending", amount: 1200000, color: "text-amber-600" },
                { ref: "PAY-901", type: "Payment", entity: "Staff Salaries", date: "2024-05-15", status: "Completed", amount: -850000, color: "text-destructive" },
              ].map((tx) => (
                <TableRow key={tx.ref}>
                  <TableCell className="font-mono font-bold text-xs">{tx.ref}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{tx.type}</Badge>
                  </TableCell>
                  <TableCell>{tx.entity}</TableCell>
                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={tx.status === 'Paid' || tx.status === 'Completed' ? 'default' : 'secondary'}>
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-bold ${tx.color}`}>
                    {tx.amount.toLocaleString()} FCFA
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
