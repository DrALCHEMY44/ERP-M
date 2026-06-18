"use client"

import * as React from "react"
import { Plus, Search, UserCircle, Phone, Mail, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Human Resources</h1>
          <p className="text-sm text-muted-foreground">Manage your team, positions, and payroll (SYCOHADA Compliant).</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest shadow-lg">
          <Plus className="size-4 mr-2" /> Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-t-4 border-blue-500 shadow-md">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Staff</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-blue-700">12 Employees</div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-md">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Payroll Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-700">Fully Paid</div>
            <p className="text-[9px] text-muted-foreground mt-1 uppercase">Cycle: May 2024</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-md">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Leave Requests</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-amber-600">2 Pending</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-9 bg-muted/20" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Marie Claire", role: "Store Manager", dept: "Operations", status: "Active" },
            { name: "John Doe", role: "Sales Rep", dept: "Sales", status: "Active" },
            { name: "Abena Samuel", role: "Accountant", dept: "Finance", status: "Active" },
          ].map((emp, i) => (
            <Card key={i} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <Avatar className="h-12 w-12 rounded-lg border-2 border-muted group-hover:border-primary/30 transition-colors">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{emp.name[0]}{emp.name.split(' ')[1]?.[0]}</AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-tighter bg-emerald-100 text-emerald-700">{emp.status}</Badge>
                </div>
                <div className="space-y-1 mb-4">
                  <h3 className="font-headline font-bold text-lg">{emp.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-medium">
                    <Building className="size-3" /> {emp.role} • {emp.dept}
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
                  <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest">Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
