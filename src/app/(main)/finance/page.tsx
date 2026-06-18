
"use client"

import * as React from "react"
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  FileSpreadsheet, 
  ArrowUpRight, 
  ArrowDownRight,
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

// OHADA/SYCOHADA Data Structure
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
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4 text-center">
        <div className="bg-muted p-6 rounded-full">
          <Lock className="size-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground max-w-md">
          You do not have the necessary permissions to view detailed SYCOHADA financial records.
        </p>
        <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    )
  }

  const totalCA = financialData.reduce((acc, curr) => acc + curr.produits, 0)
  const totalCharges = financialData.reduce((acc, curr) => acc + curr.charges, 0)
  const totalVA = financialData.reduce((acc, curr) => acc + curr.va, 0)
  const result Net = totalCA - totalCharges

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Finance & Accounting</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">SYCOHADA Compliant</Badge>
            <p className="text-muted-foreground text-sm">Official financial reporting for Cameroonian SMEs.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4 mr-2" /> Export DSF
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Calculator className="size-4 mr-2" /> Generate Balance Sheet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-500 border-t-4 shadow-sm bg-blue-50/10 transition-transform hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Chiffre d'Affaires (CA)</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700">{totalCA.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <TrendingUp className="size-3" /> Growth: +12.5%
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500 border-t-4 shadow-sm bg-emerald-50/10 transition-transform hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Valeur Ajoutée (VA)</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700">{totalVA.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <BarChart3 className="size-3" /> Margin: 34%
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500 border-t-4 shadow-sm bg-amber-50/10 transition-transform hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Résultat Net (P&L)</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-700">{resultNet.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold">
              <TrendingUp className="size-3" /> Profitability: Healthy
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary border-t-4 shadow-sm bg-primary/5 transition-transform hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Trésorerie Actuelle</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">4,250,000 FCFA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
              <Wallet className="size-3" /> Cash & Mobile Money
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-sidebar-border/10">
          <CardHeader>
            <CardTitle>Analyse de Gestion (SYCOHADA)</CardTitle>
            <CardDescription>Produits (Income) vs Charges (Expenses) - Monthly Trend</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ChartContainer
              config={{
                produits: { label: "Produits (Cl. 7)", color: "hsl(var(--primary))" },
                charges: { label: "Charges (Cl. 6)", color: "hsl(var(--destructive))" },
              }}
            >
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(val) => `${val / 1000000}M`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="produits" fill="var(--color-produits)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="charges" fill="var(--color-charges)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-sidebar-border/10">
          <CardHeader>
            <CardTitle>Compliance Actions</CardTitle>
            <CardDescription>Fiscal duties & SYCOHADA tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl border-l-4 border-amber-500 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-amber-700 tracking-tighter">Tax Deadline</p>
                <Gavel className="size-4 text-amber-600" />
              </div>
              <p className="text-lg font-bold">June 15, 2024</p>
              <p className="text-[10px] text-muted-foreground">Monthly VAT (TVA) and AIR declaration due.</p>
              <Button size="sm" className="w-full mt-2 text-xs" variant="secondary">Prepare Filing</Button>
            </div>

            <div className="space-y-2">
              <Button className="w-full justify-start text-sm" variant="ghost">
                <FileSpreadsheet className="size-4 mr-3 text-emerald-500" /> Grand Livre (General Ledger)
              </Button>
              <Button className="w-full justify-start text-sm" variant="ghost">
                <TrendingUp className="size-4 mr-3 text-blue-500" /> Balance des Comptes
              </Button>
              <Button className="w-full justify-start text-sm" variant="ghost">
                <History className="size-4 mr-3 text-amber-500" /> Accounting Audit Trail
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-3">Taxes Estimées</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>TVA (19.25%)</span>
                  <span className="font-bold">481,250 FCFA</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Impôt sur le Revenu (AIR)</span>
                  <span className="font-bold">125,000 FCFA</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-sidebar-border/10">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Journal des Opérations</CardTitle>
            <CardDescription>SYCOHADA Compliant ledger entries</CardDescription>
          </div>
          <Button variant="ghost" size="sm">Download CSV</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead>Compte</TableHead>
                <TableHead>Label</TableHead>
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
                { acc: "521", label: "Banque (SCB/Afriland)", ref: "EXP-2024-088", date: "2024-05-20", debit: 0, credit: 45000 },
              ].map((tx, idx) => (
                <TableRow key={idx} className="hover:bg-muted/20">
                  <TableCell className="font-mono font-bold text-xs text-blue-600">{tx.acc}</TableCell>
                  <TableCell className="text-xs">{tx.label}</TableCell>
                  <TableCell className="text-xs font-medium">{tx.ref}</TableCell>
                  <TableCell className="text-xs">{new Date(tx.date).toLocaleDateString()}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  )
}
