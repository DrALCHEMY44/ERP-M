"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product } from "@/lib/types"

const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  costPrice: z.coerce.number().min(0, "Price cannot be negative"),
  sellingPrice: z.coerce.number().min(0, "Price cannot be negative"),
  lowStockLevel: z.coerce.number().min(0, "Level cannot be negative"),
  supplierId: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  baseUnit: z.string().min(1, "Select a base unit"),
  scanUnit: z.string().min(1, "Select a barcode unit"),
  conversionFactor: z.coerce.number().int().min(1, "Must contain at least one base unit"),
  barcode: z.string().trim().max(128, "Barcode is too long").optional(),
  scanSellingPrice: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.coerce.number().min(0, "Price cannot be negative").optional(),
  ),
  scanUnitId: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductDialogProps {
  product?: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: Partial<Product>) => void
}

export function ProductDialog({ product, open, onOpenChange, onSave }: ProductDialogProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: 0,
      costPrice: 0,
      sellingPrice: 0,
      lowStockLevel: 5,
      supplierId: "",
      expiryDate: "",
      status: "active",
      baseUnit: "piece",
      scanUnit: "piece",
      conversionFactor: 1,
      barcode: "",
      scanSellingPrice: undefined,
      scanUnitId: "",
    },
  })

  React.useEffect(() => {
    if (product) {
      const barcodeUnit = product.units?.find((unit) => unit.barcode) ?? product.units?.find((unit) => unit.isBase)
      form.reset({
        name: product.name,
        category: product.category,
        quantity: product.quantity,
        costPrice: product.costPrice,
        sellingPrice: product.sellingPrice,
        lowStockLevel: product.lowStockLevel,
        supplierId: product.supplierId || "",
        expiryDate: product.expiryDate || "",
        status: product.status,
        baseUnit: product.baseUnit || "piece",
        scanUnit: barcodeUnit?.unitName || product.baseUnit || "piece",
        conversionFactor: barcodeUnit?.conversionFactor || 1,
        barcode: barcodeUnit?.barcode || "",
        scanSellingPrice: barcodeUnit && !barcodeUnit.isBase ? barcodeUnit.sellingPrice ?? undefined : undefined,
        scanUnitId: barcodeUnit?.id || "",
      })
    } else {
      form.reset({
        name: "",
        category: "",
        quantity: 0,
        costPrice: 0,
        sellingPrice: 0,
        lowStockLevel: 5,
        supplierId: "",
        expiryDate: "",
        status: "active",
        baseUnit: "piece",
        scanUnit: "piece",
        conversionFactor: 1,
        barcode: "",
        scanSellingPrice: undefined,
        scanUnitId: "",
      })
    }
  }, [product, open, form])

  const onSubmit = (values: ProductFormValues) => {
    onSave({
      ...values,
      conversionFactor: values.scanUnit === values.baseUnit ? 1 : values.conversionFactor,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-headline font-bold text-xl">{product ? "Edit Product" : "New Inventory Item"}</DialogTitle>
              <DialogDescription>
                Stock is synchronized with the business workspace in Neon.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Riz de Maroua" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Food">Food & Beverage</SelectItem>
                          <SelectItem value="Cleaning">Cleaning Supplies</SelectItem>
                          <SelectItem value="Electronics">Electronics</SelectItem>
                          <SelectItem value="Construction">Construction</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-lg border bg-muted/20 p-3 space-y-3">
                <div>
                  <p className="text-xs font-bold">Barcode &amp; units</p>
                  <p className="text-[11px] text-muted-foreground">Keep stock in the smallest unit, then define what one scan represents.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="baseUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Base stock unit</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {['piece', 'bottle', 'kilogram', 'liter', 'meter'].map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="scanUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Unit represented by barcode</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            {['piece', 'bottle', 'pack', 'box', 'carton', 'bag', 'kilogram', 'liter', 'meter', 'roll'].map((unit) => <SelectItem key={unit} value={unit}>{unit}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Barcode</FormLabel>
                        <FormControl><Input inputMode="numeric" placeholder="Scan or enter code" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="conversionFactor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Base units per scan</FormLabel>
                        <FormControl><Input type="number" min="1" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="scanSellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Package selling price (optional)</FormLabel>
                      <FormControl><Input type="number" min="0" placeholder="Defaults to base price × units" {...field} value={field.value ?? ''} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <input type="hidden" {...form.register("scanUnitId")} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lowStockLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Alert Threshold</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Cost Price (FCFA)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sellingPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Selling Price (FCFA)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Expiry Date (If applicable)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 uppercase font-bold text-xs tracking-widest">
                {product ? "Update Database" : "Save Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
