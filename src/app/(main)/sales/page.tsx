
"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  FileText, 
  Filter,
  ArrowUpRight,
  ShoppingCart
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SaleDialog } from "@/components/sales/sale-dialog"
import { MOCK_SALES } from "@/lib/mock-data"
import { Sale } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function SalesPage() {
  const [sales, setSales] = React.useState<Sale[]>(MOCK_SALES)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const { toast } = useToast()

  const filteredSales = sales.filter(s => 
    s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRecordSale = (saleData: Partial<Sale>) => {
    const newSale: Sale = {
      ...saleData,
      id: `SALE-${Date.now().toString().slice(-6)}`,
      saleDate: new Date().toISOString(),
    } as Sale
    
    setSales(prev => [newSale, ...prev])
    toast({
      title: "Vente Enregistrée",
      description: `Transaction de ${saleData.totalAmount?.toLocaleString()} FCFA effectuée.`,
    })
  }

  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0)
  const salesCount = sales.length
  const avgSale = salesCount > 0 ? totalRevenue / salesCount : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-headline">Sales Management</h2>
          <p className="text-sm text-muted-foreground">Track revenue and customer transactions in FCFA currency.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
            <FileText className="size-4" />
            Daily Report
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} size="sm" className="bg-accent hover:bg-accent/90 flex items-center gap-2 w-full sm:w-auto">
            <Plus className="size-4" />
            Record Transaction
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Revenue (FCFA)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-[10px] text-emerald-600 mt-1">
              <ArrowUpRight className="size-3 mr-1" />
              +8.2% from yesterday
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{salesCount}</div>
            <p className="text-[10px] text-muted-foreground mt-1">12 new today</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{avgSale.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Stable vs last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-4 py-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-base md:text-lg font-headline flex items-center gap-2">
            <ShoppingCart className="size-5 text-muted-foreground" />
            Transaction History
          </CardTitle>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search ID, Method..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 text-[10px] uppercase tracking-wider whitespace-nowrap">
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.map((sale) => (
                  <TableRow key={sale.id} className="group whitespace-nowrap">
                    <TableCell className="font-mono text-[10px] md:text-xs font-bold">{sale.id}</TableCell>
                    <TableCell className="text-[10px] md:text-xs">
                      {new Date(sale.saleDate).toLocaleString('fr-CM')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="bg-secondary/50 font-normal text-[10px]">
                        {sale.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary text-xs md:text-sm">
                      {sale.totalAmount.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-[10px]">Receipt</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <SaleDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSave={handleRecordSale} 
      />
    </div>
  )
}
