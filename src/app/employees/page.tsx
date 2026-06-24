"use client"

import * as React from "react"
import { Plus, Search, Building, Loader2, Trash2, Calendar, Mail, Phone, LogIn } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { listEmployeesByBusinessQuery, createEmployeeMutation, updateEmployeeMutation, deleteEmployeeMutation } from "@/lib/data-service"
import { useAuth } from "@/hooks/use-auth"
import { Employee } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { EmployeeDialog } from "@/components/employees/employee-dialog"

export default function EmployeesPage() {
  const { user, profile } = useAuth();
  const { data: employeesData, loading, unauthenticated, refetch } = useDataConnect({ 
    query: listEmployeesByBusinessQuery, 
    variables: { tenantId: profile?.tenantId, businessId: profile?.businessId },
    skip: !profile?.tenantId || !profile?.businessId
  });
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const { toast } = useToast();
  
  const fetchEmployees = React.useCallback(async () => {
    if (!profile?.tenantId || !profile?.businessId) return;
    try {
      const response = await listEmployeesByBusinessQuery({
        tenantId: profile.tenantId,
        businessId: profile.businessId
      });
      // Map dataconnect format back to ui format
      const mappedEmployees = ((response as any)?.employees || []).map((emp: any) => ({
        ...emp,
        employmentStatus: emp.status || 'Active',
        salaryPaymentStatus: 'Paid', // Default placeholder since it's missing from schema
      }));
      setEmployees(mappedEmployees);
    } catch (e) {
      console.error("Failed to fetch employees:", e);
    }
  }, [profile]);

  React.useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredEmployees = employees.filter(emp => 
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeCount = employees.filter(e => e.employmentStatus === 'Active').length;
  const pendingPayrollCount = employees.filter(e => e.salaryPaymentStatus !== 'Paid').length;

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedEmployee(null)
    setIsDialogOpen(true)
  }

  const handleSave = async (employeeData: Partial<Employee>) => {
    if (!profile?.tenantId || !profile?.businessId) return;
    try {
      if (selectedEmployee?.id) {
        await updateEmployeeMutation({
          id: selectedEmployee.id,
          fullName: employeeData.fullName,
          position: employeeData.position,
          department: employeeData.department,
          salary: employeeData.salary,
        });
        toast({ title: "Employee Updated", description: `${employeeData.fullName}'s records have been modified.` });
      } else {
        await createEmployeeMutation({
          tenantId: profile.tenantId,
          businessId: profile.businessId,
          fullName: employeeData.fullName || "",
          position: employeeData.position || "",
          department: employeeData.department,
          salary: employeeData.salary,
        });
        toast({ title: "Employee Added", description: `${employeeData.fullName} is now part of your SME.` });
      }
      fetchEmployees();
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Could not save employee data." });
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this employee's records? This action is immutable.")) {
      try {
        await deleteEmployeeMutation({ id });
        toast({ title: "Employee Removed", description: "Record deleted from secure cloud storage." });
        fetchEmployees();
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete record." });
      }
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
              Please sign in to view employee records. All operations require an authenticated session.
            </p>
            <Link href="/login">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest">
                <LogIn className="size-4 mr-2" /> Sign In
              </Button>
            </Link>
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Human Resources</h1>
          <p className="text-sm text-muted-foreground">Manage your team, positions, and payroll (SYCOHADA Compliant).</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest shadow-lg">
          <Plus className="size-4 mr-2" /> Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-blue-500 shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Staff</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-blue-700">{employees.length} Employees</div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">{activeCount} Currently Active</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payroll Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-700">{pendingPayrollCount === 0 ? "Fully Paid" : `${pendingPayrollCount} Pending`}</div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Cycle: {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Average Attendance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-600">92%</div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase font-bold tracking-tighter">Last 30 Days Oversight</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, position or dept..." 
              className="pl-9 bg-muted/20" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <Card key={emp.id} className="group hover:border-primary/50 transition-colors shadow-sm overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-12 w-12 rounded-lg border-2 border-muted group-hover:border-primary/30 transition-colors">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{emp.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="secondary" className={`text-[9px] uppercase font-bold tracking-tighter ${
                        emp.employmentStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {emp.employmentStatus}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1 mb-4">
                    <h3 className="font-headline font-bold text-lg truncate">{emp.fullName}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-medium">
                      <Building className="size-3" /> {emp.position} • {emp.department}
                    </p>
                    <p className="text-[10px] text-primary font-bold flex items-center gap-1.5 mt-2">
                      <Calendar className="size-3" /> Started: {new Date(emp.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-muted/50 text-muted-foreground hover:text-primary">
                        <Phone className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-muted/50 text-muted-foreground hover:text-primary">
                        <Mail className="size-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(emp)} className="text-[10px] font-bold uppercase tracking-widest h-8 px-3">Edit</Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id!)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <div className="bg-muted/30 px-6 py-2 border-t flex items-center justify-between text-[10px] font-bold uppercase">
                  <span className="text-muted-foreground">Salary: {emp.salary.toLocaleString()} FCFA</span>
                  <span className={emp.salaryPaymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>{emp.salaryPaymentStatus}</span>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground italic">
              No employee records found matching your search.
            </div>
          )}
        </div>
      </div>

      <EmployeeDialog 
        employee={selectedEmployee}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
