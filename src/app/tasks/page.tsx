"use client"

import * as React from "react"
import { Plus, Search, CheckCircle2, Clock, AlertCircle, Filter, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MOCK_TASKS } from "@/lib/mock-data"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { Task } from "@/lib/types"

export default function TasksPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)

  const pendingCount = MOCK_TASKS.filter(t => t.status === 'Pending').length
  const overdueCount = MOCK_TASKS.filter(t => t.status === 'Overdue' || t.status === 'Late').length
  const ongoingCount = MOCK_TASKS.filter(t => t.status === 'Ongoing').length

  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleAddNew = () => {
    setSelectedTask(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Workload & Tasks</h1>
          <p className="text-sm text-muted-foreground">Monitor employee performance and operational deadlines.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest shadow-lg">
          <Plus className="size-4 mr-2" /> Assign Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-t-4 border-blue-500 shadow-md">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Tasks</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{MOCK_TASKS.length}</div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="size-3 text-blue-500" />
              <span className="text-[9px] text-muted-foreground uppercase">{ongoingCount} Ongoing</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-md">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Action</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-[9px] text-muted-foreground uppercase mt-1 italic">Waiting for start</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-red-500 shadow-md bg-red-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overdue/Late</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
              <p className="text-[9px] text-muted-foreground uppercase mt-1 font-bold">Action Required</p>
            </div>
            <AlertCircle className="size-6 text-red-500 opacity-50" />
          </CardContent>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-md">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600">85%</div>
            <p className="text-[9px] text-muted-foreground uppercase mt-1">Completion Rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search tasks or employees..." className="pl-9 bg-muted/20" />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="text-xs">
              <Filter className="size-3.5 mr-2" /> All Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Task Title</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TASKS.map((task) => (
                <TableRow key={task.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{task.title}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{task.department}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">{task.assignedToName}</TableCell>
                  <TableCell>
                    <Badge variant={task.priority === 'Urgent' ? 'destructive' : 'secondary'} className="text-[9px] uppercase tracking-tighter">
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="size-3 text-muted-foreground" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-[9px] uppercase font-bold ${
                      task.status === 'Overdue' ? 'bg-red-100 text-red-700' :
                      task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(task)} className="text-[10px] uppercase font-bold">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <TaskDialog 
        task={selectedTask}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(t) => console.log("Task Saved:", t)}
      />
    </div>
  )
}
