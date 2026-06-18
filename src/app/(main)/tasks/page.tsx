"use client"

import * as React from "react"
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  User2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MOCK_TASKS } from "@/lib/mock-data"
import { TaskDialog } from "@/components/tasks/task-dialog"
import { Task } from "@/lib/types"

const priorityColors = {
  Low: "bg-blue-100 text-blue-700 border-blue-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Urgent: "bg-red-100 text-red-700 border-red-200",
}

const statusIcons = {
  Pending: Clock,
  Ongoing: Clock,
  Completed: CheckCircle2,
  Cancelled: AlertCircle,
  Late: AlertCircle,
  Overdue: AlertCircle,
}

export default function TasksPage() {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Operations Tasks</h1>
          <p className="text-muted-foreground">Manage employee workload and project deadlines.</p>
        </div>
        <Button onClick={() => { setSelectedTask(null); setIsDialogOpen(true); }} className="bg-primary hover:bg-primary/90">
          <Plus className="size-4 mr-2" /> Assign Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TASKS.map((task) => {
          const StatusIcon = statusIcons[task.status]
          return (
            <Card key={task.id} className="group hover:shadow-md transition-all border-sidebar-border/10">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className={`${priorityColors[task.priority]} font-bold`}>
                    {task.priority}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{task.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex items-center justify-between border-t mt-auto p-4 bg-muted/20">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                    {task.assignedToName[0]}
                  </div>
                  <span className="text-xs font-medium">{task.assignedToName}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <StatusIcon className={`size-3 ${task.status === 'Overdue' ? 'text-destructive' : 'text-primary'}`} />
                  <span className={task.status === 'Overdue' ? 'text-destructive' : ''}>{task.status}</span>
                </div>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      <TaskDialog 
        task={selectedTask}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(t) => console.log("Saved task:", t)}
      />
    </div>
  )
}