"use client"

import * as React from "react"
import { AlertTriangle, BookOpenCheck, Download, Landmark, Loader2, RefreshCw, Scale } from "lucide-react"

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
import { downloadCsv } from "@/lib/csv"

type Account = { id: string; code: string; name: string; accountType: string; normalBalance: string; systemCode?: string | null; totalDebit: number; totalCredit: number; balance: number }
type EntryLine = { id: number; accountCode: string; accountName: string; description?: string | null; debit: number; credit: number }
type Entry = { id: string; entryDate: string; reference: string; description: string; sourceType: string; status: string; reversalOfId?: string | null; lines: EntryLine[] }
type Period = { id: string; name: string; startsOn: string; endsOn: string; status: string }
type OpenItem = { id: string; customerName?: string; supplierName?: string; invoiceNumber?: string; billNumber?: string; dueDate: string; totalAmount: number; amountPaid: number; outstanding: number; status: string }
type BankAccount = { id: string; accountName: string; bankName: string; maskedAccountNumber?: string | null; currency: string; ledgerBalance: number }
type BankTransaction = { id: string; bankAccountId: string; accountName: string; transactionDate: string; description: string; reference?: string | null; amount: number; status: string; matchedJournalEntryId?: string | null }
type Party = { id: string; name: string }
type Workspace = {
  throughDate: string; accounts: Account[]; trialBalance: { totalDebits: number; totalCredits: number };
  incomeStatement: { revenue: number; expenses: number; netIncome: number };
  balanceSheet: { assets: number; liabilities: number; equity: number; liabilitiesAndEquity: number; difference: number };
  periods: Period[]; entries: Entry[]; receivables: OpenItem[]; payables: OpenItem[];
  bankAccounts: BankAccount[]; bankTransactions: BankTransaction[]; customers: Party[]; suppliers: Party[]
}

const today = () => new Date().toISOString().slice(0, 10)
const money = (value: number) => `${Number(value || 0).toLocaleString()} FCFA`

export default function AccountingPage() {
  const { profile, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [throughDate, setThroughDate] = React.useState(today())
  const [workspace, setWorkspace] = React.useState<Workspace | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState("")
  const [customerId, setCustomerId] = React.useState("")
  const [supplierId, setSupplierId] = React.useState("")
  const [bankAccountId, setBankAccountId] = React.useState("")

  const load = React.useCallback(async () => {
    if (!profile) return
    setLoading(true)
    try {
      const data = await erpApi<Workspace>(`/api/accounting?throughDate=${encodeURIComponent(throughDate)}`)
      setWorkspace(data); setCustomerId((value) => value || String(data.customers[0]?.id || ""));
      setSupplierId((value) => value || String(data.suppliers[0]?.id || "")); setBankAccountId((value) => value || String(data.bankAccounts[0]?.id || "")); setError("")
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Could not load accounting") }
    finally { setLoading(false) }
  }, [profile, throughDate])
  React.useEffect(() => { if (!authLoading) void load() }, [authLoading, load])

  const act = async (body: Record<string, unknown>, success: string, form?: HTMLFormElement) => {
    setSaving(true)
    try {
      const result = await erpApi<Record<string, unknown>>("/api/accounting", { method: "POST", body })
      form?.reset(); broadcastErpChange(); await load()
      toast({ title: success, description: typeof result.posted === "number" ? `${result.posted} operational transactions posted.` : undefined })
    } catch (requestError) { toast({ variant: "destructive", title: "Accounting action failed", description: requestError instanceof Error ? requestError.message : "Request failed" }) }
    finally { setSaving(false) }
  }

  const exportAccounting = () => {
    if (!workspace) return
    downloadCsv(`accounting-${throughDate}.csv`, [
      ["MANAGEMENT ACCOUNTING EXPORT", throughDate],
      ["Statement", "Line", "Amount (FCFA)"],
      ["Balance sheet", "Assets", workspace.balanceSheet.assets],
      ["Balance sheet", "Liabilities", workspace.balanceSheet.liabilities],
      ["Balance sheet", "Equity including current result", workspace.balanceSheet.equity],
      ["Income statement", "Revenue", workspace.incomeStatement.revenue],
      ["Income statement", "Expenses", workspace.incomeStatement.expenses],
      ["Income statement", "Net income", workspace.incomeStatement.netIncome],
      [],
      ["TRIAL BALANCE"],
      ["Code", "Account", "Type", "Debit", "Credit", "Balance"],
      ...workspace.accounts.map((account) => [account.code, account.name, account.accountType, account.totalDebit, account.totalCredit, account.balance]),
      [],
      ["GENERAL JOURNAL"],
      ["Date", "Reference", "Description", "Account", "Debit", "Credit"],
      ...workspace.entries.flatMap((entry) => entry.lines.map((line) => [entry.entryDate, entry.reference, entry.description, `${line.accountCode} ${line.accountName}`, line.debit, line.credit])),
      [],
      ["Notice", "Management export; obtain professional SYSCOHADA mapping and review before statutory filing."],
    ])
  }

  if (authLoading || loading) return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="size-8 animate-spin text-primary" /></div>
  if (error || !workspace) return <Alert variant="destructive"><AlertTitle>Accounting unavailable</AlertTitle><AlertDescription>{error || "No accounting workspace was returned. Apply migration 011 first."}</AlertDescription></Alert>
  const canWrite = profile?.role === "Business Owner" || profile?.role === "Accountant"
  const balanced = Math.abs(workspace.balanceSheet.difference) < 0.01 && Math.abs(workspace.trialBalance.totalDebits - workspace.trialBalance.totalCredits) < 0.01

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h1 className="text-3xl font-bold tracking-tight">Accounting</h1><p className="text-sm text-muted-foreground">Double-entry ledger, statements, open items, and reconciliation.</p></div><div className="flex flex-wrap gap-2"><Input aria-label="Statement date" type="date" value={throughDate} onChange={(event) => setThroughDate(event.target.value)} className="w-40" /><Button variant="outline" onClick={exportAccounting}><Download className="mr-2 size-4" />Export</Button><Button variant="outline" onClick={() => void load()}><RefreshCw className="mr-2 size-4" />Refresh</Button></div></div>
      {!canWrite && <Alert><AlertTitle>Read-only accounting access</AlertTitle><AlertDescription>Managers may review financial statements. Owners and accountants can post entries.</AlertDescription></Alert>}
      <Alert><BookOpenCheck className="size-4" /><AlertTitle>Management accounting statements</AlertTitle><AlertDescription>The ledger is double-entry and auditable, but the default chart is simplified. Have a qualified accountant map it to the current SYSCOHADA presentation and confirm opening balances before statutory filing.</AlertDescription></Alert>
      {!balanced && <Alert variant="destructive"><AlertTriangle className="size-4" /><AlertTitle>Ledger imbalance detected</AlertTitle><AlertDescription>Do not close the period or rely on statements until the source of the difference is reviewed.</AlertDescription></Alert>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader><CardDescription>Assets</CardDescription><CardTitle>{money(workspace.balanceSheet.assets)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Liabilities</CardDescription><CardTitle>{money(workspace.balanceSheet.liabilities)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Equity incl. result</CardDescription><CardTitle>{money(workspace.balanceSheet.equity)}</CardTitle></CardHeader></Card>
        <Card><CardHeader><CardDescription>Net income</CardDescription><CardTitle className={workspace.incomeStatement.netIncome < 0 ? "text-destructive" : "text-emerald-600"}>{money(workspace.incomeStatement.netIncome)}</CardTitle></CardHeader></Card>
      </div>

      <Tabs defaultValue="statements" className="space-y-4">
        <TabsList className="h-auto flex-wrap"><TabsTrigger value="statements">Statements</TabsTrigger><TabsTrigger value="ledger">Journal</TabsTrigger><TabsTrigger value="open-items">Receivables & payables</TabsTrigger><TabsTrigger value="bank">Bank</TabsTrigger><TabsTrigger value="setup">Setup & periods</TabsTrigger></TabsList>
        <TabsContent value="statements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Scale className="size-5" />Balance sheet</CardTitle><CardDescription>As at {new Date(throughDate).toLocaleDateString()}</CardDescription></CardHeader><CardContent className="space-y-3"><StatementRow label="Assets" value={workspace.balanceSheet.assets} /><StatementRow label="Liabilities" value={workspace.balanceSheet.liabilities} /><StatementRow label="Equity including current result" value={workspace.balanceSheet.equity} /><StatementRow label="Liabilities + equity" value={workspace.balanceSheet.liabilitiesAndEquity} strong /><StatementRow label="Difference" value={workspace.balanceSheet.difference} /></CardContent></Card><Card><CardHeader><CardTitle>Income statement</CardTitle><CardDescription>Posted entries through the selected date.</CardDescription></CardHeader><CardContent className="space-y-3"><StatementRow label="Revenue" value={workspace.incomeStatement.revenue} /><StatementRow label="Expenses" value={workspace.incomeStatement.expenses} /><StatementRow label="Net income" value={workspace.incomeStatement.netIncome} strong /></CardContent></Card></div>
          <Card><CardHeader><CardTitle>Trial balance</CardTitle><CardDescription>Total debits {money(workspace.trialBalance.totalDebits)} · total credits {money(workspace.trialBalance.totalCredits)}</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Account</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead><TableHead className="text-right">Balance</TableHead></TableRow></TableHeader><TableBody>{workspace.accounts.map((account) => <TableRow key={account.id}><TableCell className="font-mono">{account.code}</TableCell><TableCell>{account.name}{account.systemCode && <Badge variant="outline" className="ml-2">system</Badge>}</TableCell><TableCell>{account.accountType}</TableCell><TableCell className="text-right">{money(account.totalDebit)}</TableCell><TableCell className="text-right">{money(account.totalCredit)}</TableCell><TableCell className="text-right font-semibold">{money(account.balance)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="ledger" className="space-y-4">
          {canWrite && workspace.accounts.length > 1 && <Card><CardHeader><CardTitle>Post simple journal</CardTitle><CardDescription>For complex entries use the same API with up to 100 balanced lines.</CardDescription></CardHeader><CardContent><form className="grid gap-4 md:grid-cols-4" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); const total = Number(data.get("amount")); void act({ action: "postJournal", entryDate: data.get("entryDate"), reference: data.get("reference"), description: data.get("description"), lines: [{ accountId: data.get("debitAccount"), debit: total }, { accountId: data.get("creditAccount"), credit: total }] }, "Journal entry posted", form) }}>
            <div className="space-y-2"><Label>Date</Label><Input name="entryDate" type="date" defaultValue={today()} required /></div><div className="space-y-2"><Label>Reference</Label><Input name="reference" required maxLength={120} /></div><div className="space-y-2 md:col-span-2"><Label>Description</Label><Input name="description" required maxLength={500} /></div><div className="space-y-2"><Label>Debit account</Label><AccountSelect name="debitAccount" accounts={workspace.accounts} /></div><div className="space-y-2"><Label>Credit account</Label><AccountSelect name="creditAccount" accounts={workspace.accounts} /></div><div className="space-y-2"><Label>Amount</Label><Input name="amount" type="number" min="0.01" step="0.01" required /></div><div className="flex items-end"><Button disabled={saving} className="w-full">Post journal</Button></div>
          </form></CardContent></Card>}
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><BookOpenCheck className="size-5" />Posted journal</CardTitle></CardHeader><CardContent className="space-y-3">{workspace.entries.map((entry) => <div key={entry.id} className="rounded-lg border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><span className="font-mono text-sm font-semibold">{entry.reference}</span><p className="text-sm">{entry.description}</p><p className="text-xs text-muted-foreground">{new Date(entry.entryDate).toLocaleDateString()} · {entry.sourceType}</p></div><div className="flex gap-2"><Badge>{entry.status}</Badge>{canWrite && !entry.reversalOfId && <Button size="sm" variant="outline" onClick={() => { const reason = window.prompt("Reason for reversal"); if (reason) void act({ action: "reverseJournal", entryId: entry.id, reason }, "Reversal posted") }}>Reverse</Button>}</div></div><Table><TableHeader><TableRow><TableHead>Account</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead></TableRow></TableHeader><TableBody>{entry.lines.map((line) => <TableRow key={line.id}><TableCell>{line.accountCode} — {line.accountName}</TableCell><TableCell className="text-right">{line.debit ? money(line.debit) : "—"}</TableCell><TableCell className="text-right">{line.credit ? money(line.credit) : "—"}</TableCell></TableRow>)}</TableBody></Table></div>)}</CardContent></Card>
        </TabsContent>

        <TabsContent value="open-items" className="space-y-4">
          {canWrite && <div className="grid gap-4 lg:grid-cols-2"><OpenItemForm kind="receivable" parties={workspace.customers} selected={customerId} onSelected={setCustomerId} saving={saving} act={act} /><OpenItemForm kind="payable" parties={workspace.suppliers} selected={supplierId} onSelected={setSupplierId} saving={saving} act={act} /></div>}
          <div className="grid gap-4 lg:grid-cols-2"><OpenItemsTable title="Customer receivables" items={workspace.receivables} canWrite={canWrite} saving={saving} onPay={(item) => void act({ action: "recordPayment", direction: "RECEIPT", documentId: item.id, paymentDate: today(), amount: item.outstanding, method: "CASH" }, "Customer receipt posted")} /><OpenItemsTable title="Supplier payables" items={workspace.payables} canWrite={canWrite} saving={saving} onPay={(item) => void act({ action: "recordPayment", direction: "PAYMENT", documentId: item.id, paymentDate: today(), amount: item.outstanding, method: "CASH" }, "Supplier payment posted")} /></div>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          {canWrite && <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Create bank account</CardTitle></CardHeader><CardContent><form className="grid gap-3" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); void act({ action: "createBankAccount", accountName: data.get("accountName"), bankName: data.get("bankName"), maskedAccountNumber: data.get("maskedAccountNumber") || null, currency: "FCFA", openingBalance: Number(data.get("openingBalance") || 0) }, "Bank account created", form) }}><Input name="accountName" placeholder="Account label" required /><Input name="bankName" placeholder="Bank or mobile-money provider" required /><Input name="maskedAccountNumber" placeholder="Masked number, e.g. ****1234" /><Input name="openingBalance" type="number" step="0.01" placeholder="Opening balance" /><Button disabled={saving}>Create account</Button></form></CardContent></Card><Card><CardHeader><CardTitle>Import bank transaction</CardTitle></CardHeader><CardContent><form className="grid gap-3" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); void act({ action: "importBankTransaction", bankAccountId: data.get("bankAccountId"), transactionDate: data.get("transactionDate"), description: data.get("description"), reference: data.get("reference") || null, amount: Number(data.get("amount")) }, "Bank transaction imported", form) }}><Select name="bankAccountId" value={bankAccountId} onValueChange={setBankAccountId}><SelectTrigger><SelectValue placeholder="Bank account" /></SelectTrigger><SelectContent>{workspace.bankAccounts.map((bank) => <SelectItem key={bank.id} value={bank.id}>{bank.accountName}</SelectItem>)}</SelectContent></Select><Input name="transactionDate" type="date" defaultValue={today()} required /><Input name="description" placeholder="Statement description" required /><Input name="reference" placeholder="Reference" /><Input name="amount" type="number" step="0.01" placeholder="Positive inflow / negative outflow" required /><Button disabled={saving || !bankAccountId}>Import transaction</Button></form></CardContent></Card></div>}
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Landmark className="size-5" />Bank accounts</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Account</TableHead><TableHead>Institution</TableHead><TableHead>Number</TableHead><TableHead className="text-right">Ledger balance</TableHead></TableRow></TableHeader><TableBody>{workspace.bankAccounts.map((bank) => <TableRow key={bank.id}><TableCell>{bank.accountName}</TableCell><TableCell>{bank.bankName}</TableCell><TableCell>{bank.maskedAccountNumber || "—"}</TableCell><TableCell className="text-right">{money(bank.ledgerBalance)}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
          <Card><CardHeader><CardTitle>Statement reconciliation</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Account</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Status / match</TableHead></TableRow></TableHeader><TableBody>{workspace.bankTransactions.map((transaction) => <TableRow key={transaction.id}><TableCell>{new Date(transaction.transactionDate).toLocaleDateString()}</TableCell><TableCell>{transaction.accountName}</TableCell><TableCell>{transaction.description}</TableCell><TableCell>{money(transaction.amount)}</TableCell><TableCell>{transaction.status === "RECONCILED" ? <Badge>RECONCILED</Badge> : canWrite ? <form className="flex gap-2" onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); void act({ action: "reconcileBankTransaction", transactionId: transaction.id, journalEntryId: data.get("journalEntryId") }, "Bank transaction reconciled") }}><Input name="journalEntryId" placeholder="Journal entry ID" required className="min-w-44" /><Button size="sm" disabled={saving}>Match</Button></form> : <Badge variant="outline">UNMATCHED</Badge>}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-4">
          {canWrite && <div className="flex flex-wrap gap-2"><Button onClick={() => void act({ action: "bootstrap" }, "Default chart of accounts ready")} disabled={saving}>Initialize default accounts</Button><Button variant="outline" onClick={() => void act({ action: "syncOperational" }, "Operational records synchronized")} disabled={saving}>Post unlinked sales & expenses</Button></div>}
          {canWrite && <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Add ledger account</CardTitle></CardHeader><CardContent><form className="grid gap-3" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); void act({ action: "createAccount", code: data.get("code"), name: data.get("name"), accountType: data.get("accountType"), normalBalance: data.get("normalBalance"), description: data.get("description") || null }, "Ledger account created", form) }}><Input name="code" placeholder="Account code" required /><Input name="name" placeholder="Account name" required /><Select name="accountType" defaultValue="ASSET"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"].map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}</SelectContent></Select><Select name="normalBalance" defaultValue="DEBIT"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="DEBIT">DEBIT</SelectItem><SelectItem value="CREDIT">CREDIT</SelectItem></SelectContent></Select><Input name="description" placeholder="Description" /><Button disabled={saving}>Create account</Button></form></CardContent></Card><Card><CardHeader><CardTitle>Create fiscal period</CardTitle></CardHeader><CardContent><form className="grid gap-3" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); void act({ action: "createPeriod", name: data.get("name"), startsOn: data.get("startsOn"), endsOn: data.get("endsOn") }, "Fiscal period created", form) }}><Input name="name" placeholder="Period name" required /><Input name="startsOn" type="date" required /><Input name="endsOn" type="date" required /><Button disabled={saving}>Create period</Button></form></CardContent></Card></div>}
          <Card><CardHeader><CardTitle>Fiscal periods</CardTitle><CardDescription>Closing a period permanently blocks new or reversed entries dated inside it.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Dates</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader><TableBody>{workspace.periods.map((period) => <TableRow key={period.id}><TableCell>{period.name}</TableCell><TableCell>{new Date(period.startsOn).toLocaleDateString()} – {new Date(period.endsOn).toLocaleDateString()}</TableCell><TableCell><Badge variant="outline">{period.status}</Badge></TableCell><TableCell>{canWrite && period.status === "OPEN" && <Button size="sm" variant="outline" disabled={saving} onClick={() => { if (window.confirm("Close this period? Posted entries remain immutable and the period cannot be reopened from the application.")) void act({ action: "closePeriod", periodId: period.id }, "Fiscal period closed") }}>Close period</Button>}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatementRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return <div className={`flex justify-between border-b pb-2 ${strong ? "font-bold" : ""}`}><span>{label}</span><span>{money(value)}</span></div>
}

function AccountSelect({ name, accounts }: { name: string; accounts: Account[] }) {
  return <Select name={name} required><SelectTrigger><SelectValue placeholder="Select account" /></SelectTrigger><SelectContent>{accounts.map((account) => <SelectItem key={account.id} value={account.id}>{account.code} — {account.name}</SelectItem>)}</SelectContent></Select>
}

function OpenItemForm({ kind, parties, selected, onSelected, saving, act }: { kind: "receivable" | "payable"; parties: Party[]; selected: string; onSelected: (value: string) => void; saving: boolean; act: (body: Record<string, unknown>, success: string, form?: HTMLFormElement) => Promise<void> }) {
  const isReceivable = kind === "receivable"
  return <Card><CardHeader><CardTitle>New {isReceivable ? "customer invoice" : "supplier bill"}</CardTitle></CardHeader><CardContent><form className="grid gap-3" onSubmit={(event) => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); void act({ action: isReceivable ? "createReceivable" : "createPayable", [isReceivable ? "customerId" : "supplierId"]: data.get("partyId"), [isReceivable ? "invoiceNumber" : "billNumber"]: data.get("documentNumber"), issueDate: data.get("issueDate"), dueDate: data.get("dueDate"), description: data.get("description"), totalAmount: Number(data.get("totalAmount")) }, isReceivable ? "Receivable posted" : "Payable posted", form) }}><Select name="partyId" value={selected} onValueChange={onSelected}><SelectTrigger><SelectValue placeholder={isReceivable ? "Customer" : "Supplier"} /></SelectTrigger><SelectContent>{parties.map((party) => <SelectItem key={party.id} value={party.id}>{party.name}</SelectItem>)}</SelectContent></Select><Input name="documentNumber" placeholder={isReceivable ? "Invoice number" : "Bill number"} required /><div className="grid grid-cols-2 gap-3"><Input name="issueDate" type="date" defaultValue={today()} required /><Input name="dueDate" type="date" defaultValue={today()} required /></div><Textarea name="description" placeholder="Description" required /><Input name="totalAmount" type="number" min="0.01" step="0.01" placeholder="Total amount" required /><Button disabled={saving || !selected}>Post {isReceivable ? "invoice" : "bill"}</Button></form></CardContent></Card>
}

function OpenItemsTable({ title, items, canWrite, saving, onPay }: { title: string; items: OpenItem[]; canWrite: boolean; saving: boolean; onPay: (item: OpenItem) => void }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Party / document</TableHead><TableHead>Due</TableHead><TableHead className="text-right">Outstanding</TableHead><TableHead /></TableRow></TableHeader><TableBody>{items.map((item) => <TableRow key={item.id}><TableCell>{item.customerName || item.supplierName}<div className="text-xs text-muted-foreground">{item.invoiceNumber || item.billNumber} · {item.status}</div></TableCell><TableCell>{new Date(item.dueDate).toLocaleDateString()}</TableCell><TableCell className="text-right">{money(item.outstanding)}</TableCell><TableCell>{canWrite && item.outstanding > 0 && <Button size="sm" variant="outline" disabled={saving} onClick={() => onPay(item)}>Settle cash</Button>}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
}
