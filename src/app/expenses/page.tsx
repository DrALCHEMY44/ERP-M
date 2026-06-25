"use client"

import * as React from "react"
import { Plus, Search, Download, Receipt, Calendar, Loader2, Trash2, LogIn } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"
import { Expense } from "@/lib/types"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { listTransactionsByTypeQuery, createTransactionMutation, deleteTransactionMutation } from "@/lib/data-service"
import { TransactionType } from "@/dataconnect-generated"
import { useToast } from "@/hooks/use-toast"
import { MOCK_USER } from "@/lib/mock-data"
import { useTranslation } from "@/components/language-provider"
import { useAuth } from "@/hooks/use-auth"

export default function ExpensesPage() {
  const { t } = useTranslation();
  const { profile, user } = useAuth();
  const { data: transactionsData, loading, unauthenticated, refetch } = useDataConnect({ 
    query: listTransactionsByTypeQuery, 
    variables: { 
      tenantId: profile?.tenantId || "", 
      businessId: profile?.businessId || "", 
      type: TransactionType.EXPENSE 
    },
    skip: !profile || !profile.tenantId || !profile.businessId
  });
  
  const expenses = React.useMemo(() => (transactionsData?.transactions || []) as unknown as Expense[], [transactionsData]);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const totalThisMonth = expenses.reduce((acc, exp) => {
    const isCurrentMonth = new Date(exp.date).getMonth() === new Date().getMonth();
    return isCurrentMonth ? acc + exp.amount : acc;
  }, 0)

  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exp.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const handleSave = async (expenseData: Partial<Expense>) => {
    if (!profile?.tenantId || !profile?.businessId || !user) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Your user profile is missing business/tenant identifiers. Please complete registration or select a business."
      });
      return;
    }
    try {
      await createTransactionMutation({
        tenantId: profile.tenantId,
        businessId: profile.businessId,
        type: TransactionType.EXPENSE,
        amount: expenseData.amount || 0,
        date: expenseData.date || new Date().toISOString(),
        category: expenseData.category || 'Other',
        receiptUrl: expenseData.receiptUrl,
        recordedBy: user.uid
      });
      await refetch();
      toast({ title: "Expense Recorded", description: "Your financial logs have been updated." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not save expense." });
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Remove this expense record?")) {
      try {
        await deleteTransactionMutation({ id });
        await refetch();
        toast({ title: "Deleted", description: "Expense removed." });
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete expense." });
      }
    }
  }

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
              Please sign in to view your expense records. All operations require an authenticated session.
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

  if (loading) {
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('expenses.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('expenses.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto font-bold uppercase text-xs tracking-widest shadow-lg">
            <Plus className="size-4 mr-2" /> {t('expenses.addExpense')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-[#f59e0b] shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('expenses.totalExpenses')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-amber-700">{totalThisMonth.toLocaleString()} FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">{t('common.thisMonth')}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#3b82f6] shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Top Category</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-blue-700">Operational Costs</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Fixed Asset & Utilities</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#10b981] shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tax Readiness</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-emerald-700">SYCOHADA Ready</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Auditable Record Logs</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
           <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              placeholder={t('expenses.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/20 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount (FCFA)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((expense) => (
                  <TableRow key={expense.id} className="hover:bg-muted/20">
                    <TableCell className="text-xs whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-widest">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="text-xs max-w-[200px] truncate">{expense.description}</TableCell>
                    <TableCell className="font-bold text-destructive text-sm">-{expense.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="sm" onClick={() => handleDelete(expense.id!)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                    No expense records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ExpenseDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
