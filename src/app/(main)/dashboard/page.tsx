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
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Line, LineChart } from "recharts"

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
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Jean-Pierre. Here is what's happening today in your business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Sales"
          value="3,500,000 FCFA"
          icon={ShoppingCart}
          trend={{ value: 12, label: "vs last month", isPositive: true }}
        />
        <StatCard
          title="Monthly Expenses"
          value="1,800,000 FCFA"
          icon={Receipt}
          trend={{ value: 4, label: "vs last month", isPositive: false }}
        />
        <StatCard
          title="Net Profit"
          value="1,700,000 FCFA"
          icon={TrendingUp}
          trend={{ value: 18, label: "vs last month", isPositive: true }}
        />
        <StatCard
          title="Low Stock Items"
          value="12"
          icon={AlertTriangle}
          className="bg-destructive/5"
          description="Action required immediately"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Sales performance</CardTitle>
            <CardDescription>Daily sales volume in FCFA (Littoral Region)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
             <ChartContainer
                config={{
                  total: {
                    label: "Sales",
                    color: "hsl(var(--primary))",
                  },
                }}
              >
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value/1000}k`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system-wide events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Jean-Pierre", action: "Recorded new sale", time: "10 mins ago" },
                { user: "Marie Claire", action: "Updated inventory: Riz Long Grain", time: "2 hrs ago" },
                { user: "System", action: "Low stock alert: Savon Azur", time: "4 hrs ago" },
                { user: "Manager", action: "Assigned task: Monthly Audit", time: "Yesterday" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-sm border-b pb-3 last:border-0 last:pb-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {item.user[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.action}</p>
                    <p className="text-muted-foreground text-xs">{item.user} • {item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Task Overview</CardTitle>
              <CardDescription>Operations & Logistics</CardDescription>
            </div>
            <Briefcase className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Completed</span>
                <span className="font-bold">24 / 30</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[80%]" />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="bg-muted/50 p-2 rounded-lg text-center">
                  <p className="text-xl font-bold text-destructive">5</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Overdue</p>
                </div>
                <div className="bg-muted/50 p-2 rounded-lg text-center">
                  <p className="text-xl font-bold text-primary">12</p>
                  <p className="text-[10px] uppercase text-muted-foreground">Assigned</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Inventory Health</CardTitle>
              <CardDescription>Stock levels & Valuations</CardDescription>
            </div>
            <Package className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>Stock Coverage</span>
                <span className="font-bold">92%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[92%]" />
              </div>
              <p className="text-xs text-muted-foreground pt-2">
                Estimated inventory value: <span className="font-bold text-foreground">12,450,000 FCFA</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Human Resources</CardTitle>
              <CardDescription>Workforce stats</CardDescription>
            </div>
            <Users className="size-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-1">
                <p className="text-3xl font-bold">18</p>
                <p className="text-sm text-muted-foreground">Active Employees</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-emerald-500 font-bold">100%</p>
                <p className="text-[10px] uppercase text-muted-foreground">Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}