"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  Download,
  AlertCircle
} from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { ProductDialog } from "@/components/inventory/product-dialog"
import { Product } from "@/lib/types"

export default function InventoryPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null)

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Track and manage your stock levels across branches.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Download className="size-4 mr-2" /> Export
          </Button>
          <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90">
            <Plus className="size-4 mr-2" /> New Product
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>
        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
          <Filter className="size-4 mr-2" /> Filter
        </Button>
      </div>

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock Level</TableHead>
              <TableHead>Price (FCFA)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_PRODUCTS.map((product) => (
              <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">{product.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className={product.quantity <= product.lowStockLevel ? "text-destructive font-bold" : ""}>
                      {product.quantity}
                    </span>
                    {product.quantity <= product.lowStockLevel && (
                      <AlertCircle className="size-3 text-destructive" />
                    )}
                  </div>
                </TableCell>
                <TableCell>{product.sellingPrice.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge 
                    variant={product.status === 'active' ? 'default' : 'secondary'}
                    className={product.status === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(product)}>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete Product</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog 
        product={selectedProduct}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(p) => console.log("Saved product:", p)}
      />
    </div>
  )
}