"use client"

import * as React from "react"
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  FileSpreadsheet, 
  Download,
  Lock,
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts"
import { useFirestore } from "@/hooks/use-firestore"
import { Sale, Expense } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"
import { hasPermission } from "@/lib/permissions"

export default function FinancePage() {
  const { data: sales, loading: salesLoading } = useFirestore<Sale>('sales');
  const { data: expenses, loading: expensesLoading } = useFirestore<Expense>('expenses');

  const isAuthorized = hasPermission(MOCK_USER.role, 'viewFinance');

  const stats = React.useMemo(() => {
    const totalIncome = sales.reduce((acc, sale) => acc + sale.totalAmount, 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    
    // Simple Cash Flow calculation (Income - Expenses)
    const cashFlow = totalIncome - totalExpenses; 

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      cashFlow
    };
  }, [sales, expenses]);

  // Aggregate monthly data for chart
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
        va: monthlySales - monthlyExpenses > 0 ? monthlySales - monthlyExpenses : 0
      };
    }).slice(0, new Date().getMonth() + 1); // Only show up to current month
  }, [sales, expenses]);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center p-4">
        <div className="bg-muted p-6 rounded-full">
          <Lock className="size-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          You do not have permissions to view SYCOHADA financial records. Please contact your administrator.
        </p>
      </div>
    );
  }

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
            <p className="text-[10px] text-muted-foreground font-bold uppercase">OHADA Standard Reporting (System Normal)</p>
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
            <CardDescription className="text-xs uppercase font-bold tracking-tighter">Produits (Income) vs Charges (Expenses) - {new Date().getFullYear()}</CardDescription>
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
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Monthly VAT & Tax declaration due</p>
              <Button size="sm" className="w-full mt-3 text-xs font-bold uppercase tracking-widest" variant="secondary">Prepare Filing</Button>
            </div>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-10 group">
                <FileSpreadsheet className="size-4 mr-3 text-emerald-500 group-hover:scale-110 transition-transform" /> Grand Livre (Ledger)
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-10 group">
                <History className="size-4 mr-3 text-amber-500 group-hover:scale-110 transition-transform" /> Accounting Audit Trail
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[10px] font-bold uppercase tracking-widest h-10 group">
                <TrendingUp className="size-4 mr-3 text-blue-500 group-hover:scale-110 transition-transform" /> Balance des Comptes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm overflow-hidden border-none">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between p-4">
          <div>
            <CardTitle className="text-sm font-bold uppercase tracking-widest">Journal des Opérations Récentes</CardTitle>
            <CardDescription className="text-[10px] uppercase font-medium">Mapped to SYCOHADA Account Classes</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest bg-card">
            <Download className="size-3 mr-2" /> Download CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px]">Compte</TableHead>
                  <TableHead>Label SYCOHADA</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Débit (FCFA)</TableHead>
                  <TableHead className="text-right">Crédit (FCFA)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.slice(0, 3).map((sale, idx) => (
                  <React.Fragment key={`sale-${idx}`}>
                    <TableRow className="hover:bg-muted/10 border-b">
                      <TableCell className="font-mono font-bold text-[10px] text-blue-600">411</TableCell>
                      <TableCell className="text-[11px] font-medium uppercase tracking-tight">Clients Locaux</TableCell>
                      <TableCell className="text-[10px] font-mono">{sale.id?.substring(0, 8)}</TableCell>
                      <TableCell className="text-[11px]">{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-bold text-xs text-emerald-600">{sale.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground/30 font-bold">-</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/10 border-b">
                      <TableCell className="font-mono font-bold text-[10px] text-blue-600">701</TableCell>
                      <TableCell className="text-[11px] font-medium uppercase tracking-tight">Ventes Marchandises</TableCell>
                      <TableCell className="text-[10px] font-mono">{sale.id?.substring(0, 8)}</TableCell>
                      <TableCell className="text-[11px]">{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground/30 font-bold">-</TableCell>
                      <TableCell className="text-right font-bold text-xs text-destructive">{sale.totalAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
                {expenses.slice(0, 2).map((exp, idx) => (
                  <React.Fragment key={`exp-${idx}`}>
                    <TableRow className="hover:bg-muted/10 border-b">
                      <TableCell className="font-mono font-bold text-[10px] text-blue-600">601</TableCell>
                      <TableCell className="text-[11px] font-medium uppercase tracking-tight">{exp.category}</TableCell>
                      <TableCell className="text-[10px] font-mono">{exp.id?.substring(0, 8)}</TableCell>
                      <TableCell className="text-[11px]">{new Date(exp.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right font-bold text-xs text-emerald-600">{exp.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground/30 font-bold">-</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/10 border-b">
                      <TableCell className="font-mono font-bold text-[10px] text-blue-600">521</TableCell>
                      <TableCell className="text-[11px] font-medium uppercase tracking-tight">Banque / Trésorerie</TableCell>
                      <TableCell className="text-[10px] font-mono">{exp.id?.substring(0, 8)}</TableCell>
                      <TableCell className="text-[11px]">{new Date(exp.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground/30 font-bold">-</TableCell>
                      <TableCell className="text-right font-bold text-xs text-destructive">{exp.amount.toLocaleString()}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20 p-4 flex items-center gap-4">
           <Wallet className="size-8 text-primary opacity-50" />
           <div>
             <h4 className="text-sm font-bold uppercase tracking-tight">Trésorerie Nette</h4>
             <p className="text-lg font-bold text-primary">{stats.cashFlow.toLocaleString()} FCFA</p>
             <p className="text-[9px] uppercase font-bold text-muted-foreground">Calculated: Total Income - Total Expenses</p>
           </div>
        </Card>
        <Card className="bg-muted/50 p-4 flex items-center gap-4">
           <FileSpreadsheet className="size-8 text-muted-foreground opacity-50" />
           <div>
             <h4 className="text-sm font-bold uppercase tracking-tight">Invoices & Receipts</h4>
             <p className="text-lg font-bold">{(sales.length + expenses.length)} Records</p>
             <p className="text-[9px] uppercase font-bold text-muted-foreground">Digital archives for fiscal audit</p>
           </div>
        </Card>
      </div>
    </div>
  )
}
