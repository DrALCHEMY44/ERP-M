
"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  Calendar as CalendarIcon,
  User
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MOCK_TASKS } from "@/lib/mock-data"
import { Task, TaskStatus, TaskPriority } from "@/lib/types"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<Task[]>(MOCK_TASKS)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)
  const { toast } = useToast()

  const handleAddTask = () => {
    setSelectedTask(null)
    setIsDialogOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsDialogOpen(true)
  }

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (selectedTask) {
      setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, ...taskData } as Task : t))
      toast({ title: "Task Updated", description: "Changes saved successfully." })
    } else {
      const newTask = { 
        ...taskData, 
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString() 
      } as Task
      setTasks(prev => [newTask, ...prev])
      toast({ title: "Task Created", description: "New task assigned." })
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'Overdue':
      case 'Late': return 'bg-destructive/10 text-destructive border-destructive/20'
      case 'Ongoing': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-secondary text-secondary-foreground'
    }
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'Urgent': return 'text-destructive font-bold'
      case 'High': return 'text-orange-600 font-semibold'
      case 'Medium': return 'text-blue-600'
      default: return 'text-muted-foreground'
    }
  }

  const completedCount = tasks.filter(t => t.status === 'Completed').length
  const overdueCount = tasks.filter(t => t.status === 'Overdue' || t.status === 'Late').length
  const totalCount = tasks.length
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-primary font-headline">Tasks</h2>
          <p className="text-sm text-muted-foreground">Assign and monitor operational workloads.</p>
        </div>
        <Button onClick={handleAddTask} size="sm" className="bg-accent hover:bg-accent/90 flex items-center gap-2 w-full sm:w-auto">
          <Plus className="size-4" />
          Create Task
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold mb-2">{completedCount} / {totalCount} Done</div>
            <Progress value={completionRate} className="h-1.5" />
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold flex items-center gap-2 text-destructive">
              {overdueCount} Overdue
              <AlertCircle className="size-4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-medium text-muted-foreground uppercase">Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">4 Due Soon</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all" className="flex-1 sm:flex-none">All</TabsTrigger>
            <TabsTrigger value="active" className="flex-1 sm:flex-none">Active</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 sm:flex-none">Done</TabsTrigger>
          </TabsList>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search tasks..." className="pl-9 h-9" />
          </div>
        </div>

        <TabsContent value="all" className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="group hover:border-accent/50 transition-colors">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 overflow-hidden">
                    <div className={cn(
                      "size-8 md:size-10 rounded-full flex items-center justify-center shrink-0",
                      task.status === 'Completed' ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary"
                    )}>
                      {task.status === 'Completed' ? <CheckCircle2 className="size-4 md:size-5" /> : <Clock className="size-4 md:size-5" />}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-xs md:text-sm leading-none truncate max-w-[150px] md:max-w-none">{task.title}</h3>
                        <Badge variant="outline" className={cn("text-[8px] md:text-[10px] py-0 h-4 md:h-5 px-1 md:px-1.5", getStatusColor(task.status))}>
                          {task.status}
                        </Badge>
                      </div>
                      <p className="text-[10px] md:text-xs text-muted-foreground line-clamp-1">{task.description}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1">
                        <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-muted-foreground">
                          <User className="size-2.5" />
                          <span><strong className="text-foreground">{task.assignedToName}</strong></span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] md:text-[10px] text-muted-foreground">
                          <CalendarIcon className="size-2.5" />
                          <span className={cn(task.status === 'Overdue' && "text-destructive")}>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => handleEditTask(task)}>
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      <TaskDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        task={selectedTask}
        onSave={handleSaveTask}
      />
    </div>
  )
}
