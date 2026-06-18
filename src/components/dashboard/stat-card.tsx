
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
    <Card className={cn("overflow-hidden transition-all hover:shadow-md border-sidebar-border/10", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4">
        <CardTitle className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</CardTitle>
        <div className="rounded-md bg-primary/10 p-1.5 text-primary">
          <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-lg md:text-2xl font-bold tracking-tight truncate">
          {value}
        </div>
        {(description || trend) && (
          <div className="mt-1 flex items-center gap-1.5 text-[9px] md:text-xs">
            {trend && (
              <span className={cn(
                "font-bold",
                trend.isPositive ? "text-emerald-600" : "text-destructive"
              )}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}%
              </span>
            )}
            <span className="text-muted-foreground truncate">{description || trend?.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
