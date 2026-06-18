"use client"

import * as React from "react"
import { Plus, Search, Filter, AlertTriangle, Package, Download, Loader2, Trash2 } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

export default function InventoryPage() {
  const { data: products, loading, addRecord, updateRecord, deleteRecord } = useFirestore<Product>('products');
  const { toast } = useToast();
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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteRecord(id);
        toast({ title: "Product Deleted", description: "Item has been removed from your inventory." });
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete product." });
      }
    }
  }

  const handleSave = async (productData: Partial<Product>) => {
    try {
      if (selectedProduct?.id) {
        await updateRecord(selectedProduct.id, productData);
        toast({ title: "Product Updated", description: `${productData.name} has been modified.` });
      } else {
        await addRecord(productData as Omit<Product, 'id'>);
        toast({ title: "Product Added", description: `${productData.name} is now in your stock.` });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Save Failed", description: "Please check your database connection." });
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
          <Button variant="outline" size="sm" className="hidden sm:flex uppercase font-bold text-[10px]">
            <Download className="size-4 mr-2" /> Export CSV
          </Button>
          <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto font-bold uppercase text-xs tracking-widest shadow-lg">
            <Plus className="size-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-[#3b82f6] shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Stock Value</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-blue-700">{totalValue.toLocaleString()} FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Based on cost price</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#f59e0b] shadow-md bg-amber-50/10">
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
        <Card className="border-t-4 border-[#10b981] shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Products</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-emerald-700">{products.length} Items</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Connected to Cloud Firestore</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input 
              placeholder="Search products or categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/20 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="ghost" size="sm" className="ml-auto text-[10px] uppercase font-bold">
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
                <TableHead>Price (Selling)</TableHead>
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
                      <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-widest">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${product.quantity <= product.lowStockLevel ? 'text-destructive' : 'text-foreground'}`}>
                          {product.quantity} units
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase font-bold">Alert: {product.lowStockLevel}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600 text-sm">{product.sellingPrice.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      {product.quantity <= product.lowStockLevel ? (
                        <Badge className="bg-destructive text-destructive-foreground text-[9px] uppercase font-bold">Low Stock</Badge>
                      ) : (
                        <Badge className="bg-emerald-500 text-white text-[9px] uppercase font-bold">In Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="text-[10px] uppercase font-bold">Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id!)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
