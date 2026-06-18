
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
import { Expense } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"

const expenseSchema = z.object({
  category: z.enum(['Rent', 'Utilities', 'Salaries', 'Supplies', 'Marketing', 'Transport', 'Taxes', 'Other']),
  amount: z.coerce.number().min(1, "Amount must be at least 1 FCFA"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  receiptUrl: z.string().optional(),
})

type ExpenseFormValues = z.infer<typeof expenseSchema>

interface ExpenseDialogProps {
  expense?: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (expense: Partial<Expense>) => void
}

export function ExpenseDialog({ expense, open, onOpenChange, onSave }: ExpenseDialogProps) {
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: 'Other',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: "",
      receiptUrl: "",
    },
  })

  React.useEffect(() => {
    if (expense) {
      form.reset({
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
        description: expense.description,
        receiptUrl: expense.receiptUrl || "",
      })
    } else {
      form.reset({
        category: 'Other',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: "",
        receiptUrl: "",
      })
    }
  }, [expense, form])

  const onSubmit = (values: ExpenseFormValues) => {
    onSave({
      ...values,
      id: expense?.id,
      tenantId: MOCK_USER.tenantId,
      businessId: MOCK_USER.businessId,
      recordedBy: MOCK_USER.uid,
      createdAt: expense?.createdAt || new Date().toISOString(),
    } as Expense)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{expense ? "Edit Expense" : "Record New Expense"}</DialogTitle>
              <DialogDescription>
                Track business costs to keep your financial reports accurate.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Utilities">Utilities (Water/Electricity)</SelectItem>
                        <SelectItem value="Salaries">Staff Salaries</SelectItem>
                        <SelectItem value="Supplies">Business Supplies</SelectItem>
                        <SelectItem value="Marketing">Marketing & Ads</SelectItem>
                        <SelectItem value="Transport">Transport & Logistics</SelectItem>
                        <SelectItem value="Taxes">Taxes & Fees</SelectItem>
                        <SelectItem value="Other">Other Expenses</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (FCFA)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What was this expense for?" 
                        className="resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Receipt (Optional)</FormLabel>
                <FormControl>
                  <Input type="file" className="cursor-pointer" />
                </FormControl>
                <DialogDescription className="text-[10px]">
                  Upload a photo of the receipt or invoice.
                </DialogDescription>
              </FormItem>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
                {expense ? "Update Record" : "Save Expense"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
