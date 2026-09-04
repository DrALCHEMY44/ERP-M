"use client"

import * as React from "react"
import Link from "next/link"
import {
  Activity, ArrowLeft, Ban, ChevronLeft, ChevronRight, CircleUserRound,
  Clipboard, Download, KeyRound, Loader2, MailPlus, MoreHorizontal, Pencil, RefreshCw,
  Search, ShieldCheck, UserCheck, UserPlus, Users, XCircle,
} from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useNeonData } from "@/hooks/use-neon-data"
import { useToast } from "@/hooks/use-toast"
import { authClient } from "@/lib/auth/client"
import {
  invitePlatformUser, platformUserDetailsQuery, platformUsersQuery, renewPlatformUserInvite,
  revokePlatformUserInvite, revokePlatformUserSessions, updatePlatformUser,
} from "@/lib/platform-service"
import type { PlatformUser, PlatformUserDetails, PlatformUserDirectory } from "@/lib/platform-types"

const roles = [
  "Platform Super Admin", "Business Owner", "Manager", "Accountant", "HR Officer", "Staff", "Viewer",
] as const
const inviteRoles = roles.filter((role) => role !== "Business Owner")

type InviteResult = {
  userId: string
  email: string
  invitationToken: string
  invitationExpiresAt: string
}

type InviteInput = {
  tenantId: string
  businessId: string
  email: string
  fullName: string
  role: string
  department: string | null
  phoneNumber: string | null
}

const dateTime = (value: string | null) => value ? new Date(value).toLocaleString() : "Never"
const compact = (value: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value)
const csvCell = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`

function downloadText(filename: string, contents: string) {
  const href = URL.createObjectURL(new Blob([contents], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  link.click()
  URL.revokeObjectURL(href)
}

function StatusBadge({ status }: { status: string }) {
  const tone = ["Active", "accepted", "linked"].includes(status)
    ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
    : ["Suspended", "revoked", "expired"].includes(status)
      ? "bg-rose-50 text-rose-700 ring-rose-100"
      : "bg-amber-50 text-amber-700 ring-amber-100"
  return <Badge className={`border-0 capitalize ring-1 ${tone}`}>{status.replaceAll("_", " ")}</Badge>
}

function MetricCard({ label, value, detail, icon: Icon, tone }: {
  label: string
  value: string
  detail: string
  icon: React.ComponentType<{ className?: string }>
  tone: string
}) {
  return (
    <article className="rounded-[22px] border border-white bg-white p-5 shadow-[0_12px_35px_rgba(51,65,85,0.07)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-black tracking-tight text-[#17223b]">{value}</p>
          <p className="mt-1 text-[10px] text-slate-400">{detail}</p>
        </div>
        <span className={`grid size-10 shrink-0 place-items-center rounded-2xl ${tone}`}><Icon className="size-5" /></span>
      </div>
    </article>
  )
}

function InviteLinkDialog({ invitation, onOpenChange }: {
  invitation: InviteResult | null
  onOpenChange: (open: boolean) => void
}) {
  const { toast } = useToast()
  const link = invitation && typeof window !== "undefined"
    ? `${window.location.origin}/register?invite=${encodeURIComponent(invitation.invitationToken)}&email=${encodeURIComponent(invitation.email)}`
    : ""
  const copy = async () => {
    await navigator.clipboard.writeText(link)
    toast({ title: "Invitation link copied" })
  }
  return (
    <Dialog open={Boolean(invitation)} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitation ready</DialogTitle>
          <DialogDescription>Share this one-time registration link securely with {invitation?.email}. It expires {dateTime(invitation?.invitationExpiresAt ?? null)}.</DialogDescription>
        </DialogHeader>
        <div className="rounded-xl border bg-slate-50 p-3 font-mono text-xs leading-5 text-slate-600 break-all">{link}</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={copy}><Clipboard className="mr-2 size-4" />Copy link</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function InviteUserDialog({ open, onOpenChange, directory, pending, onSubmit }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  directory: PlatformUserDirectory
  pending: boolean
  onSubmit: (form: InviteInput) => void
}) {
  const [form, setForm] = React.useState({ tenantId: "", businessId: "", email: "", fullName: "", role: "Staff", department: "", phoneNumber: "" })
  const businesses = directory.businessOptions.filter((business) => business.tenantId === form.tenantId)
  React.useEffect(() => {
    if (!form.tenantId && directory.tenantOptions[0]) setForm((value) => ({ ...value, tenantId: directory.tenantOptions[0].id }))
  }, [directory.tenantOptions, form.tenantId])
  React.useEffect(() => {
    if (!businesses.some((business) => business.id === form.businessId)) {
      setForm((value) => ({ ...value, businessId: businesses[0]?.id ?? "" }))
    }
  }, [businesses, form.businessId])
  const valid = form.tenantId && form.businessId && form.email.includes("@") && form.fullName.trim().length >= 2
  const submit = () => {
    if (!valid) return
    onSubmit({ ...form, email: form.email.trim().toLowerCase(), fullName: form.fullName.trim(), department: form.department.trim() || null, phoneNumber: form.phoneNumber.trim() || null })
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Invite a platform user</DialogTitle>
          <DialogDescription>Create the user profile now and issue a secure seven-day registration link.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Full name</Label><Input value={form.fullName} onChange={(event) => setForm((value) => ({ ...value, fullName: event.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Workspace</Label><Select value={form.tenantId} onValueChange={(tenantId) => setForm((value) => ({ ...value, tenantId, businessId: "" }))}><SelectTrigger><SelectValue placeholder="Select workspace" /></SelectTrigger><SelectContent>{directory.tenantOptions.map((tenant) => <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Business</Label><Select value={form.businessId} onValueChange={(businessId) => setForm((value) => ({ ...value, businessId }))}><SelectTrigger><SelectValue placeholder="Select business" /></SelectTrigger><SelectContent>{businesses.map((business) => <SelectItem key={business.id} value={business.id}>{business.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Role</Label><Select value={form.role} onValueChange={(role) => setForm((value) => ({ ...value, role }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{inviteRoles.map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent></Select><p className="text-[10px] text-slate-400">Ownership can be transferred after registration.</p></div>
          <div className="space-y-1.5"><Label>Department</Label><Input value={form.department} onChange={(event) => setForm((value) => ({ ...value, department: event.target.value }))} placeholder="Optional" /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Phone number</Label><Input value={form.phoneNumber} onChange={(event) => setForm((value) => ({ ...value, phoneNumber: event.target.value }))} placeholder="Optional" /></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button disabled={!valid || pending} onClick={submit}>{pending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <MailPlus className="mr-2 size-4" />}Create invitation</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditUserDialog({ user, directory, pending, onOpenChange, onSave }: {
  user: PlatformUser | null
  directory: PlatformUserDirectory
  pending: boolean
  onOpenChange: (open: boolean) => void
  onSave: (input: Record<string, unknown>) => void
}) {
  const [form, setForm] = React.useState({ email: "", fullName: "", department: "", phoneNumber: "", businessId: "", role: "Staff", status: "Active" })
  React.useEffect(() => {
    if (user) setForm({ email: user.email, fullName: user.fullName, department: user.department ?? "", phoneNumber: user.phoneNumber ?? "", businessId: user.businessId, role: user.role, status: user.status })
  }, [user])
  const businesses = directory.businessOptions.filter((business) => business.tenantId === user?.tenantId)
  const save = () => {
    if (!user || form.fullName.trim().length < 2 || !form.email.includes("@")) return
    if (form.role === "Business Owner" && user.role !== "Business Owner" && !window.confirm(`Transfer ownership of ${user.tenantName} to ${form.fullName}? The current owner will become a Manager.`)) return
    onSave({ id: user.id, email: form.email.trim().toLowerCase(), fullName: form.fullName.trim(), department: form.department.trim() || null, phoneNumber: form.phoneNumber.trim() || null, businessId: form.businessId, role: form.role, status: form.status })
  }
  return (
    <Dialog open={Boolean(user)} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Edit user</DialogTitle><DialogDescription>Update identity, workspace assignment, role, and account access. Every change is audited.</DialogDescription></DialogHeader>
        <div className="grid gap-4 py-2 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Full name</Label><Input value={form.fullName} onChange={(event) => setForm((value) => ({ ...value, fullName: event.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input type="email" value={form.email} disabled={Boolean(user?.authLinked)} onChange={(event) => setForm((value) => ({ ...value, email: event.target.value }))} />{user?.authLinked && <p className="text-[10px] text-slate-400">Managed by the authentication account.</p>}</div>
          <div className="space-y-1.5"><Label>Department</Label><Input value={form.department} onChange={(event) => setForm((value) => ({ ...value, department: event.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Phone number</Label><Input value={form.phoneNumber} onChange={(event) => setForm((value) => ({ ...value, phoneNumber: event.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Business</Label><Select value={form.businessId} onValueChange={(businessId) => setForm((value) => ({ ...value, businessId }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{businesses.map((business) => <SelectItem key={business.id} value={business.id}>{business.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1.5"><Label>Role</Label><Select value={form.role} onValueChange={(role) => setForm((value) => ({ ...value, role }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{roles.filter((role) => role !== "Business Owner" || user?.authLinked).map((role) => <SelectItem key={role} value={role}>{role}</SelectItem>)}</SelectContent></Select>{!user?.authLinked && <p className="text-[10px] text-slate-400">Ownership requires completed registration.</p>}</div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Account access</Label><Select value={form.status} onValueChange={(status) => setForm((value) => ({ ...value, status }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Suspended">Suspended</SelectItem></SelectContent></Select></div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button onClick={save} disabled={pending}>{pending && <Loader2 className="mr-2 size-4 animate-spin" />}Save changes</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function UserDetailsDialog({ details, loading, open, onOpenChange, onEdit }: {
  details: PlatformUserDetails | null
  loading: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (user: PlatformUser) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto p-0">
        <DialogHeader className="border-b p-6 pb-4">
          <div className="flex flex-wrap items-center gap-2"><DialogTitle>{details?.user.fullName || "User record"}</DialogTitle>{details && <StatusBadge status={details.user.status} />}</div>
          <DialogDescription>{details ? `${details.user.email} · ${details.user.tenantName} / ${details.user.businessName}` : "Loading identity, access, sessions, and activity."}</DialogDescription>
        </DialogHeader>
        {loading && !details ? <div className="space-y-3 p-6">{Array.from({ length: 5 }).map((_, index) => <Skeleton className="h-14" key={index} />)}</div> : details ? (
          <div className="p-6">
            <div className="grid gap-3 sm:grid-cols-4">
              {[["Role", details.user.role], ["Department", details.user.department || "Not set"], ["Last login", dateTime(details.user.lastLoginAt)], ["Active sessions", String(details.user.activeSessions)]].map(([label, value]) => <div key={label} className="rounded-2xl bg-slate-50 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 truncate text-xs font-bold text-slate-700" title={value}>{value}</p></div>)}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2"><StatusBadge status={details.user.authLinked ? "linked" : details.user.invitationStatus || "not invited"} /><span className="text-xs text-slate-400">Created {dateTime(details.user.createdAt)}</span><Button variant="outline" size="sm" className="ml-auto" onClick={() => onEdit(details.user)}><Pencil className="mr-2 size-3.5" />Edit user</Button></div>
            <Tabs defaultValue="activity" className="mt-5">
              <TabsList><TabsTrigger value="activity">Activity</TabsTrigger><TabsTrigger value="sessions">Sessions</TabsTrigger><TabsTrigger value="audit">Admin audit</TabsTrigger></TabsList>
              <TabsContent value="activity" className="space-y-2 pt-3">{details.activity.map((entry) => <div key={entry.id} className="flex gap-3 rounded-2xl border p-3"><Activity className="mt-0.5 size-4 text-cyan-500" /><div><p className="text-xs font-bold">{entry.actionType} · {entry.module}</p><p className="text-[10px] text-slate-500">{entry.description || "No description"}</p><p className="mt-1 text-[9px] text-slate-400">{dateTime(entry.timestamp)}</p></div></div>)}{!details.activity.length && <p className="rounded-2xl border border-dashed p-8 text-center text-xs text-slate-400">No recorded ERP activity.</p>}</TabsContent>
              <TabsContent value="sessions" className="space-y-2 pt-3">{details.sessions.map((session) => <div key={session.id} className="flex items-start gap-3 rounded-2xl border p-3"><KeyRound className="mt-0.5 size-4 text-violet-500" /><div className="min-w-0 flex-1"><p className="text-xs font-bold">Last used {dateTime(session.lastUsedAt)}</p><p className="truncate text-[10px] text-slate-500">{session.userAgent || "Unknown device"}</p><p className="mt-1 text-[9px] text-slate-400">Created {dateTime(session.createdAt)} · expires {dateTime(session.expiresAt)}</p></div><StatusBadge status={session.revokedAt ? "revoked" : new Date(session.expiresAt) <= new Date() ? "expired" : "Active"} /></div>)}{!details.sessions.length && <p className="rounded-2xl border border-dashed p-8 text-center text-xs text-slate-400">No employee access-code sessions.</p>}</TabsContent>
              <TabsContent value="audit" className="space-y-2 pt-3">{details.audit.map((entry) => <div key={entry.id} className="flex gap-3 rounded-2xl border p-3"><ShieldCheck className="mt-0.5 size-4 text-emerald-500" /><div><p className="text-xs font-bold">{entry.action}</p><p className="text-[10px] text-slate-500">{entry.actorEmail} · {dateTime(entry.createdAt)}</p><p className="mt-1 max-w-2xl truncate text-[9px] text-slate-400">{JSON.stringify(entry.details)}</p></div></div>)}{!details.audit.length && <p className="rounded-2xl border border-dashed p-8 text-center text-xs text-slate-400">No administrative changes for this user.</p>}</TabsContent>
            </Tabs>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export default function PlatformUsersPage() {
  const { loading: authLoading, profile } = useAuth()
  const { toast } = useToast()
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [tenantId, setTenantId] = React.useState("all")
  const [role, setRole] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [authState, setAuthState] = React.useState("all")
  const [sort, setSort] = React.useState("newest")
  const [page, setPage] = React.useState(1)
  const [pending, setPending] = React.useState<string | null>(null)
  const [refreshing, setRefreshing] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)
  const [inviteOpen, setInviteOpen] = React.useState(false)
  const [invitation, setInvitation] = React.useState<InviteResult | null>(null)
  const [editUser, setEditUser] = React.useState<PlatformUser | null>(null)
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)

  React.useEffect(() => { const timer = window.setTimeout(() => setDebouncedSearch(search), 300); return () => window.clearTimeout(timer) }, [search])
  React.useEffect(() => setPage(1), [debouncedSearch, tenantId, role, status, authState, sort])
  const variables = React.useMemo(() => ({ search: debouncedSearch, tenantId, role, status, authState, sort, page, pageSize: 20 }), [debouncedSearch, tenantId, role, status, authState, sort, page])
  const { data: directory, loading, error, refetch } = useNeonData<PlatformUserDirectory>({ query: platformUsersQuery, variables, refreshInterval: 20000 })
  const detailVariables = React.useMemo(() => selectedUserId ? { id: selectedUserId } : {}, [selectedUserId])
  const { data: rawDetails, loading: detailsLoading, refetch: refetchDetails } = useNeonData<PlatformUserDetails>({ query: platformUserDetailsQuery, variables: detailVariables, skip: !selectedUserId })
  const details = rawDetails?.user.id === selectedUserId ? rawDetails : null

  const run = React.useCallback(async (key: string, action: () => Promise<unknown>, success: string, closeEdit = false) => {
    setPending(key)
    try {
      await action()
      await Promise.all([refetch(), selectedUserId ? refetchDetails() : Promise.resolve()])
      if (closeEdit) setEditUser(null)
      toast({ title: success })
    } catch (failure) {
      toast({ variant: "destructive", title: "Action failed", description: failure instanceof Error ? failure.message : "Please retry" })
    } finally { setPending(null) }
  }, [refetch, refetchDetails, selectedUserId, toast])

  const createInvite = async (form: InviteInput) => {
    setPending("invite")
    try {
      const result = await invitePlatformUser(form) as { data: InviteResult }
      setInviteOpen(false)
      setInvitation(result.data)
      await refetch()
      toast({ title: "User invitation created" })
    } catch (failure) {
      toast({ variant: "destructive", title: "Invitation failed", description: failure instanceof Error ? failure.message : "Please retry" })
    } finally { setPending(null) }
  }

  const renewInvite = async (user: PlatformUser) => {
    setPending(`invite:${user.id}`)
    try {
      const result = await renewPlatformUserInvite(user.id) as { data: InviteResult }
      setInvitation(result.data)
      await refetch()
      toast({ title: "New invitation link created" })
    } catch (failure) {
      toast({ variant: "destructive", title: "Could not renew invitation", description: failure instanceof Error ? failure.message : "Please retry" })
    } finally { setPending(null) }
  }

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

  const refresh = async () => { setRefreshing(true); await refetch(); setRefreshing(false) }
  const exportUsers = async () => {
    setExporting(true)
    try {
      const first = await platformUsersQuery({ search: debouncedSearch, tenantId, role, status, authState, sort, page: 1, pageSize: 100 }) as { data: PlatformUserDirectory }
      const all = [...first.data.users]
      const pages = Math.ceil(first.data.total / 100)
      for (let nextPage = 2; nextPage <= pages; nextPage += 1) {
        const result = await platformUsersQuery({ search: debouncedSearch, tenantId, role, status, authState, sort, page: nextPage, pageSize: 100 }) as { data: PlatformUserDirectory }
        all.push(...result.data.users)
      }
      const rows = [["Name", "Email", "Workspace", "Business", "Role", "Department", "Phone", "Status", "Auth", "Invitation", "Last login", "Created"], ...all.map((user) => [user.fullName, user.email, user.tenantName, user.businessName, user.role, user.department, user.phoneNumber, user.status, user.authLinked ? "Linked" : "Pending", user.invitationStatus, user.lastLoginAt, user.createdAt])]
      downloadText(`smarterp-platform-users-${new Date().toISOString().slice(0, 10)}.csv`, rows.map((row) => row.map(csvCell).join(",")).join("\n"))
    } catch (failure) {
      toast({ variant: "destructive", title: "Export failed", description: failure instanceof Error ? failure.message : "Please retry" })
    } finally { setExporting(false) }
  }

  if (authLoading || (loading && !directory)) return <div className="min-h-screen bg-[#f6f8fc] p-6"><div className="mx-auto max-w-[1500px] space-y-4">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-24 rounded-[22px]" />)}</div></div>
  if (profile?.role !== "Platform Super Admin") return <div className="grid min-h-[60vh] place-items-center p-6 text-center"><div><Ban className="mx-auto size-10 text-rose-500" /><h1 className="mt-3 text-xl font-black">Platform access required</h1><p className="mt-1 text-sm text-slate-500">Only Platform Super Admins can manage all platform users.</p></div></div>
  if (error || !directory) return <div className="grid min-h-[60vh] place-items-center p-6 text-center"><div><XCircle className="mx-auto size-10 text-rose-500" /><h1 className="mt-3 text-xl font-black">Could not load platform users</h1><p className="mt-1 text-sm text-slate-500">{error?.message || "Please retry."}</p><Button className="mt-4" onClick={refresh}>Retry</Button></div></div>

  const pageCount = Math.max(1, Math.ceil(directory.total / directory.pageSize))
  return (
    <main className="min-h-screen bg-[#f6f8fc] p-4 text-slate-900 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <Link href="/admin/dashboard" className="mb-3 inline-flex items-center text-xs font-bold text-slate-500 hover:text-blue-600"><ArrowLeft className="mr-1.5 size-3.5" />SaaS dashboard</Link>
            <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"><Users className="size-5" /></span><div><h1 className="text-2xl font-black tracking-tight text-[#17223b]">Platform users</h1><p className="text-xs text-slate-400">Identity, access, invitations, roles, sessions, and user activity across every workspace</p></div></div>
          </div>
          <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={exportUsers} disabled={exporting}>{exporting ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Download className="mr-2 size-4" />}Export CSV</Button><Button variant="outline" onClick={refresh} disabled={refreshing}>{refreshing ? <Loader2 className="mr-2 size-4 animate-spin" /> : <RefreshCw className="mr-2 size-4" />}Refresh</Button><Button onClick={() => setInviteOpen(true)}><UserPlus className="mr-2 size-4" />Invite user</Button></div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <MetricCard label="All users" value={compact(directory.totals.users)} detail="Across every workspace" icon={Users} tone="bg-blue-50 text-blue-600" />
          <MetricCard label="Active access" value={compact(directory.totals.active)} detail="Allowed to authenticate" icon={UserCheck} tone="bg-emerald-50 text-emerald-600" />
          <MetricCard label="Active 30d" value={compact(directory.totals.active30d)} detail="Logged in recently" icon={Activity} tone="bg-cyan-50 text-cyan-600" />
          <MetricCard label="Pending invites" value={compact(directory.totals.pendingInvitations)} detail="Valid registration links" icon={MailPlus} tone="bg-amber-50 text-amber-600" />
          <MetricCard label="Suspended" value={compact(directory.totals.suspended)} detail="Access currently blocked" icon={Ban} tone="bg-rose-50 text-rose-600" />
          <MetricCard label="Super admins" value={compact(directory.totals.superAdmins)} detail="Active platform operators" icon={ShieldCheck} tone="bg-violet-50 text-violet-600" />
        </section>

        <section className="rounded-[22px] border border-white bg-white p-4 shadow-[0_12px_35px_rgba(51,65,85,0.07)]">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div className="relative xl:col-span-2"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, workspace, business…" /></div>
            <Select value={tenantId} onValueChange={setTenantId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All workspaces</SelectItem>{directory.tenantOptions.map((tenant) => <SelectItem key={tenant.id} value={tenant.id}>{tenant.name}</SelectItem>)}</SelectContent></Select>
            <Select value={role} onValueChange={setRole}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All roles</SelectItem>{roles.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select>
            <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All access states</SelectItem><SelectItem value="Active">Active</SelectItem><SelectItem value="Suspended">Suspended</SelectItem></SelectContent></Select>
            <Select value={authState} onValueChange={setAuthState}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All account states</SelectItem><SelectItem value="linked">Registration complete</SelectItem><SelectItem value="pending">Not registered</SelectItem></SelectContent></Select>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-slate-400">{directory.total} matching user{directory.total === 1 ? "" : "s"}</p><Select value={sort} onValueChange={setSort}><SelectTrigger className="w-44"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="newest">Newest first</SelectItem><SelectItem value="oldest">Oldest first</SelectItem><SelectItem value="name">Name A–Z</SelectItem><SelectItem value="lastActive">Recently active</SelectItem></SelectContent></Select></div>
        </section>

        <section className="overflow-hidden rounded-[22px] border border-white bg-white shadow-[0_12px_35px_rgba(51,65,85,0.07)]">
          <div className="overflow-x-auto"><Table><TableHeader><TableRow className="bg-slate-50/70"><TableHead>User</TableHead><TableHead>Workspace / business</TableHead><TableHead>Role</TableHead><TableHead>Access</TableHead><TableHead>Account</TableHead><TableHead>Last login</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>
            {directory.users.map((user) => <TableRow key={user.id} className="cursor-pointer" onClick={() => setSelectedUserId(user.id)}><TableCell><div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-xs font-black text-slate-600">{(user.fullName || user.email).slice(0, 2).toUpperCase()}</span><div><p className="font-bold text-slate-700">{user.fullName || "Unnamed user"}</p><p className="text-[10px] text-slate-400">{user.email}</p>{user.department && <p className="text-[9px] text-slate-400">{user.department}</p>}</div></div></TableCell><TableCell><p className="text-xs font-bold text-slate-600">{user.tenantName}</p><p className="text-[10px] text-slate-400">{user.businessName}</p></TableCell><TableCell><Badge variant="outline">{user.role}</Badge></TableCell><TableCell><StatusBadge status={user.status} /></TableCell><TableCell>{user.authLinked ? <StatusBadge status="linked" /> : <StatusBadge status={user.invitationStatus || "not invited"} />}</TableCell><TableCell><p className="whitespace-nowrap text-[10px] text-slate-500">{dateTime(user.lastLoginAt)}</p>{user.activeSessions > 0 && <p className="mt-1 text-[9px] font-bold text-emerald-600">{user.activeSessions} active session{user.activeSessions === 1 ? "" : "s"}</p>}</TableCell><TableCell onClick={(event) => event.stopPropagation()} className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" disabled={pending?.includes(user.id)}>{pending?.includes(user.id) ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontal className="size-4" />}</Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-56"><DropdownMenuItem onClick={() => setSelectedUserId(user.id)}><CircleUserRound className="mr-2 size-4" />View details</DropdownMenuItem><DropdownMenuItem onClick={() => setEditUser(user)}><Pencil className="mr-2 size-4" />Edit user</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem onClick={() => run(`status:${user.id}`, () => updatePlatformUser({ id: user.id, status: user.status === "Active" ? "Suspended" : "Active" }), user.status === "Active" ? "User suspended" : "User reactivated")}><Ban className="mr-2 size-4" />{user.status === "Active" ? "Suspend account" : "Reactivate account"}</DropdownMenuItem><DropdownMenuItem disabled={!user.authLinked} onClick={() => sendReset(user)}><KeyRound className="mr-2 size-4" />Send password reset</DropdownMenuItem><DropdownMenuItem disabled={user.activeSessions === 0} onClick={() => run(`sessions:${user.id}`, () => revokePlatformUserSessions(user.id), "Active employee sessions revoked")}><XCircle className="mr-2 size-4" />Revoke sessions</DropdownMenuItem>{!user.authLinked && <><DropdownMenuSeparator /><DropdownMenuItem onClick={() => renewInvite(user)}><MailPlus className="mr-2 size-4" />Generate new invite link</DropdownMenuItem><DropdownMenuItem disabled={user.invitationStatus !== "pending"} className="text-rose-600" onClick={() => { if (window.confirm(`Revoke the invitation for ${user.email}?`)) run(`invite:${user.id}`, () => revokePlatformUserInvite(user.id), "Invitation revoked") }}><XCircle className="mr-2 size-4" />Revoke invitation</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu></TableCell></TableRow>)}
            {!directory.users.length && <TableRow><TableCell colSpan={7}><div className="flex min-h-56 flex-col items-center justify-center text-center"><Users className="size-9 text-slate-200" /><p className="mt-3 text-sm font-bold text-slate-600">No users match these filters</p><p className="mt-1 text-xs text-slate-400">Clear a filter or invite a new user.</p></div></TableCell></TableRow>}
          </TableBody></Table></div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3"><p className="text-[10px] text-slate-400">Page {directory.page} of {pageCount}</p><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><ChevronLeft className="mr-1 size-3.5" />Previous</Button><Button variant="outline" size="sm" disabled={page >= pageCount} onClick={() => setPage((value) => value + 1)}>Next<ChevronRight className="ml-1 size-3.5" /></Button></div></div>
        </section>
      </div>

      <InviteUserDialog open={inviteOpen} onOpenChange={setInviteOpen} directory={directory} pending={pending === "invite"} onSubmit={createInvite} />
      <InviteLinkDialog invitation={invitation} onOpenChange={(open) => { if (!open) setInvitation(null) }} />
      <EditUserDialog user={editUser} directory={directory} pending={pending === `edit:${editUser?.id}`} onOpenChange={(open) => { if (!open) setEditUser(null) }} onSave={(input) => run(`edit:${editUser?.id}`, () => updatePlatformUser(input), "User updated", true)} />
      <UserDetailsDialog details={details} loading={detailsLoading} open={Boolean(selectedUserId)} onOpenChange={(open) => { if (!open) setSelectedUserId(null) }} onEdit={(user) => setEditUser(user)} />
    </main>
  )
}
