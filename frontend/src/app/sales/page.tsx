"use client"

import * as React from "react"
import { Plus, Search, Download, ShoppingCart, CreditCard, Smartphone, Banknote, Loader2, Calendar, LogIn } from "lucide-react"
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
import { SaleDialog } from "@/components/sales/sale-dialog"
import { ReceiptDialog } from "@/components/sales/receipt-dialog"
import { Customer, Product, Sale } from "@/lib/types"
import { useNeonData } from "@/hooks/use-neon-data"
import {
  getSalesQuery,
  getBusinessByIdQuery,
  getBusinessSettingsQuery,
  listSaleCustomersByBusinessQuery,
  listSaleProductsByBusinessQuery,
} from "@/lib/data-service"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { downloadCsv } from "@/lib/csv"

export default function SalesPage() {
  const { profile, user } = useAuth();
  const canRecordSales = Boolean(profile && ["Business Owner", "Manager", "Accountant"].includes(profile.role));
  const { data: salesData, loading: salesLoading, unauthenticated, refetch: refetchSales } = useNeonData({
    query: getSalesQuery,
    skip: !profile || !profile.tenantId || !profile.businessId,
    refreshInterval: 5000
  });
  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useNeonData({
    query: listSaleProductsByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !canRecordSales || !profile?.tenantId || !profile.businessId,
    refreshInterval: 5000
  });
  const { data: customersData, loading: customersLoading } = useNeonData({
    query: listSaleCustomersByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !canRecordSales || !profile?.tenantId || !profile.businessId,
    refreshInterval: 15000,
  });
  const { data: businessData } = useNeonData({
    query: getBusinessByIdQuery,
    variables: { id: profile?.businessId || "" },
    skip: !profile?.businessId,
    refreshInterval: 60000,
  });
  const { data: settingsData } = useNeonData({
    query: getBusinessSettingsQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !profile?.tenantId || !profile?.businessId,
    refreshInterval: 60000,
  });
  const { toast } = useToast();

  const sales = React.useMemo(() => {
    return (salesData?.sales || []) as Sale[];
  }, [salesData]);
  const products = React.useMemo(() => {
    if (!profile?.tenantId || !profile.businessId) return [];
    return (productsData?.products || []).filter((product: any) =>
      product.tenantId === profile.tenantId && product.businessId === profile.businessId
    ) as unknown as Product[];
  }, [productsData, profile?.tenantId, profile?.businessId]);
  const customers = React.useMemo(() => {
    if (!profile?.tenantId || !profile.businessId) return [];
    return (customersData?.customers || []).filter((customer: Customer) =>
      customer.tenantId === profile.tenantId && customer.businessId === profile.businessId
    ) as Customer[];
  }, [customersData, profile?.tenantId, profile?.businessId]);
  const business = businessData?.business;
  const businessSettings = settingsData?.businessSettings?.[0];

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedReceipt, setSelectedReceipt] = React.useState<Sale | null>(null)
  const [isReceiptOpen, setIsReceiptOpen] = React.useState(false)

  const totalToday = sales.reduce((acc, sale) => {
    const isToday = new Date(sale.saleDate).toDateString() === new Date().toDateString();
    return isToday ? acc + sale.totalAmount : acc;
  }, 0)

  const momoSales = sales.filter(s => s.paymentMethod === 'Mobile Money').length

  const filteredSales = sales.filter(s =>
    s.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.paymentMethod && s.paymentMethod.toLowerCase().includes(searchQuery.toLowerCase()))
  ).sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())

  const exportSales = () => {
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(`sales-${date}.csv`, [
      ["Sale ID", "Date", "Payment method", "Products", "Total amount", "Recorded by"],
      ...filteredSales.map((sale) => [sale.id, sale.saleDate, sale.paymentMethod,
        sale.productsSold.map((item) => `${item.productId} x${item.quantity}`).join("; "), sale.totalAmount, sale.recordedBy]),
    ])
  }

  const handleNewSale = async (saleData: Partial<Sale>) => {
    if (!profile?.tenantId || !profile?.businessId || !user) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Your user profile is missing business/tenant identifiers. Please complete registration or select a business."
      });
      return;
    }
    try {
      const selectedPaymentMethod = saleData.paymentMethod || "Cash"
      if (selectedPaymentMethod === "Unknown") throw new Error("Select a payment method for the new sale")
      const paymentMethod = ({
        Cash: "CASH", "Mobile Money": "MOBILE_MONEY",
        "Bank Transfer": "BANK_TRANSFER", Credit: "CREDIT",
      } as const)[selectedPaymentMethod]
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: crypto.randomUUID(),
          customerId: saleData.customerId || undefined,
          paymentMethod,
          items: saleData.productsSold || [],
        }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "Sale failed")
      toast({ title: "Sale Recorded", description: `Transaction for ${saleData.totalAmount?.toLocaleString()} FCFA recorded.` });
      refetchSales();
      refetchProducts();
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not record sale. Please try again." });
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
              Please sign in to view your sales data. All operations require an authenticated session.
            </p>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest">
              <Link href="/login">
                <LogIn className="size-4 mr-2" /> Sign In
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (salesLoading) {
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
          <p className="text-sm text-muted-foreground">Monitor revenue and record customer payments for your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex text-[10px] font-bold uppercase" onClick={exportSales}>
            <Download className="size-4 mr-2" /> Export
          </Button>
          {canRecordSales && (
            <Button onClick={() => setIsDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto font-bold uppercase text-xs tracking-widest shadow-lg">
              <Plus className="size-4 mr-2" /> New Sale
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-4 border-[#10b981] shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Today&apos;s Revenue</CardTitle>
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
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Credit Sales</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-red-600">{sales.filter(s => s.paymentMethod === 'Credit').length} Recorded</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Transactions recorded on store credit</p>
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
                        <span className="text-xs font-medium">{sale.paymentMethod || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest">{sale.productsSold?.length || 0} Products</Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">
                      {sale.totalAmount.toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => { setSelectedReceipt(sale); setIsReceiptOpen(true); }}
                        variant="ghost"
                        size="sm"
                        className="text-[10px] uppercase font-bold text-primary hover:text-primary-foreground hover:bg-primary"
                      >
                        Print Receipt
                      </Button>
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

      {canRecordSales && (
        <SaleDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleNewSale}
          products={products}
          customers={customers}
          productsLoading={productsLoading}
          customersLoading={customersLoading}
        />
      )}

      <ReceiptDialog
        sale={selectedReceipt}
        open={isReceiptOpen}
        onOpenChange={setIsReceiptOpen}
        allProducts={products}
        businessName={business?.name}
        businessAddress={[business?.location, business?.city, business?.region].filter(Boolean).join(", ")}
        businessPhone={business?.phone}
        taxId={business?.taxId}
        taxRatePercent={businessSettings?.taxRate ?? 0}
        currency={businessSettings?.currency || "FCFA"}
        recordedByName={selectedReceipt?.recordedBy === user?.uid
          ? profile?.fullName || profile?.email
          : selectedReceipt?.recordedBy ? `User ${selectedReceipt.recordedBy.slice(0, 8)}` : undefined}
      />
    </div>
  )
}
