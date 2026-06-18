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
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-bold uppercase tracking-tighter">SYCOHADA Compliant</Badge>
            <p className="text-[10px] text-muted-foreground font-bold uppercase">OHADA Standard Reporting</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="size-4 mr-2" /> Export DSF
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Calculator className="size-4 mr-2" /> Generate Balance Sheet
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
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Valeur Ajoutée (VA)</CardDescription>
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
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Trésorerie Actuelle</CardDescription>
            <CardTitle className="text-xl font-bold text-primary">4,250,000 FCFA</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Analyse de Gestion SYCOHADA</CardTitle>
            <CardDescription className="text-xs">Produits (Cl. 7) vs Charges (Cl. 6) - 2024</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] w-full">
            <ChartContainer
              config={{
                produits: { label: "Produits (Income)", color: "hsl(var(--primary))" },
                charges: { label: "Charges (Expenses)", color: "hsl(var(--destructive))" },
              }}
              className="w-full h-full"
            >
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={(val) => `${val / 1000000}M`} fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend iconType="circle" />
                <Bar dataKey="produits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="charges" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Compliance Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl border-l-4 border-amber-500">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase text-amber-700">Tax Deadline</p>
                <Gavel className="size-4 text-amber-600" />
              </div>
              <p className="text-lg font-bold">June 15, 2024</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Monthly VAT & AIR declaration</p>
              <Button size="sm" className="w-full mt-3 text-xs" variant="secondary">Prepare Filing</Button>
            </div>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-xs h-9">
                <FileSpreadsheet className="size-4 mr-3 text-emerald-500" /> Grand Livre (General Ledger)
              </Button>
              <Button variant="ghost" className="w-full justify-start text-xs h-9">
                <History className="size-4 mr-3 text-amber-500" /> Accounting Audit Trail
              </Button>
              <Button variant="ghost" className="w-full justify-start text-xs h-9">
                <TrendingUp className="size-4 mr-3 text-blue-500" /> Balance des Comptes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Journal des Opérations</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs uppercase font-bold">Export CSV</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px]">Compte</TableHead>
                  <TableHead>Label SYCOHADA</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Débit</TableHead>
                  <TableHead className="text-right">Crédit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { acc: "411", label: "Clients Locaux", ref: "FAC-2024-001", date: "2024-05-21", debit: 450000, credit: 0 },
                  { acc: "701", label: "Ventes Marchandises", ref: "FAC-2024-001", date: "2024-05-21", debit: 0, credit: 450000 },
                  { acc: "601", label: "Achats de Fournitures", ref: "EXP-2024-088", date: "2024-05-20", debit: 45000, credit: 0 },
                  { acc: "521", label: "Banque (Afriland)", ref: "EXP-2024-088", date: "2024-05-20", debit: 0, credit: 45000 },
                ].map((tx, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono font-bold text-xs text-blue-600">{tx.acc}</TableCell>
                    <TableCell className="text-xs">{tx.label}</TableCell>
                    <TableCell className="text-xs font-medium">{tx.ref}</TableCell>
                    <TableCell className="text-xs whitespace-nowrap">{new Date(tx.date).toLocaleDateString()}</TableCell>
                    <TableCell className={`text-right font-bold text-xs ${tx.debit > 0 ? "text-emerald-600" : "text-muted-foreground/30"}`}>
                      {tx.debit > 0 ? tx.debit.toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className={`text-right font-bold text-xs ${tx.credit > 0 ? "text-destructive" : "text-muted-foreground/30"}`}>
                      {tx.credit > 0 ? tx.credit.toLocaleString() : "-"}
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
