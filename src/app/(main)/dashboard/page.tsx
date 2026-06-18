
"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { ShoppingCart, Receipt, Users, TrendingUp, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="space-y-1">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary font-headline">Bonjour, Jean-Pierre</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Voici l'état actuel de votre entreprise à Douala (Littoral).</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Sales" 
          value="4,500,000 FCFA" 
          icon={ShoppingCart} 
          trend={{ value: 12.5, label: "vs last month", isPositive: true }}
        />
        <StatCard 
          title="Total Expenses" 
          value="1,200,000 FCFA" 
          icon={Receipt} 
          trend={{ value: 4.2, label: "vs last month", isPositive: false }}
        />
        <StatCard 
          title="Net Profit" 
          value="3,300,000 FCFA" 
          icon={TrendingUp} 
          trend={{ value: 18.1, label: "vs last month", isPositive: true }}
        />
        <StatCard 
          title="Active Employees" 
          value="12" 
          icon={Users} 
          description="3 on leave this month"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-accent/20 bg-accent/5">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              <CardTitle className="text-accent text-base md:text-lg font-headline">AI Performance Insights</CardTitle>
            </div>
            <CardDescription className="text-xs">Based on current business data for {new Date().toLocaleDateString('fr-CM', { month: 'long', year: 'numeric' })}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-4">
            <p className="text-xs md:text-sm leading-relaxed text-foreground/80">
              Votre chiffre d'affaires ce mois-ci est en hausse de <strong>12.5%</strong>. 
              Cependant, nous observons une baisse de stock critique sur <strong>3 produits</strong>. 
              L'AI Assistant recommande de réapprovisionner le "Riz Long Grain" pour éviter une rupture de stock d'ici 3 jours.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-bold text-[10px]">Riz: Stock Critique</Badge>
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">Rentabilité: Boissons</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg font-headline">Task Overview</CardTitle>
            <CardDescription className="text-xs">Operational workload management</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3">
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-bold">4</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-muted-foreground text-destructive">Overdue</span>
              <span className="font-bold text-destructive">1</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-muted-foreground text-emerald-600">Completed</span>
              <span className="font-bold text-emerald-600">12</span>
            </div>
            <Link href="/tasks" passHref>
              <Button size="sm" className="w-full mt-2 text-xs" variant="secondary">
                Manage All Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg font-headline">Inventory Alerts</CardTitle>
            <CardDescription className="text-xs">Items needing replenishment at Akwa Branch</CardDescription>
          </div>
          <Link href="/inventory" passHref className="w-full sm:w-auto">
            <Button size="sm" variant="ghost" className="w-full sm:w-auto text-xs">View Inventory</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 whitespace-nowrap">
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Category</TableHead>
                  <TableHead className="text-xs">Stock</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PRODUCTS.filter(p => p.quantity <= p.lowStockLevel).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-xs py-3">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs py-3">{product.category}</TableCell>
                    <TableCell className="text-xs py-3">{product.quantity}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="destructive" className="text-[9px] uppercase tracking-tighter">Critical</Badge>
                    </TableCell>
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
