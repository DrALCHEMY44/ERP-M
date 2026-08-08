"use client"

import * as React from "react"
import { Activity, ArrowUpRight, Building2, CalendarDays, CircleDollarSign, Globe2, Loader2, MoreHorizontal, Search, ShieldCheck, TrendingUp, UserRoundCheck, Users } from "lucide-react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAuth } from "@/hooks/use-auth"
import { useDataConnect } from "@/hooks/use-dataconnect"
import { listTenantsQuery, listUsersQuery, updateTenant } from "@/lib/data-service"
import { Tenant } from "@/lib/types"

const planPrice = { Basic: 0, Premium: 25000, Enterprise: 75000 }
const compactMoney = (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
type SaaSTenant = Tenant & { businessSector?: string }

export default function SuperAdminDashboard() {
  const { loading: authLoading } = useAuth()
  const { data: tenantsData, loading: tenantsLoading, refetch: refetchTenants } = useDataConnect({ query: listTenantsQuery, refreshInterval: 5000 })
  const { data: usersData } = useDataConnect({ query: listUsersQuery, refreshInterval: 5000 })
  const [searchQuery, setSearchQuery] = React.useState("")

  const tenants: SaaSTenant[] = React.useMemo(() => (tenantsData?.tenants || []).map((tenant: any) => ({
    id: tenant.id,
    name: tenant.name,
    plan: (tenant.subscriptionTier || "Basic") as "Basic" | "Premium" | "Enterprise",
    status: (tenant.status || "Active") as "Active" | "Suspended",
    createdAt: tenant.createdAt,
    businessSector: tenant.businessSector,
  })), [tenantsData])
  const users = React.useMemo(() => usersData?.users || [], [usersData])
  const filteredTenants = tenants.filter(tenant => `${tenant.name} ${tenant.id} ${tenant.businessSector || ""}`.toLowerCase().includes(searchQuery.toLowerCase()))

  const stats = React.useMemo(() => {
    const active = tenants.filter(tenant => tenant.status === "Active").length
    const paid = tenants.filter(tenant => tenant.plan !== "Basic").length
    const mrr = tenants.reduce((sum, tenant) => sum + planPrice[tenant.plan], 0)
    return { active, paid, mrr, arr: mrr * 12, conversion: tenants.length ? Math.round((paid / tenants.length) * 100) : 0 }
  }, [tenants])

  const revenueTrend = React.useMemo(() => {
    const months: { key: string; label: string; revenue: number }[] = []
    const now = new Date()
    for (let offset = 5; offset >= 0; offset--) {
      const date = new Date(now.getFullYear(), now.getMonth() - offset, 1)
      months.push({ key: `${date.getFullYear()}-${date.getMonth()}`, label: date.toLocaleDateString("en", { month: "short" }), revenue: 0 })
    }
    tenants.forEach(tenant => {
      const joined = new Date(tenant.createdAt)
      months.forEach(month => {
        const [year, monthIndex] = month.key.split("-").map(Number)
        if (joined <= new Date(year, monthIndex + 1, 0)) month.revenue += planPrice[tenant.plan]
      })
    })
    return months
  }, [tenants])

  const plans = (["Basic", "Premium", "Enterprise"] as const).map(plan => ({
    plan,
    count: tenants.filter(tenant => tenant.plan === plan).length,
    percent: tenants.length ? Math.round((tenants.filter(tenant => tenant.plan === plan).length / tenants.length) * 100) : 0,
  }))

  const toggleStatus = async (tenant: SaaSTenant) => {
    const newStatus = tenant.status === "Active" ? "Suspended" : "Active"
    if (!confirm(`${newStatus === "Active" ? "Reactivate" : "Suspend"} ${tenant.name}?`)) return
    await updateTenant(tenant.id, { status: newStatus })
    await refetchTenants()
  }

  if (authLoading) return <div className="grid h-[70vh] place-items-center"><Loader2 className="size-8 animate-spin text-primary" /></div>

  const metricCards = [
    { label: "Monthly revenue", value: `${stats.mrr.toLocaleString()} FCFA`, detail: `${compactMoney(stats.arr)} projected ARR`, icon: CircleDollarSign, color: "#22d3ee" },
    { label: "Total tenants", value: tenants.length.toLocaleString(), detail: `${stats.active} active workspaces`, icon: Building2, color: "#60a5fa" },
    { label: "Platform users", value: users.length.toLocaleString(), detail: "Across every company", icon: Users, color: "#a78bfa" },
    { label: "Paid conversion", value: `${stats.conversion}%`, detail: `${stats.paid} paid accounts`, icon: TrendingUp, color: "#34d399" },
  ]

  return (
    <div className="-m-4 min-h-screen bg-[#07101c] p-4 text-slate-100 md:-m-6 md:p-6 lg:-m-8 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <header className="flex flex-col justify-between gap-4 pb-2 sm:flex-row sm:items-center">
          <div><div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-cyan-400"><ShieldCheck className="size-3.5" /> SmartERP platform</div><h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">SaaS Command Center</h1><p className="mt-1 text-xs text-slate-500">Revenue, adoption and tenant operations at a glance.</p></div>
          <div className="flex items-center gap-2"><Badge className="border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-emerald-300 hover:bg-emerald-400/10"><span className="mr-2 size-1.5 animate-pulse rounded-full bg-emerald-400" /> All systems operational</Badge><Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"><CalendarDays className="mr-2 size-4" />Last 6 months</Button></div>
        </header>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((metric, index) => <article key={metric.label} className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1626] p-4 transition hover:-translate-y-0.5 hover:border-slate-700"><div className="absolute inset-x-0 top-0 h-px opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${metric.color}, transparent)` }} /><div className="flex items-start justify-between"><p className="text-[9px] font-bold uppercase tracking-[.14em] text-slate-500">{metric.label}</p><metric.icon className="size-4" style={{ color: metric.color }} /></div><p className="mt-3 text-2xl font-bold tracking-tight">{metric.value}</p><div className="mt-2 flex items-center justify-between"><p className="text-[10px] text-slate-500">{metric.detail}</p><span className="text-[10px] font-bold text-emerald-400">+{8 + index * 3}%</span></div><svg className="mt-3 h-7 w-full" viewBox="0 0 240 30" preserveAspectRatio="none"><path d={`M0 ${24-index*2} C35 ${22-index} 45 25 75 17 S120 22 145 12 S185 16 240 ${3+index}`} fill="none" stroke={metric.color} strokeWidth="2" opacity=".75" /></svg></article>)}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.62fr_1fr]">
          <article className="rounded-2xl border border-slate-800 bg-[#0b1626] p-4 md:p-5"><div className="mb-5 flex items-start justify-between"><div><p className="text-sm font-bold">Recurring revenue overview</p><p className="mt-1 text-[10px] text-slate-500">MRR generated by active subscription plans</p></div><Badge className="bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/10">Live billing view</Badge></div><div className="h-64"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueTrend}><defs><linearGradient id="saasRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#22d3ee" stopOpacity={.34}/><stop offset="1" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#1e293b" strokeDasharray="3 3"/><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }}/><YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={compactMoney}/><Tooltip formatter={(value: number) => [`${value.toLocaleString()} FCFA`, "MRR"]} contentStyle={{ background: "#0f1d30", border: "1px solid #26364c", borderRadius: 12, fontSize: 11 }}/><Area type="monotone" dataKey="revenue" stroke="#22d3ee" strokeWidth={3} fill="url(#saasRevenue)"/></AreaChart></ResponsiveContainer></div></article>

          <article className="rounded-2xl border border-slate-800 bg-[#0b1626] p-4 md:p-5"><div className="mb-5 flex items-center justify-between"><div><p className="text-sm font-bold">Subscription mix</p><p className="mt-1 text-[10px] text-slate-500">Companies by current plan</p></div><ArrowUpRight className="size-4 text-cyan-300" /></div><div className="space-y-6">{plans.map(({plan,count,percent}, index) => <div key={plan}><div className="mb-2 flex items-center justify-between"><div><p className="text-xs font-bold">{plan}</p><p className="text-[9px] text-slate-600">{count} workspace{count === 1 ? "" : "s"}</p></div><p className="text-sm font-bold text-slate-300">{percent}%</p></div><div className="h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full" style={{ width: `${percent}%`, background: ["#38bdf8", "#8b5cf6", "#34d399"][index] }} /></div></div>)}</div><div className="mt-6 grid grid-cols-2 gap-2 border-t border-slate-800 pt-4"><div className="rounded-xl bg-slate-900/70 p-3"><p className="text-[9px] uppercase text-slate-600">Active rate</p><p className="mt-1 text-lg font-bold text-emerald-300">{tenants.length ? Math.round(stats.active / tenants.length * 100) : 0}%</p></div><div className="rounded-xl bg-slate-900/70 p-3"><p className="text-[9px] uppercase text-slate-600">ARPA</p><p className="mt-1 text-lg font-bold text-cyan-300">{compactMoney(tenants.length ? stats.mrr / tenants.length : 0)}</p></div></div></article>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.62fr_1fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0b1626]"><div className="flex flex-col gap-3 border-b border-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold">Tenant directory</p><p className="mt-1 text-[10px] text-slate-500">Manage access and subscription status</p></div><div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-600"/><Input value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search tenants..." className="h-9 border-slate-700 bg-slate-900 pl-9 text-xs text-white"/></div></div><div className="overflow-x-auto"><Table><TableHeader><TableRow className="border-slate-800 hover:bg-transparent"><TableHead className="text-[9px] uppercase text-slate-600">Company</TableHead><TableHead className="text-[9px] uppercase text-slate-600">Plan</TableHead><TableHead className="text-[9px] uppercase text-slate-600">Joined</TableHead><TableHead className="text-[9px] uppercase text-slate-600">Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{tenantsLoading ? Array.from({length: 4}).map((_,i)=><TableRow key={i} className="border-slate-800"><TableCell colSpan={5}><Skeleton className="h-9 bg-slate-800"/></TableCell></TableRow>) : filteredTenants.slice(0, 8).map(tenant => <TableRow key={tenant.id} className="border-slate-800 hover:bg-white/[.025]"><TableCell><div className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300"><Building2 className="size-4"/></span><div><p className="max-w-40 truncate text-xs font-bold">{tenant.name}</p><p className="max-w-40 truncate text-[9px] text-slate-600">{tenant.businessSector || tenant.id}</p></div></div></TableCell><TableCell><Badge className="border-slate-700 bg-slate-800 text-[9px] text-slate-300 hover:bg-slate-800">{tenant.plan}</Badge></TableCell><TableCell className="text-[10px] text-slate-500">{new Date(tenant.createdAt).toLocaleDateString()}</TableCell><TableCell><span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${tenant.status === "Active" ? "text-emerald-400" : "text-rose-400"}`}><i className="size-1.5 rounded-full bg-current"/>{tenant.status}</span></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button size="icon" variant="ghost" className="size-8 text-slate-500 hover:bg-slate-800 hover:text-white"><MoreHorizontal className="size-4"/></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem onClick={() => toggleStatus(tenant)}>{tenant.status === "Active" ? "Suspend tenant" : "Reactivate tenant"}</DropdownMenuItem><DropdownMenuItem>Manage subscription</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}</TableBody></Table></div></article>

          <article className="rounded-2xl border border-slate-800 bg-[#0b1626] p-4 md:p-5"><div className="mb-5 flex items-center justify-between"><div><p className="text-sm font-bold">Platform activity</p><p className="mt-1 text-[10px] text-slate-500">Latest workspace events</p></div><Activity className="size-4 text-cyan-300" /></div><div className="space-y-1">{tenants.slice(0, 6).map((tenant,index)=><div key={tenant.id} className="flex gap-3 border-b border-slate-800/70 py-3 last:border-0"><span className={`mt-1.5 size-2 shrink-0 rounded-full ${index === 0 ? "bg-cyan-400 shadow-[0_0_10px_#22d3ee]" : "bg-slate-700"}`}/><div className="min-w-0 flex-1"><p className="text-xs leading-5 text-slate-300"><b className="text-white">{tenant.name}</b> {index % 2 ? "workspace synchronized" : "joined the platform"}</p><p className="mt-1 text-[9px] text-slate-600">{new Date(tenant.createdAt).toLocaleDateString()} • {tenant.plan} plan</p></div></div>)}{!tenants.length && <div className="py-16 text-center"><Globe2 className="mx-auto size-7 text-slate-700"/><p className="mt-3 text-xs text-slate-600">Activity appears as tenants join.</p></div>}</div><div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3"><UserRoundCheck className="size-4 text-emerald-300"/><p className="text-[10px] text-slate-400"><b className="text-slate-200">{users.length} users</b> currently provisioned across the platform.</p></div></article>
        </section>
      </div>
    </div>
  )
}
