"use client"

import * as React from "react"
import Link from "next/link"
import { AlertTriangle, Bell, CheckCheck, Loader2, Megaphone } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Announcement={id:string;title:string;message:string;priority:"NORMAL"|"IMPORTANT"|"URGENT";created_by_name:string;created_at:string;is_read:boolean}

export function NotificationCenter(){
  const{user}=useAuth();const[items,setItems]=React.useState<Announcement[]>([]);const[loading,setLoading]=React.useState(false)
  const mounted=React.useRef(true)
  const requestRunning=React.useRef(false)
  const load=React.useCallback(async()=>{
    if(!user||requestRunning.current)return
    requestRunning.current=true
    if(mounted.current)setLoading(true)
    try{
      const response=await fetch("/api/announcements",{cache:"no-store"})
      if(!response.ok)return
      const data=await response.json()
      if(mounted.current&&Array.isArray(data.announcements))setItems(data.announcements)
    }catch{
      // A polling failure is non-fatal (for example while `next dev` is
      // recompiling). Keep the last successful notifications on screen and
      // let the next interval retry without surfacing a runtime overlay.
    }finally{
      requestRunning.current=false
      if(mounted.current)setLoading(false)
    }
  },[user])
  React.useEffect(()=>{
    mounted.current=true
    void load()
    const timer=setInterval(()=>void load(),10000)
    const refresh=()=>void load()
    window.addEventListener("smarterp:announcement",refresh)
    return()=>{
      mounted.current=false
      clearInterval(timer)
      window.removeEventListener("smarterp:announcement",refresh)
    }
  },[load])
  const mark=async(id:string)=>{
    if(!user)return
    const previous=items
    setItems(old=>old.map(item=>item.id===id?{...item,is_read:true}:item))
    try{
      const response=await fetch("/api/announcements",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})})
      if(!response.ok)throw new Error("Could not mark notification as read")
    }catch{
      if(mounted.current)setItems(previous)
    }
  }
  const unread=items.filter(item=>!item.is_read).length
  const markAll=async()=>{for(const item of items.filter(x=>!x.is_read))await mark(item.id)}
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
          <Bell className="size-5 text-muted-foreground" aria-hidden="true" />
          {unread > 0 && <span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white ring-2 ring-card">{unread > 9 ? "9+" : unread}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={12} className="w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl p-0 shadow-lg">
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <div>
            <p className="font-semibold">Notifications</p>
            <p className="mt-1 text-xs text-muted-foreground">Updates from your team</p>
          </div>
          {unread > 0 && <Button variant="ghost" size="sm" onClick={markAll} className="text-xs"><CheckCheck aria-hidden="true" />Read all</Button>}
        </div>
        <ScrollArea className="h-80">
          {loading && !items.length ? (
            <div className="flex h-40 flex-col items-center justify-center gap-3 text-muted-foreground" role="status">
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              <p className="text-sm">Loading notifications…</p>
            </div>
          ) : !items.length ? (
            <div className="flex h-64 flex-col items-center justify-center px-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><Bell className="size-6" aria-hidden="true" /></div>
              <p className="mt-4 text-sm font-semibold">No announcements yet</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">New updates from your team will appear here.</p>
            </div>
          ) : items.slice(0, 20).map((item) => (
            <button type="button" key={item.id} onClick={() => void mark(item.id)} className={`flex w-full gap-3 border-b p-4 text-left transition-colors hover:bg-muted/60 ${!item.is_read ? "bg-primary/5" : ""}`}>
              <span className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl ${item.priority === "URGENT" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>
                {item.priority === "URGENT" ? <AlertTriangle className="size-4" aria-label="Urgent" /> : <Megaphone className="size-4" aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-semibold leading-snug">{item.title}</span>
                  {!item.is_read && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"><span className="sr-only">Unread</span></span>}
                </span>
                <span className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.message}</span>
                <span className="mt-2 block text-xs text-muted-foreground">{item.created_by_name} · {new Date(item.created_at).toLocaleDateString()}</span>
              </span>
            </button>
          ))}
        </ScrollArea>
        <div className="border-t p-2"><Button asChild variant="ghost" className="w-full text-sm"><Link href="/announcements">View all announcements</Link></Button></div>
      </PopoverContent>
    </Popover>
  )
}
