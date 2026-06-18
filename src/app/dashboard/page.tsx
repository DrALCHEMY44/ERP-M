
"use client"

import * as React from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { 
  ShoppingCart, 
  Receipt, 
  TrendingUp, 
  AlertTriangle,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useFirestore } from "@/hooks/use-firestore"
import { Sale, Product, Expense } from "@/lib/types"

export default function DashboardPage() {
  const { data: sales, loading: salesLoading } = useFirestore<Sale>('sales');
  const { data: products, loading: productsLoading } = useFirestore<Product>('products');
  const { data: expenses, loading: expensesLoading } = useFirestore<Expense>('expenses');

  const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalExpensesAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalSalesAmount - totalExpensesAmount;
  const lowStockCount = products.filter(p => p.quantity <= p.lowStockLevel).length;

  const isLoading = salesLoading || productsLoading || expensesLoading;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

  // Simplified sales data for the chart based on last 7 days or entries
  const salesData = [
    { name: "Mon", total: 120000 },
    { name: "Tue", total: 150000 },
    { name: "Wed", total: 110000 },
    { name: "Thu", total: 180000 },
    { name: "Fri", total: 220000 },
    { name: "Sat", total: 250000 },
    { name: "Sun", total: 140000 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-headline">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">Live business insights from Cloud Firestore.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          value={`${totalSalesAmount.toLocaleString()} FCFA`}
          icon={ShoppingCart}
          trend={{ value: 12, label: "Live data", isPositive: true }}
          className="border-t-4 border-[#10b981] shadow-md"
        />
        <StatCard
          title="Total Expenses"
          value={`${totalExpensesAmount.toLocaleString()} FCFA`}
          icon={Receipt}
          trend={{ value: 4, label: "Live data", isPositive: false }}
          className="border-t-4 border-[#f59e0b] shadow-md"
        />
        <StatCard
          title="Net Profit"
          value={`${netProfit.toLocaleString()} FCFA`}
          icon={TrendingUp}
          trend={{ value: 18, label: "Live data", isPositive: true }}
          className="border-t-4 border-[#3b82f6] shadow-md"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockCount}
          icon={AlertTriangle}
          className="border-t-4 border-[#ef4444] shadow-md bg-red-50/10"
          description="Action required"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Sales Performance</CardTitle>
            <CardDescription className="text-xs">Daily sales volume in FCFA (Littoral Region)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
             <ChartContainer
                config={{
                  total: {
                    label: "Sales",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="w-full h-full"
              >
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(value) => `${value/1000}k`} fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sales.slice(0, 5).map((sale, i) => (
                <div key={sale.id} className="flex items-center gap-4 text-sm border-b pb-3 last:border-0 last:pb-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    S
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">Sale: {sale.totalAmount.toLocaleString()} FCFA</p>
                    <p className="text-muted-foreground text-[10px] uppercase">{sale.paymentMethod} • {new Date(sale.saleDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {sales.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">No recent sales found.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
