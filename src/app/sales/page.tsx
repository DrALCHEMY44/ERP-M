"use client"

import * as React from "react"
import { Plus, Search, Download, ShoppingCart, CreditCard, Smartphone, Banknote, Loader2, Calendar } from "lucide-react"
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
import { SaleDialog } from "@/components/sales/sale-dialog"
import { Sale, Product } from "@/lib/types"
import { useFirestore } from "@/hooks/use-firestore"
import { useToast } from "@/hooks/use-toast"

export default function SalesPage() {
  const { data: sales, loading, addRecord } = useFirestore<Sale>('sales');
  const { data: products, updateRecord } = useFirestore<Product>('products');
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  const totalToday = sales.reduce((acc, sale) => {
    const isToday = new Date(sale.saleDate).toDateString() === new Date().toDateString();
    return isToday ? acc + sale.totalAmount : acc;
  }, 0)

  const momoSales = sales.filter(s => s.paymentMethod === 'Mobile Money').length
  
  const filteredSales = sales.filter(s => 
    s.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())

  const handleNewSale = async (saleData: Partial<Sale>) => {
    try {
      // 1. Record the sale
      await addRecord(saleData as Omit<Sale, 'id'>);
      
      // 2. Update Inventory (Decrement quantities)
      if (saleData.productsSold) {
        for (const item of saleData.productsSold) {
          const product = products.find(p => p.id === item.productId);
          if (product) {
            await updateRecord(product.id!, {
              quantity: product.quantity - item.quantity
            });
          }
        }
      }

      toast({ title: "Sale Completed", description: `Recorded transaction for ${saleData.totalAmount?.toLocaleString()} FCFA.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not record sale. Please try again." });
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales & Transactions</h1>
          <p className="text-sm text-muted-foreground">Monitor revenue and record customer payments (Douala Hub).</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex text-[10px] font-bold uppercase">
            <Download className="size-4 mr-2" /> Export
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto font-bold uppercase text-xs tracking-widest shadow-lg">
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
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter flex items-center gap-1">
              <Calendar className="size-3" /> Live Statistics
            </p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#3b82f6] shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mobile Money</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-blue-700">{momoSales} Transactions</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Orange & MTN Cameroon</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#f59e0b] shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-amber-700">{sales.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Recorded Volume</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#ef4444] shadow-md bg-red-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Customer Credits</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-red-600">{sales.filter(s => s.paymentMethod === 'Credit').length} Pending</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Outstanding Store Credit</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              placeholder="Search by Payment Method..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/20 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.length > 0 ? (
                filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-muted/20">
                    <TableCell className="font-mono text-[10px] font-bold text-primary truncate max-w-[100px]">{sale.id}</TableCell>
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
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">{sale.productsSold.length} Products</Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">
                      {sale.totalAmount.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold">Print Receipt</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No transactions found in this period.
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
        onSave={handleNewSale}
      />
    </div>
  )
}
