
"use client"

import * as React from "react"
import { Plus, Search, CheckCircle2, Clock, AlertCircle, Filter, Calendar as CalendarIcon, Loader2, Trash2, LogIn } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { Task, TaskStatus } from "@/lib/types"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { useToast } from "@/hooks/use-toast"
import { listTasksByBusinessQuery, createTaskMutation, updateTaskMutation, deleteTaskMutation } from "@/lib/data-service"
import { MOCK_USER } from "@/lib/mock-data"
import { startOfDay, parseISO, isBefore } from "date-fns"
import { createNotification } from "@/lib/notifications"
import { TaskStatus as DbTaskStatus, TaskPriority as DbTaskPriority } from "@dataconnect/generated"

const mapStatusToDb = (status: TaskStatus | undefined): DbTaskStatus => {
  switch (status) {
    case 'Completed': return DbTaskStatus.COMPLETED;
    case 'Ongoing': return DbTaskStatus.ONGOING;
    case 'Late':
    case 'Overdue':
      return DbTaskStatus.LATE;
    case 'Pending':
    default:
      return DbTaskStatus.PENDING;
  }
};

const mapPriorityToDb = (priority: string | undefined | null): DbTaskPriority | null => {
  if (!priority) return null;
  switch (priority) {
    case 'Medium': return DbTaskPriority.MEDIUM;
    case 'High':
    case 'Urgent':
      return DbTaskPriority.HIGH;
    case 'Low':
    default:
      return DbTaskPriority.LOW;
  }
};

const mapStatusFromDb = (dbStatus: string | undefined | null): TaskStatus => {
  switch (dbStatus) {
    case 'COMPLETED': return 'Completed';
    case 'ONGOING': return 'Ongoing';
    case 'LATE': return 'Late';
    case 'PENDING':
    default:
      return 'Pending';
  }
};

const mapPriorityFromDb = (dbPriority: string | undefined | null): string => {
  switch (dbPriority) {
    case 'MEDIUM': return 'Medium';
    case 'HIGH': return 'High';
    case 'LOW':
    default:
      return 'Low';
  }
};

export default function TasksPage() {
  const { data: tasksData, loading, unauthenticated, refetch } = useDataConnect({ 
    query: listTasksByBusinessQuery, 
    variables: { tenantId: MOCK_USER.tenantId, businessId: MOCK_USER.businessId } 
  });
  
  const tasks = React.useMemo(() => {
    const rawTasks = (tasksData?.tasks || []) as any[];
    return rawTasks.map(t => ({
      ...t,
      status: mapStatusFromDb(t.status),
      priority: mapPriorityFromDb(t.priority),
      assignedTo: t.assignedTo?.id || ''
    })) as unknown as Task[];
  }, [tasksData]);

  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
 
  // Automatic overdue detection logic
  const getTaskStatus = (task: Task): TaskStatus => {
    if (task.status === 'Completed') return 'Completed';
    if (task.status === 'Cancelled') return 'Cancelled';
    
    const today = startOfDay(new Date());
    const dueDate = startOfDay(parseISO(task.dueDate));
    
    if (isBefore(dueDate, today)) {
      return 'Overdue';
    }
    return task.status;
  };
 
  const processedTasks = React.useMemo(() => {
    return tasks.map(task => {
      const assignedToName = task.assignedToName || (task.assignedTo as any)?.email?.split('@')[0] || 'Unassigned';
      return {
        ...task,
        assignedToName,
        displayStatus: getTaskStatus(task)
      }
    }).filter(task => 
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedToName?.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tasks, searchQuery]);
 
  // Effect to trigger overdue notifications once
  React.useEffect(() => {
    const checkOverdue = async () => {
      const overdueTasks = processedTasks.filter(t => t.displayStatus === 'Overdue' && t.status !== 'Overdue');
      for (const t of overdueTasks) {
        await createNotification({
          title: "Task Overdue",
          message: `The task "${t.title}" is now past its deadline (${t.dueDate}).`,
          type: "error",
          module: "Tasks",
          targetRoles: ["Business Owner", "Manager"],
          targetUserId: t.assignedTo,
          link: "/tasks"
        });
        // We update the status in DB to prevent multiple notifications
        await updateTaskMutation({ id: t.id, status: DbTaskStatus.LATE });
      }
    };
    if (processedTasks.length > 0) checkOverdue();
  }, [processedTasks]);
 
  const stats = React.useMemo(() => {
    const total = processedTasks.length;
    const pending = processedTasks.filter(t => t.displayStatus === 'Pending').length;
    const ongoing = processedTasks.filter(t => t.displayStatus === 'Ongoing').length;
    const completed = processedTasks.filter(t => t.displayStatus === 'Completed').length;
    const overdue = processedTasks.filter(t => t.displayStatus === 'Overdue').length;
    
    return { total, pending, ongoing, completed, overdue };
  }, [processedTasks]);
 
  const handleEdit = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }
 
  const handleAddNew = () => {
    setSelectedTask(null)
    setIsDialogOpen(true)
  }
 
  const handleSave = async (taskData: Partial<Task>) => {
    try {
      if (selectedTask?.id) {
        await updateTaskMutation({
          id: selectedTask.id,
          title: taskData.title,
          description: taskData.description,
          status: mapStatusToDb(taskData.status),
          priority: mapPriorityToDb(taskData.priority),
          dueDate: taskData.dueDate,
          assignedToId: taskData.assignedTo
        });
        await refetch();
        toast({ title: "Task Updated", description: "Operational tracking updated successfully." });
      } else {
        const result = await createTaskMutation({
          tenantId: MOCK_USER.tenantId,
          businessId: MOCK_USER.businessId,
          title: taskData.title || '',
          description: taskData.description,
          status: mapStatusToDb(taskData.status || 'Pending'),
          priority: mapPriorityToDb(taskData.priority),
          dueDate: taskData.dueDate || new Date().toISOString(),
          assignedToId: taskData.assignedTo,
          createdBy: MOCK_USER.uid
        });
        await refetch();
        
        // Notify assignee
        await createNotification({
          title: "New Task Assigned",
          message: `You have been assigned a new task: "${taskData.title}". Priority: ${taskData.priority}.`,
          type: "info",
          module: "Tasks",
          targetUserId: taskData.assignedTo,
          link: "/tasks"
        });
 
        toast({ title: "Task Created", description: "Assignment has been sent to the cloud." });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Could not save task details." });
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this task assignment?")) {
      try {
        await deleteTaskMutation({ id });
        await refetch();
        toast({ title: "Task Deleted", description: "Record removed from workspace." });
      } catch (e) {
        toast({ variant: "destructive", title: "Error", description: "Could not delete task." });
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
              Please sign in to view your tasks. All operations require an authenticated session.
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Workload & Tasks</h1>
          <p className="text-sm text-muted-foreground">Monitor employee performance and operational deadlines.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white font-bold uppercase text-xs tracking-widest shadow-lg">
          <Plus className="size-4 mr-2" /> Assign Task
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-t-4 border-blue-500 shadow-md bg-blue-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Load</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{stats.total} Tasks</div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="size-3 text-blue-500" />
              <span className="text-[9px] text-muted-foreground uppercase">{stats.ongoing} Currently Ongoing</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-amber-500 shadow-md bg-amber-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Action</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 text-amber-700">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-[9px] uppercase mt-1 italic font-bold">Waiting for start</p>
          </CardContent>
        </Card>
        <Card className="border-t-4 border-red-500 shadow-md bg-red-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Overdue/Late</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
              <p className="text-[9px] text-muted-foreground uppercase mt-1 font-bold">Requires Immediate Attention</p>
            </div>
            <AlertCircle className="size-6 text-red-500 opacity-50" />
          </CardContent>
        </Card>
        <Card className="border-t-4 border-emerald-500 shadow-md bg-emerald-50/10">
          <CardHeader className="pb-2 p-4">
            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Performance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-emerald-600">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</div>
            <p className="text-[9px] text-muted-foreground uppercase mt-1 font-bold tracking-tighter">Completion Rate (All Time)</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks or employees..." 
              className="pl-9 bg-muted/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="text-[10px] font-bold uppercase">Real-time Cloud Sync</Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Task Details</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedTasks.length > 0 ? (
                processedTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{task.title}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-medium">{task.department} • Ref: {task.id.substring(0,6)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                           {(task as any).assignedToName?.[0] || 'U'}
                         </div>
                         <span className="text-xs font-medium">{(task as any).assignedToName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        task.priority === 'Urgent' ? 'destructive' : 
                        task.priority === 'High' ? 'default' : 'secondary'
                      } className="text-[9px] uppercase tracking-tighter font-bold">
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs">
                      <div className={`flex items-center gap-1.5 ${task.displayStatus === 'Overdue' ? 'text-destructive font-bold' : ''}`}>
                        <CalendarIcon className="size-3" />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[9px] uppercase font-bold ${
                        task.displayStatus === 'Overdue' ? 'bg-red-100 text-red-700' :
                        task.displayStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                        task.displayStatus === 'Ongoing' ? 'bg-blue-100 text-blue-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {task.displayStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(task)} className="text-[10px] uppercase font-bold tracking-widest">Edit</Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(task.id!)} className="h-8 w-8 text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                    {searchQuery ? "No tasks match your search." : "No tasks assigned yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TaskDialog 
        task={selectedTask}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSave}
      />
    </div>
  )
}
