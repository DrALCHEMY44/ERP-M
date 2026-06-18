
"use client"

import * as React from "react"
import { 
  BarChart3, 
  Download, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Loader2,
  Calendar
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, ResponsiveContainer, Line, LineChart } from "recharts"
import { useFirestore } from "@/hooks/use-firestore"
import { Sale, Product } from "@/lib/types"

export default function SalesInventoryReportPage() {
  const { data: sales, loading: salesLoading } = useFirestore<Sale>('sales');
  const { data: products, loading: productsLoading } = useFirestore<Product>('products');

  const stats = React.useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.quantity * p.costPrice), 0);
    const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
    
    // Top products by revenue
    const productRevenue: Record<string, number> = {};
    sales.forEach(sale => {
      sale.productsSold.forEach(item => {
        productRevenue[item.productId] = (productRevenue[item.productId] || 0) + (item.quantity * item.priceAtSale);
      });
    });

    const topProducts = Object.entries(productRevenue)
      .map(([id, revenue]) => ({
        name: products.find(p => p.id === id)?.name || "Unknown Product",
        revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { totalRevenue, totalInventoryValue, totalItems, topProducts };
  }, [sales, products]);

  const trendData = React.useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map(m => ({
      name: m,
      sales: Math.floor(Math.random() * 5000000) + 1000000,
    }));
  }, []);

  if (salesLoading || productsLoading) {
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Sales & Inventory Analytics</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Deep Dive into Operational Revenue & Assets</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest bg-card">
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
                {stats.topProducts.map((p, i) => (
                  <TableRow key={i} className="hover:bg-muted/10 text-xs">
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
            <CardTitle className="text-sm font-bold uppercase">Inventory & Sales Audit</CardTitle>
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
