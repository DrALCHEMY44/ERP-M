"use client"

import * as React from "react"
import { 
  TrendingUp, 
  Wallet, 
  FileSpreadsheet, 
  Download,
  Calculator,
  Gavel,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { useAuth } from "@/hooks/use-auth"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { listTransactionsByBusinessQuery } from "@/lib/data-service"
import { Sale, Expense } from "@/lib/types"

export default function FinancePage() {
  const { profile } = useAuth();
  const { data: dbTransactions, loading: transactionsLoading } = useDataConnect({
    query: listTransactionsByBusinessQuery,
    variables: {
      tenantId: profile?.tenantId || "",
      businessId: profile?.businessId || ""
    },
    skip: !profile || !profile.tenantId || !profile.businessId
  });

  const transactions = dbTransactions?.transactions || [];

  const sales = React.useMemo(() => {
    return transactions
      .filter((t: any) => t.type?.toUpperCase() === 'SALE')
      .map((t: any) => ({
        id: t.id,
        tenantId: t.tenantId,
        businessId: t.businessId,
        totalAmount: t.amount,
        saleDate: t.date,
        recordedBy: t.recordedBy,
        createdAt: t.createdAt,
        paymentMethod: 'Cash',
        productsSold: []
      })) as unknown as Sale[];
  }, [transactions]);

  const expenses = React.useMemo(() => {
    return transactions
      .filter((t: any) => t.type?.toUpperCase() === 'EXPENSE')
      .map((t: any) => ({
        id: t.id,
        tenantId: t.tenantId,
        businessId: t.businessId,
        amount: t.amount,
        date: t.date,
        recordedBy: t.recordedBy,
        createdAt: t.createdAt,
        category: t.category || 'Other',
        description: t.category || 'Expense'
      })) as unknown as Expense[];
  }, [transactions]);

  const salesLoading = transactionsLoading;
  const expensesLoading = transactionsLoading;

  const stats = React.useMemo(() => {
    const totalIncome = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const cashFlow = totalIncome - totalExpenses; 

    return { totalIncome, totalExpenses, netProfit, cashFlow };
  }, [sales, expenses]);

  const chartData = React.useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const monthlySales = sales.filter(s => {
        const d = new Date(s.saleDate);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      }).reduce((acc, s) => acc + s.totalAmount, 0);

      const monthlyExpenses = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === index && d.getFullYear() === currentYear;
      }).reduce((acc, e) => acc + e.amount, 0);

      return {
        month,
        produits: monthlySales,
        charges: monthlyExpenses,
      };
    }).slice(0, new Date().getMonth() + 1);
  }, [sales, expenses]);

  if (salesLoading || expensesLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Finance & Accounting</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-bold uppercase tracking-tighter">SYCOHADA Compliant</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex bg-card">
            <Download className="size-4 mr-2" /> Export DSF
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 w-full sm:w-auto font-bold uppercase text-[10px] tracking-widest shadow-lg">
            <Calculator className="size-4 mr-2" /> Generate Balance Sheet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-emerald-500 shadow-sm bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <div className="flex justify-between items-start">
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Chiffre d'Affaires</CardDescription>
              <ArrowUpRight className="size-4 text-emerald-600" />
            </div>
            <CardTitle className="text-xl font-bold text-emerald-700">{stats.totalIncome.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-sm bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <div className="flex justify-between items-start">
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total Charges</CardDescription>
              <ArrowDownRight className="size-4 text-amber-600" />
            </div>
            <CardTitle className="text-xl font-bold text-amber-700">{stats.totalExpenses.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-blue-500 shadow-sm bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Valeur Ajoutée (VA)</CardDescription>
            <CardTitle className="text-xl font-bold text-blue-700">{(stats.totalIncome - stats.totalExpenses > 0 ? stats.totalIncome - stats.totalExpenses : 0).toLocaleString()} FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-primary shadow-sm bg-primary/5">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Résultat Net</CardDescription>
            <CardTitle className="text-xl font-bold text-primary">{stats.netProfit.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Analyse de Gestion SYCOHADA</CardTitle>
            <CardDescription className="text-xs uppercase font-bold tracking-tighter">Produits (Income) vs Charges (Expenses)</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <ChartContainer
              config={{
                produits: { label: "Produits", color: "hsl(var(--primary))" },
                charges: { label: "Charges", color: "hsl(var(--destructive))" },
              }}
              className="w-full h-full"
            >
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => `${val / 1000}k`} fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend iconType="circle" />
                <Bar dataKey="produits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="charges" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Compliance & Reports</CardTitle>
            <CardDescription className="text-xs">Quick access to official records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl border-l-4 border-amber-500">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase text-amber-700">Fiscal Deadline</p>
                <Gavel className="size-4 text-amber-600" />
              </div>
              <p className="text-lg font-bold">15th of Next Month</p>
              <Button size="sm" className="w-full mt-3 text-xs font-bold uppercase tracking-widest" variant="secondary">Prepare Filing</Button>
            </div>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-10 group">
                <FileSpreadsheet className="size-4 mr-3 text-emerald-500 group-hover:scale-110 transition-transform" /> Grand Livre (Ledger)
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-10 group">
                <History className="size-4 mr-3 text-amber-500 group-hover:scale-110 transition-transform" /> Accounting Audit Trail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
