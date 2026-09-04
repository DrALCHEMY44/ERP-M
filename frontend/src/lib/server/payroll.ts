import { randomUUID } from "crypto"
import type { PoolClient } from "@neondatabase/serverless"

import { postJournalEntryWithClient, withAccountingTransaction, writeAuditWithClient, type CompanyScope } from "./accounting"
import { db } from "./neon"

export type PayrollBracket = { upTo: number | null; rate: number }
export type PayrollSettings = {
  currency: string
  payFrequency: "WEEKLY" | "BIWEEKLY" | "MONTHLY"
  professionalExpenseRate: number
  annualTaxAllowance: number
  localSurtaxRate: number
  employeeSocialRate: number
  employerSocialRate: number
  socialMonthlyCeiling: number
  monthlyTaxExemptThreshold: number
  taxBrackets: PayrollBracket[]
  complianceStatus: "DRAFT" | "CONFIRMED"
  complianceNote?: string | null
}

export type PayrollAdjustment = { label: string; amount: number }

const DEFAULT_SETTINGS: PayrollSettings = {
  currency: "FCFA",
  payFrequency: "MONTHLY",
  professionalExpenseRate: 30,
  annualTaxAllowance: 500_000,
  localSurtaxRate: 10,
  employeeSocialRate: 2.8,
  employerSocialRate: 0,
  socialMonthlyCeiling: 300_000,
  monthlyTaxExemptThreshold: 62_000,
  taxBrackets: [
    { upTo: 2_000_000, rate: 10 },
    { upTo: 3_000_000, rate: 15 },
    { upTo: 5_000_000, rate: 25 },
    { upTo: null, rate: 35 },
  ],
  complianceStatus: "DRAFT",
  complianceNote: "Confirm payroll rates and tax treatment with a qualified local accountant before posting.",
}

function currency(value: number) {
  if (!Number.isFinite(value)) throw new Error("Payroll amount is invalid")
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function validAdjustments(values: PayrollAdjustment[] = []) {
  return values.map((item) => {
    const amount = currency(Number(item.amount))
    if (amount < 0 || !item.label.trim()) throw new Error("Payroll adjustments require a label and non-negative amount")
    return { label: item.label.trim().slice(0, 120), amount }
  })
}

export function validateTaxBrackets(brackets: PayrollBracket[]) {
  if (!Array.isArray(brackets) || !brackets.length || brackets.length > 20) throw new Error("At least one tax bracket is required")
  let previous = 0
  let openEnded = false
  const normalized = brackets.map((bracket, index) => {
    const rate = Number(bracket.rate)
    const upTo = bracket.upTo == null ? null : Number(bracket.upTo)
    if (!Number.isFinite(rate) || rate < 0 || rate > 100) throw new Error("Tax bracket rates must be between 0 and 100")
    if (openEnded || (upTo == null && index !== brackets.length - 1)) throw new Error("Only the final tax bracket can be open-ended")
    if (upTo != null && (!Number.isFinite(upTo) || upTo <= previous)) throw new Error("Tax bracket limits must increase")
    if (upTo == null) openEnded = true
    else previous = upTo
    return { upTo, rate }
  })
  if (!openEnded) throw new Error("The final tax bracket must be open-ended")
  return normalized
}

function progressiveTax(annualTaxable: number, brackets: PayrollBracket[]) {
  let tax = 0
  let lower = 0
  for (const bracket of validateTaxBrackets(brackets)) {
    const upper = bracket.upTo ?? annualTaxable
    const slice = Math.max(0, Math.min(annualTaxable, upper) - lower)
    tax += slice * bracket.rate / 100
    lower = upper
    if (annualTaxable <= upper || bracket.upTo == null) break
  }
  return currency(tax)
}

export function calculatePayrollItem(
  baseSalary: number,
  settings: PayrollSettings,
  earnings: PayrollAdjustment[] = [],
  deductions: PayrollAdjustment[] = [],
) {
  const salary = currency(Number(baseSalary))
  if (salary < 0) throw new Error("Base salary cannot be negative")
  const safeEarnings = validAdjustments(earnings)
  const safeDeductions = validAdjustments(deductions)
  const grossPay = currency(salary + safeEarnings.reduce((sum, item) => sum + item.amount, 0))
  const periodsPerYear = settings.payFrequency === "WEEKLY" ? 52 : settings.payFrequency === "BIWEEKLY" ? 26 : 12
  const contributionCeiling = settings.socialMonthlyCeiling * 12 / periodsPerYear
  const taxExemptThreshold = settings.monthlyTaxExemptThreshold * 12 / periodsPerYear
  const contributionBase = Math.min(grossPay, contributionCeiling)
  const employeeSocial = currency(contributionBase * settings.employeeSocialRate / 100)
  const employerSocial = currency(contributionBase * settings.employerSocialRate / 100)
  const professionalExpense = currency(grossPay * settings.professionalExpenseRate / 100)
  const taxablePay = currency(Math.max(0, grossPay - professionalExpense - employeeSocial - settings.annualTaxAllowance / periodsPerYear))
  const baseTax = grossPay <= taxExemptThreshold
    ? 0
    : progressiveTax(taxablePay * periodsPerYear, settings.taxBrackets) / periodsPerYear
  const employeeTax = currency(baseTax * (1 + settings.localSurtaxRate / 100))
  const otherDeductions = currency(safeDeductions.reduce((sum, item) => sum + item.amount, 0))
  const netPay = currency(grossPay - employeeTax - employeeSocial - otherDeductions)
  if (netPay < 0) throw new Error("Payroll deductions exceed gross pay")
  return {
    baseSalary: salary,
    earnings: safeEarnings,
    deductions: safeDeductions,
    grossPay,
    taxablePay,
    employeeTax,
    employeeSocial,
    employerSocial,
    otherDeductions,
    netPay,
    calculationSnapshot: {
      settings,
      periodsPerYear,
      contributionBase,
      professionalExpense,
      annualizedTaxablePay: currency(taxablePay * periodsPerYear),
    },
  }
}

function settingsFromRow(row: Record<string, unknown>): PayrollSettings {
  return {
    currency: String(row.currency),
    payFrequency: String(row.pay_frequency) as PayrollSettings["payFrequency"],
    professionalExpenseRate: Number(row.professional_expense_rate),
    annualTaxAllowance: Number(row.annual_tax_allowance),
    localSurtaxRate: Number(row.local_surtax_rate),
    employeeSocialRate: Number(row.employee_social_rate),
    employerSocialRate: Number(row.employer_social_rate),
    socialMonthlyCeiling: Number(row.social_monthly_ceiling),
    monthlyTaxExemptThreshold: Number(row.monthly_tax_exempt_threshold),
    taxBrackets: validateTaxBrackets(row.tax_brackets as PayrollBracket[]),
    complianceStatus: String(row.compliance_status) as PayrollSettings["complianceStatus"],
    complianceNote: row.compliance_note ? String(row.compliance_note) : null,
  }
}

async function settingsWithClient(client: PoolClient, scope: CompanyScope) {
  await client.query(
    `INSERT INTO payroll_settings(business_id,tenant_id,updated_by,compliance_note)
     VALUES($1,$2,$3,$4) ON CONFLICT(business_id) DO NOTHING`,
    [scope.businessId, scope.tenantId, scope.actorId, DEFAULT_SETTINGS.complianceNote],
  )
  const result = await client.query(
    "SELECT * FROM payroll_settings WHERE business_id=$1 AND tenant_id=$2 FOR UPDATE",
    [scope.businessId, scope.tenantId],
  )
  if (!result.rows[0]) throw new Error("Payroll settings could not be loaded")
  return settingsFromRow(result.rows[0])
}

export async function getPayrollWorkspace(tenantId: string, businessId: string) {
  const sql = db()
  const settingsRows = await sql`SELECT * FROM payroll_settings WHERE tenant_id=${tenantId} AND business_id=${businessId}`
  const runs = await sql`SELECT pr.*,COUNT(pi.id)::integer AS employee_count
    FROM payroll_runs pr LEFT JOIN payroll_items pi
      ON pi.tenant_id=pr.tenant_id AND pi.business_id=pr.business_id AND pi.payroll_run_id=pr.id
    WHERE pr.tenant_id=${tenantId} AND pr.business_id=${businessId}
    GROUP BY pr.id ORDER BY pr.period_end DESC,pr.created_at DESC`
  const items = await sql`SELECT pi.*,e.full_name,e.department,e.position
    FROM payroll_items pi JOIN employees e
      ON e.tenant_id=pi.tenant_id AND e.business_id=pi.business_id AND e.id=pi.employee_id
    WHERE pi.tenant_id=${tenantId} AND pi.business_id=${businessId}
    ORDER BY pi.created_at DESC`
  const banks = await sql`SELECT id,account_name,bank_name FROM bank_accounts
    WHERE tenant_id=${tenantId} AND business_id=${businessId} AND is_active ORDER BY account_name`
  return {
    settings: settingsRows[0] ? settingsFromRow(settingsRows[0]) : DEFAULT_SETTINGS,
    settingsPersisted: Boolean(settingsRows[0]),
    runs: runs.map((row) => ({
      id: row.id, periodStart: row.period_start, periodEnd: row.period_end, payDate: row.pay_date,
      status: row.status, currency: row.currency, totalGross: Number(row.total_gross),
      totalEmployeeTax: Number(row.total_employee_tax), totalEmployeeSocial: Number(row.total_employee_social),
      totalEmployerSocial: Number(row.total_employer_social), totalOtherDeductions: Number(row.total_other_deductions),
      totalNet: Number(row.total_net), employeeCount: Number(row.employee_count), createdAt: row.created_at,
    })),
    items: items.map((row) => ({
      id: row.id, payrollRunId: row.payroll_run_id, employeeId: row.employee_id, employeeName: row.full_name,
      department: row.department, position: row.position, baseSalary: Number(row.base_salary), earnings: row.earnings,
      deductions: row.deductions, grossPay: Number(row.gross_pay), taxablePay: Number(row.taxable_pay),
      employeeTax: Number(row.employee_tax), employeeSocial: Number(row.employee_social),
      employerSocial: Number(row.employer_social), otherDeductions: Number(row.other_deductions), netPay: Number(row.net_pay),
    })),
    bankAccounts: banks.map((row) => ({ id: row.id, accountName: row.account_name, bankName: row.bank_name })),
  }
}

export async function updatePayrollSettings(scope: CompanyScope, settings: PayrollSettings) {
  validateTaxBrackets(settings.taxBrackets)
  for (const value of [settings.professionalExpenseRate, settings.localSurtaxRate, settings.employeeSocialRate, settings.employerSocialRate]) {
    if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error("Payroll rates must be between 0 and 100")
  }
  return withAccountingTransaction(async (client) => {
    const row = await client.query(
      `INSERT INTO payroll_settings(
        business_id,tenant_id,currency,pay_frequency,professional_expense_rate,annual_tax_allowance,
        local_surtax_rate,employee_social_rate,employer_social_rate,social_monthly_ceiling,
        monthly_tax_exempt_threshold,tax_brackets,compliance_status,compliance_note,
        compliance_confirmed_by,compliance_confirmed_at,updated_by,updated_at
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13,$14,
        CASE WHEN $13='CONFIRMED' THEN $15 ELSE NULL END,CASE WHEN $13='CONFIRMED' THEN NOW() ELSE NULL END,$15,NOW())
      ON CONFLICT(business_id) DO UPDATE SET
        currency=EXCLUDED.currency,pay_frequency=EXCLUDED.pay_frequency,
        professional_expense_rate=EXCLUDED.professional_expense_rate,annual_tax_allowance=EXCLUDED.annual_tax_allowance,
        local_surtax_rate=EXCLUDED.local_surtax_rate,employee_social_rate=EXCLUDED.employee_social_rate,
        employer_social_rate=EXCLUDED.employer_social_rate,social_monthly_ceiling=EXCLUDED.social_monthly_ceiling,
        monthly_tax_exempt_threshold=EXCLUDED.monthly_tax_exempt_threshold,tax_brackets=EXCLUDED.tax_brackets,
        compliance_status=EXCLUDED.compliance_status,compliance_note=EXCLUDED.compliance_note,
        compliance_confirmed_by=EXCLUDED.compliance_confirmed_by,compliance_confirmed_at=EXCLUDED.compliance_confirmed_at,
        updated_by=EXCLUDED.updated_by,updated_at=NOW()
      WHERE payroll_settings.tenant_id=EXCLUDED.tenant_id RETURNING *`,
      [scope.businessId, scope.tenantId, settings.currency, settings.payFrequency,
        settings.professionalExpenseRate, settings.annualTaxAllowance, settings.localSurtaxRate,
        settings.employeeSocialRate, settings.employerSocialRate, settings.socialMonthlyCeiling,
        settings.monthlyTaxExemptThreshold, JSON.stringify(settings.taxBrackets), settings.complianceStatus,
        settings.complianceNote || null, scope.actorId],
    )
    if (!row.rows[0]) throw new Error("Payroll settings belong to another tenant")
    await writeAuditWithClient(client, scope, "UPDATE_SETTINGS", "Payroll", `Payroll settings saved as ${settings.complianceStatus}`, scope.businessId)
    return settingsFromRow(row.rows[0])
  })
}

export async function generatePayrollRun(scope: CompanyScope & {
  periodStart: string
  periodEnd: string
  payDate: string
  adjustments?: Record<string, { earnings?: PayrollAdjustment[]; deductions?: PayrollAdjustment[] }>
}) {
  return withAccountingTransaction(async (client) => {
    const settings = await settingsWithClient(client, scope)
    const employees = await client.query(
      `SELECT id,full_name,salary FROM employees
       WHERE tenant_id=$1 AND business_id=$2 AND lower(COALESCE(status,'active'))='active'
         AND salary IS NOT NULL AND salary>=0 ORDER BY full_name FOR UPDATE`,
      [scope.tenantId, scope.businessId],
    )
    if (!employees.rows.length) throw new Error("No active employees with a salary were found")
    const runId = randomUUID()
    await client.query(
      `INSERT INTO payroll_runs(id,tenant_id,business_id,period_start,period_end,pay_date,currency,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [runId, scope.tenantId, scope.businessId, scope.periodStart, scope.periodEnd, scope.payDate, settings.currency, scope.actorId],
    )
    const totals = { gross: 0, tax: 0, employeeSocial: 0, employerSocial: 0, deductions: 0, net: 0 }
    for (const employee of employees.rows) {
      const adjustment = scope.adjustments?.[String(employee.id)] || {}
      const item = calculatePayrollItem(Number(employee.salary), settings, adjustment.earnings, adjustment.deductions)
      await client.query(
        `INSERT INTO payroll_items(
          id,tenant_id,business_id,payroll_run_id,employee_id,base_salary,earnings,deductions,gross_pay,
          taxable_pay,employee_tax,employee_social,employer_social,other_deductions,net_pay,calculation_snapshot
        ) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$10,$11,$12,$13,$14,$15,$16::jsonb)`,
        [randomUUID(), scope.tenantId, scope.businessId, runId, employee.id, item.baseSalary,
          JSON.stringify(item.earnings), JSON.stringify(item.deductions), item.grossPay, item.taxablePay,
          item.employeeTax, item.employeeSocial, item.employerSocial, item.otherDeductions, item.netPay,
          JSON.stringify(item.calculationSnapshot)],
      )
      totals.gross += item.grossPay
      totals.tax += item.employeeTax
      totals.employeeSocial += item.employeeSocial
      totals.employerSocial += item.employerSocial
      totals.deductions += item.otherDeductions
      totals.net += item.netPay
    }
    if (currency(totals.gross) <= 0) throw new Error("Payroll gross total must be positive")
    await client.query(
      `UPDATE payroll_runs SET total_gross=$1,total_employee_tax=$2,total_employee_social=$3,
       total_employer_social=$4,total_other_deductions=$5,total_net=$6,updated_at=NOW()
       WHERE id=$7 AND tenant_id=$8 AND business_id=$9`,
      [currency(totals.gross), currency(totals.tax), currency(totals.employeeSocial),
        currency(totals.employerSocial), currency(totals.deductions), currency(totals.net),
        runId, scope.tenantId, scope.businessId],
    )
    await writeAuditWithClient(client, scope, "GENERATE_PAYROLL", "Payroll", `Generated payroll for ${employees.rows.length} employees`, runId)
    return { id: runId, employeeCount: employees.rows.length, complianceStatus: settings.complianceStatus }
  })
}

async function lockRun(client: PoolClient, scope: CompanyScope, runId: string) {
  const result = await client.query(
    "SELECT * FROM payroll_runs WHERE id=$1 AND tenant_id=$2 AND business_id=$3 FOR UPDATE",
    [runId, scope.tenantId, scope.businessId],
  )
  if (!result.rows[0]) throw new Error("Payroll run was not found in this company")
  return result.rows[0]
}

export async function approvePayrollRun(scope: CompanyScope, runId: string) {
  return withAccountingTransaction(async (client) => {
    const settings = await settingsWithClient(client, scope)
    if (settings.complianceStatus !== "CONFIRMED") throw new Error("Payroll settings must be reviewed and confirmed before approval")
    const run = await lockRun(client, scope, runId)
    if (run.status !== "DRAFT") throw new Error("Only a draft payroll run can be approved")
    await client.query(
      "UPDATE payroll_runs SET status='APPROVED',approved_by=$1,approved_at=NOW(),updated_at=NOW() WHERE id=$2",
      [scope.actorId, runId],
    )
    await client.query(
      `UPDATE employees SET salary_payment_status='Pending'
       WHERE tenant_id=$1 AND business_id=$2 AND id IN
         (SELECT employee_id FROM payroll_items WHERE payroll_run_id=$3 AND tenant_id=$1 AND business_id=$2)`,
      [scope.tenantId, scope.businessId, runId],
    )
    await writeAuditWithClient(client, scope, "APPROVE_PAYROLL", "Payroll", "Payroll run approved", runId)
    return { id: runId, status: "APPROVED" as const }
  })
}

export async function postPayrollRun(scope: CompanyScope, runId: string) {
  return withAccountingTransaction(async (client) => {
    const settings = await settingsWithClient(client, scope)
    if (settings.complianceStatus !== "CONFIRMED") throw new Error("Payroll settings must be reviewed and confirmed before posting")
    const run = await lockRun(client, scope, runId)
    if (run.status !== "APPROVED") throw new Error("Only an approved payroll run can be posted")
    const journal = await postJournalEntryWithClient(client, {
      ...scope,
      entryDate: new Date(run.pay_date).toISOString().slice(0, 10),
      reference: `PAY-${runId.slice(0, 16)}`,
      description: `Payroll ${new Date(run.period_start).toISOString().slice(0, 10)} to ${new Date(run.period_end).toISOString().slice(0, 10)}`,
      sourceType: "PAYROLL_RUN",
      sourceId: runId,
      lines: [
        { systemCode: "PAYROLL_EXPENSE", debit: Number(run.total_gross) },
        ...(Number(run.total_employer_social) > 0 ? [{ systemCode: "EMPLOYER_SOCIAL_EXPENSE", debit: Number(run.total_employer_social) }] : []),
        ...(Number(run.total_employee_tax) > 0 ? [{ systemCode: "TAX_PAYABLE", credit: Number(run.total_employee_tax) }] : []),
        ...(Number(run.total_employee_social) + Number(run.total_employer_social) > 0
          ? [{ systemCode: "SOCIAL_PAYABLE", credit: Number(run.total_employee_social) + Number(run.total_employer_social) }] : []),
        ...(Number(run.total_other_deductions) > 0 ? [{ systemCode: "DEDUCTIONS_PAYABLE", credit: Number(run.total_other_deductions) }] : []),
        ...(Number(run.total_net) > 0 ? [{ systemCode: "PAYROLL_PAYABLE", credit: Number(run.total_net) }] : []),
      ],
    })
    await client.query(
      "UPDATE payroll_runs SET status='POSTED',journal_entry_id=$1,posted_by=$2,posted_at=NOW(),updated_at=NOW() WHERE id=$3",
      [journal.id, scope.actorId, runId],
    )
    await writeAuditWithClient(client, scope, "POST_PAYROLL", "Payroll", "Payroll run posted to accounting", runId)
    return { id: runId, status: "POSTED" as const, journalEntryId: journal.id }
  })
}

export async function payPayrollRun(scope: CompanyScope, runId: string, method: "CASH" | "BANK", bankAccountId?: string | null) {
  return withAccountingTransaction(async (client) => {
    const run = await lockRun(client, scope, runId)
    if (run.status !== "POSTED") throw new Error("Only a posted payroll run can be paid")
    if (Number(run.total_net) <= 0) throw new Error("A zero-value payroll run does not require payment")
    let settlementLine = { systemCode: method, credit: Number(run.total_net) } as { systemCode?: string; accountId?: string; credit: number }
    if (method === "BANK" && bankAccountId) {
      const bank = await client.query(
        "SELECT ledger_account_id FROM bank_accounts WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND is_active",
        [bankAccountId, scope.tenantId, scope.businessId],
      )
      if (!bank.rows[0]) throw new Error("Bank account was not found in this company")
      settlementLine = { accountId: String(bank.rows[0].ledger_account_id), credit: Number(run.total_net) }
    }
    const journal = await postJournalEntryWithClient(client, {
      ...scope,
      entryDate: new Date().toISOString().slice(0, 10),
      reference: `PAYMENT-${runId.slice(0, 16)}`,
      description: `Payroll payment for run ${runId}`,
      sourceType: "PAYROLL_PAYMENT",
      sourceId: runId,
      lines: [
        { systemCode: "PAYROLL_PAYABLE", debit: Number(run.total_net) },
        settlementLine,
      ],
    })
    await client.query(
      "UPDATE payroll_runs SET status='PAID',payment_journal_entry_id=$1,paid_by=$2,paid_at=NOW(),updated_at=NOW() WHERE id=$3",
      [journal.id, scope.actorId, runId],
    )
    await client.query(
      `UPDATE employees SET salary_payment_status='Paid'
       WHERE tenant_id=$1 AND business_id=$2 AND id IN
         (SELECT employee_id FROM payroll_items WHERE payroll_run_id=$3 AND tenant_id=$1 AND business_id=$2)`,
      [scope.tenantId, scope.businessId, runId],
    )
    await writeAuditWithClient(client, scope, "PAY_PAYROLL", "Payroll", `Payroll paid via ${method}`, runId)
    return { id: runId, status: "PAID" as const, journalEntryId: journal.id }
  })
}

export async function voidDraftPayrollRun(scope: CompanyScope, runId: string) {
  return withAccountingTransaction(async (client) => {
    const run = await lockRun(client, scope, runId)
    if (run.status !== "DRAFT") throw new Error("Only a draft payroll run can be voided")
    await client.query("UPDATE payroll_runs SET status='VOID',updated_at=NOW() WHERE id=$1", [runId])
    await writeAuditWithClient(client, scope, "VOID_PAYROLL", "Payroll", "Draft payroll run voided", runId)
    return { id: runId, status: "VOID" as const }
  })
}
