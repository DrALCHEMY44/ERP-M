
"use client"

import { StatCard } from "@/components/dashboard/stat-card"
import { ShoppingCart, Receipt, Users, TrendingUp, Sparkles, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_PRODUCTS, MOCK_SALES } from "@/lib/mock-data"
import Link from "next/link"

export default function DashboardPage() {
  const lowStockItems = MOCK_PRODUCTS.filter(p => p.quantity <= p.lowStockLevel);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="space-y-1">
        <h2 className="text-xl md:text-3xl font-bold tracking-tight text-primary font-headline">Tableau de Bord</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Bienvenue, Jean-Pierre. Voici un résumé de l'activité à Douala.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ventes Totales" 
          value="4,500,000 FCFA" 
          icon={ShoppingCart} 
          trend={{ value: 12.5, label: "vs mois dernier", isPositive: true }}
        />
        <StatCard 
          title="Dépenses Totales" 
          value="1,200,000 FCFA" 
          icon={Receipt} 
          trend={{ value: 4.2, label: "vs mois dernier", isPositive: false }}
        />
        <StatCard 
          title="Bénéfice Net" 
          value="3,300,000 FCFA" 
          icon={TrendingUp} 
          trend={{ value: 18.1, label: "vs mois dernier", isPositive: true }}
        />
        <StatCard 
          title="Employés Actifs" 
          value="12" 
          icon={Users} 
          description="Tous présents aujourd'hui"
        />
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-accent/20 bg-accent/5">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              <CardTitle className="text-accent text-base md:text-lg font-headline">Insights IA en temps réel</CardTitle>
            </div>
            <CardDescription className="text-xs">Analyse basée sur vos données de tenant {new Date().toLocaleDateString('fr-CM')}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-4">
            <p className="text-xs md:text-sm leading-relaxed text-foreground/80 italic">
              "Vos ventes ont augmenté de 12.5% grâce à la catégorie Food. Attention : <strong>{lowStockItems.length} produits</strong> sont en stock critique. Je vous suggère de commander du Riz Long Grain avant la rupture prévue demain."
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="outline" className="bg-accent/10 border-accent/20 text-accent font-bold text-[10px]">IA: Stock Critique</Badge>
              <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">IA: Analyse Profit</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg font-headline">Statut des Tâches</CardTitle>
            <CardDescription className="text-xs">Opérations en cours</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 space-y-3">
            <div className="flex justify-between items-center text-xs md:text-sm border-b pb-2">
              <span className="text-muted-foreground">En attente</span>
              <span className="font-bold">4</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm border-b pb-2">
              <span className="text-muted-foreground text-destructive">En retard</span>
              <span className="font-bold text-destructive">1</span>
            </div>
            <div className="flex justify-between items-center text-xs md:text-sm">
              <span className="text-muted-foreground text-emerald-600">Terminées</span>
              <span className="font-bold text-emerald-600">12</span>
            </div>
            <Link href="/tasks" passHref className="block pt-2">
              <Button size="sm" className="w-full text-xs" variant="secondary">
                Gérer les Tâches
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-base md:text-lg font-headline flex items-center gap-2">
              <AlertCircle className="size-4 text-destructive" />
              Alertes de Stock
            </CardTitle>
            <CardDescription className="text-xs">Produits nécessitant un réapprovisionnement immédiat</CardDescription>
          </div>
          <Link href="/inventory" passHref className="w-full sm:w-auto">
            <Button size="sm" variant="outline" className="w-full sm:w-auto text-xs">Inventaire Complet</Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 whitespace-nowrap">
                  <TableHead className="text-xs">Produit</TableHead>
                  <TableHead className="hidden md:table-cell text-xs">Catégorie</TableHead>
                  <TableHead className="text-xs text-right">Quantité</TableHead>
                  <TableHead className="text-xs">Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.length > 0 ? lowStockItems.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium text-xs py-3">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs py-3">{product.category}</TableCell>
                    <TableCell className="text-xs py-3 text-right font-bold text-destructive">{product.quantity}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="destructive" className="text-[9px] uppercase tracking-tighter">Critique</Badge>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-xs py-4 text-muted-foreground">
                      Aucune alerte de stock.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
