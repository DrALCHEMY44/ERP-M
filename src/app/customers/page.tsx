
"use client"

import * as React from "react"
import { Plus, Search, UserCircle, Phone, Mail, MapPin, ShoppingBag, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Customer } from "@/lib/types"
import { CustomerDialog } from "@/components/customers/customer-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { useTranslation } from "@/components/language-provider"
import { listCustomersByBusinessQuery, createCustomerMutation, updateCustomerMutation, deleteCustomerMutation } from "@/lib/data-service"
import { LogIn } from "lucide-react"
import Link from "next/link"

export default function CustomersPage() {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  
  const { data: dbCustomers, loading: dbLoading, error: dbError, unauthenticated, refetch } = useDataConnect({
    query: listCustomersByBusinessQuery,
    variables: {
      tenantId: profile?.tenantId || "",
      businessId: profile?.businessId || ""
    },
    skip: !profile || !profile.tenantId || !profile.businessId
  });
  
  const customers = React.useMemo(() => {
    const sqlList = dbCustomers?.customers || [];
    return sqlList.map((sc: any) => ({
      id: sc.id,
      name: sc.customerName,
      phone: sc.phoneNumber || "",
      email: sc.email || "",
      location: sc.location || "Douala",
      totalOrders: sc.totalOrders || 0,
      totalSpent: sc.totalSpent || 0,
      createdAt: sc.createdAt
    })) as Customer[];
  }, [dbCustomers]);

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [hasShownSuccess, setHasShownSuccess] = React.useState(false)

  React.useEffect(() => {
    if (dbError) {
      toast({
        variant: "destructive",
        title: "Synchronization Error",
        description: "Failed to fetch customer records from SQL Connect database."
      });
    } else if (dbCustomers && !dbLoading && !hasShownSuccess) {
      toast({
        title: "Live Database Sync",
        description: `Successfully loaded ${dbCustomers?.customers?.length || 0} customer records from SQL Connect.`
      });
      setHasShownSuccess(true);
    }
  }, [dbCustomers, dbLoading, dbError, hasShownSuccess, toast]);

  const filteredCustomers = customers.filter(c => 
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || "").includes(searchQuery) ||
    (c.location || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalSpent = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0)
  const totalOrders = customers.reduce((acc, c) => acc + (c.totalOrders || 0), 0)

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedCustomer(null)
    setIsDialogOpen(true)
  }

  const handleSave = async (data: Partial<Customer>) => {
    if (!profile?.tenantId || !profile?.businessId) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Your user profile is missing business/tenant identifiers. Please complete registration or select a business."
      });
      return;
    }
    try {
      if (selectedCustomer?.id) {
        await updateCustomerMutation({
          id: selectedCustomer.id,
          customerName: data.name,
          phoneNumber: data.phone,
          email: data.email,
          location: data.location,
          totalOrders: data.totalOrders,
          totalSpent: data.totalSpent
        });
        await refetch();
        toast({ title: "Customer Updated", description: `${data.name}'s profile has been synchronized.` });
      } else {
        await createCustomerMutation({
          tenantId: profile?.tenantId || "",
          businessId: profile?.businessId || "",
          customerName: data.name || "",
          phoneNumber: data.phone || "",
          email: data.email || "",
          location: data.location || "Douala",
          totalOrders: data.totalOrders || 0,
          totalSpent: data.totalSpent || 0
        });
        await refetch();
        toast({ title: "Customer Added", description: `${data.name} is now in your directory.` });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save customer data." });
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer? This action is permanent.")) {
      try {
        await deleteCustomerMutation({ id });
        await refetch();
        toast({ title: "Customer Removed", description: "Data deleted from cloud database." });
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete customer." });
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
              Please sign in to view customer records. All operations require an authenticated session.
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

  const loading = dbLoading;

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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('customers.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('customers.subtitle')}</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest shadow-lg">
          <Plus className="size-4 mr-2" /> {t('customers.newCustomer')}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-[#3b82f6] shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">{t('customers.totalClients')}</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700">{customers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-[#10b981] shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">{t('customers.customerRevenue')}</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700">{totalSpent.toLocaleString()} FCFA</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-[#f59e0b] shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">{t('customers.totalOrders')}</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-700">{totalOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-primary shadow-md bg-primary/5">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">{t('customers.retentionRate')}</CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">{t('customers.liveSync')}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder={t('customers.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>{t('customers.customerName')}</TableHead>
                <TableHead>{t('customers.contactInfo')}</TableHead>
                <TableHead>{t('customers.location')}</TableHead>
                <TableHead>{t('customers.purchases')}</TableHead>
                <TableHead className="text-right">{t('customers.totalSpent')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                          {customer.name[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{customer.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-medium">ID: {customer.id?.substring(0, 8)}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Phone className="size-3 text-muted-foreground" />
                          {customer.phone}
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="size-3" />
                            {customer.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="size-3 text-primary" />
                        {customer.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-2">
                          <ShoppingBag className="size-3 mr-1" /> {customer.totalOrders || 0} Orders
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-700 text-sm">
                      {(customer.totalSpent || 0).toLocaleString()} FCFA
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(customer)} className="text-[10px] uppercase font-bold tracking-widest">
                          {t('common.edit')}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id!)} className="h-8 w-8 text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No customers found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CustomerDialog 
        customer={selectedCustomer}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
