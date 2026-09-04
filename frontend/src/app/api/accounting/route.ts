import { NextResponse } from "next/server"
import { z } from "zod"

import { postJournalEntry, reverseJournalEntry, syncOperationalTransactions } from "@/lib/server/accounting"
import {
  bootstrapAccounting,
  closeFiscalPeriod,
  createBankAccount,
  createFiscalPeriod,
  createLedgerAccount,
  createPayableBill,
  createReceivableInvoice,
  getAccountingWorkspace,
  importBankTransaction,
  reconcileBankTransaction,
  recordAccountingPayment,
} from "@/lib/server/accounting-operations"
import { requirePermission } from "@/lib/server/authorization"
import { authorizeRequest } from "@/lib/server/auth"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"

export const runtime = "nodejs"
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const line = z.object({
  accountId: z.string().min(1).max(200).optional(), systemCode: z.string().min(1).max(80).optional(),
  description: z.string().max(500).nullable().optional(), debit: z.number().nonnegative().optional(), credit: z.number().nonnegative().optional(),
  employeeId: z.string().max(200).nullable().optional(), customerId: z.string().max(200).nullable().optional(), supplierId: z.string().max(200).nullable().optional(),
})
const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("bootstrap") }),
  z.object({ action: z.literal("syncOperational") }),
  z.object({ action: z.literal("postJournal"), entryDate: date, reference: z.string().min(1).max(120), description: z.string().min(1).max(500), lines: z.array(line).min(2).max(100) }),
  z.object({ action: z.literal("reverseJournal"), entryId: z.string().min(1).max(200), reason: z.string().min(3).max(500) }),
  z.object({ action: z.literal("createAccount"), code: z.string().min(1).max(40), name: z.string().min(1).max(200), accountType: z.enum(["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"]), normalBalance: z.enum(["DEBIT", "CREDIT"]), description: z.string().max(1000).nullable().optional() }),
  z.object({ action: z.literal("createPeriod"), name: z.string().min(1).max(120), startsOn: date, endsOn: date }),
  z.object({ action: z.literal("closePeriod"), periodId: z.string().min(1).max(200) }),
  z.object({ action: z.literal("createBankAccount"), accountName: z.string().min(1).max(200), bankName: z.string().min(1).max(200), maskedAccountNumber: z.string().max(80).nullable().optional(), currency: z.string().min(3).max(8).optional(), openingBalance: z.number().optional() }),
  z.object({ action: z.literal("importBankTransaction"), bankAccountId: z.string().min(1).max(200), transactionDate: date, description: z.string().min(1).max(500), reference: z.string().max(200).nullable().optional(), amount: z.number().refine((value) => value !== 0) }),
  z.object({ action: z.literal("reconcileBankTransaction"), transactionId: z.string().min(1).max(200), journalEntryId: z.string().min(1).max(200) }),
  z.object({ action: z.literal("createReceivable"), customerId: z.string().min(1).max(200), invoiceNumber: z.string().min(1).max(100), issueDate: date, dueDate: date, description: z.string().min(1).max(500), totalAmount: z.number().positive() }),
  z.object({ action: z.literal("createPayable"), supplierId: z.string().min(1).max(200), billNumber: z.string().min(1).max(100), issueDate: date, dueDate: date, description: z.string().min(1).max(500), totalAmount: z.number().positive() }),
  z.object({ action: z.literal("recordPayment"), direction: z.enum(["RECEIPT", "PAYMENT"]), documentId: z.string().min(1).max(200), paymentDate: date, amount: z.number().positive(), method: z.enum(["CASH", "BANK"]), bankAccountId: z.string().max(200).nullable().optional(), reference: z.string().max(200).nullable().optional() }),
])

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "Accounting request failed"
  const status = message.startsWith("Forbidden") ? 403 : message.toLowerCase().includes("session") ? 401 : 400
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "accounting:read")
    const value = new URL(request.url).searchParams.get("throughDate") || new Date().toISOString().slice(0, 10)
    const throughDate = date.parse(value)
    return NextResponse.json(await getAccountingWorkspace(profile.tenantId, profile.businessId, throughDate))
  } catch (error) {
    return failure(error)
  }
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requireTrustedMutationOrigin(request)
    const input = actionSchema.parse(await request.json())
    const scope = { tenantId: profile.tenantId, businessId: profile.businessId, actorId: profile.uid }
    if (input.action === "closePeriod") requirePermission(profile, "accounting:close")
    else requirePermission(profile, "accounting:write")
    let result
    switch (input.action) {
      case "bootstrap": result = await bootstrapAccounting(scope); break
      case "syncOperational": result = await syncOperationalTransactions(scope); break
      case "postJournal": result = await postJournalEntry({ ...scope, ...input, sourceType: "MANUAL", sourceId: null }); break
      case "reverseJournal": result = await reverseJournalEntry(scope, input.entryId, input.reason); break
      case "createAccount": result = await createLedgerAccount({ ...scope, ...input }); break
      case "createPeriod": result = await createFiscalPeriod({ ...scope, ...input }); break
      case "closePeriod": result = await closeFiscalPeriod(scope, input.periodId); break
      case "createBankAccount": result = await createBankAccount({ ...scope, ...input }); break
      case "importBankTransaction": result = await importBankTransaction({ ...scope, ...input }); break
      case "reconcileBankTransaction": result = await reconcileBankTransaction(scope, input.transactionId, input.journalEntryId); break
      case "createReceivable": result = await createReceivableInvoice({ ...scope, ...input }); break
      case "createPayable": result = await createPayableBill({ ...scope, ...input }); break
      case "recordPayment": result = await recordAccountingPayment({ ...scope, ...input }); break
    }
    return NextResponse.json(result)
  } catch (error) {
    return failure(error)
  }
}
