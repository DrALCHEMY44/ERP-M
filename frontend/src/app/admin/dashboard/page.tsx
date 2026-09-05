"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity, Archive, BarChart3, Building2, ChevronLeft, ChevronRight,
  CircleDollarSign, CreditCard, Download, FileText, Headphones, Loader2,
  MoreHorizontal, Plus, RefreshCw, Search, ShieldCheck, Sparkles,
  TrendingUp, UserCog, Users, XCircle,
} from "lucide-react"
import {
  Area, Bar, CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"

import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useNeonData } from "@/hooks/use-neon-data"
import { useToast } from "@/hooks/use-toast"
import { authClient } from "@/lib/auth/client"
import {
  addPlatformTenantNote, createPlatformSupportCase, createPlatformTenant,
  createSaaSInvoice, platformOverviewQuery, platformTenantDetailsQuery,
  publishPlatformAnnouncement, recordSaaSPayment, revokePlatformUserSessions,
  updatePlatformSupportCase, updatePlatformTenant, updatePlatformUser,
  updateSaaSPlan, voidSaaSInvoice,
} from "@/lib/platform-service"
import type {
  PlatformOverview, PlatformSupportCase, PlatformTenant, PlatformTenantDetails,
  PlatformUser, SaaSInvoice, SaaSPlan, SaaSPlanCode,
} from "@/lib/platform-types"

const roles = [
  "Platform Super Admin", "Business Owner", "Manager", "Accountant", "HR Officer", "Staff", "Viewer",
] as const
const plans: SaaSPlanCode[] = ["Basic", "Premium", "Enterprise"]

const money = (value: number) => `${new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value)} FCFA`
const compact = (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
const dateTime = (value: string | null) => value ? new Date(value).toLocaleString() : "Never"
const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`

const planTone: Record<SaaSPlanCode, string> = {
  Basic: "bg-sky-50 text-sky-700 ring-sky-100",
  Premium: "bg-violet-50 text-violet-700 ring-violet-100",
  Enterprise: "bg-emerald-50 text-emerald-700 ring-emerald-100",
}

function downloadText(filename: string, contents: string, type: string) {
  const href = URL.createObjectURL(new Blob([contents], { type }))
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  link.click()
  URL.revokeObjectURL(href)
}

function StatusBadge({ status }: { status: string }) {
  const tone = ["Active", "active", "paid", "resolved"].includes(status)
    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
    : ["Suspended", "past_due", "uncollectible", "urgent"].includes(status)
      ? "bg-rose-50 text-rose-700 ring-rose-100"
      : ["open", "in_progress", "trialing"].includes(status)
        ? "bg-amber-50 text-amber-700 ring-amber-100"
        : "bg-slate-100 text-slate-600 ring-slate-200"
  return <Badge className={`border-0 capitalize ring-1 ${tone}`}>{status.replaceAll("_", " ")}</Badge>
}

function MetricCard({ label, value, detail, icon }: {
  label: string
  value: string
  detail: string
  icon: typeof Users
}) {
  return <StatCard title={label} value={value} description={detail} icon={icon} />
}

function Empty({ icon: Icon, title, copy }: { icon: React.ComponentType<{ className?: string }>; title: string; copy: string }) {
  return <div className="flex min-h-40 flex-col items-center justify-center p-8 text-center"><Icon className="size-8 text-slate-200" /><p className="mt-3 text-sm font-bold text-slate-600">{title}</p><p className="mt-1 text-xs text-slate-500">{copy}</p></div>
}

type RunAction = (key: string, action: () => Promise<unknown>, success: string) => void

function UserActions({ user, pending, run, sendReset }: { user: PlatformUser; pending: boolean; run: RunAction; sendReset: (user: PlatformUser) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" disabled={pending} aria-label={`Actions for ${user.email}`}>{pending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => run(`user:${user.id}`, () => updatePlatformUser({ id: user.id, status: user.status === "Active" ? "Suspended" : "Active" }), user.status === "Active" ? "User suspended" : "User reactivated")}>{user.status === "Active" ? "Suspend account" : "Reactivate account"}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => run(`sessions:${user.id}`, () => revokePlatformUserSessions(user.id), "Active employee sessions revoked")}>Revoke sessions</DropdownMenuItem>
        <DropdownMenuItem disabled={!user.authLinked} onClick={() => sendReset(user)}>Send password reset</DropdownMenuItem>
        <DropdownMenuSeparator />
        {roles.map((role) => <DropdownMenuItem key={role} disabled={user.role === role} onClick={() => run(`user:${user.id}`, () => updatePlatformUser({ id: user.id, role }), `Role changed to ${role}`)}>Set {role}</DropdownMenuItem>)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function InvoiceActions({ invoice, pending, run }: { invoice: SaaSInvoice; pending: boolean; run: RunAction }) {
  const remaining = invoice.amountDueFcfa - invoice.amountPaidFcfa
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="size-8" disabled={pending}>{pending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}</Button></DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem disabled={remaining <= 0 || invoice.status === "void"} onClick={() => {
          const requested = window.prompt("Payment amount in FCFA", String(remaining))
          if (!requested) return
          run(`invoice:${invoice.id}`, () => recordSaaSPayment({ invoiceId: invoice.id, amountFcfa: Number(requested), method: "manual" }), "Payment recorded")
        }}>Record payment</DropdownMenuItem>
        <DropdownMenuItem disabled={["paid", "void"].includes(invoice.status)} onClick={() => { if (window.confirm(`Void ${invoice.invoiceNumber}?`)) run(`invoice:${invoice.id}`, () => voidSaaSInvoice(invoice.id), "Invoice voided") }}>Void invoice</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function SuperAdminDashboard() {
  const { loading: authLoading, profile } = useAuth()
  const { toast } = useToast()
  const [tab, setTab] = React.useState("overview")
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [planFilter, setPlanFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sort, setSort] = React.useState("newest")
  const [page, setPage] = React.useState(1)
  const [pending, setPending] = React.useState<string | null>(null)
  const [refreshing, setRefreshing] = React.useState(false)
  const [selectedTenantId, setSelectedTenantId] = React.useState<string | null>(null)
  const [createOpen, setCreateOpen] = React.useState(false)
  const [userSearch, setUserSearch] = React.useState("")

  React.useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search), 300); return () => window.clearTimeout(timer) }, [search])
  React.useEffect(() => setPage(1), [debouncedSearch, planFilter, statusFilter, sort])

  const variables = React.useMemo(() => ({ search: debouncedSearch, plan: planFilter, status: statusFilter, sort, page, pageSize: 10 }), [debouncedSearch, planFilter, statusFilter, sort, page])
  const { data: overview, loading, error, refetch: refetchOverview } = useNeonData<PlatformOverview>({ query: platformOverviewQuery, variables, refreshInterval: 15000 })
  const detailVariables = React.useMemo(() => selectedTenantId ? { id: selectedTenantId } : {}, [selectedTenantId])
  const { data: rawDetails, loading: detailsLoading, refetch: refetchDetails } = useNeonData<PlatformTenantDetails>({ query: platformTenantDetailsQuery, variables: detailVariables, skip: !selectedTenantId })
  const details = rawDetails?.tenant.id === selectedTenantId ? rawDetails : null

  const run = React.useCallback(async (key: string, action: () => Promise<unknown>, success: string) => {
    setPending(key)
    try {
      await action()
      await Promise.all([refetchOverview(), selectedTenantId ? refetchDetails() : Promise.resolve()])
      toast({ title: success })
    } catch (failure) {
      toast({ variant: "destructive", title: "Action failed", description: failure instanceof Error ? failure.message : "Please retry" })
    } finally { setPending(null) }
  }, [refetchDetails, refetchOverview, selectedTenantId, toast])

  const refresh = async () => { setRefreshing(true); await Promise.all([refetchOverview(), selectedTenantId ? refetchDetails() : Promise.resolve()]); setRefreshing(false) }

  const sendReset = async (user: PlatformUser) => {
    setPending(`reset:${user.id}`)
    try {
      const result = await authClient.requestPasswordReset({ email: user.email, redirectTo: `${window.location.origin}/reset-password` })
      if (result.error) throw new Error(result.error.message)
      toast({ title: "Password reset sent", description: `Instructions were sent to ${user.email}.` })
    } catch (failure) {
      toast({ variant: "destructive", title: "Reset failed", description: failure instanceof Error ? failure.message : "Please retry" })
    } finally { setPending(null) }
  }

  const changeTenantStatus = (tenant: PlatformTenant) => {
    if (tenant.status === "Archived") {
      if (window.confirm(`Restore ${tenant.name}?`)) run(`tenant:${tenant.id}`, () => updatePlatformTenant({ id: tenant.id, lifecycle: "restore" }), "Workspace restored")
      return
    }
    if (tenant.status === "Active") {
      const suspensionReason = window.prompt(`Why are you suspending ${tenant.name}?`, "Administrative review")
      if (suspensionReason == null) return
      run(`tenant:${tenant.id}`, () => updatePlatformTenant({ id: tenant.id, status: "Suspended", suspensionReason }), "Workspace suspended and access blocked")
    } else run(`tenant:${tenant.id}`, () => updatePlatformTenant({ id: tenant.id, status: "Active" }), "Workspace reactivated")
  }

  const editTenant = (tenant: PlatformTenant) => {
    const name = window.prompt("Workspace name", tenant.name); if (name == null) return
    const businessSector = window.prompt("Business sector", tenant.businessSector); if (businessSector == null) return
    const location = window.prompt("Location", tenant.location); if (location == null) return
    const ownerEmail = window.prompt("Owner contact email", tenant.ownerEmail); if (ownerEmail == null) return
    run(`tenant:${tenant.id}`, () => updatePlatformTenant({ id: tenant.id, name, businessSector, location, ownerEmail }), "Workspace details updated")
  }

  const editPlan = (plan: SaaSPlan) => {
    const askAmount = (label: string, current: number) => {
      const value = window.prompt(label, String(current)); return value == null ? undefined : Number(value)
    }
    const askLimit = (label: string, current: number | null) => {
      const value = window.prompt(`${label} (blank means unlimited)`, current == null ? "" : String(current))
      return value == null ? undefined : value.trim() === "" ? null : Number(value)
    }
    const monthlyPriceFcfa = askAmount("Monthly price in FCFA", plan.monthlyPriceFcfa); if (monthlyPriceFcfa === undefined) return
    const annualPriceFcfa = askAmount("Annual price in FCFA", plan.annualPriceFcfa); if (annualPriceFcfa === undefined) return
    const maxUsers = askLimit("Maximum users", plan.maxUsers); if (maxUsers === undefined) return
    const maxBusinesses = askLimit("Maximum businesses", plan.maxBusinesses); if (maxBusinesses === undefined) return
    const maxDocuments = askLimit("Maximum documents", plan.maxDocuments); if (maxDocuments === undefined) return
    const monthlyAiRequests = askLimit("Monthly AI requests", plan.monthlyAiRequests); if (monthlyAiRequests === undefined) return
    run(`plan:${plan.code}`, () => updateSaaSPlan({ code: plan.code, monthlyPriceFcfa, annualPriceFcfa, maxUsers, maxBusinesses, maxDocuments, monthlyAiRequests }), `${plan.code} plan updated`)
  }

  const exportTenants = async () => {
    setPending("export")
    try {
      let exportPage = 1; let rows: PlatformTenant[] = []; let total = 0
      do {
        const result = await platformOverviewQuery({ ...variables, page: exportPage, pageSize: 50 }) as { data: PlatformOverview }
        rows = rows.concat(result.data.tenants); total = result.data.tenantTotal; exportPage += 1
      } while (rows.length < total && exportPage <= 100)
      const csv = [["Workspace", "Owner", "Sector", "Location", "Plan", "Access", "Subscription", "Users", "Businesses", "Documents", "AI requests", "Created"], ...rows.map((tenant) => [tenant.name, tenant.ownerEmail, tenant.businessSector, tenant.location, tenant.plan, tenant.status, tenant.subscriptionStatus, tenant.userCount, tenant.businessCount, tenant.documentCount, tenant.aiRequestsThisMonth, tenant.createdAt])].map((row) => row.map(csvCell).join(",")).join("\n")
      downloadText(`smarterp-workspaces-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8")
      toast({ title: "Workspace export ready", description: `${rows.length} records exported.` })
    } catch (failure) { toast({ variant: "destructive", title: "Export failed", description: failure instanceof Error ? failure.message : "Please retry" }) } finally { setPending(null) }
  }

  const exportTenantDetails = async (tenant: PlatformTenant) => {
    setPending(`export:${tenant.id}`)
    try {
      const result = await platformTenantDetailsQuery({ id: tenant.id }) as { data: PlatformTenantDetails }
      downloadText(`${tenant.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-control-data.json`, JSON.stringify(result.data, null, 2), "application/json")
      toast({ title: "Workspace control data exported" })
    } catch (failure) { toast({ variant: "destructive", title: "Export failed", description: failure instanceof Error ? failure.message : "Please retry" }) } finally { setPending(null) }
  }

  if (authLoading || loading && !overview) return <div className="grid min-h-[75vh] place-items-center bg-background"><Loader2 className="size-8 animate-spin text-primary" /></div>
  if (!overview) return <div className="grid min-h-[75vh] place-items-center bg-background p-6"><div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-xl"><XCircle className="mx-auto size-10 text-rose-500" /><h1 className="mt-4 text-lg font-semibold text-slate-800">Platform overview unavailable</h1><p className="mt-2 text-sm text-slate-500">{error?.message || "The platform overview could not be loaded."}</p><Button onClick={() => void refetchOverview()} className="mt-5">Try again</Button></div></div>

  const pageCount = Math.max(1, Math.ceil(overview.tenantTotal / overview.pageSize))
  const paidConversion = overview.totals.tenants ? Math.round(overview.totals.paidTenants / overview.totals.tenants * 100) : 0
  const filteredUsers = overview.users.filter((user) => `${user.fullName} ${user.email} ${user.tenantName} ${user.role}`.toLowerCase().includes(userSearch.toLowerCase()))

  return (
    <div className="space-y-6 text-slate-700">
      <header className="border-b border-slate-200 pb-6"><div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between"><div className="flex items-center gap-3"><div><p className="text-xs font-semibold tracking-normal text-primary">Platform administration</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Platform overview</h1><p className="text-xs text-slate-500">Signed in as {profile?.email || "Platform Super Admin"} · refreshed {dateTime(overview.generatedAt)}</p></div></div><div className="flex flex-wrap gap-2"><Button asChild variant="outline" className="rounded-xl"><Link href="/admin/users"><Users className="mr-2 size-4" />Manage users</Link></Button><Button variant="outline" onClick={() => void refresh()} disabled={refreshing} className="rounded-xl"><RefreshCw className={`mr-2 size-4 ${refreshing ? "animate-spin" : ""}`} />Refresh</Button><Button variant="outline" onClick={() => void exportTenants()} disabled={pending === "export"} className="rounded-xl"><Download className="mr-2 size-4" />Export</Button><Button onClick={() => setCreateOpen(true)} className="rounded-xl bg-primary hover:bg-primary/90"><Plus className="mr-2 size-4" />New workspace</Button></div></div></header>

      <div className="space-y-6">
        {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">Refresh warning: {error.message}. Showing the last successful snapshot.</div>}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Actual MRR" value={money(overview.totals.mrrFcfa)} detail={`${paidConversion}% paid conversion`} icon={CircleDollarSign} />
          <MetricCard label="Collected · 30 days" value={money(overview.totals.collected30dFcfa)} detail={`${money(overview.totals.outstandingFcfa)} outstanding`} icon={TrendingUp} />
          <MetricCard label="Workspaces" value={compact(overview.totals.tenants)} detail={`${overview.totals.activeTenants} active · ${overview.totals.suspendedTenants} suspended`} icon={Building2} />
          <MetricCard label="Active users · 30 days" value={compact(overview.totals.activeUsers30d)} detail={`${overview.totals.users} registered platform users`} icon={Users} />
        </section>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none border-b bg-transparent p-0 pb-2 shadow-none"><TabsTrigger value="overview" className="rounded-lg px-4 py-2.5 text-sm"><BarChart3 className="mr-2 size-4" />Overview</TabsTrigger><TabsTrigger value="workspaces" className="rounded-lg px-4 py-2.5 text-sm"><Building2 className="mr-2 size-4" />Workspaces</TabsTrigger><TabsTrigger value="users" className="rounded-lg px-4 py-2.5 text-sm"><UserCog className="mr-2 size-4" />Users</TabsTrigger><TabsTrigger value="billing" className="rounded-lg px-4 py-2.5 text-sm"><CreditCard className="mr-2 size-4" />Billing</TabsTrigger><TabsTrigger value="support" className="rounded-lg px-4 py-2.5 text-sm"><Headphones className="mr-2 size-4" />Support</TabsTrigger><TabsTrigger value="audit" className="rounded-lg px-4 py-2.5 text-sm"><ShieldCheck className="mr-2 size-4" />Audit</TabsTrigger></TabsList>

          <TabsContent value="overview" className="mt-5 space-y-5">
            <section className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-none"><div className="flex items-start justify-between"><div><h2 className="text-sm font-semibold text-[#17223b]">Collected revenue</h2><p className="mt-1 text-xs text-slate-500">Recorded SaaS payments and workspace growth</p></div><Badge variant="outline">Last 6 months</Badge></div><div className="mt-5 h-72"><ResponsiveContainer width="100%" height="100%"><ComposedChart data={overview.trend} margin={{ left: 0, right: 8, top: 10, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2256c3" stopOpacity={0.32} /><stop offset="100%" stopColor="#2256c3" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid stroke="#eef2f7" vertical={false} /><XAxis dataKey="month" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} /><YAxis yAxisId="money" tickFormatter={compact} tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={42} /><YAxis yAxisId="workspaces" orientation="right" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={28} /><Tooltip formatter={(value, name) => name === "collectedFcfa" ? [money(Number(value)), "Collected"] : [value, "Workspaces"]} contentStyle={{ borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 11 }} /><Area yAxisId="money" type="monotone" dataKey="collectedFcfa" stroke="#2256c3" fill="url(#revenueFill)" strokeWidth={2.5} /><Bar yAxisId="workspaces" dataKey="workspaces" fill="#64748b" opacity={0.65} radius={[4, 4, 0, 0]} barSize={13} /></ComposedChart></ResponsiveContainer></div></article>
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-none"><h2 className="text-sm font-semibold text-[#17223b]">Platform operations</h2><p className="mt-1 text-xs text-slate-500">Current service and workload signals</p><div className="mt-5 space-y-3">{[
                { label: "Neon database", value: overview.databaseHealthy ? "Healthy" : "Unavailable", icon: Activity, ok: overview.databaseHealthy },
                { label: "Failed background jobs", value: String(overview.totals.failedJobs), icon: RefreshCw, ok: overview.totals.failedJobs === 0 },
                { label: "Open support cases", value: String(overview.totals.openSupportCases), icon: Headphones, ok: overview.totals.openSupportCases === 0 },
                { label: "Documents stored", value: compact(overview.totals.documents), icon: FileText, ok: true },
                { label: "AI requests this month", value: compact(overview.totals.aiRequestsThisMonth), icon: Sparkles, ok: true },
              ].map(({ label, value, icon: Icon, ok }) => <div key={label} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"><span className={`grid size-8 place-items-center rounded-xl ${ok ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}><Icon className="size-4" /></span><p className="flex-1 text-xs font-bold text-slate-600">{label}</p><span className="text-xs font-semibold text-slate-700">{value}</span></div>)}</div></article>
            </section>
            <section className="grid gap-5 lg:grid-cols-3">{overview.plans.map((plan) => <article key={plan.code} className="rounded-xl border border-slate-200 bg-white p-5 shadow-none"><div className="flex items-center justify-between"><Badge className={`border-0 ring-1 ${planTone[plan.code]}`}>{plan.displayName}</Badge><p className="text-sm font-semibold text-slate-700">{money(plan.monthlyPriceFcfa)}<span className="text-xs font-normal text-slate-500"> / mo</span></p></div><div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500"><p><b className="text-slate-700">{plan.maxUsers ?? "Unlimited"}</b> users</p><p><b className="text-slate-700">{plan.maxBusinesses ?? "Unlimited"}</b> businesses</p><p><b className="text-slate-700">{plan.maxDocuments ?? "Unlimited"}</b> documents</p><p><b className="text-slate-700">{plan.monthlyAiRequests ?? "Unlimited"}</b> AI / month</p></div><Button variant="outline" size="sm" className="mt-4 w-full" disabled={pending === `plan:${plan.code}`} onClick={() => editPlan(plan)}>{pending === `plan:${plan.code}` && <Loader2 className="mr-2 size-3.5 animate-spin" />}Configure plan</Button></article>)}</section>
          </TabsContent>

          <TabsContent value="workspaces" className="mt-5"><WorkspaceTable overview={overview} search={search} setSearch={setSearch} planFilter={planFilter} setPlanFilter={setPlanFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} sort={sort} setSort={setSort} page={page} pageCount={pageCount} setPage={setPage} pending={pending} run={run} editTenant={editTenant} changeTenantStatus={changeTenantStatus} selectTenant={setSelectedTenantId} exportTenantDetails={exportTenantDetails} /></TabsContent>

          <TabsContent value="users" className="mt-5"><article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-none"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-sm font-semibold text-[#17223b]">Platform user administration</h2><p className="mt-1 text-xs text-slate-500">Roles, account access, sessions, login activity, and password recovery</p></div><div className="relative"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-300" /><Input value={userSearch} onChange={(event) => setUserSearch(event.target.value)} placeholder="Search users…" className="h-9 rounded-xl pl-9 text-xs sm:w-72" /></div></div><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-slate-50/60"><TableHead>User</TableHead><TableHead>Workspace</TableHead><TableHead>Role</TableHead><TableHead>Last login</TableHead><TableHead>Sessions</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{filteredUsers.map((user) => <TableRow key={user.id}><TableCell><p className="font-bold text-slate-700">{user.fullName || "Unnamed user"}</p><p className="text-xs text-slate-500">{user.email} · {user.authLinked ? "Auth linked" : "Invite pending"}</p></TableCell><TableCell className="text-xs text-slate-600">{user.tenantName}</TableCell><TableCell><Badge variant="outline">{user.role}</Badge></TableCell><TableCell className="text-xs text-slate-500">{dateTime(user.lastLoginAt)}</TableCell><TableCell className="text-xs font-bold">{user.activeSessions}</TableCell><TableCell><StatusBadge status={user.status} /></TableCell><TableCell><UserActions user={user} pending={pending?.includes(user.id) ?? false} run={run} sendReset={sendReset} /></TableCell></TableRow>)}{!filteredUsers.length && <TableRow><TableCell colSpan={7}><Empty icon={Users} title="No users found" copy="Try a different user search." /></TableCell></TableRow>}</TableBody></Table></div></article></TabsContent>

          <TabsContent value="billing" className="mt-5 space-y-5"><InvoiceComposer tenants={overview.tenantOptions} run={run} /><InvoiceTable invoices={overview.invoices} pending={pending} run={run} /></TabsContent>
          <TabsContent value="support" className="mt-5 space-y-5"><AnnouncementComposer tenants={overview.tenantOptions} run={run} /><SupportComposer tenants={overview.tenantOptions} run={run} /><SupportTable cases={overview.supportCases} pending={pending} run={run} /></TabsContent>
          <TabsContent value="audit" className="mt-5"><AuditTable entries={overview.audit} /></TabsContent>
        </Tabs>
      </div>

      <CreateWorkspaceDialog open={createOpen} onOpenChange={setCreateOpen} pending={pending === "create-workspace"} run={run} />
      <TenantDetailsDialog details={details} loading={detailsLoading} open={Boolean(selectedTenantId)} onOpenChange={(open) => { if (!open) setSelectedTenantId(null) }} pending={pending} run={run} sendReset={sendReset} changeStatus={changeTenantStatus} />
    </div>
  )
}

function WorkspaceTable({ overview, search, setSearch, planFilter, setPlanFilter, statusFilter, setStatusFilter, sort, setSort, page, pageCount, setPage, pending, run, editTenant, changeTenantStatus, selectTenant, exportTenantDetails }: {
  overview: PlatformOverview; search: string; setSearch: (value: string) => void; planFilter: string; setPlanFilter: (value: string) => void; statusFilter: string; setStatusFilter: (value: string) => void; sort: string; setSort: (value: string) => void; page: number; pageCount: number; setPage: React.Dispatch<React.SetStateAction<number>>; pending: string | null; run: RunAction; editTenant: (tenant: PlatformTenant) => void; changeTenantStatus: (tenant: PlatformTenant) => void; selectTenant: (id: string) => void; exportTenantDetails: (tenant: PlatformTenant) => Promise<void>
}) {
  return <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-none"><div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between"><div><h2 className="text-sm font-semibold text-[#17223b]">Workspace directory</h2><p className="mt-1 text-xs text-slate-500">Search, filter, manage access, subscriptions, lifecycle, and exports</p></div><div className="grid gap-2 sm:grid-cols-2 xl:flex"><div className="relative"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-300" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, owner, sector…" className="h-9 rounded-xl pl-9 text-xs xl:w-60" /></div><Select value={planFilter} onValueChange={setPlanFilter}><SelectTrigger className="h-9 rounded-xl text-xs xl:w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All plans</SelectItem>{plans.map((plan) => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}</SelectContent></Select><Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="h-9 rounded-xl text-xs xl:w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All access</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Suspended">Suspended</SelectItem><SelectItem value="Archived">Archived</SelectItem></SelectContent></Select><Select value={sort} onValueChange={setSort}><SelectTrigger className="h-9 rounded-xl text-xs xl:w-36"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest</SelectItem><SelectItem value="oldest">Oldest</SelectItem><SelectItem value="name">Name</SelectItem><SelectItem value="value">Plan value</SelectItem></SelectContent></Select></div></div><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-slate-50/60"><TableHead>Workspace</TableHead><TableHead>Plan</TableHead><TableHead>Usage</TableHead><TableHead>Last activity</TableHead><TableHead>Access</TableHead><TableHead /></TableRow></TableHeader><TableBody>{overview.tenants.map((tenant) => <TableRow key={tenant.id} className="hover:bg-sky-50/40"><TableCell><button className="text-left" onClick={() => selectTenant(tenant.id)}><p className="font-bold text-slate-700 hover:text-cyan-700">{tenant.name}</p><p className="mt-0.5 text-xs text-slate-500">{tenant.ownerEmail} · {tenant.businessSector}</p></button></TableCell><TableCell><div className="space-y-1"><Badge className={`border-0 ring-1 ${planTone[tenant.plan]}`}>{tenant.plan}</Badge><p className="text-xs capitalize text-slate-500">{tenant.subscriptionStatus} · {tenant.billingInterval}</p></div></TableCell><TableCell><p className="text-xs font-medium text-slate-600">{tenant.userCount} users · {tenant.businessCount} businesses</p><p className="text-xs text-slate-500">{tenant.documentCount} docs · {tenant.aiRequestsThisMonth} AI requests</p></TableCell><TableCell className="text-xs text-slate-500">{dateTime(tenant.lastActivityAt)}</TableCell><TableCell><StatusBadge status={tenant.status} /></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" disabled={pending?.includes(tenant.id)}>{pending?.includes(tenant.id) ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuItem onClick={() => selectTenant(tenant.id)}>View control record</DropdownMenuItem><DropdownMenuItem onClick={() => editTenant(tenant)}>Edit workspace details</DropdownMenuItem><DropdownMenuItem onClick={() => void exportTenantDetails(tenant)}>Export control data</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => changeTenantStatus(tenant)}>{tenant.status === "Active" ? "Suspend and block access" : tenant.status === "Archived" ? "Restore workspace" : "Reactivate workspace"}</DropdownMenuItem>{plans.map((plan) => <DropdownMenuItem key={plan} disabled={tenant.plan === plan} onClick={() => run(`tenant:${tenant.id}`, () => updatePlatformTenant({ id: tenant.id, plan }), `Plan changed to ${plan}`)}>Set {plan} plan</DropdownMenuItem>)}<DropdownMenuSeparator />{tenant.status !== "Archived" && <DropdownMenuItem className="text-rose-600" onClick={() => { if (window.confirm(`Archive ${tenant.name}? Access and active sessions will be revoked.`)) run(`tenant:${tenant.id}`, () => updatePlatformTenant({ id: tenant.id, lifecycle: "archive", suspensionReason: "Archived by platform administrator" }), "Workspace archived") }}><Archive className="mr-2 size-4" />Archive workspace</DropdownMenuItem>}</DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}{!overview.tenants.length && <TableRow><TableCell colSpan={6}><Empty icon={Building2} title="No workspaces found" copy="Change the filters or create a workspace." /></TableCell></TableRow>}</TableBody></Table></div><div className="flex items-center justify-between border-t border-slate-100 px-4 py-3"><p className="text-xs text-slate-500">{overview.tenantTotal} matching workspaces · page {page} of {pageCount}</p><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}><ChevronLeft className="size-4" /></Button><Button size="sm" variant="outline" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}><ChevronRight className="size-4" /></Button></div></div></article>
}

function InvoiceComposer({ tenants, run }: { tenants: Array<{ id: string; name: string }>; run: RunAction }) {
  const [tenantId, setTenantId] = React.useState(tenants[0]?.id || ""); const [amount, setAmount] = React.useState(""); const [dueAt, setDueAt] = React.useState(""); const [description, setDescription] = React.useState("")
  React.useEffect(() => { if (!tenantId && tenants[0]) setTenantId(tenants[0].id) }, [tenantId, tenants])
  const submit = () => { const amountFcfa = Number(amount); if (!tenantId || !Number.isFinite(amountFcfa) || amountFcfa <= 0) return; run("invoice:create", () => createSaaSInvoice({ tenantId, amountFcfa, dueAt: dueAt ? new Date(`${dueAt}T23:59:59`).toISOString() : null, description: description || null }), "Subscription invoice created"); setAmount(""); setDueAt(""); setDescription("") }
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-none"><div className="flex items-center gap-2"><CircleDollarSign className="size-5 text-primary" /><div><h2 className="text-sm font-semibold text-[#17223b]">Create invoice</h2><p className="text-xs text-slate-500">Record subscription receivables without mixing them into tenant accounting</p></div></div><div className="mt-4 grid gap-3 md:grid-cols-4"><Select value={tenantId} onValueChange={setTenantId}><SelectTrigger><SelectValue placeholder="Workspace" /></SelectTrigger><SelectContent>{tenants.map((tenant) => <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>)}</SelectContent></Select><Input type="number" min="1" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Amount FCFA" /><Input type="date" value={dueAt} onChange={(event) => setDueAt(event.target.value)} /><Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" /></div><Button onClick={submit} disabled={!tenantId || Number(amount) <= 0} className="mt-3"><Plus className="mr-2 size-4" />Create invoice</Button></article>
}

function InvoiceTable({ invoices, pending, run }: { invoices: SaaSInvoice[]; pending: string | null; run: RunAction }) {
  return <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-none"><div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h2 className="text-sm font-semibold text-[#17223b]">Subscription invoices</h2><p className="mt-1 text-xs text-slate-500">Manual/provider-ready invoices and collected payments</p></div><Badge variant="outline">XAF · manual mode</Badge></div><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-slate-50/60"><TableHead>Invoice</TableHead><TableHead>Workspace</TableHead><TableHead>Due</TableHead><TableHead>Paid</TableHead><TableHead>Due date</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{invoices.map((invoice) => <TableRow key={invoice.id}><TableCell><p className="font-bold text-slate-700">{invoice.invoiceNumber}</p><p className="max-w-60 truncate text-xs text-slate-500">{invoice.description || "Subscription charge"}</p></TableCell><TableCell className="text-xs">{invoice.tenantName}</TableCell><TableCell className="text-xs font-bold">{money(invoice.amountDueFcfa)}</TableCell><TableCell className="text-xs text-emerald-600">{money(invoice.amountPaidFcfa)}</TableCell><TableCell className="text-xs text-slate-500">{dateTime(invoice.dueAt)}</TableCell><TableCell><StatusBadge status={invoice.status} /></TableCell><TableCell><InvoiceActions invoice={invoice} pending={pending?.includes(invoice.id) ?? false} run={run} /></TableCell></TableRow>)}{!invoices.length && <TableRow><TableCell colSpan={7}><Empty icon={CreditCard} title="No subscription invoices" copy="Create an invoice above to start tracking collections." /></TableCell></TableRow>}</TableBody></Table></div></article>
}

function AnnouncementComposer({ tenants, run }: { tenants: Array<{ id: string; name: string }>; run: RunAction }) {
  const [tenantId, setTenantId] = React.useState("all")
  const [title, setTitle] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [priority, setPriority] = React.useState<"NORMAL" | "IMPORTANT" | "URGENT">("NORMAL")
  const submit = () => {
    if (title.trim().length < 3 || message.trim().length < 3) return
    run("announcement:publish", () => publishPlatformAnnouncement({
      tenantId: tenantId === "all" ? null : tenantId, title, message, priority,
    }), tenantId === "all" ? "Platform announcement published" : "Tenant announcement published")
    setTitle(""); setMessage(""); setPriority("NORMAL")
  }
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-none"><div className="flex items-center gap-2"><Sparkles className="size-5 text-primary" /><div><h2 className="text-sm font-semibold text-[#17223b]">Publish announcement</h2><p className="text-xs text-slate-500">Send an in-app update to one workspace or every active workspace</p></div></div><div className="mt-4 grid gap-3 md:grid-cols-3"><Select value={tenantId} onValueChange={setTenantId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All active workspaces</SelectItem>{tenants.map((tenant) => <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>)}</SelectContent></Select><Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Announcement title" /><Select value={priority} onValueChange={(value) => setPriority(value as typeof priority)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="NORMAL">Normal</SelectItem><SelectItem value="IMPORTANT">Important</SelectItem><SelectItem value="URGENT">Urgent</SelectItem></SelectContent></Select></div><Textarea className="mt-3" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write the platform update…" /><Button onClick={submit} disabled={title.trim().length < 3 || message.trim().length < 3} className="mt-3"><Plus className="mr-2 size-4" />Publish announcement</Button></article>
}

function SupportComposer({ tenants, run }: { tenants: Array<{ id: string; name: string }>; run: RunAction }) {
  const [tenantId, setTenantId] = React.useState(tenants[0]?.id || ""); const [subject, setSubject] = React.useState(""); const [description, setDescription] = React.useState(""); const [priority, setPriority] = React.useState<PlatformSupportCase["priority"]>("normal")
  React.useEffect(() => { if (!tenantId && tenants[0]) setTenantId(tenants[0].id) }, [tenantId, tenants])
  const submit = () => { if (!tenantId || !subject.trim()) return; run("support:create", () => createPlatformSupportCase({ tenantId, subject, description: description || null, priority }), "Support case created"); setSubject(""); setDescription(""); setPriority("normal") }
  return <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-none"><div className="flex items-center gap-2"><Headphones className="size-5 text-violet-600" /><div><h2 className="text-sm font-semibold text-[#17223b]">Open support case</h2><p className="text-xs text-slate-500">Track platform follow-up and operational assistance</p></div></div><div className="mt-4 grid gap-3 md:grid-cols-4"><Select value={tenantId} onValueChange={setTenantId}><SelectTrigger><SelectValue placeholder="Workspace" /></SelectTrigger><SelectContent>{tenants.map((tenant) => <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>)}</SelectContent></Select><Input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Case subject" /><Input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" /><Select value={priority} onValueChange={(value) => setPriority(value as PlatformSupportCase["priority"])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="normal">Normal</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div><Button onClick={submit} disabled={!tenantId || !subject.trim()} className="mt-3"><Plus className="mr-2 size-4" />Open case</Button></article>
}

function SupportActions({ supportCase, pending, run }: { supportCase: PlatformSupportCase; pending: boolean; run: RunAction }) {
  return <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" disabled={pending}>{pending ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}</Button></DropdownMenuTrigger><DropdownMenuContent align="end">{(["open", "in_progress", "resolved", "closed"] as const).map((status) => <DropdownMenuItem key={status} disabled={supportCase.status === status} onClick={() => run(`support:${supportCase.id}`, () => updatePlatformSupportCase({ id: supportCase.id, status }), `Support case marked ${status.replaceAll("_", " ")}`)}>Mark {status.replaceAll("_", " ")}</DropdownMenuItem>)}<DropdownMenuSeparator /><DropdownMenuItem onClick={() => { const assignedTo = window.prompt("Assign to email", supportCase.assignedTo || ""); if (assignedTo != null) run(`support:${supportCase.id}`, () => updatePlatformSupportCase({ id: supportCase.id, status: supportCase.status, assignedTo }), "Support owner updated") }}>Assign case</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
}

function SupportTable({ cases, pending, run }: { cases: PlatformSupportCase[]; pending: string | null; run: RunAction }) {
  return <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-none"><div className="border-b border-slate-100 p-4"><h2 className="text-sm font-semibold text-[#17223b]">Support queue</h2><p className="mt-1 text-xs text-slate-500">Internal platform cases, priority, ownership, and resolution status</p></div><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-slate-50/60"><TableHead>Case</TableHead><TableHead>Workspace</TableHead><TableHead>Priority</TableHead><TableHead>Assigned</TableHead><TableHead>Updated</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{cases.map((supportCase) => <TableRow key={supportCase.id}><TableCell><p className="font-bold text-slate-700">{supportCase.subject}</p><p className="max-w-72 truncate text-xs text-slate-500">{supportCase.description || "No description"}</p></TableCell><TableCell className="text-xs">{supportCase.tenantName}</TableCell><TableCell><StatusBadge status={supportCase.priority} /></TableCell><TableCell className="text-xs">{supportCase.assignedTo || "Unassigned"}</TableCell><TableCell className="text-xs">{dateTime(supportCase.updatedAt)}</TableCell><TableCell><StatusBadge status={supportCase.status} /></TableCell><TableCell><SupportActions supportCase={supportCase} pending={pending?.includes(supportCase.id) ?? false} run={run} /></TableCell></TableRow>)}{!cases.length && <TableRow><TableCell colSpan={7}><Empty icon={Headphones} title="Support queue is clear" copy="New internal cases will appear here." /></TableCell></TableRow>}</TableBody></Table></div></article>
}

function AuditTable({ entries }: { entries: PlatformOverview["audit"] }) {
  const exportAudit = () => { const csv = [["Time", "Actor", "Action", "Target type", "Target ID", "Details"], ...entries.map((entry) => [entry.createdAt, entry.actorEmail, entry.action, entry.targetType, entry.targetId, JSON.stringify(entry.details)])].map((row) => row.map(csvCell).join(",")).join("\n"); downloadText(`smarterp-platform-audit-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8") }
  return <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-none"><div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h2 className="text-sm font-semibold text-[#17223b]">Platform audit trail</h2><p className="mt-1 text-xs text-slate-500">Immutable administrative action history with actor and change details</p></div><Button variant="outline" size="sm" onClick={exportAudit}><Download className="mr-2 size-3.5" />Export</Button></div><div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-slate-50/60"><TableHead>Time</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Target</TableHead><TableHead>Details</TableHead></TableRow></TableHeader><TableBody>{entries.map((entry) => <TableRow key={entry.id}><TableCell className="whitespace-nowrap text-xs">{dateTime(entry.createdAt)}</TableCell><TableCell className="text-xs">{entry.actorEmail}</TableCell><TableCell><Badge variant="outline">{entry.action}</Badge></TableCell><TableCell><p className="text-xs font-bold">{entry.targetType}</p><p className="max-w-40 truncate text-xs text-slate-500">{entry.targetId}</p></TableCell><TableCell className="max-w-sm"><p className="truncate text-xs text-slate-500">{JSON.stringify(entry.details)}</p></TableCell></TableRow>)}{!entries.length && <TableRow><TableCell colSpan={5}><Empty icon={ShieldCheck} title="No platform changes yet" copy="Administrative actions will be recorded here." /></TableCell></TableRow>}</TableBody></Table></div></article>
}

function CreateWorkspaceDialog({ open, onOpenChange, pending, run }: { open: boolean; onOpenChange: (open: boolean) => void; pending: boolean; run: RunAction }) {
  const [form, setForm] = React.useState({ name: "", businessSector: "", location: "", ownerEmail: "", ownerName: "", plan: "Basic" as SaaSPlanCode })
  const valid = form.name.trim().length >= 2 && form.businessSector.trim().length >= 2 && form.location.trim().length >= 2 && form.ownerName.trim().length >= 2 && form.ownerEmail.includes("@")
  const submit = () => { if (!valid) return; run("create-workspace", async () => {
    const result = await createPlatformTenant(form) as { data: { ownerEmail: string; invitationToken: string } }
    const invitationLink = `${window.location.origin}/register?invite=${encodeURIComponent(result.data.invitationToken)}&email=${encodeURIComponent(result.data.ownerEmail)}`
    window.prompt("Copy this secure owner invitation link. It expires in 7 days.", invitationLink)
    onOpenChange(false)
    setForm({ name: "", businessSector: "", location: "", ownerEmail: "", ownerName: "", plan: "Basic" })
  }, "Workspace and secure owner invitation created") }
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Create a workspace</DialogTitle><DialogDescription>Creates the tenant, first business, owner profile, plan, accounting defaults, and a registration invitation for the owner email.</DialogDescription></DialogHeader><div className="grid gap-4 py-2 sm:grid-cols-2"><div className="space-y-1.5 sm:col-span-2"><Label>Workspace name</Label><Input value={form.name} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} /></div><div className="space-y-1.5"><Label>Business sector</Label><Input value={form.businessSector} onChange={(event) => setForm((value) => ({ ...value, businessSector: event.target.value }))} /></div><div className="space-y-1.5"><Label>Location</Label><Input value={form.location} onChange={(event) => setForm((value) => ({ ...value, location: event.target.value }))} /></div><div className="space-y-1.5"><Label>Owner name</Label><Input value={form.ownerName} onChange={(event) => setForm((value) => ({ ...value, ownerName: event.target.value }))} /></div><div className="space-y-1.5"><Label>Owner email</Label><Input type="email" value={form.ownerEmail} onChange={(event) => setForm((value) => ({ ...value, ownerEmail: event.target.value }))} /></div><div className="space-y-1.5 sm:col-span-2"><Label>Plan</Label><Select value={form.plan} onValueChange={(plan) => setForm((value) => ({ ...value, plan: plan as SaaSPlanCode }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{plans.map((plan) => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}</SelectContent></Select></div></div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={submit} disabled={!valid || pending}>{pending && <Loader2 className="mr-2 size-4 animate-spin" />}Create workspace</Button></DialogFooter></DialogContent></Dialog>
}

function TenantDetailsDialog({ details, loading, open, onOpenChange, pending, run, sendReset, changeStatus }: { details: PlatformTenantDetails | null; loading: boolean; open: boolean; onOpenChange: (open: boolean) => void; pending: string | null; run: RunAction; sendReset: (user: PlatformUser) => void; changeStatus: (tenant: PlatformTenant) => void }) {
  const [note, setNote] = React.useState("")
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto p-0"><DialogHeader className="border-b border-slate-100 p-6 pb-4">{details ? <><div className="flex flex-wrap items-center gap-2"><DialogTitle>{details.tenant.name}</DialogTitle><StatusBadge status={details.tenant.status} /><Badge className={`border-0 ring-1 ${planTone[details.tenant.plan]}`}>{details.tenant.plan}</Badge></div><DialogDescription>{details.tenant.ownerEmail} · {details.tenant.businessSector} · {details.tenant.location}</DialogDescription></> : <><DialogTitle>Workspace control record</DialogTitle><DialogDescription>Loading tenant configuration and activity.</DialogDescription></>}</DialogHeader>{loading && !details ? <div className="space-y-3 p-6">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-14" />)}</div> : details ? <div className="p-6"><div className="grid gap-3 sm:grid-cols-4">{[["Users", `${details.tenant.userCount} / ${details.plan.maxUsers ?? "∞"}`], ["Businesses", `${details.tenant.businessCount} / ${details.plan.maxBusinesses ?? "∞"}`], ["Documents", `${details.tenant.documentCount} / ${details.plan.maxDocuments ?? "∞"}`], ["AI this month", `${details.tenant.aiRequestsThisMonth} / ${details.plan.monthlyAiRequests ?? "∞"}`]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className="mt-1 text-lg font-semibold text-slate-700">{value}</p></div>)}</div><Tabs defaultValue="subscription" className="mt-5"><TabsList className="h-auto w-full justify-start overflow-x-auto"><TabsTrigger value="subscription">Subscription</TabsTrigger><TabsTrigger value="members">Members</TabsTrigger><TabsTrigger value="invoices">Invoices</TabsTrigger><TabsTrigger value="notes">Notes</TabsTrigger><TabsTrigger value="support">Support</TabsTrigger><TabsTrigger value="audit">Audit</TabsTrigger></TabsList>
    <TabsContent value="subscription" className="space-y-4 pt-3"><div className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl border p-4"><p className="text-xs font-semibold text-slate-700">Plan and billing</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><Select value={details.tenant.plan} onValueChange={(plan) => run(`tenant:${details.tenant.id}`, () => updatePlatformTenant({ id: details.tenant.id, plan }), `Plan changed to ${plan}`)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{plans.map((plan) => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}</SelectContent></Select><Select value={details.tenant.billingInterval} onValueChange={(billingInterval) => run(`tenant:${details.tenant.id}`, () => updatePlatformTenant({ id: details.tenant.id, billingInterval }), `Billing changed to ${billingInterval}`)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="annual">Annual</SelectItem></SelectContent></Select></div><p className="mt-3 text-xs text-slate-500">{money(details.tenant.amountFcfa)} · {details.tenant.subscriptionStatus} · period ends {dateTime(details.tenant.currentPeriodEnd)}</p><Button variant="outline" size="sm" className="mt-3" onClick={() => run(`tenant:${details.tenant.id}`, () => updatePlatformTenant({ id: details.tenant.id, cancelAtPeriodEnd: !details.tenant.cancelAtPeriodEnd }), details.tenant.cancelAtPeriodEnd ? "Cancellation removed" : "Subscription set to cancel at period end")}>{details.tenant.cancelAtPeriodEnd ? "Keep subscription" : "Cancel at period end"}</Button></div><div className="rounded-2xl border p-4"><p className="text-xs font-semibold text-slate-700">Access and lifecycle</p><p className="mt-2 text-xs text-slate-500">Suspension is enforced during authentication and every API request. Active employee sessions are revoked immediately.</p><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => changeStatus(details.tenant)}>{details.tenant.status === "Active" ? "Suspend access" : details.tenant.status === "Archived" ? "Restore" : "Reactivate"}</Button>{details.tenant.status !== "Archived" && <Button size="sm" variant="destructive" onClick={() => { if (window.confirm(`Archive ${details.tenant.name}?`)) run(`tenant:${details.tenant.id}`, () => updatePlatformTenant({ id: details.tenant.id, lifecycle: "archive" }), "Workspace archived") }}><Archive className="mr-2 size-3.5" />Archive</Button>}</div>{details.tenant.suspensionReason && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">{details.tenant.suspensionReason}</p>}</div></div></TabsContent>
    <TabsContent value="members" className="pt-3"><div className="overflow-x-auto rounded-2xl border"><Table><TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Last login</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{details.users.map((user) => <TableRow key={user.id}><TableCell><p className="font-bold">{user.fullName || "Unnamed"}</p><p className="text-xs text-slate-500">{user.email}</p></TableCell><TableCell><Badge variant="outline">{user.role}</Badge></TableCell><TableCell className="text-xs">{dateTime(user.lastLoginAt)}</TableCell><TableCell><StatusBadge status={user.status} /></TableCell><TableCell><UserActions user={user} pending={pending?.includes(user.id) ?? false} run={run} sendReset={sendReset} /></TableCell></TableRow>)}</TableBody></Table></div></TabsContent>
    <TabsContent value="invoices" className="pt-3"><div className="overflow-x-auto rounded-2xl border"><Table><TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Due</TableHead><TableHead>Paid</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{details.invoices.map((invoice) => <TableRow key={invoice.id}><TableCell>{invoice.invoiceNumber}</TableCell><TableCell>{money(invoice.amountDueFcfa)}</TableCell><TableCell>{money(invoice.amountPaidFcfa)}</TableCell><TableCell><StatusBadge status={invoice.status} /></TableCell><TableCell><InvoiceActions invoice={invoice} pending={pending?.includes(invoice.id) ?? false} run={run} /></TableCell></TableRow>)}{!details.invoices.length && <TableRow><TableCell colSpan={5}><Empty icon={CreditCard} title="No invoices" copy="Create one from the Billing tab." /></TableCell></TableRow>}</TableBody></Table></div></TabsContent>
    <TabsContent value="notes" className="space-y-3 pt-3"><div className="flex gap-2"><Textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add an internal tenant note…" /><Button disabled={!note.trim() || pending === `note:${details.tenant.id}`} onClick={() => { const body = note; setNote(""); run(`note:${details.tenant.id}`, () => addPlatformTenantNote(details.tenant.id, body), "Tenant note added") }}>Add note</Button></div>{details.notes.map((item) => <div key={item.id} className="rounded-2xl border p-4"><p className="whitespace-pre-wrap text-sm text-slate-600">{item.body}</p><p className="mt-2 text-xs text-slate-500">{item.createdByEmail} · {dateTime(item.createdAt)}</p></div>)}{!details.notes.length && <Empty icon={FileText} title="No internal notes" copy="Record onboarding, support, or account context here." />}</TabsContent>
    <TabsContent value="support" className="space-y-2 pt-3">{details.supportCases.map((item) => <div key={item.id} className="flex items-center gap-3 rounded-2xl border p-3"><Headphones className="size-4 text-violet-500" /><div className="flex-1"><p className="text-xs font-bold">{item.subject}</p><p className="text-xs text-slate-500">{item.assignedTo || "Unassigned"} · {dateTime(item.updatedAt)}</p></div><StatusBadge status={item.priority} /><StatusBadge status={item.status} /></div>)}{!details.supportCases.length && <Empty icon={Headphones} title="No support cases" copy="Open one from the Support tab." />}</TabsContent>
    <TabsContent value="audit" className="space-y-2 pt-3">{details.audit.map((item) => <div key={item.id} className="flex items-start gap-3 rounded-2xl border p-3"><ShieldCheck className="mt-0.5 size-4 text-primary" /><div><p className="text-xs font-bold">{item.action}</p><p className="text-xs text-slate-500">{item.actorEmail} · {dateTime(item.createdAt)}</p><p className="mt-1 text-xs text-slate-500">{JSON.stringify(item.details)}</p></div></div>)}{!details.audit.length && <Empty icon={ShieldCheck} title="No audit entries" copy="Future administrative changes will appear here." />}</TabsContent>
  </Tabs></div> : null}</DialogContent></Dialog>
}
