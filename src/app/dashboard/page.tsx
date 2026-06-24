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
  ArrowRight,
  LogIn
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { 
  listTransactionsByBusinessQuery,
  listProductsByBusinessQuery,
  listTasksByBusinessQuery,
  listCustomersByBusinessQuery,
  listActivityLogsByUserQuery,
  listEmployeesByBusinessQuery,
  listSuppliersByBusinessQuery
} from "@/lib/data-service"
import { businessPerformanceSummary } from "@/ai/flows/business-performance-summary-flow"
import { MOCK_USER } from "@/lib/mock-data"
import Link from "next/link"
import { useTranslation } from "@/components/language-provider"
import { Sale, Product, Expense, Task, Customer, ActivityLog } from "@/lib/types"

export default function DashboardPage() {
  const { t } = useTranslation();
  
  const { data: salesDataResult, loading: salesLoading, unauthenticated } = useDataConnect({ query: listTransactionsByBusinessQuery, variables: { tenantId: MOCK_USER.businessId, businessId: MOCK_USER.businessId } });
  const { data: productsData, loading: productsLoading } = useDataConnect({ query: listProductsByBusinessQuery, variables: { tenantId: MOCK_USER.businessId, businessId: MOCK_USER.businessId } });
  // Note: Assuming transactions represent both sales and expenses. Filtering will be done client-side for now based on 'type'.
  const { data: expensesDataResult, loading: expensesLoading } = useDataConnect({ query: listTransactionsByBusinessQuery, variables: { tenantId: MOCK_USER.businessId, businessId: MOCK_USER.businessId } }); 
  const { data: tasksData, loading: tasksLoading } = useDataConnect({ query: listTasksByBusinessQuery, variables: { tenantId: MOCK_USER.businessId, businessId: MOCK_USER.businessId } });
  const { data: customersData, loading: customersLoading } = useDataConnect({ query: listCustomersByBusinessQuery, variables: { tenantId: MOCK_USER.businessId, businessId: MOCK_USER.businessId } });
  const { data: logsData, loading: logsLoading } = useDataConnect({ query: listActivityLogsByUserQuery, variables: { tenantId: MOCK_USER.businessId, businessId: MOCK_USER.businessId, userId: MOCK_USER.uid } });
  const { data: employeesData, loading: employeesLoading } = useDataConnect({ query: listEmployeesByBusinessQuery, variables: { tenantId: MOCK_USER.businessId, businessId: MOCK_USER.businessId } });
  const { data: suppliersData, loading: suppliersLoading } = useDataConnect({ query: listSuppliersByBusinessQuery, variables: { tenantId: MOCK_USER.businessId, businessId: MOCK_USER.businessId } });

  // Map generated types back to existing frontend types
  const sales = React.useMemo(() => (salesDataResult?.transactions || []).filter((t: any) => t.type === 'Sale') as unknown as Sale[], [salesDataResult]);
  const expenses = React.useMemo(() => (expensesDataResult?.transactions || []).filter((t: any) => t.type === 'Expense') as unknown as Expense[], [expensesDataResult]);
  const products = React.useMemo(() => (productsData?.products || []) as unknown as Product[], [productsData]);
  const tasks = React.useMemo(() => (tasksData?.tasks || []) as unknown as Task[], [tasksData]);
  const customers = React.useMemo(() => (customersData?.customers || []) as unknown as Customer[], [customersData]);
  const logs = React.useMemo(() => (logsData?.activityLogs || []) as unknown as ActivityLog[], [logsData]);
  const employeesCount = employeesData?.employees?.length || 0;
  const suppliersCount = suppliersData?.suppliers?.length || 0;

  const [aiSummary, setAiSummary] = React.useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = React.useState(false);

  const isSyncing = salesLoading || productsLoading || expensesLoading || tasksLoading || customersLoading || logsLoading || employeesLoading || suppliersLoading;

  const stats = React.useMemo(() => {
    const totalSalesAmount = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalExpensesAmount = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const lowStockCount = products.filter(p => p.quantity <= p.lowStockLevel).length;
    const taskStats = {
      pending: tasks.filter(t => t.status === 'Pending').length,
      ongoing: tasks.filter(t => t.status === 'Ongoing').length,
      completed: tasks.filter(t => t.status === 'Completed').length,
      overdue: tasks.filter(t => t.status === 'Overdue' || t.status === 'Late').length,
    };
    return {
      totalSalesAmount,
      totalExpensesAmount,
      netProfit: totalSalesAmount - totalExpensesAmount,
      lowStockCount,
      taskStats
    };
  }, [sales, expenses, products, tasks]);

  const fetchAiSummary = React.useCallback(async () => {
    if (isAiLoading) return;
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
  }, [isAiLoading]);

  React.useEffect(() => {
    if (!isSyncing && !aiSummary) {
      fetchAiSummary();
    }
  }, [isSyncing, aiSummary, fetchAiSummary]);

  const salesChartData = React.useMemo(() => {
     // A very simple aggregation for the chart
     const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
     const data = days.map(day => ({ name: day, total: 0 }));
     
     sales.forEach(sale => {
         const date = new Date(sale.saleDate);
         const dayIndex = date.getDay();
         // Adjust Sunday from 0 to 6 to match array
         const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
         if (data[adjustedIndex]) {
             data[adjustedIndex].total += sale.totalAmount;
         }
     });
     
     // Fallback to dummy data if no sales yet for visual demo
     if (sales.length === 0) {
        return [
            { name: "Mon", total: 120000 },
            { name: "Tue", total: 150000 },
            { name: "Wed", total: 110000 },
            { name: "Thu", total: 180000 },
            { name: "Fri", total: 220000 },
            { name: "Sat", total: 250000 },
            { name: "Sun", total: 140000 },
          ];
     }
     return data;
  }, [sales]);

  if (unauthenticated) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Card className="max-w-md w-full text-center shadow-lg border-t-4 border-amber-500">
          <CardHeader>
            <div className="mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full p-3 w-fit mb-2">
              <LogIn className="size-6 text-amber-600" />
            </div>
            <CardTitle className="text-lg">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please sign in to view your dashboard. All operations require an authenticated session.
            </p>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest">
                <LogIn className="size-4 mr-2" /> Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-headline">{t('dashboard.title')}</h1>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">{t('dashboard.subtitle')}</p>
            {isSyncing && <Loader2 className="size-3 animate-spin text-primary" />}
          </div>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest bg-card" onClick={fetchAiSummary} disabled={isAiLoading || isSyncing}>
            {isAiLoading ? <Loader2 className="size-3 mr-2 animate-spin" /> : <Sparkles className="size-3 mr-2" />}
            {t('dashboard.refreshAi')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.totalSales')}
          value={salesLoading ? "---" : `${stats.totalSalesAmount.toLocaleString()} FCFA`}
          icon={ShoppingCart}
          trend={{ value: 12, label: "Live synchronization", isPositive: true }}
          className="border-t-4 border-[#10b981] shadow-md"
        />
        <StatCard
          title={t('dashboard.totalExpenses')}
          value={expensesLoading ? "---" : `${stats.totalExpensesAmount.toLocaleString()} FCFA`}
          icon={Receipt}
          trend={{ value: 4, label: "Live synchronization", isPositive: false }}
          className="border-t-4 border-[#f59e0b] shadow-md"
        />
        <StatCard
          title={t('dashboard.netProfit')}
          value={isSyncing ? "---" : `${stats.netProfit.toLocaleString()} FCFA`}
          icon={TrendingUp}
          trend={{ value: 18, label: "Live synchronization", isPositive: true }}
          className="border-t-4 border-[#3b82f6] shadow-md"
        />
        <StatCard
          title={t('dashboard.lowStock')}
          value={productsLoading ? "---" : stats.lowStockCount}
          icon={AlertTriangle}
          className="border-t-4 border-[#ef4444] shadow-md"
          description={`${products.length} ${t('common.inventory')}`}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { icon: Users, label: t('common.employees'), value: employeesCount, loading: employeesLoading },
          { icon: UserCircle, label: t('common.customers'), value: customers.length, loading: customersLoading },
          { icon: Truck, label: t('common.suppliers'), value: suppliersCount, loading: suppliersLoading },
          { icon: Briefcase, label: t('common.tasks'), value: tasks.length, loading: tasksLoading },
        ].map((item, idx) => (
          <div key={idx} className="bg-card border p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <item.icon className="size-3 text-muted-foreground" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{item.label}</span>
            </div>
            <p className="text-lg font-bold">{item.loading ? "..." : item.value}</p>
          </div>
        ))}
        <div className="bg-card border p-3 rounded-xl shadow-sm col-span-2 hidden lg:block">
           <div className="flex items-center gap-2 mb-1">
            <Briefcase className="size-3 text-muted-foreground" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">{t('dashboard.lateTasks')}</span>
          </div>
          <p className="text-lg font-bold text-destructive">{isSyncing ? "..." : stats.taskStats.overdue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-primary/5 border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-primary/10 bg-primary/10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                  <Sparkles className="size-4" />
                  {t('dashboard.aiInsights')}
                </CardTitle>
                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter bg-white/50">Contextual Analysis</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {isAiLoading ? (
                <div className="space-y-3 py-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              ) : (
                <p className="text-sm text-foreground leading-relaxed italic">
                  {aiSummary || "Connecting to intelligence engine..."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{t('dashboard.revenueTrend')}</CardTitle>
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
                  <BarChart data={salesChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(value) => `${value/1000}k`} fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm h-fit">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase">{t('dashboard.recentSales')}</CardTitle>
              <Link href="/sales">
                <Button variant="ghost" size="icon" className="h-6 w-6"><ArrowRight className="size-4" /></Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesLoading ? (
                  Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                ) : sales.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 italic">No transactions recorded yet.</p>
                ) : (
                  sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex items-center gap-3 text-sm border-b pb-3 last:border-0 last:pb-0">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                        {sale.paymentMethod?.[0] || 'O'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{sale.totalAmount.toLocaleString()} FCFA</p>
                        <p className="text-muted-foreground text-[9px] uppercase font-medium">{sale.paymentMethod || 'Other'} • {new Date(sale.saleDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm h-fit">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase">{t('dashboard.recentActivity')}</CardTitle>
              <History className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logsLoading ? (
                  Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)
                ) : logs.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No recent system logs.</p>
                ) : (
                  logs.slice(0, 6).map((log) => (
                    <div key={log.id} className="flex items-start gap-3 text-xs border-b pb-3 last:border-0 last:pb-0">
                      <div className="mt-0.5 shrink-0">
                         <Badge variant="outline" className="text-[8px] px-1 h-4 font-bold uppercase">{log.actionType}</Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-[11px]">{log.description}</p>
                        <p className="text-muted-foreground text-[9px] uppercase font-bold">{log.userName} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
