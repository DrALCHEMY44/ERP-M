import { randomUUID } from "crypto"
import type { PoolClient } from "@neondatabase/serverless"

import { pooledDb } from "./neon"

export type CompanyScope = {
  tenantId: string
  businessId: string
  actorId: string
}

export type JournalLineInput = {
  accountId?: string
  systemCode?: string
  description?: string | null
  debit?: number
  credit?: number
  employeeId?: string | null
  customerId?: string | null
  supplierId?: string | null
}

export type JournalInput = CompanyScope & {
  entryDate: string
  reference: string
  description: string
  sourceType: string
  sourceId?: string | null
  reversalOfId?: string | null
  lines: JournalLineInput[]
}

export const DEFAULT_ACCOUNTS = [
  { code: "1000", name: "Cash on hand", type: "ASSET", normal: "DEBIT", system: "CASH" },
  { code: "1010", name: "Bank and mobile money", type: "ASSET", normal: "DEBIT", system: "BANK" },
  { code: "1100", name: "Trade receivables", type: "ASSET", normal: "DEBIT", system: "AR" },
  { code: "1200", name: "Inventory", type: "ASSET", normal: "DEBIT", system: "INVENTORY" },
  { code: "2000", name: "Trade payables", type: "LIABILITY", normal: "CREDIT", system: "AP" },
  { code: "2100", name: "Payroll payable", type: "LIABILITY", normal: "CREDIT", system: "PAYROLL_PAYABLE" },
  { code: "2110", name: "Employee tax payable", type: "LIABILITY", normal: "CREDIT", system: "TAX_PAYABLE" },
  { code: "2120", name: "Social contributions payable", type: "LIABILITY", normal: "CREDIT", system: "SOCIAL_PAYABLE" },
  { code: "2130", name: "Other payroll deductions payable", type: "LIABILITY", normal: "CREDIT", system: "DEDUCTIONS_PAYABLE" },
  { code: "3000", name: "Owner equity", type: "EQUITY", normal: "CREDIT", system: "EQUITY" },
  { code: "4000", name: "Sales revenue", type: "REVENUE", normal: "CREDIT", system: "SALES" },
  { code: "5000", name: "Cost of goods sold", type: "EXPENSE", normal: "DEBIT", system: "COGS" },
  { code: "6000", name: "Operating expenses", type: "EXPENSE", normal: "DEBIT", system: "OPERATING_EXPENSE" },
  { code: "6100", name: "Payroll expense", type: "EXPENSE", normal: "DEBIT", system: "PAYROLL_EXPENSE" },
  { code: "6110", name: "Employer social contribution expense", type: "EXPENSE", normal: "DEBIT", system: "EMPLOYER_SOCIAL_EXPENSE" },
] as const

function money(value: unknown) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) throw new Error("Journal amounts must be non-negative numbers")
  return Math.round((parsed + Number.EPSILON) * 100) / 100
}

export async function writeAuditWithClient(
  client: PoolClient,
  scope: CompanyScope,
  actionType: string,
  module: string,
  description: string,
  recordId: string,
) {
  const result = await client.query(
    `INSERT INTO activity_logs(id,tenant_id,business_id,user_id,user_name,action_type,module,description,record_id,timestamp)
     SELECT $1,$2,$3,u.id,COALESCE(NULLIF(u.full_name,''),u.email,u.id),$4,$5,$6,$7,NOW()
     FROM users u WHERE u.id=$8 AND u.tenant_id=$2 AND u.business_id=$3 RETURNING id`,
    [randomUUID(), scope.tenantId, scope.businessId, actionType, module, description, recordId, scope.actorId],
  )
  if (!result.rows[0]) throw new Error("The authenticated actor is outside this company")
}

export async function withAccountingTransaction<T>(work: (client: PoolClient) => Promise<T>) {
  const client = await pooledDb().connect()
  try {
    await client.query("BEGIN")
    const result = await work(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    try { await client.query("ROLLBACK") } catch {}
    throw error
  } finally {
    client.release()
  }
}

export async function ensureDefaultAccounts(client: PoolClient, scope: CompanyScope) {
  await client.query(
    `INSERT INTO chart_of_accounts(
      id,tenant_id,business_id,code,name,account_type,normal_balance,system_code,created_by
    ) SELECT source.id,$1,$2,source.code,source.name,source.account_type,source.normal_balance,source.system_code,$3
      FROM unnest($4::text[],$5::text[],$6::text[],$7::text[],$8::text[],$9::text[])
        AS source(id,code,name,account_type,normal_balance,system_code)
      ON CONFLICT(tenant_id,business_id,code) DO NOTHING`,
    [scope.tenantId, scope.businessId, scope.actorId,
      DEFAULT_ACCOUNTS.map(() => randomUUID()), DEFAULT_ACCOUNTS.map((account) => account.code),
      DEFAULT_ACCOUNTS.map((account) => account.name), DEFAULT_ACCOUNTS.map((account) => account.type),
      DEFAULT_ACCOUNTS.map((account) => account.normal), DEFAULT_ACCOUNTS.map((account) => account.system)],
  )
  const result = await client.query(
    `SELECT id,system_code FROM chart_of_accounts
     WHERE tenant_id=$1 AND business_id=$2 AND system_code IS NOT NULL AND is_active`,
    [scope.tenantId, scope.businessId],
  )
  const accounts = new Map<string, string>(result.rows.map((row) => [String(row.system_code), String(row.id)]))
  const missing = DEFAULT_ACCOUNTS.filter((account) => !accounts.has(account.system)).map((account) => account.system)
  if (missing.length) throw new Error(`Required system accounts are missing: ${missing.join(", ")}`)
  return accounts
}

export async function postJournalEntryWithClient(client: PoolClient, input: JournalInput) {
  if (input.lines.length < 2) throw new Error("A journal entry requires at least two lines")
  if (input.sourceId) {
    const duplicate = await client.query(
      `SELECT id,reference FROM journal_entries
       WHERE tenant_id=$1 AND business_id=$2 AND source_type=$3 AND source_id=$4`,
      [input.tenantId, input.businessId, input.sourceType, input.sourceId],
    )
    if (duplicate.rows[0]) return { id: String(duplicate.rows[0].id), reference: String(duplicate.rows[0].reference), duplicate: true }
  }

  const systemAccounts = await ensureDefaultAccounts(client, input)
  const accountIds = input.lines.map((line) => line.accountId || systemAccounts.get(String(line.systemCode || "")))
  if (accountIds.some((id) => !id)) throw new Error("Every journal line must reference a valid account")
  const allowed = await client.query(
    `SELECT id FROM chart_of_accounts
     WHERE tenant_id=$1 AND business_id=$2 AND is_active AND id=ANY($3::text[])`,
    [input.tenantId, input.businessId, accountIds],
  )
  if (allowed.rows.length !== new Set(accountIds).size) throw new Error("A journal account is inactive or outside this company")

  const normalized = input.lines.map((line, index) => ({
    ...line,
    accountId: accountIds[index]!,
    debit: money(line.debit ?? 0),
    credit: money(line.credit ?? 0),
  }))
  for (const line of normalized) {
    if ((line.debit > 0) === (line.credit > 0)) throw new Error("Each journal line must have either a debit or a credit")
  }
  const debit = money(normalized.reduce((sum, line) => sum + line.debit, 0))
  const credit = money(normalized.reduce((sum, line) => sum + line.credit, 0))
  if (debit <= 0 || debit !== credit) throw new Error("Journal debits and credits must balance")

  const period = await client.query(
    `SELECT status FROM fiscal_periods
     WHERE tenant_id=$1 AND business_id=$2 AND $3::date BETWEEN starts_on AND ends_on
     ORDER BY starts_on DESC LIMIT 1`,
    [input.tenantId, input.businessId, input.entryDate],
  )
  if (period.rows[0]?.status === "CLOSED") throw new Error("The accounting period is closed")

  const id = randomUUID()
  await client.query(
    `INSERT INTO journal_entries(
      id,tenant_id,business_id,entry_date,reference,description,source_type,source_id,reversal_of_id,created_by
    ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
    [id, input.tenantId, input.businessId, input.entryDate, input.reference, input.description, input.sourceType, input.sourceId || null, input.reversalOfId || null, input.actorId],
  )
  for (let index = 0; index < normalized.length; index++) {
    const line = normalized[index]
    await client.query(
      `INSERT INTO journal_lines(
        tenant_id,business_id,journal_entry_id,account_id,line_number,description,debit,credit,employee_id,customer_id,supplier_id
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [input.tenantId, input.businessId, id, line.accountId, index + 1, line.description || null,
        line.debit, line.credit, line.employeeId || null, line.customerId || null, line.supplierId || null],
    )
  }
  await client.query(
    `UPDATE journal_entries SET status='POSTED',posted_by=$1,posted_at=NOW()
     WHERE id=$2 AND tenant_id=$3 AND business_id=$4`,
    [input.actorId, id, input.tenantId, input.businessId],
  )
  await writeAuditWithClient(
    client,
    input,
    "POST_JOURNAL",
    "Accounting",
    `${input.sourceType}: ${input.description}`.slice(0, 1000),
    id,
  )
  return { id, reference: input.reference, duplicate: false }
}

export async function postJournalEntry(input: JournalInput) {
  return withAccountingTransaction((client) => postJournalEntryWithClient(client, input))
}

export async function reverseJournalEntry(scope: CompanyScope, entryId: string, reason: string) {
  return withAccountingTransaction(async (client) => {
    const entry = await client.query(
      `SELECT * FROM journal_entries WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND status='POSTED' FOR UPDATE`,
      [entryId, scope.tenantId, scope.businessId],
    )
    if (!entry.rows[0]) throw new Error("Posted journal entry was not found")
    const existing = await client.query(
      `SELECT id,reference FROM journal_entries WHERE tenant_id=$1 AND business_id=$2 AND reversal_of_id=$3`,
      [scope.tenantId, scope.businessId, entryId],
    )
    if (existing.rows[0]) return { id: String(existing.rows[0].id), reference: String(existing.rows[0].reference), duplicate: true }
    const lines = await client.query(
      `SELECT account_id,description,debit,credit,employee_id,customer_id,supplier_id
       FROM journal_lines WHERE journal_entry_id=$1 ORDER BY line_number`,
      [entryId],
    )
    return postJournalEntryWithClient(client, {
      ...scope,
      entryDate: new Date().toISOString().slice(0, 10),
      reference: `REV-${String(entry.rows[0].reference)}-${randomUUID().slice(0, 8)}`,
      description: `Reversal: ${reason}`,
      sourceType: "REVERSAL",
      sourceId: entryId,
      reversalOfId: entryId,
      lines: lines.rows.map((line) => ({
        accountId: String(line.account_id), description: String(line.description || "Reversal"),
        debit: Number(line.credit), credit: Number(line.debit),
        employeeId: line.employee_id ? String(line.employee_id) : null,
        customerId: line.customer_id ? String(line.customer_id) : null,
        supplierId: line.supplier_id ? String(line.supplier_id) : null,
      })),
    })
  })
}

export async function syncOperationalTransactions(scope: CompanyScope) {
  return withAccountingTransaction(async (client) => {
    const records = await client.query(
      `SELECT t.* FROM transactions t
       WHERE t.tenant_id=$1 AND t.business_id=$2 AND t.voided_at IS NULL
         AND NOT EXISTS (
           SELECT 1 FROM journal_entries j
           WHERE j.tenant_id=t.tenant_id AND j.business_id=t.business_id
             AND j.source_type='TRANSACTION' AND j.source_id=t.id
         )
       ORDER BY t.date,t.created_at FOR UPDATE`,
      [scope.tenantId, scope.businessId],
    )
    let posted = 0
    for (const record of records.rows) {
      const amount = Number(record.amount)
      const sale = record.type === "SALE"
      const journal = await postJournalEntryWithClient(client, {
        ...scope,
        entryDate: new Date(record.date).toISOString().slice(0, 10),
        reference: `TX-${String(record.id).slice(0, 16)}`,
        description: String(record.description || record.category || (sale ? "Recorded sale" : "Recorded expense")),
        sourceType: "TRANSACTION",
        sourceId: String(record.id),
        lines: sale
          ? [{ systemCode: "CASH", debit: amount }, { systemCode: "SALES", credit: amount }]
          : [{ systemCode: "OPERATING_EXPENSE", debit: amount }, { systemCode: "CASH", credit: amount }],
      })
      await client.query(
        `UPDATE transactions SET accounting_journal_entry_id=$1 WHERE id=$2 AND tenant_id=$3 AND business_id=$4`,
        [journal.id, record.id, scope.tenantId, scope.businessId],
      )
      posted++
    }
    return { posted }
  })
}

export async function recordExpense(input: CompanyScope & {
  amount: number
  date: string
  category?: string | null
  description?: string | null
  receiptUrl?: string | null
}) {
  return withAccountingTransaction(async (client) => {
    const amount = money(input.amount)
    if (amount <= 0) throw new Error("Expense amount must be positive")
    const id = randomUUID()
    const journal = await postJournalEntryWithClient(client, {
      ...input,
      entryDate: new Date(input.date).toISOString().slice(0, 10),
      reference: `EXP-${id.slice(0, 16)}`,
      description: input.description || input.category || "Business expense",
      sourceType: "TRANSACTION",
      sourceId: id,
      lines: [
        { systemCode: "OPERATING_EXPENSE", debit: amount, description: input.category },
        { systemCode: "CASH", credit: amount },
      ],
    })
    const result = await client.query(
      `INSERT INTO transactions(
        id,tenant_id,business_id,type,amount,date,category,description,receipt_url,recorded_by,accounting_journal_entry_id
      ) VALUES($1,$2,$3,'EXPENSE',$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [id,input.tenantId,input.businessId,amount,input.date,input.category || null,input.description || null,
        input.receiptUrl || null,input.actorId,journal.id],
    )
    return result.rows[0]
  })
}

export async function voidExpense(scope: CompanyScope, transactionId: string) {
  return withAccountingTransaction(async (client) => {
    const result = await client.query(
      `SELECT * FROM transactions
       WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND type='EXPENSE' AND voided_at IS NULL FOR UPDATE`,
      [transactionId, scope.tenantId, scope.businessId],
    )
    if (!result.rows[0]) throw new Error("Expense was not found or is already voided")
    const journalId = result.rows[0].accounting_journal_entry_id
    if (journalId) {
      const entry = await client.query(
        `SELECT * FROM journal_entries WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND status='POSTED'`,
        [journalId, scope.tenantId, scope.businessId],
      )
      const lines = await client.query(
        `SELECT account_id,description,debit,credit FROM journal_lines WHERE journal_entry_id=$1 ORDER BY line_number`,
        [journalId],
      )
      if (entry.rows[0] && lines.rows.length) {
        await postJournalEntryWithClient(client, {
          ...scope,
          entryDate: new Date().toISOString().slice(0, 10),
          reference: `VOID-${transactionId.slice(0, 12)}-${randomUUID().slice(0, 6)}`,
          description: `Void expense ${transactionId}`,
          sourceType: "REVERSAL",
          sourceId: String(journalId),
          reversalOfId: String(journalId),
          lines: lines.rows.map((line) => ({
            accountId: String(line.account_id), description: "Expense void",
            debit: Number(line.credit), credit: Number(line.debit),
          })),
        })
      }
    }
    await client.query(
      `UPDATE transactions SET voided_at=NOW(),voided_by=$1
       WHERE id=$2 AND tenant_id=$3 AND business_id=$4`,
      [scope.actorId, transactionId, scope.tenantId, scope.businessId],
    )
    return { id: transactionId }
  })
}
