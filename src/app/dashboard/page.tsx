"use client"

import * as React from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { 
  ShoppingCart, 
  Receipt, 
  TrendingUp, 
  AlertTriangle,
  Users,
  UserCircle,
  Truck,
  Briefcase,
  Loader2,
  Sparkles,
  History,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useFirestore } from "@/hooks/use-firestore"
import { Sale, Product, Expense, Task, UserProfile, Customer, ActivityLog } from "@/lib/types"
import { businessPerformanceSummary } from "@/ai/flows/business-performance-summary-flow"
import { MOCK_USER } from "@/lib/mock-data"
import Link from "next/link"

export default function DashboardPage() {
  const { data: sales, loading: salesLoading } = useFirestore<Sale>('sales');
  const { data: products, loading: productsLoading } = useFirestore<Product>('products');
  const { data: expenses, loading: expensesLoading } = useFirestore<Expense>('expenses');
  const { data: tasks, loading: tasksLoading } = useFirestore<Task>('tasks');
  const { data: customers, loading: customersLoading } = useFirestore<Customer>('customers');
  const { data: logs, loading: logsLoading } = useFirestore<ActivityLog>('activity_logs');

  const [aiSummary, setAiSummary] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  // Aggregations
  const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalExpensesAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netProfit = totalSalesAmount - totalExpensesAmount;
  const lowStockCount = products.filter(p => p.quantity <= p.lowStockLevel).length;
  
  const taskStats = {
    pending: tasks.filter(t => t.status === 'Pending').length,
    ongoing: tasks.filter(t => t.status === 'Ongoing').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.status === 'Overdue' || t.status === 'Late').length,
  };

  const isLoading = salesLoading || productsLoading || expensesLoading || tasksLoading || customersLoading || logsLoading;

  const fetchAiSummary = async () => {
    setIsAiLoading(true);
    try {
      const result = await businessPerformanceSummary({
        period: 'this month',
        tenantId: MOCK_USER.tenantId,
        businessId: MOCK_USER.businessId,
        userId: MOCK_USER.uid,
        userRole: MOCK_USER.role,
      });
      setAiSummary(result.summary);
    } catch (error) {
      console.error("AI Summary Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  React.useEffect(() => {
    if (!isLoading) {
      fetchAiSummary();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="size-10 animate-spin text-primary" />
      </div>
    );
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-headline">Executive Overview</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Real-time Tenant Intelligence • Cameroon</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest" onClick={fetchAiSummary} disabled={isAiLoading}>
            {isAiLoading ? <Loader2 className="size-3 mr-2 animate-spin" /> : <Sparkles className="size-3 mr-2" />}
            Refresh AI Summary
          </Button>
        </div>
      </div>

      {/* Primary Financial Stats */}
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
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          className="border-t-4 border-[#ef4444] shadow-md"
          description={`${products.length} Items Tracked`}
        />
      </div>

      {/* Management Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-card border p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Users className="size-3 text-muted-foreground" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Team</span>
          </div>
          <p className="text-lg font-bold">12</p>
        </div>
        <div className="bg-card border p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <UserCircle className="size-3 text-muted-foreground" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Clients</span>
          </div>
          <p className="text-lg font-bold">{customers.length}</p>
        </div>
        <div className="bg-card border p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Truck className="size-3 text-muted-foreground" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Suppliers</span>
          </div>
          <p className="text-lg font-bold">8</p>
        </div>
        <div className="bg-card border p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="size-3 text-muted-foreground" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Tasks</span>
          </div>
          <p className="text-lg font-bold">{tasks.length}</p>
        </div>
        <div className="bg-card border p-3 rounded-xl shadow-sm col-span-2 hidden lg:block">
           <div className="flex items-center gap-2 mb-1">
            <Briefcase className="size-3 text-muted-foreground" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Late Tasks</span>
          </div>
          <p className="text-lg font-bold text-destructive">{taskStats.overdue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI & Main Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Generated Business Summary */}
          <Card className="bg-primary/5 border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-primary/10 bg-primary/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                  <Sparkles className="size-4" />
                  AI PERFORMANCE INSIGHTS
                </CardTitle>
                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-white/50">Live Analysis</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isAiLoading ? (
                <div className="space-y-2 py-4">
                  <div className="h-3 w-full bg-primary/10 animate-pulse rounded" />
                  <div className="h-3 w-3/4 bg-primary/10 animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-primary/10 animate-pulse rounded" />
                </div>
              ) : (
                <p className="text-sm text-foreground leading-relaxed italic">
                  {aiSummary || "Your business intelligence summary will appear here..."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Revenue Performance</CardTitle>
              <CardDescription className="text-xs uppercase font-bold tracking-tighter">Daily Sales Volume (FCFA)</CardDescription>
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

          {/* Task Status Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Pending</span>
                <span className="text-2xl font-bold">{taskStats.pending}</span>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1 text-blue-600">Ongoing</span>
                <span className="text-2xl font-bold text-blue-600">{taskStats.ongoing}</span>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1 text-emerald-600">Done</span>
                <span className="text-2xl font-bold text-emerald-600">{taskStats.completed}</span>
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center border-2 border-destructive/20 bg-destructive/5">
                <span className="text-[10px] font-bold text-destructive uppercase mb-1">Overdue</span>
                <span className="text-2xl font-bold text-destructive">{taskStats.overdue}</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right: Transactions & Logs */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase">Recent Sales</CardTitle>
              <Link href="/sales">
                <Button variant="ghost" size="icon" className="h-6 w-6"><ArrowRight className="size-4" /></Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sales.slice(0, 5).map((sale) => (
                  <div key={sale.id} className="flex items-center gap-3 text-sm border-b pb-3 last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                      {sale.paymentMethod[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{sale.totalAmount.toLocaleString()} FCFA</p>
                      <p className="text-muted-foreground text-[9px] uppercase font-medium">{sale.paymentMethod} • {new Date(sale.saleDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                {sales.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No recent sales found.</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase">Activity Log</CardTitle>
              <History className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logs.slice(0, 8).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs border-b pb-3 last:border-0 last:pb-0">
                    <div className="mt-0.5">
                       <Badge variant="outline" className="text-[8px] px-1 h-4">{log.actionType}</Badge>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{log.description}</p>
                      <p className="text-muted-foreground text-[9px] uppercase font-bold">{log.userName} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
                {logs.length === 0 && <p className="text-xs text-muted-foreground text-center py-6">No recent activity.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
