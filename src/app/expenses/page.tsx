"use client"

import * as React from "react"
import { Plus, Search, Download, Receipt, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { MOCK_EXPENSES } from "@/lib/mock-data"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"
import { Expense } from "@/lib/types"

export default function ExpensesPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const totalThisMonth = MOCK_EXPENSES.reduce((acc, exp) => acc + exp.amount, 0)

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
            <div className="text-xl md:text-2xl font-bold">{totalThisMonth.toLocaleString()} FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Budget Utilization: 65%</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#3b82f6] shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Top Category</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">Rent & Leasing</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Fixed Asset Costs</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#10b981] shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Next Tax Payment</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">June 15</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Est: 45,000 FCFA</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
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
              {MOCK_EXPENSES.map((expense) => (
                <TableRow key={expense.id} className="hover:bg-muted/20">
                  <TableCell className="text-xs whitespace-nowrap">{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="text-xs max-w-[200px] truncate">{expense.description}</TableCell>
                  <TableCell className="font-bold text-destructive text-sm">-{expense.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold">Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ExpenseDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(e) => console.log("Saved Expense:", e)}
      />
    </div>
  )
}
