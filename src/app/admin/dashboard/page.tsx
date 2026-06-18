"use client"

import * as React from "react"
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Search, 
  MoreVertical,
  ArrowUpRight,
  Globe,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useFirestore } from "@/hooks/use-firestore"
import { Tenant, UserProfile } from "@/lib/types"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

export default function SuperAdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const { data: tenants, loading: tenantsLoading, updateRecord } = useFirestore<Tenant>('tenants', { bypassFilter: true });
  const { data: users, loading: usersLoading } = useFirestore<UserProfile>('users', { bypassFilter: true });
  
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = React.useMemo(() => {
    return {
      totalTenants: tenants.length,
      activeTenants: tenants.filter(t => t.status === 'Active').length,
      premiumTenants: tenants.filter(t => t.plan === 'Premium' || t.plan === 'Enterprise').length,
      totalUsers: users.length,
      estimatedMRR: tenants.reduce((acc, t) => {
        if (t.plan === 'Premium') return acc + 25000;
        if (t.plan === 'Enterprise') return acc + 75000;
        return acc;
      }, 0)
    };
  }, [tenants, users]);

  const toggleStatus = async (tenant: Tenant) => {
    const newStatus = tenant.status === 'Active' ? 'Suspended' : 'Active';
    if (confirm(`Are you sure you want to ${newStatus === 'Active' ? 'reactivate' : 'suspend'} ${tenant.name}?`)) {
      await updateRecord(tenant.id, { status: newStatus });
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="size-8 text-primary" />
            SaaS Platform Command
          </h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Platform Overview (Public for testing)</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 font-bold uppercase text-[10px] tracking-widest px-8 shadow-lg">
          <Activity className="size-4 mr-2" /> System Health: 100%
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-primary shadow-lg bg-primary/5">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Total SaaS Tenants</CardDescription>
            <CardTitle className="text-3xl font-bold">{stats.totalTenants}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
             <div className="flex items-center text-[10px] text-emerald-600 font-bold gap-1 uppercase">
               <TrendingUp className="size-3" /> +12% Growth
             </div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-lg">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Active SME Hubs</CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-700">{stats.activeTenants}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[10px] text-muted-foreground uppercase font-bold">
            Real-time Operational Units
          </CardContent>
        </Card>
        <Card className="border-t-4 border-blue-500 shadow-lg">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Estimated MRR (FCFA)</CardDescription>
            <CardTitle className="text-3xl font-bold text-blue-700">{stats.estimatedMRR.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[10px] text-muted-foreground uppercase font-bold">
            Projected Monthly Recurring
          </CardContent>
        </Card>
        <Card className="border-t-4 border-purple-500 shadow-lg">
          <CardHeader className="pb-2 p-4">
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Global Platform Users</CardDescription>
            <CardTitle className="text-3xl font-bold text-purple-700">{stats.totalUsers}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-[10px] text-muted-foreground uppercase font-bold">
            Across all SME Tenants
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search tenants by name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
             <Badge variant="outline" className="text-[10px] font-bold uppercase py-1 px-3">
               <Globe className="size-3 mr-2" /> Global Multi-Tenant View
             </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Tenant Identity</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantsLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={5}><Skeleton className="h-10 w-full" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTenants.length > 0 ? (
                filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id} className="hover:bg-muted/10 group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary border">
                          <Building2 className="size-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{tenant.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono uppercase">{tenant.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tenant.plan === 'Enterprise' ? 'default' : 'secondary'} className="text-[9px] uppercase font-bold tracking-widest">
                        {tenant.plan}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-medium text-muted-foreground">
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] uppercase font-bold ${
                        tenant.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                             <MoreVertical className="size-4" />
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem onClick={() => toggleStatus(tenant)} className="text-[10px] font-bold uppercase">
                             {tenant.status === 'Active' ? 'Suspend Tenant' : 'Reactivate Tenant'}
                           </DropdownMenuItem>
                           <DropdownMenuItem className="text-[10px] font-bold uppercase">Manage Subscription</DropdownMenuItem>
                           <DropdownMenuItem className="text-[10px] font-bold uppercase text-primary">Login As Admin</DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                    No tenants match your search query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
