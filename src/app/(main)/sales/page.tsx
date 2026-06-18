"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Download,
  Calendar as CalendarIcon,
  CreditCard,
  DollarSign,
  User
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
import { MOCK_SALES } from "@/lib/mock-data"
import { SaleDialog } from "@/components/sales/sale-dialog"

export default function SalesPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Sales & Transactions</h1>
          <p className="text-muted-foreground">Monitor daily revenue and customer payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="size-4 mr-2" /> Daily Report
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="size-4 mr-2" /> New Sale
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-4">
          <div className="bg-emerald-500 p-2 rounded-lg text-white">
            <DollarSign className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-emerald-600 tracking-widest">Today's Revenue</p>
            <p className="text-xl font-bold">150,000 FCFA</p>
          </div>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center gap-4">
          <div className="bg-blue-500 p-2 rounded-lg text-white">
            <CreditCard className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-blue-600 tracking-widest">Mobile Money</p>
            <p className="text-xl font-bold">85,000 FCFA</p>
          </div>
        </div>
        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-center gap-4">
          <div className="bg-orange-500 p-2 rounded-lg text-white">
            <CalendarIcon className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-orange-600 tracking-widest">Weekly Avg</p>
            <p className="text-xl font-bold">1.2M FCFA</p>
          </div>
        </div>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Sale ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_SALES.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell className="font-bold">{sale.id}</TableCell>
                <TableCell>{new Date(sale.saleDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline">{sale.paymentMethod}</Badge>
                </TableCell>
                <TableCell className="font-semibold text-emerald-600">{sale.totalAmount.toLocaleString()} FCFA</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View Receipt</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SaleDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(s) => console.log("Recorded sale:", s)}
      />
    </div>
  )
}