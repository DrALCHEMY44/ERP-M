"use client"

import * as React from "react"
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  FileSpreadsheet, 
  Download,
  Lock,
  Calculator,
  Gavel,
  History
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts"
import { MOCK_USER } from "@/lib/mock-data"

const financialData = [
  { month: "Jan", produits: 2500000, charges: 1800000, va: 700000 },
  { month: "Feb", produits: 2800000, charges: 1900000, va: 900000 },
  { month: "Mar", produits: 3200000, charges: 2100000, va: 1100000 },
  { month: "Apr", produits: 2900000, charges: 2000000, va: 900000 },
  { month: "May", produits: 3500000, charges: 2200000, va: 1300000 },
  { month: "Jun", produits: 3800000, charges: 2400000, va: 1400000 },
]

export default function FinancePage() {
  const isAuthorized = ["Business Owner", "Accountant", "Manager"].includes(MOCK_USER.role)

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center p-4">
        <div className="bg-muted p-6 rounded-full">
          <Lock className="size-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          You do not have permissions to view SYCOHADA financial records.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Finance & Accounting</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">SYCOHADA Compliant</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="size-4 mr-2" /> Export DSF
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Calculator className="size-4 mr-2" /> Balance Sheet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-blue-500 shadow-sm bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Chiffre d'Affaires</CardDescription>
            <CardTitle className="text-xl font-bold text-blue-700">20,700,000 FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-sm bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Valeur Ajoutée</CardDescription>
            <CardTitle className="text-xl font-bold text-emerald-700">6,500,000 FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-sm bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Résultat Net</CardDescription>
            <CardTitle className="text-xl font-bold text-amber-700">3,200,000 FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-primary shadow-sm bg-primary/5">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Trésorerie</CardDescription>
            <CardTitle className="text-xl font-bold text-primary">4,250,000 FCFA</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Analyse SYCOHADA</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <ChartContainer
              config={{
                produits: { label: "Produits (Cl. 7)", color: "hsl(var(--primary))" },
                charges: { label: "Charges (Cl. 6)", color: "hsl(var(--destructive))" },
              }}
              className="w-full h-full"
            >
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(val) => `${val / 1000000}M`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="produits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="charges" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl border-l-4 border-amber-500">
              <p className="text-[10px] font-bold uppercase text-amber-700">Tax Deadline</p>
              <p className="text-lg font-bold">June 15, 2024</p>
              <p className="text-[10px] text-muted-foreground">Monthly VAT & AIR declaration.</p>
            </div>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-xs h-8">
                <FileSpreadsheet className="size-3 mr-3 text-emerald-500" /> Grand Livre
              </Button>
              <Button variant="ghost" className="w-full justify-start text-xs h-8">
                <History className="size-3 mr-3 text-amber-500" /> Audit Trail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
