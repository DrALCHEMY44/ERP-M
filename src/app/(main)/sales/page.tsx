
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
      title: "Sale Recorded",
      description: `Transaction of ${saleData.totalAmount?.toLocaleString()} FCFA recorded.`,
    })
  }

  const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0)
  const salesCount = sales.length
  const avgSale = salesCount > 0 ? totalRevenue / salesCount : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary font-headline">Sales Management</h2>
          <p className="text-muted-foreground">Track revenue and manage customer transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="size-4" />
            Export Report
          </Button>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-accent hover:bg-accent/90 flex items-center gap-2">
            <Plus className="size-4" />
            Record Sale
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} FCFA</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <ArrowUpRight className="size-3 mr-1" />
              8% growth this month
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Today: 12 sales</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-purple-500 transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Avg. Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSale.toLocaleString(undefined, { maximumFractionDigits: 0 })} FCFA</div>
            <p className="text-xs text-muted-foreground mt-1">Stable vs last week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-headline flex items-center gap-2">
            <ShoppingCart className="size-5 text-muted-foreground" />
            Recent Transactions
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Search sales..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 text-[11px] uppercase tracking-wider">
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id} className="group">
                  <TableCell className="font-mono text-xs font-bold">{sale.id}</TableCell>
                  <TableCell className="text-xs">
                    {new Date(sale.saleDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-secondary/50 font-normal">
                      {sale.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {sale.totalAmount.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
