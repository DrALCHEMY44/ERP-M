
"use client"

import * as React from "react"
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  Download, 
  Filter, 
  Search, 
  Users, 
  Building2, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Calendar as CalendarIcon,
  Loader2,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend, Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import { useFirestore } from "@/hooks/use-firestore"
import { Task, TaskStatus } from "@/lib/types"
import { isToday, isThisWeek, parseISO, isAfter, startOfDay, isBefore } from "date-fns"

export default function TaskReportsPage() {
  const { data: tasks, loading } = useFirestore<Task>('tasks');
  
  const [filterEmployee, setFilterEmployee] = React.useState("all")
  const [filterDept, setFilterDept] = React.useState("all")
  const [filterStatus, setFilterStatus] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Dynamic calculations based on current data
  const processedTasks = React.useMemo(() => {
    const today = startOfDay(new Date());
    
    return tasks.map(task => {
      const dueDate = startOfDay(parseISO(task.dueDate));
      let effectiveStatus = task.status;
      
      // Auto-detect overdue
      if (task.status !== 'Completed' && task.status !== 'Cancelled' && isBefore(dueDate, today)) {
        effectiveStatus = 'Overdue';
      }

      return {
        ...task,
        effectiveStatus,
        isOverdue: effectiveStatus === 'Overdue',
        isDueToday: isToday(dueDate),
        isDueThisWeek: isThisWeek(dueDate)
      };
    });
  }, [tasks]);

  const filteredTasks = React.useMemo(() => {
    return processedTasks.filter(t => {
      const matchEmp = filterEmployee === "all" || t.assignedToName === filterEmployee;
      const matchDept = filterDept === "all" || t.department === filterDept;
      const matchStatus = filterStatus === "all" || t.effectiveStatus === filterStatus;
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchEmp && matchDept && matchStatus && matchSearch;
    });
  }, [processedTasks, filterEmployee, filterDept, filterStatus, searchQuery]);

  const stats = React.useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(t => t.effectiveStatus === 'Completed').length;
    const overdue = filteredTasks.filter(t => t.effectiveStatus === 'Overdue').length;
    const ongoing = filteredTasks.filter(t => t.effectiveStatus === 'Ongoing').length;
    const pending = filteredTasks.filter(t => t.effectiveStatus === 'Pending').length;
    const dueToday = filteredTasks.filter(t => t.isDueToday).length;
    const dueThisWeek = filteredTasks.filter(t => t.isDueThisWeek).length;

    return { total, completed, overdue, ongoing, pending, dueToday, dueThisWeek };
  }, [filteredTasks]);

  const chartData = [
    { name: 'Completed', value: stats.completed, fill: '#10b981' },
    { name: 'Overdue', value: stats.overdue, fill: '#ef4444' },
    { name: 'Ongoing', value: stats.ongoing, fill: '#3b82f6' },
    { name: 'Pending', value: stats.pending, fill: '#64748b' },
  ];

  const deptData = React.useMemo(() => {
    const depts = ["Operations", "Sales", "Finance", "Logistics", "HR"];
    return depts.map(d => ({
      name: d,
      completed: filteredTasks.filter(t => t.department === d && t.effectiveStatus === 'Completed').length,
      overdue: filteredTasks.filter(t => t.department === d && t.effectiveStatus === 'Overdue').length,
      total: filteredTasks.filter(t => t.department === d).length,
    }));
  }, [filteredTasks]);

  const employeeNames = Array.from(new Set(tasks.map(t => t.assignedToName)));

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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Operational Intelligence</h1>
          <p className="text-sm text-muted-foreground uppercase tracking-widest font-bold text-[10px]">Task Performance & Workforce Utilization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase tracking-widest bg-card">
            <Download className="size-4 mr-2" /> Export Performance DSF
          </Button>
        </div>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="border-t-4 border-primary shadow-sm">
          <CardHeader className="p-3 pb-0">
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest">Total Active</CardDescription>
            <CardTitle className="text-xl font-bold">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest">Completed</CardDescription>
            <CardTitle className="text-xl font-bold text-emerald-600">{stats.completed}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-red-500 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest">Overdue</CardDescription>
            <CardTitle className="text-xl font-bold text-red-600">{stats.overdue}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-blue-500 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest">Ongoing</CardDescription>
            <CardTitle className="text-xl font-bold text-blue-600">{stats.ongoing}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest">Due Today</CardDescription>
            <CardTitle className="text-xl font-bold text-amber-600">{stats.dueToday}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-t-4 border-purple-500 shadow-sm">
          <CardHeader className="p-3 pb-0">
            <CardDescription className="text-[9px] font-bold uppercase tracking-widest">Due This Week</CardDescription>
            <CardTitle className="text-xl font-bold text-purple-600">{stats.dueThisWeek}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by task title or employee..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/20"
            />
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Logistics">Logistics</SelectItem>
              <SelectItem value="HR">HR & Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterEmployee} onValueChange={setFilterEmployee}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employeeNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Task Distribution */}
        <Card className="lg:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36}/>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dept Performance */}
        <Card className="lg:col-span-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase">Department Performance Matrix</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ChartContainer config={{
              completed: { label: "Completed", color: "#10b981" },
              overdue: { label: "Overdue", color: "#ef4444" },
            }} className="w-full h-full">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="overdue" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="shadow-sm">
        <CardHeader className="bg-muted/30 border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase">Workload Audit Table</CardTitle>
              <CardDescription className="text-[10px] font-medium uppercase tracking-tighter">Detailed assignment logs and status tracking</CardDescription>
            </div>
            <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest bg-card">
              Showing {filteredTasks.length} tasks
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-muted/10 text-xs">
                      <TableCell className="font-bold">{task.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="size-3 text-muted-foreground" />
                          {task.assignedToName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[8px] uppercase tracking-tighter font-bold">
                          {task.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1.5 ${task.isOverdue ? 'text-red-600 font-bold' : ''}`}>
                          <CalendarIcon className="size-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={task.priority === 'Urgent' ? 'destructive' : 'secondary'} className="text-[8px] font-bold uppercase">
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-[8px] font-bold uppercase ${
                          task.effectiveStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          task.effectiveStatus === 'Overdue' ? 'bg-red-100 text-red-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {task.effectiveStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {task.effectiveStatus === 'Completed' ? (
                          <span className="text-emerald-600 font-bold">ON TIME</span>
                        ) : task.isOverdue ? (
                          <span className="text-red-600 font-bold">DELAYED</span>
                        ) : (
                          <span className="text-muted-foreground">ACTIVE</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic">
                      No task records found matching current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20 p-4 flex items-center gap-4">
           <CheckCircle2 className="size-8 text-primary opacity-50" />
           <div>
             <h4 className="text-sm font-bold uppercase tracking-tight">SME Efficiency Rate</h4>
             <p className="text-2xl font-bold text-primary">
               {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
             </p>
             <p className="text-[9px] uppercase font-bold text-muted-foreground">Completed vs Total Assignments</p>
           </div>
        </Card>
        <Card className="bg-red-500/5 border-red-500/20 p-4 flex items-center gap-4">
           <AlertCircle className="size-8 text-red-500 opacity-50" />
           <div>
             <h4 className="text-sm font-bold uppercase tracking-tight">System Latency (Critical)</h4>
             <p className="text-2xl font-bold text-red-600">
               {stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0}%
             </p>
             <p className="text-[9px] uppercase font-bold text-muted-foreground">Tasks currently in Overdue state</p>
           </div>
        </Card>
      </div>
    </div>
  )
}
