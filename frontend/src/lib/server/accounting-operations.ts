import { randomUUID } from "crypto"

import {
  ensureDefaultAccounts,
  postJournalEntryWithClient,
  withAccountingTransaction,
  writeAuditWithClient,
  type CompanyScope,
  type JournalLineInput,
} from "./accounting"
import { db } from "./neon"

function amount(value: number) {
  const number = Number(value)
  if (!Number.isFinite(number) || number <= 0) throw new Error("Amount must be a positive number")
  return Math.round((number + Number.EPSILON) * 100) / 100
}

export async function getAccountingWorkspace(tenantId: string, businessId: string, throughDate: string) {
  const sql = db()
  const accounts = await sql`SELECT a.id,a.code,a.name,a.account_type,a.normal_balance,a.system_code,a.is_active,
      COALESCE(SUM(CASE WHEN j.status='POSTED' AND j.entry_date<=${throughDate}::date THEN l.debit ELSE 0 END),0) AS total_debit,
      COALESCE(SUM(CASE WHEN j.status='POSTED' AND j.entry_date<=${throughDate}::date THEN l.credit ELSE 0 END),0) AS total_credit
    FROM chart_of_accounts a
    LEFT JOIN journal_lines l ON l.tenant_id=a.tenant_id AND l.business_id=a.business_id AND l.account_id=a.id
    LEFT JOIN journal_entries j ON j.tenant_id=l.tenant_id AND j.business_id=l.business_id AND j.id=l.journal_entry_id
    WHERE a.tenant_id=${tenantId} AND a.business_id=${businessId}
    GROUP BY a.id ORDER BY a.code`
  const periods = await sql`SELECT * FROM fiscal_periods
    WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY starts_on DESC`
  const entries = await sql`SELECT j.id,j.entry_date,j.reference,j.description,j.source_type,j.source_id,j.status,
      j.reversal_of_id,j.created_at,j.posted_at,
      COALESCE(json_agg(json_build_object(
        'id',l.id,'accountId',l.account_id,'accountCode',a.code,'accountName',a.name,
        'description',l.description,'debit',l.debit,'credit',l.credit,'lineNumber',l.line_number
      ) ORDER BY l.line_number) FILTER (WHERE l.id IS NOT NULL),'[]'::json) AS lines
    FROM journal_entries j
    LEFT JOIN journal_lines l ON l.tenant_id=j.tenant_id AND l.business_id=j.business_id AND l.journal_entry_id=j.id
    LEFT JOIN chart_of_accounts a ON a.tenant_id=l.tenant_id AND a.business_id=l.business_id AND a.id=l.account_id
    WHERE j.tenant_id=${tenantId} AND j.business_id=${businessId}
    GROUP BY j.id ORDER BY j.entry_date DESC,j.created_at DESC LIMIT 200`
  const receivables = await sql`SELECT ri.*,c.customer_name FROM receivable_invoices ri
    JOIN customers c ON c.tenant_id=ri.tenant_id AND c.business_id=ri.business_id AND c.id=ri.customer_id
    WHERE ri.tenant_id=${tenantId} AND ri.business_id=${businessId} ORDER BY ri.due_date,ri.created_at DESC`
  const payables = await sql`SELECT pb.*,s.supplier_name FROM payable_bills pb
    JOIN suppliers s ON s.tenant_id=pb.tenant_id AND s.business_id=pb.business_id AND s.id=pb.supplier_id
    WHERE pb.tenant_id=${tenantId} AND pb.business_id=${businessId} ORDER BY pb.due_date,pb.created_at DESC`
  const bankAccounts = await sql`SELECT ba.*,
      COALESCE(SUM(CASE WHEN j.status='POSTED' THEN l.debit-l.credit ELSE 0 END),0) AS ledger_balance
    FROM bank_accounts ba
    LEFT JOIN journal_lines l ON l.tenant_id=ba.tenant_id AND l.business_id=ba.business_id AND l.account_id=ba.ledger_account_id
    LEFT JOIN journal_entries j ON j.tenant_id=l.tenant_id AND j.business_id=l.business_id AND j.id=l.journal_entry_id
    WHERE ba.tenant_id=${tenantId} AND ba.business_id=${businessId}
    GROUP BY ba.id ORDER BY ba.account_name`
  const bankTransactions = await sql`SELECT bt.*,ba.account_name FROM bank_transactions bt
    JOIN bank_accounts ba ON ba.tenant_id=bt.tenant_id AND ba.business_id=bt.business_id AND ba.id=bt.bank_account_id
    WHERE bt.tenant_id=${tenantId} AND bt.business_id=${businessId}
    ORDER BY bt.transaction_date DESC,bt.created_at DESC LIMIT 500`
  const customers = await sql`SELECT id,customer_name FROM customers
    WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY customer_name`
  const suppliers = await sql`SELECT id,supplier_name FROM suppliers
    WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY supplier_name`

  const normalizedAccounts = accounts.map((row) => {
    const debit = Number(row.total_debit)
    const credit = Number(row.total_credit)
    const normalBalance = String(row.normal_balance)
    return {
      id: row.id, code: row.code, name: row.name, accountType: row.account_type,
      normalBalance, systemCode: row.system_code, isActive: row.is_active,
      totalDebit: debit, totalCredit: credit,
      balance: normalBalance === "DEBIT" ? debit - credit : credit - debit,
    }
  })
  const sumType = (type: string) => normalizedAccounts
    .filter((account) => account.accountType === type)
    .reduce((sum, account) => sum + account.balance, 0)
  const assets = sumType("ASSET")
  const liabilities = sumType("LIABILITY")
  const equityBeforeResult = sumType("EQUITY")
  const revenue = sumType("REVENUE")
  const expenses = sumType("EXPENSE")
  const netIncome = revenue - expenses
  return {
    throughDate,
    accounts: normalizedAccounts,
    trialBalance: {
      totalDebits: normalizedAccounts.reduce((sum, account) => sum + account.totalDebit, 0),
      totalCredits: normalizedAccounts.reduce((sum, account) => sum + account.totalCredit, 0),
    },
    incomeStatement: { revenue, expenses, netIncome },
    balanceSheet: {
      assets, liabilities, equity: equityBeforeResult + netIncome,
      liabilitiesAndEquity: liabilities + equityBeforeResult + netIncome,
      difference: assets - liabilities - equityBeforeResult - netIncome,
    },
    periods: periods.map((row) => ({ id: row.id, name: row.name, startsOn: row.starts_on, endsOn: row.ends_on, status: row.status, closedAt: row.closed_at })),
    entries: entries.map((row) => ({
      id: row.id, entryDate: row.entry_date, reference: row.reference, description: row.description,
      sourceType: row.source_type, sourceId: row.source_id, status: row.status,
      reversalOfId: row.reversal_of_id, createdAt: row.created_at, postedAt: row.posted_at,
      lines: (row.lines as Array<Record<string, unknown>>).map((line) => ({ ...line, debit: Number(line.debit), credit: Number(line.credit) })),
    })),
    receivables: receivables.map((row) => ({
      id: row.id, customerId: row.customer_id, customerName: row.customer_name, invoiceNumber: row.invoice_number,
      issueDate: row.issue_date, dueDate: row.due_date, description: row.description, totalAmount: Number(row.total_amount),
      amountPaid: Number(row.amount_paid), outstanding: Number(row.total_amount) - Number(row.amount_paid), status: row.status,
    })),
    payables: payables.map((row) => ({
      id: row.id, supplierId: row.supplier_id, supplierName: row.supplier_name, billNumber: row.bill_number,
      issueDate: row.issue_date, dueDate: row.due_date, description: row.description, totalAmount: Number(row.total_amount),
      amountPaid: Number(row.amount_paid), outstanding: Number(row.total_amount) - Number(row.amount_paid), status: row.status,
    })),
    bankAccounts: bankAccounts.map((row) => ({
      id: row.id, accountName: row.account_name, bankName: row.bank_name, maskedAccountNumber: row.masked_account_number,
      currency: row.currency, ledgerAccountId: row.ledger_account_id, openingBalance: Number(row.opening_balance),
      ledgerBalance: Number(row.ledger_balance), isActive: row.is_active,
    })),
    bankTransactions: bankTransactions.map((row) => ({
      id: row.id, bankAccountId: row.bank_account_id, accountName: row.account_name,
      transactionDate: row.transaction_date, description: row.description, reference: row.reference,
      amount: Number(row.amount), status: row.status, matchedJournalEntryId: row.matched_journal_entry_id,
    })),
    customers: customers.map((row) => ({ id: row.id, name: row.customer_name })),
    suppliers: suppliers.map((row) => ({ id: row.id, name: row.supplier_name })),
  }
}

export async function bootstrapAccounting(scope: CompanyScope) {
  return withAccountingTransaction(async (client) => {
    const accounts = await ensureDefaultAccounts(client, scope)
    await writeAuditWithClient(client, scope, "BOOTSTRAP_ACCOUNTS", "Accounting", "Default chart of accounts initialized", scope.businessId)
    return { accountCount: accounts.size }
  })
}

export async function createLedgerAccount(scope: CompanyScope & {
  code: string
  name: string
  accountType: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"
  normalBalance: "DEBIT" | "CREDIT"
  description?: string | null
}) {
  return withAccountingTransaction(async (client) => {
    const id = randomUUID()
    await client.query(
      `INSERT INTO chart_of_accounts(id,tenant_id,business_id,code,name,account_type,normal_balance,description,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, scope.tenantId, scope.businessId, scope.code.trim(), scope.name.trim(), scope.accountType,
        scope.normalBalance, scope.description || null, scope.actorId],
    )
    await writeAuditWithClient(client, scope, "CREATE_ACCOUNT", "Accounting", `Created ledger account ${scope.code}`, id)
    return { id }
  })
}

export async function createFiscalPeriod(scope: CompanyScope & { name: string; startsOn: string; endsOn: string }) {
  return withAccountingTransaction(async (client) => {
    const overlap = await client.query(
      `SELECT id FROM fiscal_periods WHERE tenant_id=$1 AND business_id=$2
       AND daterange(starts_on,ends_on,'[]') && daterange($3::date,$4::date,'[]') LIMIT 1`,
      [scope.tenantId, scope.businessId, scope.startsOn, scope.endsOn],
    )
    if (overlap.rows[0]) throw new Error("Fiscal periods cannot overlap")
    const id = randomUUID()
    await client.query(
      `INSERT INTO fiscal_periods(id,tenant_id,business_id,name,starts_on,ends_on,created_by)
       VALUES($1,$2,$3,$4,$5,$6,$7)`,
      [id, scope.tenantId, scope.businessId, scope.name.trim(), scope.startsOn, scope.endsOn, scope.actorId],
    )
    await writeAuditWithClient(client, scope, "CREATE_PERIOD", "Accounting", `Created fiscal period ${scope.name}`, id)
    return { id }
  })
}

export async function closeFiscalPeriod(scope: CompanyScope, periodId: string) {
  return withAccountingTransaction(async (client) => {
    const period = await client.query(
      `SELECT * FROM fiscal_periods WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND status='OPEN' FOR UPDATE`,
      [periodId, scope.tenantId, scope.businessId],
    )
    if (!period.rows[0]) throw new Error("Open fiscal period was not found in this company")
    const drafts = await client.query(
      `SELECT COUNT(*)::integer AS count FROM journal_entries WHERE tenant_id=$1 AND business_id=$2
       AND entry_date BETWEEN $3 AND $4 AND status='DRAFT'`,
      [scope.tenantId, scope.businessId, period.rows[0].starts_on, period.rows[0].ends_on],
    )
    if (Number(drafts.rows[0].count) > 0) throw new Error("Post or remove draft journals before closing this period")
    await client.query(
      "UPDATE fiscal_periods SET status='CLOSED',closed_by=$1,closed_at=NOW() WHERE id=$2",
      [scope.actorId, periodId],
    )
    await writeAuditWithClient(client, scope, "CLOSE_PERIOD", "Accounting", `Closed fiscal period ${String(period.rows[0].name)}`, periodId)
    return { id: periodId, status: "CLOSED" as const }
  })
}

export async function createBankAccount(scope: CompanyScope & {
  accountName: string
  bankName: string
  maskedAccountNumber?: string | null
  currency?: string
  openingBalance?: number
}) {
  return withAccountingTransaction(async (client) => {
    await ensureDefaultAccounts(client, scope)
    const id = randomUUID()
    const ledgerAccountId = randomUUID()
    const openingBalance = Number(scope.openingBalance || 0)
    if (!Number.isFinite(openingBalance)) throw new Error("Opening balance is invalid")
    await client.query(
      `INSERT INTO chart_of_accounts(id,tenant_id,business_id,code,name,account_type,normal_balance,description,created_by)
       VALUES($1,$2,$3,$4,$5,'ASSET','DEBIT',$6,$7)`,
      [ledgerAccountId, scope.tenantId, scope.businessId, `1010-${id.slice(0, 8).toUpperCase()}`,
        `${scope.accountName.trim()} ledger`, `Bank ledger for ${scope.bankName.trim()}`, scope.actorId],
    )
    await client.query(
      `INSERT INTO bank_accounts(
        id,tenant_id,business_id,account_name,bank_name,masked_account_number,currency,ledger_account_id,opening_balance,created_by
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [id, scope.tenantId, scope.businessId, scope.accountName.trim(), scope.bankName.trim(),
        scope.maskedAccountNumber || null, scope.currency || "FCFA", ledgerAccountId,
        openingBalance, scope.actorId],
    )
    if (openingBalance !== 0) {
      const value = Math.abs(openingBalance)
      await postJournalEntryWithClient(client, {
        ...scope,
        entryDate: new Date().toISOString().slice(0, 10),
        reference: `BANK-OPEN-${id.slice(0, 12)}`,
        description: `Opening balance for ${scope.accountName.trim()}`,
        sourceType: "BANK_OPENING",
        sourceId: id,
        lines: openingBalance > 0
          ? [{ accountId: ledgerAccountId, debit: value }, { systemCode: "EQUITY", credit: value }]
          : [{ systemCode: "EQUITY", debit: value }, { accountId: ledgerAccountId, credit: value }],
      })
    }
    await writeAuditWithClient(client, scope, "CREATE_BANK_ACCOUNT", "Accounting", `Created bank account ${scope.accountName}`, id)
    return { id }
  })
}

export async function importBankTransaction(scope: CompanyScope & {
  bankAccountId: string
  transactionDate: string
  description: string
  reference?: string | null
  amount: number
}) {
  return withAccountingTransaction(async (client) => {
    const bank = await client.query(
      "SELECT id FROM bank_accounts WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND is_active",
      [scope.bankAccountId, scope.tenantId, scope.businessId],
    )
    if (!bank.rows[0]) throw new Error("Bank account was not found in this company")
    if (!Number.isFinite(scope.amount) || scope.amount === 0) throw new Error("Bank transaction amount cannot be zero")
    const id = randomUUID()
    await client.query(
      `INSERT INTO bank_transactions(
        id,tenant_id,business_id,bank_account_id,transaction_date,description,reference,amount
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, scope.tenantId, scope.businessId, scope.bankAccountId, scope.transactionDate,
        scope.description.trim(), scope.reference || null, scope.amount],
    )
    await writeAuditWithClient(client, scope, "IMPORT_BANK_TRANSACTION", "Accounting", "Imported bank statement transaction", id)
    return { id }
  })
}

export async function reconcileBankTransaction(scope: CompanyScope, transactionId: string, journalEntryId: string) {
  return withAccountingTransaction(async (client) => {
    const transaction = await client.query(
      `SELECT bt.*,ba.ledger_account_id FROM bank_transactions bt JOIN bank_accounts ba
       ON ba.tenant_id=bt.tenant_id AND ba.business_id=bt.business_id AND ba.id=bt.bank_account_id
       WHERE bt.id=$1 AND bt.tenant_id=$2 AND bt.business_id=$3 AND bt.status='UNMATCHED' FOR UPDATE`,
      [transactionId, scope.tenantId, scope.businessId],
    )
    if (!transaction.rows[0]) throw new Error("Unmatched bank transaction was not found in this company")
    const journalAmount = await client.query(
      `SELECT COALESCE(SUM(l.debit-l.credit),0) AS amount FROM journal_entries j JOIN journal_lines l
       ON l.tenant_id=j.tenant_id AND l.business_id=j.business_id AND l.journal_entry_id=j.id
       WHERE j.id=$1 AND j.tenant_id=$2 AND j.business_id=$3 AND j.status='POSTED' AND l.account_id=$4`,
      [journalEntryId, scope.tenantId, scope.businessId, transaction.rows[0].ledger_account_id],
    )
    if (Math.abs(Number(journalAmount.rows[0].amount) - Number(transaction.rows[0].amount)) > 0.009) {
      throw new Error("The selected journal does not match this bank transaction amount")
    }
    await client.query(
      `UPDATE bank_transactions SET status='RECONCILED',matched_journal_entry_id=$1,reconciled_by=$2,reconciled_at=NOW()
       WHERE id=$3 AND tenant_id=$4 AND business_id=$5`,
      [journalEntryId, scope.actorId, transactionId, scope.tenantId, scope.businessId],
    )
    await writeAuditWithClient(client, scope, "RECONCILE_BANK", "Accounting", `Reconciled against journal ${journalEntryId}`, transactionId)
    return { id: transactionId, status: "RECONCILED" as const }
  })
}

async function assertParty(
  client: { query: (text: string, values?: unknown[]) => Promise<{ rows: Array<Record<string, unknown>> }> },
  table: "customers" | "suppliers",
  scope: CompanyScope,
  partyId: string,
) {
  const result = await client.query(
    `SELECT id FROM ${table} WHERE id=$1 AND tenant_id=$2 AND business_id=$3`,
    [partyId, scope.tenantId, scope.businessId],
  )
  if (!result.rows[0]) throw new Error(`${table === "customers" ? "Customer" : "Supplier"} was not found in this company`)
}

export async function createReceivableInvoice(scope: CompanyScope & {
  customerId: string
  invoiceNumber: string
  issueDate: string
  dueDate: string
  description: string
  totalAmount: number
}) {
  return withAccountingTransaction(async (client) => {
    await assertParty(client, "customers", scope, scope.customerId)
    const id = randomUUID()
    const total = amount(scope.totalAmount)
    const journal = await postJournalEntryWithClient(client, {
      ...scope, entryDate: scope.issueDate, reference: `AR-${scope.invoiceNumber}`, description: scope.description,
      sourceType: "RECEIVABLE", sourceId: id,
      lines: [
        { systemCode: "AR", debit: total, customerId: scope.customerId },
        { systemCode: "SALES", credit: total, customerId: scope.customerId },
      ],
    })
    await client.query(
      `INSERT INTO receivable_invoices(
        id,tenant_id,business_id,customer_id,invoice_number,issue_date,due_date,description,total_amount,journal_entry_id,created_by
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, scope.tenantId, scope.businessId, scope.customerId, scope.invoiceNumber.trim(), scope.issueDate,
        scope.dueDate, scope.description.trim(), total, journal.id, scope.actorId],
    )
    return { id, journalEntryId: journal.id }
  })
}

export async function createPayableBill(scope: CompanyScope & {
  supplierId: string
  billNumber: string
  issueDate: string
  dueDate: string
  description: string
  totalAmount: number
}) {
  return withAccountingTransaction(async (client) => {
    await assertParty(client, "suppliers", scope, scope.supplierId)
    const id = randomUUID()
    const total = amount(scope.totalAmount)
    const journal = await postJournalEntryWithClient(client, {
      ...scope, entryDate: scope.issueDate, reference: `AP-${scope.billNumber}`, description: scope.description,
      sourceType: "PAYABLE", sourceId: id,
      lines: [
        { systemCode: "OPERATING_EXPENSE", debit: total, supplierId: scope.supplierId },
        { systemCode: "AP", credit: total, supplierId: scope.supplierId },
      ],
    })
    await client.query(
      `INSERT INTO payable_bills(
        id,tenant_id,business_id,supplier_id,bill_number,issue_date,due_date,description,total_amount,journal_entry_id,created_by
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [id, scope.tenantId, scope.businessId, scope.supplierId, scope.billNumber.trim(), scope.issueDate,
        scope.dueDate, scope.description.trim(), total, journal.id, scope.actorId],
    )
    return { id, journalEntryId: journal.id }
  })
}

export async function recordAccountingPayment(scope: CompanyScope & {
  direction: "RECEIPT" | "PAYMENT"
  documentId: string
  paymentDate: string
  amount: number
  method: "CASH" | "BANK"
  bankAccountId?: string | null
  reference?: string | null
}) {
  return withAccountingTransaction(async (client) => {
    const total = amount(scope.amount)
    const receivable = scope.direction === "RECEIPT"
    const table = receivable ? "receivable_invoices" : "payable_bills"
    const document = await client.query(
      `SELECT * FROM ${table} WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND status IN ('OPEN','PARTIAL') FOR UPDATE`,
      [scope.documentId, scope.tenantId, scope.businessId],
    )
    if (!document.rows[0]) throw new Error("Open accounting document was not found in this company")
    const outstanding = Number(document.rows[0].total_amount) - Number(document.rows[0].amount_paid)
    if (total - outstanding > 0.009) throw new Error("Payment exceeds the outstanding amount")
    let settlementLine: JournalLineInput = { systemCode: scope.method, debit: receivable ? total : 0, credit: receivable ? 0 : total }
    if (scope.method === "BANK" && scope.bankAccountId) {
      const bank = await client.query(
        "SELECT ledger_account_id FROM bank_accounts WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND is_active",
        [scope.bankAccountId, scope.tenantId, scope.businessId],
      )
      if (!bank.rows[0]) throw new Error("Bank account was not found in this company")
      settlementLine = { accountId: String(bank.rows[0].ledger_account_id), debit: receivable ? total : 0, credit: receivable ? 0 : total }
    }
    const id = randomUUID()
    const journal = await postJournalEntryWithClient(client, {
      ...scope, entryDate: scope.paymentDate, reference: `${scope.direction}-${id.slice(0, 16)}`,
      description: `${scope.direction === "RECEIPT" ? "Customer receipt" : "Supplier payment"} ${scope.reference || ""}`.trim(),
      sourceType: "ACCOUNTING_PAYMENT", sourceId: id,
      lines: receivable
        ? [settlementLine, { systemCode: "AR", credit: total, customerId: String(document.rows[0].customer_id) }]
        : [{ systemCode: "AP", debit: total, supplierId: String(document.rows[0].supplier_id) }, settlementLine],
    })
    await client.query(
      `INSERT INTO accounting_payments(
        id,tenant_id,business_id,direction,receivable_invoice_id,payable_bill_id,bank_account_id,payment_date,amount,reference,journal_entry_id,created_by
      ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [id, scope.tenantId, scope.businessId, scope.direction,
        receivable ? scope.documentId : null, receivable ? null : scope.documentId,
        scope.bankAccountId || null, scope.paymentDate, total, scope.reference || null, journal.id, scope.actorId],
    )
    const paid = Number(document.rows[0].amount_paid) + total
    await client.query(
      `UPDATE ${table} SET amount_paid=$1,status=CASE WHEN $1>=total_amount THEN 'PAID' ELSE 'PARTIAL' END,updated_at=NOW()
       WHERE id=$2 AND tenant_id=$3 AND business_id=$4`,
      [paid, scope.documentId, scope.tenantId, scope.businessId],
    )
    return { id, journalEntryId: journal.id }
  })
}
