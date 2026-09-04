"use client"

import * as React from "react"
import { AlertTriangle, Banknote, CheckCircle2, Download, Loader2, RefreshCw, ShieldAlert } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { broadcastErpChange, erpApi } from "@/lib/erp-api"
import { downloadCsv } from "@/lib/csv"

type Settings = {
  currency: string; payFrequency: string; professionalExpenseRate: number; annualTaxAllowance: number;
  localSurtaxRate: number; employeeSocialRate: number; employerSocialRate: number; socialMonthlyCeiling: number;
  monthlyTaxExemptThreshold: number; taxBrackets: Array<{ upTo: number | null; rate: number }>;
  complianceStatus: "DRAFT" | "CONFIRMED"; complianceNote?: string | null
}
type Run = {
  id: string; periodStart: string; periodEnd: string; payDate: string; status: string; currency: string;
  totalGross: number; totalEmployeeTax: number; totalEmployeeSocial: number; totalEmployerSocial: number;
  totalOtherDeductions: number; totalNet: number; employeeCount: number
}
type Item = { id: string; payrollRunId: string; employeeName: string; grossPay: number; employeeTax: number; employeeSocial: number; employerSocial: number; otherDeductions: number; netPay: number }
type Workspace = { settings: Settings; settingsPersisted: boolean; runs: Run[]; items: Item[]; bankAccounts: Array<{ id: string; accountName: string; bankName: string }> }

const money = (value: number, currency = "FCFA") => `${Number(value || 0).toLocaleString()} ${currency}`
const monthRange = () => {
  const current = new Date()
  const first = new Date(current.getFullYear(), current.getMonth(), 1).toISOString().slice(0, 10)
  const last = new Date(current.getFullYear(), current.getMonth() + 1, 0).toISOString().slice(0, 10)
  return { first, last }
}

export default function PayrollPage() {
  const { profile, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const canConfigure = profile?.role === "Business Owner" || profile?.role === "HR Officer"
  const canApprove = profile?.role === "Business Owner"

  const load = React.useCallback(async () => {
    if (!profile) return
    setLoading(true)
    try { setWorkspace(await erpApi<Workspace>("/api/payroll")); setError("") }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not load payroll") }
    finally { setLoading(false) }
  }, [profile])
  React.useEffect(() => { if (!authLoading) void load() }, [authLoading, load])

  const act = async (body: Record<string, unknown>, success: string) => {
    setSaving(true)
    try {
      await erpApi("/api/payroll", { method: "POST", body })
      broadcastErpChange(); await load(); toast({ title: success })
    } catch (requestError) {
      toast({ variant: "destructive", title: "Payroll action failed", description: requestError instanceof Error ? requestError.message : "Request failed" })
    } finally { setSaving(false) }
  }

  const exportRun = (run: Run) => {
    const items = workspace?.items.filter((item) => item.payrollRunId === run.id) || []
    downloadCsv(`payroll-${String(run.periodEnd).slice(0, 10)}.csv`, [
      ["PAYROLL REGISTER", `${run.periodStart} to ${run.periodEnd}`, run.status],
      ["Employee", "Gross", "Employee tax", "Employee social", "Employer social", "Other deductions", "Net", "Currency"],
      ...items.map((item) => [item.employeeName, item.grossPay, item.employeeTax, item.employeeSocial, item.employerSocial, item.otherDeductions, item.netPay, run.currency]),
      ["TOTAL", run.totalGross, run.totalEmployeeTax, run.totalEmployeeSocial, run.totalEmployerSocial, run.totalOtherDeductions, run.totalNet, run.currency],
    ])
  }

  if (authLoading || loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>
  if (error || !workspace) return <Alert variant="destructive"><AlertTitle>Payroll unavailable</AlertTitle><AlertDescription>{error || "No payroll workspace was returned"}</AlertDescription></Alert>
  const draftSettings = workspace.settings.complianceStatus !== "CONFIRMED"
  const ranges = monthRange()
  const runItems = (runId: string) => workspace.items.filter((item) => item.payrollRunId === runId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h1 className="text-3xl font-bold tracking-tight">Payroll</h1><p className="text-sm text-muted-foreground">Calculate, approve, post, and pay controlled payroll runs.</p></div>
        <Button variant="outline" onClick={() => void load()}><RefreshCw className="mr-2 size-4" />Refresh</Button>
      </div>
      {draftSettings ? <Alert variant="destructive"><ShieldAlert className="size-4" /><AlertTitle>Posting is locked</AlertTitle><AlertDescription>The supplied rates are editable working defaults. A Business Owner must obtain professional review and explicitly confirm the settings before payroll can be approved or posted.</AlertDescription></Alert>
        : <Alert><CheckCircle2 className="size-4" /><AlertTitle>Settings confirmed</AlertTitle><AlertDescription>Payroll posting is enabled. Reconfirm whenever tax or social-contribution rules change.</AlertDescription></Alert>}

      <Tabs defaultValue="runs" className="space-y-4">
        <TabsList className="h-auto flex-wrap"><TabsTrigger value="runs">Pay runs</TabsTrigger><TabsTrigger value="payslips">Payroll register</TabsTrigger><TabsTrigger value="settings">Settings</TabsTrigger></TabsList>
        <TabsContent value="runs" className="space-y-4">
          {canConfigure && <Card><CardHeader><CardTitle className="flex items-center gap-2"><Banknote className="size-5" />Generate pay run</CardTitle><CardDescription>Includes every active employee with a recorded base salary.</CardDescription></CardHeader><CardContent>
            <form className="grid gap-4 md:grid-cols-4" onSubmit={(event) => {
              event.preventDefault(); const data = new FormData(event.currentTarget)
              void act({ action: "generate", periodStart: data.get("periodStart"), periodEnd: data.get("periodEnd"), payDate: data.get("payDate") }, "Draft payroll generated")
            }}>
              <div className="space-y-2"><Label>Period start</Label><Input name="periodStart" type="date" defaultValue={ranges.first} required /></div>
              <div className="space-y-2"><Label>Period end</Label><Input name="periodEnd" type="date" defaultValue={ranges.last} required /></div>
              <div className="space-y-2"><Label>Pay date</Label><Input name="payDate" type="date" defaultValue={ranges.last} required /></div>
              <div className="flex items-end"><Button disabled={saving} className="w-full">Generate draft</Button></div>
            </form>
          </CardContent></Card>}
          <Card><CardHeader><CardTitle>Pay runs</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Period</TableHead><TableHead>Staff</TableHead><TableHead>Gross</TableHead><TableHead>Deductions</TableHead><TableHead>Net</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>{workspace.runs.map((run) => <TableRow key={run.id}><TableCell>{new Date(run.periodStart).toLocaleDateString()} – {new Date(run.periodEnd).toLocaleDateString()}</TableCell><TableCell>{run.employeeCount}</TableCell><TableCell>{money(run.totalGross, run.currency)}</TableCell><TableCell>{money(run.totalEmployeeTax + run.totalEmployeeSocial + run.totalOtherDeductions, run.currency)}</TableCell><TableCell className="font-semibold">{money(run.totalNet, run.currency)}</TableCell><TableCell><Badge variant={run.status === "PAID" ? "default" : "outline"}>{run.status}</Badge></TableCell><TableCell><div className="flex flex-wrap gap-2"><Button size="sm" variant="ghost" onClick={() => exportRun(run)}><Download className="mr-1 size-3" />Export</Button>{canApprove && run.status === "DRAFT" && <Button size="sm" disabled={saving || draftSettings} onClick={() => void act({ action: "approve", runId: run.id }, "Payroll approved")}>Approve</Button>}{canApprove && run.status === "APPROVED" && <Button size="sm" disabled={saving} onClick={() => void act({ action: "post", runId: run.id }, "Payroll posted to the ledger")}>Post</Button>}{canApprove && run.status === "POSTED" && <><Button size="sm" disabled={saving} onClick={() => void act({ action: "pay", runId: run.id, method: "BANK", bankAccountId: workspace.bankAccounts[0]?.id || null }, "Payroll marked paid from bank")}>Pay bank</Button><Button size="sm" variant="outline" disabled={saving} onClick={() => void act({ action: "pay", runId: run.id, method: "CASH" }, "Payroll marked paid in cash")}>Pay cash</Button></>}{canConfigure && run.status === "DRAFT" && <Button size="sm" variant="outline" disabled={saving} onClick={() => void act({ action: "void", runId: run.id }, "Draft payroll voided")}>Void</Button>}</div></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="payslips"><Card><CardHeader><CardTitle>Payroll register</CardTitle><CardDescription>Per-employee calculations are snapshotted with each run for audit and payslip generation.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Gross</TableHead><TableHead>Tax</TableHead><TableHead>Employee social</TableHead><TableHead>Employer social</TableHead><TableHead>Other deductions</TableHead><TableHead>Net</TableHead></TableRow></TableHeader><TableBody>{workspace.runs.flatMap((run) => runItems(run.id).map((item) => <TableRow key={item.id}><TableCell>{item.employeeName}<div className="text-xs text-muted-foreground">{new Date(run.periodEnd).toLocaleDateString()} · {run.status}</div></TableCell><TableCell>{money(item.grossPay, run.currency)}</TableCell><TableCell>{money(item.employeeTax, run.currency)}</TableCell><TableCell>{money(item.employeeSocial, run.currency)}</TableCell><TableCell>{money(item.employerSocial, run.currency)}</TableCell><TableCell>{money(item.otherDeductions, run.currency)}</TableCell><TableCell className="font-semibold">{money(item.netPay, run.currency)}</TableCell></TableRow>))}</TableBody></Table></CardContent></Card></TabsContent>

        <TabsContent value="settings"><Card><CardHeader><CardTitle>Payroll calculation settings</CardTitle><CardDescription>Values are never treated as production-approved until the owner confirms them after professional review.</CardDescription></CardHeader><CardContent>
          {!canConfigure ? <Alert><AlertTriangle className="size-4" /><AlertTitle>Read-only settings</AlertTitle><AlertDescription>Your role can review payroll but cannot change calculations.</AlertDescription></Alert> :
          <form key={JSON.stringify(workspace.settings)} className="grid gap-4 md:grid-cols-3" onSubmit={(event) => {
            event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const status = String(data.get("complianceStatus"))
            if (status === "CONFIRMED" && data.get("acknowledge") !== "yes") { toast({ variant: "destructive", title: "Confirmation required", description: "Acknowledge professional review before confirming these rates." }); return }
            try {
              const brackets = JSON.parse(String(data.get("taxBrackets")))
              void act({ action: "updateSettings", currency: data.get("currency"), payFrequency: data.get("payFrequency"), professionalExpenseRate: Number(data.get("professionalExpenseRate")), annualTaxAllowance: Number(data.get("annualTaxAllowance")), localSurtaxRate: Number(data.get("localSurtaxRate")), employeeSocialRate: Number(data.get("employeeSocialRate")), employerSocialRate: Number(data.get("employerSocialRate")), socialMonthlyCeiling: Number(data.get("socialMonthlyCeiling")), monthlyTaxExemptThreshold: Number(data.get("monthlyTaxExemptThreshold")), taxBrackets: brackets, complianceStatus: status, complianceNote: data.get("complianceNote") || null }, "Payroll settings saved")
            } catch { toast({ variant: "destructive", title: "Invalid tax brackets", description: "Enter a valid JSON array of increasing annual limits and rates." }) }
          }}>
            <div className="space-y-2"><Label>Currency</Label><Input name="currency" defaultValue={workspace.settings.currency} required /></div><div className="space-y-2"><Label>Frequency</Label><Select name="payFrequency" defaultValue={workspace.settings.payFrequency}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["WEEKLY", "BIWEEKLY", "MONTHLY"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select></div>
            {([['professionalExpenseRate','Professional expense rate (%)'],['annualTaxAllowance','Annual tax allowance'],['localSurtaxRate','Local surtax rate (%)'],['employeeSocialRate','Employee social rate (%)'],['employerSocialRate','Employer social rate (%)'],['socialMonthlyCeiling','Monthly social ceiling'],['monthlyTaxExemptThreshold','Monthly tax-exempt threshold']] as const).map(([name,label]) => <div key={name} className="space-y-2"><Label>{label}</Label><Input name={name} type="number" min="0" step="0.01" defaultValue={workspace.settings[name]} required /></div>)}
            <div className="space-y-2 md:col-span-2"><Label>Annual progressive brackets (JSON)</Label><Textarea name="taxBrackets" className="min-h-28 font-mono text-xs" defaultValue={JSON.stringify(workspace.settings.taxBrackets, null, 2)} required /></div><div className="space-y-2"><Label>Compliance status</Label><Select name="complianceStatus" defaultValue={workspace.settings.complianceStatus} disabled={!canApprove}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DRAFT">DRAFT — posting locked</SelectItem><SelectItem value="CONFIRMED">CONFIRMED — posting enabled</SelectItem></SelectContent></Select>{!canApprove && <Input type="hidden" name="complianceStatus" value="DRAFT" />}</div>
            <div className="space-y-2 md:col-span-3"><Label>Review note</Label><Textarea name="complianceNote" defaultValue={workspace.settings.complianceNote || ""} maxLength={2000} /></div>
            {canApprove && <div className="flex items-center gap-2 md:col-span-3"><Checkbox id="acknowledge" name="acknowledge" value="yes" /><Label htmlFor="acknowledge" className="font-normal">I confirm these values were reviewed for this company and payroll period.</Label></div>}
            <div className="md:col-span-3"><Button disabled={saving}>{saving && <Loader2 className="mr-2 size-4 animate-spin" />}Save settings</Button></div>
          </form>}
        </CardContent></Card></TabsContent>
      </Tabs>
    </div>
  )
}
