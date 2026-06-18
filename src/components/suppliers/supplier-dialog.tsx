
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Supplier } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"

const supplierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  productsSupplied: z.string().min(2, "List at least one product group"),
  paymentStatus: z.enum(["Paid", "Pending", "Partial", "Overdue"]),
  notes: z.string().optional(),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

interface SupplierDialogProps {
  supplier?: Supplier | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (supplier: Partial<Supplier>) => void
}

export function SupplierDialog({ supplier, open, onOpenChange, onSave }: SupplierDialogProps) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      productsSupplied: "",
      paymentStatus: "Paid",
      notes: "",
    },
  })

  React.useEffect(() => {
    if (supplier) {
      form.reset({
        name: supplier.name,
        phone: supplier.phone,
        email: supplier.email || "",
        location: supplier.location,
        productsSupplied: supplier.productsSupplied.join(", "),
        paymentStatus: supplier.paymentStatus,
        notes: supplier.notes || "",
      })
    } else {
      form.reset({
        name: "",
        phone: "",
        email: "",
        location: "",
        productsSupplied: "",
        paymentStatus: "Paid",
        notes: "",
      })
    }
  }, [supplier, open, form])

  const onSubmit = (values: SupplierFormValues) => {
    const payload: Partial<Supplier> = {
      ...values,
      tenantId: MOCK_USER.tenantId,
      businessId: MOCK_USER.businessId,
      productsSupplied: values.productsSupplied.split(",").map(s => s.trim()),
      createdAt: supplier?.createdAt || new Date().toISOString(),
    }
    
    if (supplier?.id) {
      payload.id = supplier.id;
    }

    onSave(payload)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-bold text-xl">{supplier ? "Edit Supplier" : "New Supplier"}</DialogTitle>
              <DialogDescription>
                Track your supply chain partners and payment commitments.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold tracking-widest">Supplier Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Brasseries du Cameroun" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+237 ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest">Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@supplier.cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest">HQ / City</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Bassa, Douala" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] uppercase font-bold tracking-widest">Current Balance Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Paid">Fully Paid</SelectItem>
                          <SelectItem value="Pending">Pending Payment</SelectItem>
                          <SelectItem value="Partial">Partial Payment</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="productsSupplied"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold tracking-widest">Products Supplied (Comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Drinks, Logistics, Printing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] uppercase font-bold tracking-widest">Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Terms of service, delivery schedule, etc." 
                        className="resize-none h-20"
                        {...field} 
                      />
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
              <Button type="submit" className="bg-primary hover:bg-primary/90 font-bold uppercase text-[10px] tracking-widest px-8">
                {supplier ? "Update Supplier" : "Save Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
