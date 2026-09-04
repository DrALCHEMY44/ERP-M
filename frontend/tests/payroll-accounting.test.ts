import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

import { DEFAULT_ACCOUNTS, postJournalEntryWithClient } from "../src/lib/server/accounting"
import { calculatePayrollItem, validateTaxBrackets, type PayrollSettings } from "../src/lib/server/payroll"
import { requireTrustedMutationOrigin } from "../src/lib/server/origin"

const settings: PayrollSettings = {
  currency: "FCFA",
  payFrequency: "MONTHLY",
  professionalExpenseRate: 30,
  annualTaxAllowance: 500_000,
  localSurtaxRate: 10,
  employeeSocialRate: 2.8,
  employerSocialRate: 4.2,
  socialMonthlyCeiling: 300_000,
  monthlyTaxExemptThreshold: 62_000,
  taxBrackets: [
    { upTo: 2_000_000, rate: 10 },
    { upTo: 3_000_000, rate: 15 },
    { upTo: 5_000_000, rate: 25 },
    { upTo: null, rate: 35 },
  ],
  complianceStatus: "CONFIRMED",
}

test("payroll calculation preserves gross-to-net and employer liability identities", () => {
  const item = calculatePayrollItem(
    100_000,
    settings,
    [{ label: "Transport allowance", amount: 10_000 }],
    [{ label: "Advance repayment", amount: 2_000 }],
  )
  assert.equal(item.grossPay, 110_000)
  assert.equal(item.employeeSocial, 3_080)
  assert.equal(item.employerSocial, 4_620)
  assert.equal(
    item.netPay,
    Math.round((item.grossPay - item.employeeTax - item.employeeSocial - item.otherDeductions) * 100) / 100,
  )
  const postingDebits = item.grossPay + item.employerSocial
  const postingCredits = item.employeeTax + item.employeeSocial + item.employerSocial + item.otherDeductions + item.netPay
  assert.equal(Math.round(postingDebits * 100), Math.round(postingCredits * 100))
})

test("payroll brackets reject ambiguous or decreasing limits", () => {
  assert.throws(() => validateTaxBrackets([{ upTo: null, rate: 10 }, { upTo: 100, rate: 20 }]), /final tax bracket/)
  assert.throws(() => validateTaxBrackets([{ upTo: 200, rate: 10 }, { upTo: 100, rate: 20 }]), /must increase/)
  assert.throws(() => validateTaxBrackets([{ upTo: 200, rate: 10 }]), /must be open-ended/)
  assert.throws(() => calculatePayrollItem(10, settings, [], [{ label: "Invalid", amount: 20 }]), /exceed gross pay/)
})

test("cookie mutations require a trusted origin while mobile bearer requests remain supported", () => {
  const previous = process.env.ALLOWED_ORIGINS
  process.env.ALLOWED_ORIGINS = "https://erp.example.test"
  try {
    assert.doesNotThrow(() => requireTrustedMutationOrigin(new Request("https://erp.example.test/api/payroll", {
      method: "POST", headers: { origin: "https://erp.example.test" },
    })))
    assert.throws(() => requireTrustedMutationOrigin(new Request("https://erp.example.test/api/payroll", {
      method: "POST", headers: { origin: "https://attacker.example" },
    })), /untrusted request origin/)
    assert.doesNotThrow(() => requireTrustedMutationOrigin(new Request("https://erp.example.test/api/payroll", {
      method: "POST", headers: { authorization: "Bearer mobile-session" },
    })))
  } finally {
    if (previous === undefined) delete process.env.ALLOWED_ORIGINS
    else process.env.ALLOWED_ORIGINS = previous
  }
})

class FakeJournalClient {
  lineInserts = 0
  posted = false
  async query(text: string, values: unknown[] = []) {
    if (text.includes("SELECT id,system_code FROM chart_of_accounts")) {
      return { rows: DEFAULT_ACCOUNTS.map((account) => ({ id: `account-${account.system}`, system_code: account.system })) }
    }
    if (text.includes("SELECT id FROM chart_of_accounts")) {
      return { rows: (values[2] as string[]).map((id) => ({ id })) }
    }
    if (text.includes("SELECT status FROM fiscal_periods")) return { rows: [{ status: "OPEN" }] }
    if (text.includes("INSERT INTO journal_lines")) this.lineInserts++
    if (text.includes("UPDATE journal_entries SET status='POSTED'")) this.posted = true
    if (text.includes("INSERT INTO activity_logs")) return { rows: [{ id: "audit-1" }] }
    return { rows: [] }
  }
}

test("journal service posts balanced lines and refuses an unbalanced entry", async () => {
  const client = new FakeJournalClient()
  const common = {
    tenantId: "tenant-a", businessId: "business-a", actorId: "owner-a",
    entryDate: "2026-09-03", reference: "MANUAL-1", description: "Opening test",
    sourceType: "MANUAL", sourceId: null,
  }
  await postJournalEntryWithClient(client as never, {
    ...common,
    lines: [{ systemCode: "CASH", debit: 500 }, { systemCode: "EQUITY", credit: 500 }],
  })
  assert.equal(client.lineInserts, 2)
  assert.equal(client.posted, true)
  await assert.rejects(() => postJournalEntryWithClient(new FakeJournalClient() as never, {
    ...common, reference: "MANUAL-2",
    lines: [{ systemCode: "CASH", debit: 500 }, { systemCode: "EQUITY", credit: 499 }],
  }), /must balance/)
})

test("HR, payroll, and accounting APIs are authenticated and company-scoped", async () => {
  const files = await Promise.all([
    "src/app/api/hr/route.ts", "src/app/api/payroll/route.ts", "src/app/api/accounting/route.ts",
    "src/lib/server/hr.ts", "src/lib/server/payroll.ts", "src/lib/server/accounting-operations.ts",
    "migrations/011_hr_payroll_accounting.sql",
  ].map((file) => readFile(new URL(`../${file}`, import.meta.url), "utf8")))
  const [hrRoute, payrollRoute, accountingRoute, hr, payroll, accounting, migration] = files
  for (const route of [hrRoute, payrollRoute, accountingRoute]) {
    assert.match(route, /authorizeRequest\(request\)/)
    assert.match(route, /requirePermission/)
    assert.match(route, /requireTrustedMutationOrigin\(request\)/)
    assert.doesNotMatch(route, /input\.(tenantId|businessId)/)
  }
  for (const service of [hr, payroll, accounting]) {
    assert.match(service, /tenant_id=\$|tenant_id=\$\{|tenant_id,/)
    assert.match(service, /business_id=\$|business_id=\$\{|business_id,/)
  }
  assert.match(payroll, /complianceStatus !== "CONFIRMED"/)
  assert.match(migration, /Posted journal entries are immutable/)
  assert.match(migration, /Journal entry must contain at least two balanced non-zero lines/)
  assert.match(migration, /FOREIGN KEY \(tenant_id, business_id, employee_id\)/)
})
