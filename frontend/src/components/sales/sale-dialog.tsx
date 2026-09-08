
"use client"

import * as React from "react"
import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Plus, QrCode, Smartphone, Trash2 } from "lucide-react"
import QRCode from "react-qr-code"
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
import { useAuth } from "@/hooks/use-auth"
import { Customer, Product, Sale } from "@/lib/types"

const saleItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  unitId: z.string().optional(),
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
  onSave: (sale: Partial<Sale>) => Promise<void> | void
  products: Product[]
  customers: Customer[]
  productsLoading?: boolean
  customersLoading?: boolean
}

export function SaleDialog({
  open,
  onOpenChange,
  onSave,
  products,
  customers,
  productsLoading = false,
  customersLoading = false,
}: SaleDialogProps) {
  const { profile } = useAuth()
  const form = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      customerId: "",
      paymentMethod: "Cash",
      productsSold: [{ productId: "", quantity: 1, priceAtSale: 0 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "productsSold",
  })

  const watchProducts = useWatch({ control: form.control, name: "productsSold" })
  const totalAmount = watchProducts.reduce((acc, item) => acc + (item.quantity * item.priceAtSale), 0)
  const [scanner, setScanner] = React.useState<{
    sessionId: string
    pairingCode: string
    expiresAt: string
    items: Array<{ productId: string; unitId: string; productName: string; unitName: string; quantity: number; unitPrice: number }>
  } | null>(null)
  const [scannerLoading, setScannerLoading] = React.useState(false)
  const scannerKeys = React.useRef(new Set<string>())

  const syncScanner = React.useCallback(async (sessionId: string) => {
    const response = await fetch("/api/sales/scanner?sessionId=" + encodeURIComponent(sessionId), { cache: "no-store" })
    const body = await response.json()
    if (!response.ok) throw new Error(body.error || "Could not refresh the phone scanner")
    const items = Array.isArray(body.items) ? body.items : []
    const nextKeys = new Set<string>(items.map((item: { productId: string; unitId: string }) => item.productId + ":" + item.unitId))
    const localItems = form.getValues("productsSold").filter((item) => !scannerKeys.current.has(item.productId + ":" + (item.unitId || "")))
    const scannerItems = items.map((item: { productId: string; unitId: string; quantity: number; unitPrice: number }) => ({
      productId: item.productId, unitId: item.unitId, quantity: item.quantity, priceAtSale: item.unitPrice,
    }))
    form.setValue("productsSold", [...localItems.filter((item) => item.productId), ...scannerItems], { shouldValidate: true })
    scannerKeys.current = nextKeys
    setScanner((current) => current ? { ...current, expiresAt: body.expiresAt, items } : current)
  }, [form])

  React.useEffect(() => {
    if (!scanner?.sessionId || !open) return
    const timer = window.setInterval(() => {
      syncScanner(scanner.sessionId).catch(() => undefined)
    }, 2000)
    return () => window.clearInterval(timer)
  }, [open, scanner?.sessionId, syncScanner])

  const connectPhoneScanner = async () => {
    setScannerLoading(true)
    try {
      const response = await fetch("/api/sales/scanner", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create" }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "Could not create scanner session")
      setScanner({ ...body, items: [] })
    } catch (error) {
      form.setError("root", { message: error instanceof Error ? error.message : "Could not connect the phone scanner." })
    } finally {
      setScannerLoading(false)
    }
  }

  const disconnectPhoneScanner = async (status: "COMPLETED" | "CANCELLED" = "CANCELLED") => {
    if (!scanner) return
    await fetch("/api/sales/scanner", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "close", sessionId: scanner.sessionId, status }),
    }).catch(() => undefined)
    const remote = scannerKeys.current
    form.setValue("productsSold", form.getValues("productsSold").filter((item) => !remote.has(item.productId + ":" + (item.unitId || ""))))
    scannerKeys.current = new Set()
    setScanner(null)
  }

  const onSubmit = async (values: SaleFormValues) => {
    if (!profile?.tenantId || !profile.businessId) {
      form.setError("root", { message: "Your account is not connected to a company." })
      return
    }

    const invalidItem = values.productsSold.find((item) => {
      const product = products.find((candidate) => candidate.id === item.productId)
      return !product || product.quantity < item.quantity
    })
    if (invalidItem) {
      form.setError("root", { message: "A selected product is unavailable or does not have enough stock." })
      return
    }

    await onSave({
      ...values,
      totalAmount,
    } as Sale)
    await disconnectPhoneScanner("COMPLETED")
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
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer (Optional)</FormLabel>
                    <Select
                      value={field.value || "__walk_in__"}
                      onValueChange={(value) => field.onChange(value === "__walk_in__" ? "" : value)}
                      disabled={customersLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="__walk_in__">Walk-in customer</SelectItem>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id!}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Products</h4>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ productId: "", quantity: 1, priceAtSale: 0 })}>
                    <Plus className="size-4 mr-1" /> Add Item
                  </Button>
                  {!scanner && <Button type="button" variant="outline" size="sm" disabled={scannerLoading} onClick={connectPhoneScanner}>
                    {scannerLoading ? <Loader2 className="size-4 mr-1 animate-spin" /> : <QrCode className="size-4 mr-1" />} Connect phone
                  </Button>}
                </div>
              </div>

              {scanner && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="rounded-md bg-white p-2"><QRCode value={scanner.pairingCode} size={132} /></div>
                    <div className="flex-1 space-y-1">
                      <p className="flex items-center gap-2 text-sm font-semibold"><Smartphone className="size-4 text-blue-700" /> Phone scanner connected</p>
                      <p className="text-xs text-muted-foreground">In the mobile app, open Web sale scanner and scan this QR code. Each product scan is added to this cart automatically.</p>
                      <p className="text-xs font-medium">Expires {new Date(scanner.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {scanner.items.length} scanned line{scanner.items.length === 1 ? "" : "s"}</p>
                      <Button type="button" variant="ghost" size="sm" className="h-7 px-0 text-xs text-destructive" onClick={() => disconnectPhoneScanner()}>
                        Disconnect phone scanner
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {fields.map((field, index) => {
                const line = watchProducts[index]
                const quantity = Number(line?.quantity) || 0
                const unitPrice = Number(line?.priceAtSale) || 0
                const lineTotal = quantity * unitPrice

                return <div key={field.id} className="rounded-lg border bg-muted/20 p-3">
                  <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name={`productsSold.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val)
                              const prod = products.find(p => p.id === val)
                              if (prod) {
                                form.setValue(`productsSold.${index}.priceAtSale`, prod.sellingPrice)
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productsLoading && (
                                <SelectItem value="__loading" disabled>Loading company products...</SelectItem>
                              )}
                              {!productsLoading && products.length === 0 && (
                                <SelectItem value="__empty" disabled>No products available for this company</SelectItem>
                              )}
                              {products.map(p => (
                                <SelectItem key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                  {p.name} ({p.quantity} in stock)
                                </SelectItem>
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
                            <Input type="number" {...field} placeholder="Unit price" aria-label={`Unit price for sale item ${index + 1}`} />
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
                      aria-label={`Remove sale item ${index + 1}`}
                      className="text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Line total · {quantity.toLocaleString()} × {unitPrice.toLocaleString()} FCFA</span>
                    <span className="font-semibold text-foreground">{lineTotal.toLocaleString()} FCFA</span>
                  </div>
                </div>
              })}
            </div>

            <div className="bg-muted p-4 rounded-lg flex justify-between items-center">
              <span className="font-semibold">Grand Total:</span>
              <span className="text-xl font-bold text-primary">{totalAmount.toLocaleString()} FCFA</span>
            </div>

            {form.formState.errors.root?.message && (
              <p className="text-sm font-medium text-destructive" role="alert">
                {form.formState.errors.root.message}
              </p>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={productsLoading || products.length === 0}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Complete Sale
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
