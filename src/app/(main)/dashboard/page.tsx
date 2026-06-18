
import { StatCard } from "@/components/dashboard/stat-card"
import { ShoppingCart, Receipt, Users, TrendingUp, Package, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_PRODUCTS } from "@/lib/mock-data"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bonjour, Jean-Pierre</h2>
        <p className="text-muted-foreground">Voici l'état actuel de votre entreprise à Douala.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-accent/20 bg-accent/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              <CardTitle className="text-accent">AI Performance Insights</CardTitle>
            </div>
            <CardDescription>Generated based on real-time data analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-foreground/80">
              Votre chiffre d'affaires ce mois-ci est en hausse de <strong>12.5%</strong> par rapport au mois dernier. 
              Cependant, nous observons une baisse de stock critique sur <strong>3 produits alimentaires</strong>. 
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-bold">Riz Long Grain: Critical Stock</Badge>
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">High Profitability: Drinks</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            <CardDescription>Current operational workload</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-bold">4</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground text-destructive">Late/Overdue</span>
              <span className="font-bold text-destructive">1</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground text-emerald-600">Completed</span>
              <span className="font-bold text-emerald-600">12</span>
            </div>
            <Button size="sm" className="w-full mt-2" variant="secondary">
              Go to Tasks
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Low Stock Alerts</CardTitle>
              <CardDescription>Items needing replenishment</CardDescription>
            </div>
            <Button size="sm" variant="ghost">View Inventory</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PRODUCTS.filter(p => p.quantity <= p.lowStockLevel).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">Critical</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
