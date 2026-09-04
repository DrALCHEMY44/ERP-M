
"use client"

import * as React from "react"
import {
  Download,
  ShoppingCart,
  Package,
  TrendingUp,
  Loader2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useNeonData } from "@/hooks/use-neon-data"
import { useAuth } from "@/hooks/use-auth"
import { getReportSummaryQuery, listProductsByBusinessQuery, type ReportSummary } from "@/lib/data-service"
import { Product } from "@/lib/types"
import { downloadCsv } from "@/lib/csv"

export default function SalesInventoryReportPage() {
  const { profile } = useAuth();
  const { data: summary, loading: summaryLoading, error: summaryError } = useNeonData<ReportSummary>({
    query: getReportSummaryQuery,
    skip: !profile,
    refreshInterval: 15000,
  });
  const { data: productsData, loading: productsLoading } = useNeonData({
    query: listProductsByBusinessQuery,
    variables: { tenantId: profile?.tenantId || "", businessId: profile?.businessId || "" },
    skip: !profile?.tenantId || !profile?.businessId,
    refreshInterval: 15000,
  });
  const products = React.useMemo(() => (productsData?.products || []) as Product[], [productsData]);

  const stats = React.useMemo(() => {
    return {
      totalRevenue: summary?.totalRevenue || 0,
      totalInventoryValue: summary?.inventoryValue || 0,
      totalItems: summary?.totalItems || 0,
      topProducts: summary?.topProducts || [],
    };
  }, [summary]);

  const trendData = React.useMemo(() => {
    const recorded = new Map((summary?.revenueTrend || []).map((row) => [row.month, row.sales]));
    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - (5 - index));
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      return { name: date.toLocaleDateString(undefined, { month: "short" }), sales: recorded.get(key) || 0 };
    });
  }, [summary]);

  const exportReport = React.useCallback(() => {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`sales-inventory-${date}.csv`, [
      ["Sales and inventory report", date],
      ["Total sales revenue", stats.totalRevenue],
      ["Stock asset valuation", stats.totalInventoryValue],
      ["Total inventory units", stats.totalItems],
      [],
      ["Product ID", "Name", "Category", "Quantity", "Cost price", "Selling price", "Inventory value"],
      ...products.map((product) => [
        product.id, product.name, product.category, product.quantity, product.costPrice,
        product.sellingPrice, product.quantity * product.costPrice,
      ]),
    ]);
  }, [products, stats]);

  if (summaryLoading || productsLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (summaryError) {
    return <Card><CardContent className="p-6 text-sm text-destructive">Unable to load report data: {summaryError.message}</CardContent></Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales & Inventory Analytics</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Deep Dive into Operational Revenue & Assets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest bg-card" onClick={exportReport}>
            <Download className="size-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-emerald-500 shadow-sm bg-emerald-50/10">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total Sales Revenue</CardDescription>
              <ShoppingCart className="size-4 text-emerald-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-700">{stats.totalRevenue.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-blue-500 shadow-sm bg-blue-50/10">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Stock Asset Valuation</CardDescription>
              <Package className="size-4 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-blue-700">{stats.totalInventoryValue.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-sm bg-amber-50/10">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total Inventory Items</CardDescription>
              <TrendingUp className="size-4 text-amber-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-amber-700">{stats.totalItems.toLocaleString()} Units</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase">Revenue Growth Trend</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">Monthly Sales Volume (FCFA)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer config={{ sales: { label: "Sales", color: "hsl(var(--primary))" } }} className="w-full h-full">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis tickFormatter={(v) => `${v/1000000}M`} fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase">Top 5 Products by Revenue</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold text-muted-foreground">Highest Performing Inventory Assets</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Revenue (FCFA)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.topProducts.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/10 text-xs">
                    <TableCell className="font-bold">{p.name}</TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">{p.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between p-4">
          <div>
            <CardTitle className="text-sm font-bold uppercase">Inventory & Sales Detail</CardTitle>
            <CardDescription className="text-[10px] font-medium uppercase tracking-tighter">Unified list of products and their current commercial value</CardDescription>
          </div>
          <Badge variant="outline" className="text-[9px] font-bold uppercase bg-card">Real-time Synchronization</Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Selling Price</TableHead>
                  <TableHead className="text-right">Estimated Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice(0, 10).map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/20 text-xs">
                    <TableCell className="font-mono text-[10px] text-muted-foreground">{p.id?.substring(0, 8)}</TableCell>
                    <TableCell className="font-bold">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[8px] uppercase font-bold">{p.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{p.quantity}</TableCell>
                    <TableCell className="text-right">{p.sellingPrice.toLocaleString()} FCFA</TableCell>
                    <TableCell className="text-right font-bold text-emerald-700">{(p.quantity * p.sellingPrice).toLocaleString()} FCFA</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
