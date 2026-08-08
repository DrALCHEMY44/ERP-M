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
      const token=await user.getIdToken()
      const response=await fetch("/api/announcements",{headers:{Authorization:`Bearer ${token}`},cache:"no-store"})
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
      const token=await user.getIdToken()
      const response=await fetch("/api/announcements",{method:"PATCH",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify({id})})
      if(!response.ok)throw new Error("Could not mark notification as read")
    }catch{
      if(mounted.current)setItems(previous)
    }
  }
  const unread=items.filter(item=>!item.is_read).length
  const markAll=async()=>{for(const item of items.filter(x=>!x.is_read))await mark(item.id)}
  return <Popover><PopoverTrigger asChild><Button variant="ghost" size="icon" className="relative h-9 w-9"><Bell className="size-5 text-muted-foreground"/>{unread>0&&<span className="absolute right-0.5 top-0.5 grid min-w-4 h-4 place-items-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white ring-2 ring-background">{unread>9?"9+":unread}</span>}</Button></PopoverTrigger><PopoverContent align="end" className="w-80 p-0"><div className="flex items-center justify-between border-b p-4"><div><p className="text-sm font-bold">Notifications</p><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Company announcements</p></div>{unread>0&&<Button variant="ghost" size="sm" onClick={markAll} className="h-7 text-[10px]"><CheckCheck className="mr-1 size-3"/>Read all</Button>}</div><ScrollArea className="h-80">{loading&&!items.length?<div className="grid h-32 place-items-center"><Loader2 className="size-5 animate-spin"/></div>:!items.length?<div className="flex h-40 flex-col items-center justify-center text-muted-foreground"><Bell className="size-8 opacity-30"/><p className="mt-2 text-xs">No notifications</p></div>:items.slice(0,20).map(item=><button key={item.id} onClick={()=>void mark(item.id)} className={`flex w-full gap-3 border-b p-4 text-left transition hover:bg-muted/40 ${!item.is_read?"bg-primary/5":""}`}><span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${item.priority==="URGENT"?"bg-red-100 text-red-600":"bg-blue-100 text-blue-600"}`}>{item.priority==="URGENT"?<AlertTriangle className="size-4"/>:<Megaphone className="size-4"/>}</span><span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><b className="truncate text-xs">{item.title}</b>{!item.is_read&&<i className="mt-1 size-1.5 shrink-0 rounded-full bg-primary"/>}</span><span className="mt-1 line-clamp-2 text-[11px] leading-4 text-muted-foreground">{item.message}</span><span className="mt-2 block text-[9px] text-muted-foreground">{item.created_by_name} • {new Date(item.created_at).toLocaleDateString()}</span></span></button>)}</ScrollArea><div className="border-t p-2"><Button asChild variant="ghost" className="w-full text-xs"><Link href="/announcements">View all announcements</Link></Button></div></PopoverContent></Popover>
}
