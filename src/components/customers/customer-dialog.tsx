
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
import { Customer } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(8, "Phone number is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  location: z.string().min(2, "Location is required"),
  notes: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerDialogProps {
  customer?: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Partial<Customer>) => void
}

export function CustomerDialog({ customer, open, onOpenChange, onSave }: CustomerDialogProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      notes: "",
    },
  })

  React.useEffect(() => {
    if (customer) {
      form.reset({
        name: customer.name,
        phone: customer.phone,
        email: customer.email || "",
        location: customer.location,
        notes: customer.notes || "",
      })
    } else {
      form.reset({
        name: "",
        phone: "",
        email: "",
        location: "",
        notes: "",
      })
    }
  }, [customer, form])

  const onSubmit = (values: CustomerFormValues) => {
    onSave({
      ...values,
      id: customer?.id,
      tenantId: MOCK_USER.tenantId,
      businessId: MOCK_USER.businessId,
      createdAt: customer?.createdAt || new Date().toISOString(),
      totalOrders: customer?.totalOrders || 0,
      totalSpent: customer?.totalSpent || 0,
    } as Customer)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{customer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
              <DialogDescription>
                Keep track of your client contacts and purchase history.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Samuel Eto'o" {...field} />
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
                      <FormLabel>Phone Number</FormLabel>
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
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="client@email.cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location / City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Akwa, Douala" {...field} />
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
                    <FormLabel>Notes & Preferences</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional details about this customer..." 
                        className="resize-none h-24"
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
              <Button type="submit" className="bg-primary hover:bg-primary/90 font-bold uppercase text-[10px] tracking-widest">
                {customer ? "Update Profile" : "Save Customer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
