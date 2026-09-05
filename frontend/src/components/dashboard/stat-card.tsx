
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
    <Card className={cn("flex h-full min-w-0 flex-col", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 p-4 pb-3 sm:p-5 sm:pb-3">
        <CardTitle className="pt-1 text-sm font-medium leading-snug tracking-normal text-muted-foreground">{title}</CardTitle>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="mt-auto p-4 pt-0 sm:p-5 sm:pt-0">
        <div className="break-words text-2xl font-semibold tabular-nums leading-tight tracking-tight xl:text-3xl">
          {value}
        </div>
        {(description || trend) && (
          <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs leading-relaxed">
            {trend && (
              <span className={cn(
                "shrink-0 font-semibold",
                trend.isPositive ? "text-emerald-700" : "text-destructive"
              )}>
                <span aria-hidden="true">{trend.isPositive ? "↑" : "↓"} </span>
                <span className="sr-only">{trend.isPositive ? "Increase" : "Decrease"} of </span>
                {trend.value}%
              </span>
            )}
            <span className="text-muted-foreground">{description || trend?.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
