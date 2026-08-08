"use client"

import * as React from "react"
import { AlertTriangle, BellRing, Loader2, Megaphone, Plus, Send } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Announcement = { id:string; title:string; message:string; priority:"NORMAL"|"IMPORTANT"|"URGENT"; created_by_name:string; created_at:string; is_read:boolean }

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [items,setItems] = React.useState<Announcement[]>([])
  const [loading,setLoading] = React.useState(true)
  const [canPublish,setCanPublish] = React.useState(false)
  const [open,setOpen] = React.useState(false)
  const [saving,setSaving] = React.useState(false)
  const [title,setTitle] = React.useState("")
  const [message,setMessage] = React.useState("")
  const [priority,setPriority] = React.useState<"NORMAL"|"IMPORTANT"|"URGENT">("NORMAL")

  const load = React.useCallback(async (silent=false) => {
    if (!user) return
    if (!silent) setLoading(true)
    try {
      const response = await fetch("/api/announcements", { headers:{ Authorization:`Bearer ${await user.getIdToken()}` }, cache:"no-store" })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setItems(data.announcements); setCanPublish(data.canPublish)
    } catch (error) { if (!silent) toast({ variant:"destructive", title:"Announcements unavailable", description:error instanceof Error?error.message:"Please retry" }) }
    finally { if (!silent) setLoading(false) }
  },[toast,user])

  React.useEffect(() => { void load(); const timer=setInterval(()=>void load(true),10000); return()=>clearInterval(timer) },[load])

  const publish = async () => {
    if (!user || title.trim().length<3 || message.trim().length<3) return
    setSaving(true)
    try {
      const response=await fetch("/api/announcements",{method:"POST",headers:{Authorization:`Bearer ${await user.getIdToken()}`,"Content-Type":"application/json"},body:JSON.stringify({title,message,priority})})
      const data=await response.json(); if(!response.ok) throw new Error(data.error)
      setOpen(false); setTitle(""); setMessage(""); setPriority("NORMAL"); await load(true)
      window.dispatchEvent(new CustomEvent("smarterp:announcement")); toast({title:"Announcement published",description:"Everyone in the company can now view it."})
    } catch(error){toast({variant:"destructive",title:"Could not publish",description:error instanceof Error?error.message:"Please retry"})} finally{setSaving(false)}
  }

  const markRead=async(item:Announcement)=>{
    if(!user||item.is_read)return
    const previous=items
    setItems(current=>current.map(x=>x.id===item.id?{...x,is_read:true}:x))
    try{
      const response=await fetch("/api/announcements",{method:"PATCH",headers:{Authorization:`Bearer ${await user.getIdToken()}`,"Content-Type":"application/json"},body:JSON.stringify({id:item.id})})
      if(!response.ok)throw new Error("Could not mark announcement as read")
    }catch{
      setItems(previous)
    }
  }

  return <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">Company communication</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Announcements</h1><p className="mt-1 text-sm text-muted-foreground">Important updates shared with every member of your company.</p></div>{canPublish&&<Button onClick={()=>setOpen(true)} className="font-bold"><Plus className="mr-2 size-4"/>New announcement</Button>}</div>
    {loading?<div className="grid h-64 place-items-center"><Loader2 className="size-7 animate-spin text-primary"/></div>:items.length===0?<Card><CardContent className="flex flex-col items-center py-20 text-center"><Megaphone className="size-10 text-muted-foreground/30"/><p className="mt-4 font-bold">No announcements yet</p><p className="mt-1 text-sm text-muted-foreground">Company updates will appear here.</p></CardContent></Card>:<div className="grid gap-4 lg:grid-cols-2">{items.map(item=><Card key={item.id} onClick={()=>void markRead(item)} className={`cursor-pointer overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md ${!item.is_read?"border-primary/40 bg-primary/[.025]":""}`}><div className={`h-1 ${item.priority==="URGENT"?"bg-red-500":item.priority==="IMPORTANT"?"bg-amber-500":"bg-blue-500"}`}/><CardHeader className="pb-3"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">{item.priority==="URGENT"?<AlertTriangle className="size-5"/>:<Megaphone className="size-5"/>}</span><div><CardTitle className="text-base">{item.title}</CardTitle><p className="mt-1 text-[10px] text-muted-foreground">{item.created_by_name} • {new Date(item.created_at).toLocaleString()}</p></div></div>{!item.is_read&&<span className="size-2 rounded-full bg-primary"/>}</div></CardHeader><CardContent><p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{item.message}</p><Badge variant="outline" className="mt-4 text-[9px]">{item.priority}</Badge></CardContent></Card>)}</div>}
    <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle className="flex items-center gap-2"><BellRing className="size-5 text-primary"/>Publish an announcement</DialogTitle></DialogHeader><div className="space-y-4"><Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Announcement title" maxLength={120}/><Select value={priority} onValueChange={(value:any)=>setPriority(value)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="NORMAL">Normal</SelectItem><SelectItem value="IMPORTANT">Important</SelectItem><SelectItem value="URGENT">Urgent</SelectItem></SelectContent></Select><Textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write the update for your team..." rows={7} maxLength={4000}/></div><DialogFooter><Button variant="outline" onClick={()=>setOpen(false)} disabled={saving}>Cancel</Button><Button onClick={publish} disabled={saving||title.trim().length<3||message.trim().length<3}>{saving?<Loader2 className="mr-2 size-4 animate-spin"/>:<Send className="mr-2 size-4"/>}Publish</Button></DialogFooter></DialogContent></Dialog>
  </div>
}
