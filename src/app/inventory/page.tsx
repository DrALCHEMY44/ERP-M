
"use client"

import * as React from "react"
import { Plus, Search, Filter, AlertTriangle, Package, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductDialog } from "@/components/inventory/product-dialog"
import { Product } from "@/lib/types"
import { useFirestore } from "@/hooks/use-firestore"

export default function InventoryPage() {
  const { data: products, loading, addRecord, updateRecord } = useFirestore<Product>('products');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const lowStockItems = products.filter(p => p.quantity <= p.lowStockLevel)
  const totalValue = products.reduce((acc, p) => acc + (p.quantity * p.costPrice), 0)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleSave = async (productData: Partial<Product>) => {
    if (selectedProduct?.id) {
      await updateRecord(selectedProduct.id, productData);
    } else {
      await addRecord(productData as Omit<Product, 'id'>);
    }
  }

  if (loading) {
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inventory Tracking</h1>
          <p className="text-sm text-muted-foreground">Manage your stock levels, pricing, and suppliers (Live Database).</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="size-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto font-bold uppercase text-xs tracking-widest shadow-lg">
            <Plus className="size-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-blue-500 shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold">{totalValue.toLocaleString()} FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Based on cost price</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center justify-between">
            <div>
              <div className="text-xl md:text-2xl font-bold text-amber-600">{lowStockItems.length} Items</div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Requires Re-stocking</p>
            </div>
            <AlertTriangle className="size-8 text-amber-500 opacity-50" />
          </CardContent>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Database Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-emerald-700">Online</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Connected to Cloud Firestore</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search products or categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>
          <Button variant="ghost" size="sm" className="ml-auto">
            <Filter className="size-4 mr-2" /> Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/20">
                    <TableCell className="font-medium text-sm">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-tighter">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${product.quantity <= product.lowStockLevel ? 'text-destructive' : 'text-foreground'}`}>
                          {product.quantity} units
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase">Alert at {product.lowStockLevel}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-primary text-sm">{product.sellingPrice.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      {product.quantity <= product.lowStockLevel ? (
                        <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] uppercase font-bold">Low Stock</Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[9px] uppercase font-bold">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="text-[10px] uppercase font-bold">Edit</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchQuery ? "No matching products found." : "No products in your database yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductDialog 
        product={selectedProduct}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
