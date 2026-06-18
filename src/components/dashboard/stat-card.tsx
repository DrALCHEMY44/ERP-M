
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md border-sidebar-border/10 flex flex-col h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-4">
        <CardTitle className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground line-clamp-1">{title}</CardTitle>
        <div className="rounded-md bg-primary/10 p-1 md:p-1.5 text-primary shrink-0">
          <Icon className="h-3 w-3 md:h-4 md:w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-4 pt-0 mt-auto">
        <div className="text-base md:text-2xl font-bold tracking-tight truncate">
          {value}
        </div>
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-1.5 text-[8px] md:text-xs">
            {trend && (
              <span className={cn(
                "font-bold shrink-0",
                trend.isPositive ? "text-emerald-600" : "text-destructive"
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </span>
            )}
            <span className="text-muted-foreground truncate opacity-80">{description || trend?.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
