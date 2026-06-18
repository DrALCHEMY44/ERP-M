"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  FileDown,
  ArrowUpDown
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { Product } from "@/lib/types"
import { ProductDialog } from "@/components/inventory/product-dialog"
import { useToast } from "@/hooks/use-toast"

export default function InventoryPage() {
  const [products, setProducts] = React.useState<Product[]>(MOCK_PRODUCTS)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)
  const { toast } = useToast()

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId))
    toast({
      title: "Product Deleted",
      description: "The product has been removed from inventory.",
    })
  }

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProduct) {
      setProducts(prev => prev.map(p => p.id === selectedProduct.id ? { ...p, ...productData } as Product : p))
      toast({ title: "Product Updated", description: `${productData.name} updated successfully.` })
    } else {
      const newProduct = { ...productData, id: `prod${Date.now()}` } as Product
      setProducts(prev => [newProduct, ...prev])
      toast({ title: "Product Added", description: `${productData.name} added to inventory.` })
    }
  }

  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0)
  const lowStockCount = products.filter(p => p.quantity <= p.lowStockLevel).length
  const inventoryValue = products.reduce((acc, p) => acc + (p.quantity * p.costPrice), 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Inventory Management</h2>
          <p className="text-muted-foreground">Monitor and manage your business stock and supplies.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="size-4" />
            Export CSV
          </Button>
          <Button onClick={handleAddProduct} className="bg-accent hover:bg-accent/90 flex items-center gap-2">
            <Plus className="size-4" />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Low Stock Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {lowStockCount}
              {lowStockCount > 0 && <AlertTriangle className="size-5 text-amber-500 animate-pulse" />}
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Stock Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryValue.toLocaleString()} FCFA</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="px-6 py-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <CardTitle className="text-lg font-headline">Product Catalog</CardTitle>
             <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                   <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                   <Input 
                     placeholder="Search products..." 
                     className="pl-9"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                <Button variant="outline" size="icon">
                   <Filter className="size-4" />
                </Button>
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Selling Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell><Badge variant="secondary">{product.category}</Badge></TableCell>
                  <TableCell className="text-right">
                    <span className={product.quantity <= product.lowStockLevel ? "text-destructive font-bold" : ""}>
                      {product.quantity}
                    </span>
                    {product.quantity <= product.lowStockLevel && (
                       <div className="text-[10px] text-destructive font-bold uppercase">Low Stock</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">{product.sellingPrice.toLocaleString()} FCFA</TableCell>
                  <TableCell>
                    <Badge variant={product.status === 'active' ? "outline" : "secondary"} className={product.status === 'active' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : ""}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)}><Edit className="mr-2 size-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-blue-600"><ArrowUpDown className="mr-2 size-4" /> Stock Movement</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive"><Trash2 className="mr-2 size-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProductDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} product={selectedProduct} onSave={handleSaveProduct} />
    </div>
  )
}
