"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { 
  ShoppingCart, 
  Receipt, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Briefcase,
  Users
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const salesData = [
  { name: "Mon", total: 120000 },
  { name: "Tue", total: 150000 },
  { name: "Wed", total: 110000 },
  { name: "Thu", total: 180000 },
  { name: "Fri", total: 220000 },
  { name: "Sat", total: 250000 },
  { name: "Sun", total: 140000 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground font-headline">Executive Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, Jean-Pierre. Real-time insights for your Douala-based business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          value="3,500,000 FCFA"
          icon={ShoppingCart}
          trend={{ value: 12, label: "vs last month", isPositive: true }}
          className="border-t-4 border-[#10b981] shadow-md"
        />
        <StatCard
          title="Monthly Expenses"
          value="1,800,000 FCFA"
          icon={Receipt}
          trend={{ value: 4, label: "vs last month", isPositive: false }}
          className="border-t-4 border-[#f59e0b] shadow-md"
        />
        <StatCard
          title="Net Profit"
          value="1,700,000 FCFA"
          icon={TrendingUp}
          trend={{ value: 18, label: "vs last month", isPositive: true }}
          className="border-t-4 border-[#3b82f6] shadow-md"
        />
        <StatCard
          title="Low Stock Items"
          value="12"
          icon={AlertTriangle}
          className="border-t-4 border-[#ef4444] shadow-md bg-red-50/10"
          description="Action required"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Sales Performance</CardTitle>
            <CardDescription className="text-xs">Daily sales volume in FCFA (Littoral Region)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
             <ChartContainer
                config={{
                  total: {
                    label: "Sales",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="w-full h-full"
              >
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(value) => `${value/1000}k`} fontSize={12} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Jean-Pierre", action: "Recorded sale", time: "10m ago" },
                { user: "Marie Claire", action: "Updated stock", time: "2h ago" },
                { user: "System", action: "Low stock alert", time: "4h ago" },
                { user: "Manager", action: "New task assigned", time: "Yesterday" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-sm border-b pb-3 last:border-0 last:pb-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {item.user[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.action}</p>
                    <p className="text-muted-foreground text-[10px] uppercase">{item.user} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
