"use client"

import * as React from "react"
import { Eye, EyeOff, Lock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { authInputClass } from "@/components/auth/auth-frame"
import { cn } from "@/lib/utils"

export function PasswordField({ className, visibilityLabel = "password", ...props }: Omit<React.ComponentProps<typeof Input>, "type"> & { visibilityLabel?: string }) {
  const [visible, setVisible] = React.useState(false)
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3.5 top-4 size-4 text-slate-400" aria-hidden="true" />
      <Input {...props} type={visible ? "text" : "password"} className={cn(authInputClass, "pl-11 pr-12", className)} />
      <button type="button" disabled={props.disabled} onClick={() => setVisible(!visible)} aria-label={`${visible ? "Hide" : "Show"} ${visibilityLabel}`} aria-controls={props.id} aria-pressed={visible} className="absolute right-0.5 top-0.5 flex size-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:opacity-50">
        {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
      </button>
    </div>
  )
}
