"use client"

import * as React from "react"
import { Plus, Search, Download, ShoppingCart, CreditCard, Smartphone, Banknote } from "lucide-react"
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
import { MOCK_SALES, MOCK_PRODUCTS } from "@/lib/mock-data"
import { SaleDialog } from "@/components/sales/sale-dialog"
import { Sale } from "@/lib/types"

export default function SalesPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const totalToday = MOCK_SALES.reduce((acc, sale) => acc + sale.totalAmount, 0)
  const momoSales = MOCK_SALES.filter(s => s.paymentMethod === 'Mobile Money').length
  
  const filteredSales = MOCK_SALES.filter(s => 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNewSale = () => {
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales & Transactions</h1>
          <p className="text-sm text-muted-foreground">Monitor revenue and record customer payments (Douala Hub).</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="size-4 mr-2" /> Daily Report
          </Button>
          <Button onClick={handleNewSale} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto font-bold uppercase text-xs tracking-widest shadow-lg">
            <Plus className="size-4 mr-2" /> New Sale
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-4 border-[#10b981] shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-emerald-700">{totalToday.toLocaleString()} FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">↑ 12% from yesterday</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#3b82f6] shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mobile Money (MoMo)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-blue-700">{momoSales} Payments</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Orange & MTN Cameroon</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#f59e0b] shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cash Sales</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-amber-700">65%</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Physical currency ratio</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#ef4444] shadow-md bg-red-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Unpaid Credit</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-red-600">45,000 FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Action required for recovery</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by ID or payment method..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Sale ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-[10px] font-bold text-primary">{sale.id}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(sale.saleDate).toLocaleDateString()} at {new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {sale.paymentMethod === 'Cash' && <Banknote className="size-3.5 text-emerald-600" />}
                        {sale.paymentMethod === 'Mobile Money' && <Smartphone className="size-3.5 text-blue-600" />}
                        {sale.paymentMethod === 'Bank Transfer' && <CreditCard className="size-3.5 text-purple-600" />}
                        {sale.paymentMethod === 'Credit' && <ShoppingCart className="size-3.5 text-amber-600" />}
                        <span className="text-xs font-medium">{sale.paymentMethod}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      {sale.productsSold.length} {sale.productsSold.length === 1 ? 'item' : 'items'}
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">
                      {sale.totalAmount.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold">Receipt</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <SaleDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(s) => console.log("New Sale Recorded:", s)}
      />
    </div>
  )
}
