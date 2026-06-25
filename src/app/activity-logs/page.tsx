
"use client"

import * as React from "react"
import { History, Search, Download, ShieldCheck, User, Filter, ArrowUpDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { listActivityLogsByBusinessQuery } from "@/lib/data-service"
import { ActivityLog } from "@/lib/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ActivityLogsPage() {
  const { profile } = useAuth();
  const { data: logsData, loading } = useDataConnect({
    query: listActivityLogsByBusinessQuery,
    variables: {
      tenantId: profile?.tenantId || "",
      businessId: profile?.businessId || ""
    },
    skip: !profile
  });

  const logs = React.useMemo(() => {
    return (logsData?.activityLogs || []).map((l: any) => ({
      ...l,
      userRole: 'Member' // Fallback role for logs UI display
    })) as ActivityLog[];
  }, [logsData]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterModule, setFilterModule] = React.useState<string>("all");

  const filteredLogs = React.useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.actionType.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesModule = filterModule === "all" || log.module === filterModule;
      
      return matchesSearch && matchesModule;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [logs, searchQuery, filterModule]);

  const modules = Array.from(new Set(logs.map(l => l.module)));

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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Audit Trail</h1>
          <p className="text-sm text-muted-foreground">Immutable, append-only records of all user and AI interactions.</p>
        </div>
        <Button variant="outline" size="sm" className="bg-card shadow-sm font-bold uppercase text-[10px] tracking-widest">
          <Download className="size-4 mr-2" /> Export Full Audit
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by user or action..." 
              className="pl-9 bg-muted/20" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest">
                  <Filter className="size-3.5 mr-2" /> Module: {filterModule}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterModule('all')}>All Modules</DropdownMenuItem>
                {modules.map(mod => (
                  <DropdownMenuItem key={mod} onClick={() => setFilterModule(mod)}>
                    {mod}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Badge variant="outline" className="text-[10px] font-bold uppercase">Today: {logs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString()).length} Events</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-muted/10 text-xs">
                    <TableCell className="font-mono text-[10px] text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary font-bold">
                          {log.userName[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.userName}</span>
                          <span className="text-[9px] uppercase text-muted-foreground font-bold">{log.userRole}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                       <span className={`font-bold uppercase text-[10px] ${
                         log.actionType.includes('DELETE') ? 'text-destructive' :
                         log.actionType.includes('ADD') ? 'text-emerald-600' :
                         'text-primary'
                       }`}>
                         {log.actionType}
                       </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter font-bold">
                        {log.module}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">{log.description}</TableCell>
                    <TableCell className="text-right">
                      {log.recordId ? (
                        <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold">ID: {log.recordId.substring(0,6)}</Button>
                      ) : (
                        <span className="text-muted-foreground text-[10px]">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground italic">
                    No activity logs found for current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-4">
          <ShieldCheck className="size-8 text-primary" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-tight">Immutable Records</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">All logs are signed and protected. Edits or deletions are strictly prohibited by system protocol.</p>
          </div>
        </div>
        <div className="p-4 bg-muted/50 border rounded-xl flex items-center gap-4">
          <History className="size-8 text-muted-foreground" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-tight">Audit History</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Full history retained for fiscal compliance and accountability audits.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
