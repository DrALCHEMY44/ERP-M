
"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2 } from "lucide-react"
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
import { MOCK_PRODUCTS, MOCK_USER } from "@/lib/mock-data"
import { Sale } from "@/lib/types"

const saleItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().min(1, "At least 1 item"),
  priceAtSale: z.coerce.number().min(0),
})

const saleSchema = z.object({
  customerId: z.string().optional(),
  paymentMethod: z.enum(["Cash", "Mobile Money", "Bank Transfer", "Credit"]),
  productsSold: z.array(saleItemSchema).min(1, "Add at least one product"),
})

type SaleFormValues = z.infer<typeof saleSchema>

interface SaleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (sale: Partial<Sale>) => void
}

export function SaleDialog({ open, onOpenChange, onSave }: SaleDialogProps) {
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      paymentMethod: "Cash",
      productsSold: [{ productId: "", quantity: 1, priceAtSale: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "productsSold",
  })

  const watchProducts = form.watch("productsSold")
  const totalAmount = watchProducts.reduce((acc, item) => acc + (item.quantity * item.priceAtSale), 0)

  const onSubmit = (values: SaleFormValues) => {
    onSave({
      ...values,
      totalAmount,
      recordedBy: MOCK_USER.uid,
      tenantId: MOCK_USER.tenantId,
      businessId: MOCK_USER.businessId,
    } as Sale)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Record New Sale</DialogTitle>
              <DialogDescription>
                Record a transaction and update inventory automatically.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money (Orange/MTN)</SelectItem>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Credit">Store Credit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Customer (Optional)</FormLabel>
                <Input placeholder="Search customer name..." />
              </FormItem>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Products</h4>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => append({ productId: "", quantity: 1, priceAtSale: 0 })}
                >
                  <Plus className="size-4 mr-1" /> Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name={`productsSold.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <Select 
                            onValueChange={(val) => {
                              field.onChange(val)
                              const prod = MOCK_PRODUCTS.find(p => p.id === val)
                              if (prod) {
                                form.setValue(`productsSold.${index}.priceAtSale`, prod.sellingPrice)
                              }
                            }} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {MOCK_PRODUCTS.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name} ({p.quantity} in stock)</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`productsSold.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`productsSold.${index}.priceAtSale`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input type="number" {...field} placeholder="Price" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => remove(index)}
                      className="text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
              <span className="font-semibold">Grand Total:</span>
              <span className="text-xl font-bold text-primary">{totalAmount.toLocaleString()} FCFA</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                Complete Sale
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
