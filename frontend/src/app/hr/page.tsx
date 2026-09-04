"use client"

import * as React from "react"
import { CalendarCheck, History, Loader2, PlaneTakeoff, RefreshCw } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { broadcastErpChange, erpApi } from "@/lib/erp-api"

type Employee = { id: string; fullName: string; position: string; department?: string | null; status?: string | null }
type Attendance = { id: string; employeeName: string; attendanceDate: string; status: string; minutesWorked?: number | null; notes?: string | null }
type Leave = { id: string; employeeName: string; leaveType: string; startDate: string; endDate: string; requestedDays: number; status: string; reason?: string | null }
type EmploymentEvent = { id: string; employeeName: string; eventType: string; effectiveDate: string; position?: string | null; department?: string | null; notes?: string | null }
type Workspace = { employees: Employee[]; attendance: Attendance[]; leaveRequests: Leave[]; events: EmploymentEvent[] }

const today = () => new Date().toISOString().slice(0, 10)

export default function HrPage() {
  const { profile, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [employeeId, setEmployeeId] = React.useState("")

  const load = React.useCallback(async () => {
    if (!profile) return
    setLoading(true)
    try {
      const data = await erpApi<Workspace>("/api/hr")
      setWorkspace(data)
      setEmployeeId((current) => current || String(data.employees[0]?.id || ""))
      setError("")
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not load HR records")
    } finally {
      setLoading(false)
    }
  }, [profile])

  React.useEffect(() => { if (!authLoading) void load() }, [authLoading, load])

  const submit = async (body: Record<string, unknown>, form: HTMLFormElement) => {
    setSaving(true)
    try {
      await erpApi("/api/hr", { method: "POST", body })
      form.reset()
      broadcastErpChange()
      await load()
      toast({ title: "HR record saved", description: "The employee history has been updated." })
    } catch (requestError) {
      toast({ variant: "destructive", title: "HR action failed", description: requestError instanceof Error ? requestError.message : "Request failed" })
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>
  if (error) return <Alert variant="destructive"><AlertTitle>HR workspace unavailable</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
  const canWrite = profile?.role === "Business Owner" || profile?.role === "HR Officer"
  const employees = workspace?.employees || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h1 className="text-3xl font-bold tracking-tight">HR Operations</h1><p className="text-sm text-muted-foreground">Attendance, leave decisions, and auditable employment history.</p></div>
        <Button variant="outline" onClick={() => void load()}><RefreshCw className="mr-2 size-4" />Refresh</Button>
      </div>
      {!canWrite && <Alert><AlertTitle>Read-only access</AlertTitle><AlertDescription>Managers can review HR operations; only owners and HR officers can make changes.</AlertDescription></Alert>}
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardDescription>Employees</CardDescription><CardTitle>{employees.length}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Attendance records</CardDescription><CardTitle>{workspace?.attendance.length || 0}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Pending leave</CardDescription><CardTitle>{workspace?.leaveRequests.filter((item) => item.status === "PENDING").length || 0}</CardTitle></CardHeader></Card>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="h-auto flex-wrap"><TabsTrigger value="attendance">Attendance</TabsTrigger><TabsTrigger value="leave">Leave</TabsTrigger><TabsTrigger value="history">Employment history</TabsTrigger></TabsList>
        <TabsContent value="attendance" className="space-y-4">
          {canWrite && <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarCheck className="size-5" />Record attendance</CardTitle></CardHeader><CardContent>
            <form className="grid gap-4 md:grid-cols-3" onSubmit={(event) => {
              event.preventDefault(); const form = event.currentTarget; const data = new FormData(form)
              const checkIn = String(data.get("checkIn") || ""); const checkOut = String(data.get("checkOut") || "")
              void submit({ action: "recordAttendance", employeeId: data.get("employeeId"), attendanceDate: data.get("attendanceDate"), status: data.get("status"), checkIn: checkIn ? new Date(checkIn).toISOString() : null, checkOut: checkOut ? new Date(checkOut).toISOString() : null, notes: data.get("notes") || null }, form)
            }}>
              <div className="space-y-2"><Label>Employee</Label><Select name="employeeId" value={employeeId} onValueChange={setEmployeeId} required><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent>{employees.map((employee) => <SelectItem key={employee.id} value={employee.id}>{employee.fullName}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Date</Label><Input name="attendanceDate" type="date" defaultValue={today()} required /></div>
              <div className="space-y-2"><Label>Status</Label><Select name="status" defaultValue="PRESENT"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["PRESENT", "ABSENT", "LATE", "EXCUSED", "REMOTE", "LEAVE"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Check in</Label><Input name="checkIn" type="datetime-local" /></div><div className="space-y-2"><Label>Check out</Label><Input name="checkOut" type="datetime-local" /></div>
              <div className="space-y-2"><Label>Notes</Label><Input name="notes" maxLength={2000} placeholder="Optional note" /></div>
              <div className="flex items-end"><Button disabled={saving || !employeeId} className="w-full">{saving && <Loader2 className="mr-2 size-4 animate-spin" />}Save attendance</Button></div>
            </form>
          </CardContent></Card>}
          <Card><CardHeader><CardTitle>Attendance register</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Employee</TableHead><TableHead>Status</TableHead><TableHead>Hours</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader><TableBody>{workspace?.attendance.map((item) => <TableRow key={item.id}><TableCell>{new Date(item.attendanceDate).toLocaleDateString()}</TableCell><TableCell>{item.employeeName}</TableCell><TableCell><Badge variant="outline">{item.status}</Badge></TableCell><TableCell>{item.minutesWorked == null ? "—" : (item.minutesWorked / 60).toFixed(2)}</TableCell><TableCell>{item.notes || "—"}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          {canWrite && <Card><CardHeader><CardTitle className="flex items-center gap-2"><PlaneTakeoff className="size-5" />New leave request</CardTitle></CardHeader><CardContent>
            <form className="grid gap-4 md:grid-cols-4" onSubmit={(event) => {
              event.preventDefault(); const form = event.currentTarget; const data = new FormData(form)
              void submit({ action: "createLeave", employeeId: data.get("employeeId"), leaveType: data.get("leaveType"), startDate: data.get("startDate"), endDate: data.get("endDate"), requestedDays: Number(data.get("requestedDays")), reason: data.get("reason") || null }, form)
            }}>
              <div className="space-y-2"><Label>Employee</Label><Select name="employeeId" value={employeeId} onValueChange={setEmployeeId} required><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{employees.map((employee) => <SelectItem key={employee.id} value={employee.id}>{employee.fullName}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Leave type</Label><Select name="leaveType" defaultValue="ANNUAL"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["ANNUAL", "SICK", "MATERNITY", "PATERNITY", "COMPASSIONATE", "UNPAID", "OTHER"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Start</Label><Input name="startDate" type="date" defaultValue={today()} required /></div><div className="space-y-2"><Label>End</Label><Input name="endDate" type="date" defaultValue={today()} required /></div>
              <div className="space-y-2"><Label>Requested days</Label><Input name="requestedDays" type="number" min="0.5" step="0.5" required /></div><div className="space-y-2 md:col-span-2"><Label>Reason</Label><Input name="reason" maxLength={2000} /></div><div className="flex items-end"><Button disabled={saving || !employeeId} className="w-full">Create request</Button></div>
            </form>
          </CardContent></Card>}
          <Card><CardHeader><CardTitle>Leave requests</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>Dates</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{workspace?.leaveRequests.map((item) => <TableRow key={item.id}><TableCell>{item.employeeName}</TableCell><TableCell>{item.leaveType}</TableCell><TableCell>{new Date(item.startDate).toLocaleDateString()} – {new Date(item.endDate).toLocaleDateString()}</TableCell><TableCell>{item.requestedDays}</TableCell><TableCell><Badge>{item.status}</Badge></TableCell><TableCell className="space-x-2">{canWrite && item.status === "PENDING" && <><Button size="sm" onClick={() => void submit({ action: "decideLeave", requestId: item.id, decision: "APPROVED" }, document.createElement("form"))}>Approve</Button><Button size="sm" variant="outline" onClick={() => void submit({ action: "decideLeave", requestId: item.id, decision: "REJECTED" }, document.createElement("form"))}>Reject</Button></>}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {canWrite && <Card><CardHeader><CardTitle className="flex items-center gap-2"><History className="size-5" />Add employment event</CardTitle></CardHeader><CardContent>
            <form className="grid gap-4 md:grid-cols-4" onSubmit={(event) => {
              event.preventDefault(); const form = event.currentTarget; const data = new FormData(form)
              void submit({ action: "addEmploymentEvent", employeeId: data.get("employeeId"), eventType: data.get("eventType"), effectiveDate: data.get("effectiveDate"), position: data.get("position") || null, department: data.get("department") || null, notes: data.get("notes") || null }, form)
            }}>
              <div className="space-y-2"><Label>Employee</Label><Select name="employeeId" value={employeeId} onValueChange={setEmployeeId}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{employees.map((employee) => <SelectItem key={employee.id} value={employee.id}>{employee.fullName}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Event</Label><Select name="eventType" defaultValue="NOTE"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["HIRE", "PROMOTION", "TRANSFER", "RETURN", "SUSPENSION", "TERMINATION", "NOTE"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Effective date</Label><Input name="effectiveDate" type="date" defaultValue={today()} required /></div><div className="space-y-2"><Label>Position</Label><Input name="position" /></div><div className="space-y-2"><Label>Department</Label><Input name="department" /></div><div className="space-y-2 md:col-span-2"><Label>Notes</Label><Textarea name="notes" maxLength={2000} /></div><div className="flex items-end"><Button disabled={saving || !employeeId} className="w-full">Add event</Button></div>
            </form>
          </CardContent></Card>}
          <Card><CardHeader><CardTitle>Employment timeline</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Employee</TableHead><TableHead>Event</TableHead><TableHead>Change</TableHead><TableHead>Notes</TableHead></TableRow></TableHeader><TableBody>{workspace?.events.map((item) => <TableRow key={item.id}><TableCell>{new Date(item.effectiveDate).toLocaleDateString()}</TableCell><TableCell>{item.employeeName}</TableCell><TableCell><Badge variant="outline">{item.eventType}</Badge></TableCell><TableCell>{[item.position, item.department].filter(Boolean).join(" / ") || "—"}</TableCell><TableCell>{item.notes || "—"}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
