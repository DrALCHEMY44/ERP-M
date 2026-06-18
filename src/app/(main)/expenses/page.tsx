
"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Download,
  Filter,
  Receipt,
  ArrowUpRight,
  TrendingDown,
  Calendar
} from "lucide-react"
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
  const [selectedExpense, setSelectedExpense] = React.useState<Expense | null>(null)

  const totalThisMonth = MOCK_EXPENSES.reduce((acc, exp) => acc + exp.amount, 0)
  const topCategory = "Rent" // Simplified logic for mock

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedExpense(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Business Expenses</h1>
          <p className="text-muted-foreground">Log and categorize operational costs for your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="size-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={handleAddNew} className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="size-4 mr-2" /> Record Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-500 border-t-4 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total This Month</CardTitle>
            <TrendingDown className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThisMonth.toLocaleString()} FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              <span className="text-destructive font-bold">↑ 4%</span> compared to last month
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-500 border-t-4 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Category</CardTitle>
            <Receipt className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategory}</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Takes up 65% of monthly budget
            </p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500 border-t-4 shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Next Tax Payment</CardTitle>
            <Calendar className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">June 15</div>
            <p className="text-[10px] text-muted-foreground mt-1">
              Estimated: <span className="font-bold">45,000 FCFA</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search expenses..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Filter className="size-4 mr-2" /> All Categories
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 sm:flex-none">
            Last 30 Days
          </Button>
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
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
              <TableRow key={expense.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{new Date(expense.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-normal">{expense.category}</Badge>
                </TableCell>
                <TableCell className="max-w-[300px] truncate">{expense.description}</TableCell>
                <TableCell className="font-bold text-destructive">-{expense.amount.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(expense)}>Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ExpenseDialog 
        expense={selectedExpense}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(e) => console.log("Saved expense:", e)}
      />
    </div>
  )
}
