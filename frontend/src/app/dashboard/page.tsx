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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useNeonData } from "@/hooks/use-neon-data"
import {
  getSalesQuery,
  listTransactionsByBusinessQuery,
  listProductsByBusinessQuery,
  listTasksByBusinessQuery,
  listCustomersByBusinessQuery,
  listActivityLogsByUserQuery,
  listEmployeesByBusinessQuery,
  listSuppliersByBusinessQuery
} from "@/lib/data-service"

import Link from "next/link"
import { useTranslation } from "@/components/language-provider"
import { Sale, Product, Expense, Task, Customer, ActivityLog } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"

export default function DashboardPage() {
  const { t } = useTranslation();
  const { profile, user } = useAuth();
  const role = profile?.role;
  const canReadSales = ["Business Owner", "Manager", "Accountant", "Staff", "Viewer"].includes(role || "");
  const canReadExpenses = ["Business Owner", "Manager", "Accountant"].includes(role || "");
  const canReadInventory = ["Business Owner", "Manager", "Staff", "Viewer"].includes(role || "");
  const canReadTasks = ["Business Owner", "Manager", "HR Officer", "Staff", "Viewer"].includes(role || "");
  const canReadCustomers = ["Business Owner", "Manager"].includes(role || "");
  const canReadEmployees = ["Business Owner", "Manager", "HR Officer"].includes(role || "");
  const canReadSuppliers = ["Business Owner", "Manager"].includes(role || "");
  const canReadAudit = ["Business Owner", "Manager"].includes(role || "");

  const { data: salesDataResult, loading: salesLoading, unauthenticated, error: salesError, refetch: refetchSales } = useNeonData({
    query: getSalesQuery,
    skip: !profile || !profile.tenantId || !profile.businessId || !canReadSales,
    refreshInterval: 5000
  });
  const { data: productsData, loading: productsLoading } = useNeonData({
    query: listProductsByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !profile || !profile.tenantId || !profile.businessId || !canReadInventory,
    refreshInterval: 5000
  });
  const { data: expensesDataResult, loading: expensesLoading } = useNeonData({
    query: listTransactionsByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !profile || !profile.tenantId || !profile.businessId || !canReadExpenses,
    refreshInterval: 5000
  });
  const { data: tasksData, loading: tasksLoading } = useNeonData({
    query: listTasksByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !profile || !profile.tenantId || !profile.businessId || !canReadTasks,
    refreshInterval: 5000
  });
  const { data: customersData, loading: customersLoading } = useNeonData({
    query: listCustomersByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !profile || !profile.tenantId || !profile.businessId || !canReadCustomers,
    refreshInterval: 5000
  });
  const { data: logsData, loading: logsLoading } = useNeonData({
    query: listActivityLogsByUserQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "", userId: user?.uid || "" },
    skip: !profile || !profile.tenantId || !profile.businessId || !user || !canReadAudit,
    refreshInterval: 5000
  });
  const { data: employeesData, loading: employeesLoading } = useNeonData({
    query: listEmployeesByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !profile || !profile.tenantId || !profile.businessId || !canReadEmployees,
    refreshInterval: 5000
  });
  const { data: suppliersData, loading: suppliersLoading } = useNeonData({
    query: listSuppliersByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !profile || !profile.tenantId || !profile.businessId || !canReadSuppliers,
    refreshInterval: 5000
  });

  const sales = React.useMemo(() => {
    return (salesDataResult?.sales || []) as Sale[];
  }, [salesDataResult]);

  const expenses = React.useMemo(() => {
    return (expensesDataResult?.transactions || [])
      .filter((t: any) => t.type?.toUpperCase() === 'EXPENSE')
      .map((t: any) => ({
        id: t.id,
        tenantId: t.tenantId,
        businessId: t.businessId,
        amount: t.amount,
        date: t.date,
        category: t.category || 'Other',
        description: t.category || 'Expense',
        receiptUrl: t.receiptUrl || undefined,
        recordedBy: t.recordedBy,
        createdAt: t.createdAt
      })) as unknown as Expense[];
  }, [expensesDataResult]);
  const products = React.useMemo(() => (productsData?.products || []) as unknown as Product[], [productsData]);
  const tasks = React.useMemo(() => (tasksData?.tasks || []) as unknown as Task[], [tasksData]);
  const customers = React.useMemo(() => (customersData?.customers || []) as unknown as Customer[], [customersData]);
  const logs = React.useMemo(() => (logsData?.activityLogs || []) as unknown as ActivityLog[], [logsData]);
  const employeesCount = employeesData?.employees?.length || 0;
  const suppliersCount = suppliersData?.suppliers?.length || 0;

  const operationalMetrics = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const inPeriod = (date: string, start: Date, end: Date) => {
      const value = new Date(date);
      return value >= start && value < end;
    };
    const todaySales = sales.filter(sale => inPeriod(sale.saleDate, today, tomorrow));
    const monthSales = sales.filter(sale => inPeriod(sale.saleDate, monthStart, nextMonth));
    const monthRevenue = monthSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const activeProducts = products.filter(product => product.status === 'active');
    const openTasks = tasks.filter(task => !['Completed', 'Cancelled'].includes(task.status));
    const money = (amount: number) => `${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })} FCFA`;
    return [
      { title: 'Sales today', value: money(todaySales.reduce((sum, sale) => sum + sale.totalAmount, 0)), detail: `${todaySales.length} recorded sales today`, allowed: canReadSales, ready: !!salesDataResult, icon: ShoppingCart },
      { title: 'Revenue this month', value: money(monthRevenue), detail: `${monthSales.length} sales this calendar month`, allowed: canReadSales, ready: !!salesDataResult, icon: TrendingUp },
      { title: 'Average sale', value: monthSales.length ? money(monthRevenue / monthSales.length) : '—', detail: 'Average transaction value this month', allowed: canReadSales, ready: !!salesDataResult, icon: Receipt },
      { title: 'Inventory at cost', value: money(activeProducts.reduce((sum, product) => sum + Math.max(0, product.quantity) * product.costPrice, 0)), detail: 'Active stock × current unit cost', allowed: canReadInventory, ready: !!productsData, icon: Truck },
      { title: 'Out of stock', value: activeProducts.filter(product => product.quantity <= 0).length.toLocaleString(), detail: 'Active products with no available stock', allowed: canReadInventory, ready: !!productsData, icon: AlertTriangle },
      { title: 'Open tasks', value: openTasks.length.toLocaleString(), detail: `${openTasks.filter(task => ['Overdue', 'Late'].includes(task.status) || new Date(task.dueDate) < today).length} overdue · excludes completed and cancelled`, allowed: canReadTasks, ready: !!tasksData, icon: Briefcase },
    ].filter(metric => metric.allowed);
  }, [sales, products, tasks, canReadSales, canReadInventory, canReadTasks, salesDataResult, productsData, tasksData]);

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
    if (isAiLoading || !profile || !user) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryText: 'Give me a concise business performance summary for this month. Include total sales, expenses, net profit, low stock alerts, and any actionable insights. Format all amounts in FCFA.',
          purpose: 'dashboard',
        }),
      });
      const data = await response.json();
      if (response.ok && data.response) {
        setAiSummary(data.response);
      } else {
        setAiSummary(data.error || 'Unable to generate AI insights at this time.');
      }
    } catch (error) {
      console.error("AI Summary Error:", error);
      setAiSummary('Unable to connect to the AI engine. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  }, [isAiLoading, profile, user]);

  React.useEffect(() => {
    if (!isSyncing && !aiSummary && profile && user) {
      fetchAiSummary();
    }
  }, [isSyncing, aiSummary, fetchAiSummary, profile, user]);

  const salesChartData = React.useMemo(() => {
     const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
     const data = days.map(day => ({ name: day, total: 0 }));
     const now = new Date();
     const weekStart = new Date(now);
     const daysSinceMonday = (now.getDay() + 6) % 7;
     weekStart.setDate(now.getDate() - daysSinceMonday);
     weekStart.setHours(0, 0, 0, 0);
     const nextWeek = new Date(weekStart);
     nextWeek.setDate(weekStart.getDate() + 7);

     sales.forEach(sale => {
         const date = new Date(sale.saleDate);
         if (date < weekStart || date >= nextWeek) return;
         const dayIndex = date.getDay();
         const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
         if (data[adjustedIndex]) {
             data[adjustedIndex].total += sale.totalAmount;
         }
     });
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
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest">
              <Link href="/login">
                <LogIn className="size-4 mr-2" /> Sign In
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {salesError && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"><p>{salesDataResult ? 'Sales could not refresh. Showing the last loaded figures.' : 'Sales could not load. Sales figures are unavailable until the connection recovers.'}</p><Button variant="outline" disabled={salesLoading} onClick={() => void refetchSales()}>Retry sales</Button></div>}
      <section className="border-b pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Business overview
              {isSyncing && <Loader2 className="size-3 animate-spin" />}
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Welcome back, {profile?.fullName?.split(' ')[0] || 'there'}</h1>
            <p className="max-w-xl text-sm text-muted-foreground">A clear view of your sales, stock and team.</p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
              <span>{profile?.role || 'Member'}</span>
              {profile?.businessCode && <span className="border-l pl-3">Workspace {profile.businessCode}</span>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
           {canReadSales && <Button asChild><Link href="/sales"><ShoppingCart className="size-4" />View sales</Link></Button>}
           <Button variant="outline" className="h-11" onClick={fetchAiSummary} disabled={isAiLoading || isSyncing}>
            {isAiLoading ? <Loader2 className="size-3 mr-2 animate-spin" /> : <Sparkles className="size-3 mr-2" />}
            {t('dashboard.refreshAi')}
          </Button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('dashboard.totalSales')}
          value={!canReadSales ? "Restricted" : !salesDataResult ? "—" : `${stats.totalSalesAmount.toLocaleString()} FCFA`}
          icon={ShoppingCart}
          description={canReadSales ? "All recorded sales" : "Not available to this role"}
        />
        <StatCard
          title={t('dashboard.totalExpenses')}
          value={!canReadExpenses ? "Restricted" : expensesLoading ? "---" : `${stats.totalExpensesAmount.toLocaleString()} FCFA`}
          icon={Receipt}
          description={canReadExpenses ? "All recorded expenses" : "Not available to this role"}
        />
        <StatCard
          title={t('dashboard.netProfit')}
          value={!canReadSales || !canReadExpenses ? "Restricted" : !salesDataResult || !expensesDataResult ? "—" : `${stats.netProfit.toLocaleString()} FCFA`}
          icon={TrendingUp}
          description={canReadSales && canReadExpenses ? "Sales minus expenses" : "Requires sales and expense access"}
        />
        <StatCard
          title={t('dashboard.lowStock')}
          value={!canReadInventory ? "Restricted" : productsLoading ? "---" : stats.lowStockCount}
          icon={AlertTriangle}
          description={canReadInventory ? `${products.length} ${t('common.inventory')}` : "Not available to this role"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex min-w-0 flex-col gap-6">
          <Card className="order-2 overflow-hidden">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Sparkles className="size-4" />
                  {t('dashboard.aiInsights')}
                </CardTitle>
                <Badge variant="outline" className="text-xs font-normal">AI summary</Badge>
              </div>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto pt-4">
              {isAiLoading ? (
                <div className="space-y-3 py-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              ) : (
                <AIInsightsRenderer content={aiSummary || "Connecting to intelligence engine..."} />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">{t('dashboard.revenueTrend')}</CardTitle>
              <CardDescription className="text-sm">Current-week daily sales (FCFA)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full">
              {!canReadSales ? (
                <div className="grid h-full place-items-center text-sm text-muted-foreground">Sales analytics are not available to this role.</div>
              ) : !salesDataResult ? (
                <div className="grid h-full place-items-center text-sm text-muted-foreground">{salesLoading ? 'Loading sales…' : 'Sales data is unavailable. Use Retry sales above.'}</div>
              ) : (
               <ChartContainer
                  config={{
                    total: {
                      label: "Sales",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="w-full h-full"
                >
                  <AreaChart data={salesChartData}>
                    <defs><linearGradient id="salesProgress" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(value) => `${value/1000}k`} fontSize={12} tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#salesProgress)" dot={{ r: 3, fill: "hsl(var(--background))", strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm h-fit">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">{t('dashboard.recentSales')}</CardTitle>
              <Button asChild variant="ghost" size="icon" className="h-6 w-6">
                <Link href="/sales" aria-label="View all sales"><ArrowRight className="size-4" /></Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!canReadSales ? (
                  <p className="text-xs text-muted-foreground text-center py-6 italic">Sales records are not available to this role.</p>
                ) : salesLoading ? (
                  Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
                ) : sales.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6 italic">{salesDataResult ? 'No transactions recorded yet.' : 'Sales could not load. Please retry.'}</p>
                ) : (
                  sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="flex items-center gap-3 text-sm border-b pb-3 last:border-0 last:pb-0">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                        {sale.paymentMethod?.[0] || 'O'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{sale.totalAmount.toLocaleString()} FCFA</p>
                        <p className="text-xs text-muted-foreground">{sale.paymentMethod || 'Other'} • {new Date(sale.saleDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm h-fit">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base font-semibold">{t('dashboard.recentActivity')}</CardTitle>
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
                         <Badge variant="outline" className="h-5 px-1.5 text-[11px] font-semibold">{log.actionType}</Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">{log.description}</p>
                        <p className="text-xs text-muted-foreground">{log.userName} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="space-y-4" aria-labelledby="daily-overview">
        <div><h2 id="daily-overview" className="text-lg font-semibold">Daily business overview</h2><p className="text-sm text-muted-foreground">Sales momentum, stock availability and work that needs attention.</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {operationalMetrics.map(metric => <StatCard key={metric.title} title={metric.title} value={metric.ready ? metric.value : '—'} description={metric.ready ? metric.detail : 'Waiting for business data'} icon={metric.icon} />)}
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { icon: Users, label: t('common.employees'), value: employeesCount, loading: employeesLoading, allowed: canReadEmployees },
          { icon: UserCircle, label: t('common.customers'), value: customers.length, loading: customersLoading, allowed: canReadCustomers },
          { icon: Truck, label: t('common.suppliers'), value: suppliersCount, loading: suppliersLoading, allowed: canReadSuppliers },
          { icon: Briefcase, label: t('common.tasks'), value: tasks.length, loading: tasksLoading, allowed: canReadTasks },
        ].filter((item) => item.allowed).map((item, idx) => (
          <div key={idx} className="border-b p-3">
            <div className="flex items-center gap-2 mb-1">
              <item.icon className="size-3 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
            </div>
            <p className="text-lg font-bold">{item.loading ? "..." : item.value}</p>
          </div>
        ))}
        {canReadTasks && <div className="border-b p-3 col-span-2">
           <div className="flex items-center gap-2 mb-1">
            <Briefcase className="size-3 text-muted-foreground" />
            <span className="text-xs font-semibold text-muted-foreground">{t('dashboard.lateTasks')}</span>
          </div>
          <p className="text-lg font-bold text-destructive">{isSyncing ? "..." : stats.taskStats.overdue}</p>
        </div>}
      </div>

    </div>
  )
}

function AIInsightsRenderer({ content }: { content: string }) {
  // Split content by line breaks
  const lines = content.split('\n');

  return (
    <div className="space-y-2.5 text-sm text-foreground/90 leading-relaxed font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // 1. Render Table Rows (containing pipes)
        if (trimmed.startsWith('|')) {
          // Skip markdown divider lines like |---|---|
          if (trimmed.includes('---')) return null;

          const cells = trimmed
            .split('|')
            .map((c) => c.trim())
            .filter((_, i) => i > 0 && i < trimmed.split('|').length - 1);

          const isHeader = idx === 0 || (lines[idx - 1] && lines[idx - 1].trim().includes('---')) || lines[idx + 1]?.trim().includes('---');

          return (
            <div
              key={idx}
              className={`grid grid-cols-2 gap-4 py-2 px-3 border-b border-primary/5 last:border-0 ${
                isHeader
                  ? 'bg-primary/10 font-bold text-primary rounded-t-lg border-b-2 border-primary/20'
                  : 'odd:bg-muted/30 even:bg-background'
              }`}
            >
              {cells.map((cell, cIdx) => (
                <span key={cIdx} className={isHeader ? 'uppercase tracking-wider text-[10px]' : ''}>
                  {parseBoldText(cell)}
                </span>
              ))}
            </div>
          );
        }

        // 2. Render List Items
        if (/^([-*_])\1{2,}$/.test(trimmed)) return null;
        if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
          // Filter out italic indicators or generic bullets
          const listText = trimmed.replace(/^[-•*]\s*/, '');
          // If the list item was italicized like *Item*, strip outer asterisks
          const cleanText = listText.startsWith('*') && listText.endsWith('*') ? listText.slice(1, -1) : listText;
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-1">
              <span className="text-primary mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{parseBoldText(cleanText)}</span>
            </div>
          );
        }

        // 3. Render Empty Lines as Spacing
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // 4. Render Normal Paragraphs
        return (
          <p key={idx} className={trimmed.startsWith('*') && trimmed.endsWith('*') ? 'italic text-xs text-muted-foreground' : ''}>
            {parseBoldText(trimmed.startsWith('*') && trimmed.endsWith('*') ? trimmed.slice(1, -1) : trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Regex helper to format **bold** text inline
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}
