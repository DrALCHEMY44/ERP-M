"use client"

import * as React from "react"
import { Plus, Search, Download, Receipt, Calendar, Loader2, Trash2 } from "lucide-react"
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
import { useFirestore } from "@/hooks/use-firestore"
import { useToast } from "@/hooks/use-toast"

export default function ExpensesPage() {
  const { data: expenses, loading, addRecord, deleteRecord } = useFirestore<Expense>('expenses');
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
    try {
      await addRecord(expenseData as Omit<Expense, 'id'>);
      toast({ title: "Expense Recorded", description: "Your financial logs have been updated." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not save expense." });
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Remove this expense record?")) {
      await deleteRecord(id);
      toast({ title: "Deleted", description: "Expense removed." });
    }
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Business Expenses</h1>
          <p className="text-sm text-muted-foreground">Log and categorize operational costs (FCFA).</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsDialogOpen(true)} className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto font-bold uppercase text-xs tracking-widest shadow-lg">
            <Plus className="size-4 mr-2" /> Record Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-[#f59e0b] shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total This Month</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-amber-700">{totalThisMonth.toLocaleString()} FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Live Budget Oversight</p>
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
              placeholder="Search expenses..." 
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
