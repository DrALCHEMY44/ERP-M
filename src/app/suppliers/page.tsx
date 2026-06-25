
"use client"

import * as React from "react"
import { Plus, Search, Truck, Phone, Mail, MapPin, Loader2, Trash2, Filter, DollarSign, LogIn } from "lucide-react"
import Link from "next/link"
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
import { useDataConnect } from "@/hooks/use-dataconnect"
import { listSuppliersByBusinessQuery, createSupplierMutation, updateSupplierMutation, deleteSupplierMutation } from "@/lib/data-service"
import { useAuth } from "@/hooks/use-auth"
import { Supplier } from "@/lib/types"
import { SupplierDialog } from "@/components/suppliers/supplier-dialog"
import { useToast } from "@/hooks/use-toast"

export default function SuppliersPage() {
  const { user, profile } = useAuth();
  const { data: suppliersData, loading, unauthenticated, refetch } = useDataConnect({
    query: listSuppliersByBusinessQuery,
    variables: { tenantId: profile?.tenantId, businessId: profile?.businessId },
    skip: !profile?.tenantId || !profile?.businessId
  });
  const [suppliers, setSuppliers] = React.useState<Supplier[]>([]);
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedSupplier, setSelectedSupplier] = React.useState<Supplier | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  const fetchSuppliers = React.useCallback(async () => {
    if (!profile?.tenantId || !profile?.businessId) return;
    try {
      const response = await listSuppliersByBusinessQuery({
        tenantId: profile.tenantId,
        businessId: profile.businessId
      });
      // Map dataconnect format back to ui format
      const mappedSuppliers = ((response as any)?.suppliers || []).map((s: any) => ({
        ...s,
        name: s.supplierName,
        phone: s.phoneNumber || '',
        location: 'Unknown',
        productsSupplied: [],
        paymentStatus: 'Paid'
      }));
      setSuppliers(mappedSuppliers);
    } catch (e) {
      console.error("Failed to fetch suppliers:", e);
    }
  }, [profile]);

  React.useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.productsSupplied.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const pendingPayments = suppliers.filter(s => s.paymentStatus !== 'Paid').length;

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedSupplier(null)
    setIsDialogOpen(true)
  }

  const handleSave = async (data: Partial<Supplier>) => {
    if (!profile?.tenantId || !profile?.businessId) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "Your user profile is missing business/tenant identifiers. Please complete registration or select a business."
      });
      return;
    }
    try {
      if (selectedSupplier?.id) {
        await updateSupplierMutation({
          id: selectedSupplier.id,
          supplierName: data.name,
          phoneNumber: data.phone,
          email: data.email
        });
        toast({ title: "Supplier Updated", description: `${data.name} profile has been saved.` });
      } else {
        await createSupplierMutation({
          tenantId: profile.tenantId,
          businessId: profile.businessId,
          supplierName: data.name!,
          phoneNumber: data.phone,
          email: data.email
        });
        toast({ title: "Supplier Added", description: `${data.name} is now a registered partner.` });
      }
      fetchSuppliers();
    } catch (e) {
      console.error(e);
      toast({ variant: "destructive", title: "Error", description: "Operation failed. Check connection." });
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this supplier record?")) {
      try {
        await deleteSupplierMutation({ id });
        toast({ title: "Deleted", description: "Supplier removed from cloud storage." });
        fetchSuppliers();
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
              Please sign in to view supplier records. All operations require an authenticated session.
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Supplier Management</h1>
          <p className="text-sm text-muted-foreground">Manage your B2B relationships and procurement logistics.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest shadow-lg">
          <Plus className="size-4 mr-2" /> Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-t-4 border-[#3b82f6] shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Active Partners</CardDescription>
            <CardTitle className="text-2xl font-bold text-blue-700">{suppliers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-[#f59e0b] shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Pending Balances</CardDescription>
            <CardTitle className="text-2xl font-bold text-amber-700">{pendingPayments} Suppliers</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-[#10b981] shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Supply Health</CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-700">Optimal</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by supplier or products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>
          <Button variant="ghost" size="sm" className="uppercase font-bold text-[10px]">
            <Filter className="size-4 mr-2" /> Filter List
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Supply Chain</TableHead>
                <TableHead>Financial Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="hover:bg-muted/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold border">
                          <Truck className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{supplier.name}</span>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-3" /> {supplier.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center gap-2">
                          <Phone className="size-3 text-muted-foreground" /> {supplier.phone}
                        </div>
                        {supplier.email && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="size-3" /> {supplier.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-wrap gap-1">
                          {supplier.productsSupplied.map((p, i) => (
                            <Badge key={i} variant="secondary" className="text-[9px] uppercase font-bold tracking-tighter">
                              {p}
                            </Badge>
                          ))}
                       </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] uppercase font-bold ${
                        supplier.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                        supplier.paymentStatus === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {supplier.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(supplier)} className="text-[10px] uppercase font-bold">Edit</Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(supplier.id!)} className="h-8 w-8 text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                    No suppliers found matching your query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <SupplierDialog 
        supplier={selectedSupplier}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
