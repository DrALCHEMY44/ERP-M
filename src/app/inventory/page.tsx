"use client"

import * as React from "react"
import { Plus, Search, Filter, AlertTriangle, Package, Download, Loader2, Trash2, LogIn } from "lucide-react"
import Link from "next/link"
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
import { useDataConnect } from "@/hooks/use-dataconnect"
import { 
  listProductsByBusinessQuery,
  createProductMutation,
  updateProductMutation,
  deleteProductMutation
} from "@/lib/data-service"
import { MOCK_USER } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"
import { logActivity } from "@/lib/audit-logger"
import { createNotification } from "@/lib/notifications"
import { useAuth } from "@/hooks/use-auth"

export default function InventoryPage() {
  const { user, profile } = useAuth();
  const { data: productsData, loading, unauthenticated, refetch } = useDataConnect({
    query: listProductsByBusinessQuery, 
    variables: { 
      tenantId: profile?.tenantId || "",
      businessId: profile?.businessId || "" 
    },
    skip: !profile
  });
  const { toast } = useToast();
  
  const products = React.useMemo(() => (productsData?.products || []) as unknown as Product[], [productsData]);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredProducts = products.filter(p => 
    (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const lowStockItems = products.filter(p => p.quantity <= (p.lowStockLevel || 0))
  const totalValue = products.reduce((acc, p) => acc + (p.quantity * (p.costPrice || 0)), 0)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const productToDelete = products.find(p => p.id === id);
    if (confirm(`Are you sure you want to delete ${productToDelete?.name}?`)) {
      try {
        await deleteProductMutation({ id });
        await refetch();
        await logActivity({
          actionType: 'DELETE_PRODUCT',
          module: 'Inventory',
          description: `User deleted product: ${productToDelete?.name}`,
          recordId: id,
          oldValue: productToDelete,
          userProfile: profile ? {
            tenantId: profile.tenantId,
            businessId: profile.businessId,
            uid: user?.uid || "",
            fullName: profile.fullName,
            role: profile.role
          } : undefined
        });
        toast({ title: "Product Deleted", description: "Item has been removed from your inventory." });
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete product." });
      }
    }
  }

  const handleSave = async (productData: Partial<Product>) => {
    try {
      if (selectedProduct?.id) {
        await updateProductMutation({
          id: selectedProduct.id,
          name: productData.name,
          category: productData.category,
          quantity: productData.quantity,
          costPrice: productData.costPrice,
          sellingPrice: productData.sellingPrice,
          lowStockLevel: productData.lowStockLevel
        });
        await refetch();
        await logActivity({
          actionType: 'UPDATE_PRODUCT',
          module: 'Inventory',
          description: `User updated product: ${productData.name}`,
          recordId: selectedProduct.id,
          oldValue: selectedProduct,
          newValue: productData,
          userProfile: profile ? {
            tenantId: profile.tenantId,
            businessId: profile.businessId,
            uid: user?.uid || "",
            fullName: profile.fullName,
            role: profile.role
          } : undefined
        });
        
        // Low stock notification
        if (productData.quantity !== undefined && productData.quantity <= (productData.lowStockLevel || selectedProduct.lowStockLevel || 0)) {
          await createNotification({
            title: "Low Stock Alert",
            message: `Product "${productData.name}" has reached low stock level (${productData.quantity} left).`,
            type: "warning",
            module: "Inventory",
            targetRoles: ["Business Owner", "Manager", "Staff"],
            link: "/inventory",
            userProfile: profile ? {
              tenantId: profile.tenantId,
              businessId: profile.businessId
            } : undefined
          });
        }

        toast({ title: "Product Updated", description: `${productData.name} has been modified.` });
      } else {
        const result = await createProductMutation({
          tenantId: profile?.tenantId || "",
          businessId: profile?.businessId || "",
          name: productData.name || "Unnamed Product",
          category: productData.category,
          quantity: productData.quantity || 0,
          costPrice: productData.costPrice,
          sellingPrice: productData.sellingPrice || 0,
          lowStockLevel: productData.lowStockLevel,
          createdBy: user?.uid || "unknown"
        });
        await refetch();
        const newId = result.data.product_insert.id;
        await logActivity({
          actionType: 'ADD_PRODUCT',
          module: 'Inventory',
          description: `User added new product: ${productData.name}`,
          recordId: newId,
          newValue: productData,
          userProfile: profile ? {
            tenantId: profile.tenantId,
            businessId: profile.businessId,
            uid: user?.uid || "",
            fullName: profile.fullName,
            role: profile.role
          } : undefined
        });
        toast({ title: "Product Added", description: `${productData.name} is now in your stock.` });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Save Failed", description: "Please check your database connection." });
    }
  }

  if (unauthenticated) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Card className="max-w-md w-full text-center shadow-lg border-t-4 border-amber-500">
          <CardHeader>
            <div className="mx-auto bg-amber-100 dark:bg-amber-900/30 rounded-full p-3 w-fit mb-2">
              <LogIn className="size-6 text-amber-600" />
            </div>
            <CardTitle className="text-lg">Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please sign in to view your inventory data. All operations require an authenticated session.
            </p>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest">
                <LogIn className="size-4 mr-2" /> Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
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
                        <span className={`font-bold text-sm ${(product.quantity || 0) <= (product.lowStockLevel || 0) ? 'text-destructive' : 'text-foreground'}`}>
                          {product.quantity || 0} units
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase font-bold">Alert: {product.lowStockLevel || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600 text-sm">{(product.sellingPrice || 0).toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      {(product.quantity || 0) <= (product.lowStockLevel || 0) ? (
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
