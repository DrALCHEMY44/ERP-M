"use client"

import * as React from "react"
import { History, Search, Download, ShieldCheck, User, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MOCK_ACTIVITY_LOGS } from "@/lib/mock-data"

export default function ActivityLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Audit Trail & Logs</h1>
          <p className="text-sm text-muted-foreground">Immutable record of all business activities (Append-Only).</p>
        </div>
        <Button variant="outline" size="sm" className="bg-card shadow-sm font-bold uppercase text-[10px] tracking-widest">
          <Download className="size-4 mr-2" /> Export Audit Log
        </Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search logs by user, action, or module..." className="pl-9 bg-muted/20" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="text-[10px] font-bold uppercase">Today: 12 Actions</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ACTIVITY_LOGS.map((log) => (
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
                    <Badge variant="secondary" className="text-[9px] uppercase tracking-tighter font-bold">
                      {log.module}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-bold text-primary uppercase text-[10px]">{log.actionType}</span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">{log.description}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold">View Data</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-4">
          <ShieldCheck className="size-8 text-primary" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-tight">System Integrity</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">All logs are signed and protected against modification.</p>
          </div>
        </div>
        <div className="p-4 bg-muted/50 border rounded-xl flex items-center gap-4">
          <History className="size-8 text-muted-foreground" />
          <div>
            <h4 className="text-sm font-bold uppercase tracking-tight">Retention Policy</h4>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Data retained for 10 years per OHADA standards.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
