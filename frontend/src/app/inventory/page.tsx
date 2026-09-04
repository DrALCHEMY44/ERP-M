"use client"

import * as React from "react"
import { Plus, Search, Filter, AlertTriangle, Download, Loader2, Trash2, LogIn } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import { useNeonData } from "@/hooks/use-neon-data"
import {
  listProductsByBusinessQuery,
  createProductMutation,
  updateProductMutation,
  deleteProductMutation
} from "@/lib/data-service"
import { useToast } from "@/hooks/use-toast"
import { logActivity } from "@/lib/audit-logger"
import { createNotification } from "@/lib/notifications"
import { useAuth } from "@/hooks/use-auth"
import { useTranslation } from "@/components/language-provider"
import { downloadCsv } from "@/lib/csv"

export default function InventoryPage() {
  const { user, profile } = useAuth();
  const canManageInventory = Boolean(profile && ["Business Owner", "Manager"].includes(profile.role));
  const { t } = useTranslation();
  const { data: productsData, loading, unauthenticated, refetch } = useNeonData({
    query: listProductsByBusinessQuery,
    variables: {
      tenantId: profile?.tenantId || "",
      businessId: profile?.businessId || ""
    },
    skip: !profile || !profile.tenantId || !profile.businessId,
    refreshInterval: 5000
  });
  const { toast } = useToast();

  const products = React.useMemo(() => (productsData?.products || []) as unknown as Product[], [productsData]);

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [lowStockOnly, setLowStockOnly] = React.useState(false)

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesSearch && (!lowStockOnly || p.quantity <= (p.lowStockLevel || 0))
  })

  const lowStockItems = products.filter(p => p.quantity <= (p.lowStockLevel || 0))
  const totalValue = products.reduce((acc, p) => acc + (p.quantity * (p.costPrice || 0)), 0)
  const activeProducts = products.filter((product) => product.status !== "inactive").length

  const exportInventory = () => {
    const date = new Date().toISOString().slice(0, 10)
    downloadCsv(`inventory-${date}.csv`, [
      ["Product ID", "Name", "Category", "Status", "Quantity", "Base unit", "Barcode", "Low-stock level", "Cost price", "Selling price", "Expiry date"],
      ...filteredProducts.map((product) => [product.id, product.name, product.category, product.status,
        product.quantity, product.baseUnit, product.barcode || "", product.lowStockLevel, product.costPrice, product.sellingPrice, product.expiryDate || ""]),
    ])
  }

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
      } catch {
        toast({ variant: "destructive", title: "Error", description: "Could not delete product." });
      }
    }
  }

  const handleSave = async (productData: Partial<Product>) => {
    if (!profile?.tenantId || !profile?.businessId) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Your user profile is missing business/tenant identifiers. Please complete registration or select a business."
      });
      return;
    }
    try {
      if (selectedProduct?.id) {
        await updateProductMutation({
          id: selectedProduct.id,
          name: productData.name,
          category: productData.category,
          quantity: productData.quantity,
          costPrice: productData.costPrice,
          sellingPrice: productData.sellingPrice,
          lowStockLevel: productData.lowStockLevel,
          expiryDate: productData.expiryDate || null,
          status: productData.status || 'active',
          baseUnit: productData.baseUnit,
          scanUnit: productData.scanUnit,
          conversionFactor: productData.conversionFactor,
          barcode: productData.barcode,
          scanSellingPrice: productData.scanSellingPrice,
          scanUnitId: productData.scanUnitId,
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
          expiryDate: productData.expiryDate || null,
          status: productData.status || 'active',
          baseUnit: productData.baseUnit || 'piece',
          scanUnit: productData.scanUnit || productData.baseUnit || 'piece',
          conversionFactor: productData.conversionFactor || 1,
          barcode: productData.barcode || null,
          scanSellingPrice: productData.scanSellingPrice,
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
    } catch {
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
            <Button asChild className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest">
              <Link href="/login">
                <LogIn className="size-4 mr-2" /> Sign In
              </Link>
            </Button>
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('inventory.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('inventory.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex uppercase font-bold text-[10px]" onClick={exportInventory}>
            <Download className="size-4 mr-2" /> {t('inventory.exportCsv')}
          </Button>
          {canManageInventory && (
            <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto font-bold uppercase text-xs tracking-widest shadow-lg">
              <Plus className="size-4 mr-2" /> {t('inventory.addProduct')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-[#3b82f6] shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('inventory.totalValue')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-blue-700">{totalValue.toLocaleString()} FCFA</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">{t('inventory.basedOnCost')}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#f59e0b] shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('inventory.lowStockAlerts')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center justify-between">
            <div>
              <div className="text-xl md:text-2xl font-bold text-amber-600">{lowStockItems.length} Items</div>
              <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">{t('inventory.requiresRestocking')}</p>
            </div>
            <AlertTriangle className="size-8 text-amber-500 opacity-50" />
          </CardContent>
        </Card>
        <Card className="border-t-4 border-[#10b981] shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('inventory.activeProducts')}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-xl md:text-2xl font-bold text-emerald-700">{activeProducts} Items</div>
            <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">{t('inventory.connectedToCloud')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              placeholder={t('inventory.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-muted/20 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant={lowStockOnly ? "secondary" : "ghost"} size="sm" className="ml-auto text-[10px] uppercase font-bold" onClick={() => setLowStockOnly((value) => !value)}>
            <Filter className="size-4 mr-2" /> {lowStockOnly ? "Low stock only" : "All stock"}
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>{t('inventory.productName')}</TableHead>
                <TableHead>{t('inventory.category')}</TableHead>
                <TableHead>{t('inventory.stockLevel')}</TableHead>
                <TableHead>{t('inventory.priceSelling')}</TableHead>
                <TableHead>{t('inventory.status')}</TableHead>
                {canManageInventory && <TableHead className="text-right">{t('common.actions')}</TableHead>}
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
                          {product.quantity || 0} {product.baseUnit || 'piece'}
                        </span>
                        <span className="text-[9px] text-muted-foreground uppercase font-bold">Alert: {product.lowStockLevel || 0}</span>
                        {product.barcode && <span className="text-[9px] text-muted-foreground">Barcode: {product.barcode}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600 text-sm">{(product.sellingPrice || 0).toLocaleString()} FCFA / {product.baseUnit || 'piece'}</TableCell>
                    <TableCell>
                      {(product.quantity || 0) <= (product.lowStockLevel || 0) ? (
                        <Badge className="bg-destructive text-destructive-foreground text-[9px] uppercase font-bold">Low Stock</Badge>
                      ) : (
                        <Badge className="bg-emerald-500 text-white text-[9px] uppercase font-bold">In Stock</Badge>
                      )}
                    </TableCell>
                    {canManageInventory && <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(product)} className="text-[10px] uppercase font-bold">Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id!)} className="text-destructive hover:text-destructive hover:bg-destructive/10" aria-label={`Delete ${product.name}`}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={canManageInventory ? 6 : 5} className="h-24 text-center text-muted-foreground">
                    {searchQuery ? "No matching products found." : "No products in your database yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {canManageInventory && (
        <ProductDialog
          product={selectedProduct}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
