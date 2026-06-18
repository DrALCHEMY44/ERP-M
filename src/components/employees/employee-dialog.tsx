
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
import { Employee } from "@/lib/types"
import { MOCK_USER } from "@/lib/mock-data"

const employeeSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  position: z.string().min(2, "Position is required"),
  department: z.string().min(2, "Department is required"),
  salary: z.coerce.number().min(0, "Salary cannot be negative"),
  contact: z.string().min(8, "Contact number is required"),
  email: z.string().email("Invalid email address"),
  startDate: z.string().min(1, "Start date is required"),
  employmentStatus: z.enum(["Active", "On Leave", "Suspended", "Terminated"]),
  salaryPaymentStatus: z.enum(["Paid", "Pending", "Partial", "Overdue"]),
})

type EmployeeFormValues = z.infer<typeof employeeSchema>

interface EmployeeDialogProps {
  employee?: Employee | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (employee: Partial<Employee>) => void
}

export function EmployeeDialog({ employee, open, onOpenChange, onSave }: EmployeeDialogProps) {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      fullName: "",
      position: "",
      department: "",
      salary: 0,
      contact: "",
      email: "",
      startDate: new Date().toISOString().split('T')[0],
      employmentStatus: "Active",
      salaryPaymentStatus: "Paid",
    },
  })

  React.useEffect(() => {
    if (employee) {
      form.reset({
        fullName: employee.fullName,
        position: employee.position,
        department: employee.department,
        salary: employee.salary,
        contact: employee.contact,
        email: employee.email,
        startDate: employee.startDate,
        employmentStatus: employee.employmentStatus,
        salaryPaymentStatus: employee.salaryPaymentStatus,
      })
    } else {
      form.reset({
        fullName: "",
        position: "",
        department: "",
        salary: 0,
        contact: "",
        email: "",
        startDate: new Date().toISOString().split('T')[0],
        employmentStatus: "Active",
        salaryPaymentStatus: "Paid",
      })
    }
  }, [employee, open, form])

  const onSubmit = (values: EmployeeFormValues) => {
    onSave({
      ...values,
      tenantId: MOCK_USER.tenantId,
      businessId: MOCK_USER.businessId,
      employeeId: employee?.employeeId || `EMP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      attendance: employee?.attendance || 100,
      createdBy: MOCK_USER.uid,
    } as Employee)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-headline font-bold text-xl">{employee ? "Edit Employee" : "Register New Employee"}</DialogTitle>
              <DialogDescription>
                Manage your SME workforce data according to OHADA standards.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean-Pierre Kamga" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jp@business.cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+237 ..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Position / Role</FormLabel>
                      <FormControl>
                        <Input placeholder="Store Manager" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Department</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Logistics">Logistics</SelectItem>
                          <SelectItem value="HR">HR & Admin</SelectItem>
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
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Monthly Salary (FCFA)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employmentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Work Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="On Leave">On Leave</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                          <SelectItem value="Terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salaryPaymentStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-bold uppercase tracking-widest">Payroll Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Partial">Partial</SelectItem>
                          <SelectItem value="Overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 uppercase font-bold text-xs tracking-widest">
                {employee ? "Update Records" : "Hire Employee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
