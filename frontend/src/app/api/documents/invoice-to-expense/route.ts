import { NextResponse } from "next/server"
import { z } from "zod"
import { authorizeRequest } from "@/lib/server/auth"
import { requirePermission } from "@/lib/server/authorization"
import { db } from "@/lib/server/neon"
import { executeOperationalOperation } from "@/lib/server/operational-data"

export const runtime = "nodejs"
const schema = z.object({ documentId: z.string().min(1), commit: z.boolean().default(false) })

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "expenses:write")
    const input = schema.parse(await request.json())
    const sql = db()
    const rows = await sql`SELECT classification,structured_data FROM document_intelligence
      WHERE document_id=${input.documentId} AND tenant_id=${profile.tenantId} AND business_id=${profile.businessId} AND status='READY'`
    if (!rows.length) return NextResponse.json({ error: "Processed invoice was not found" }, { status: 404 })
    const details = rows[0].structured_data || {}
    const total = Number(details.total)
    if (!Number.isFinite(total) || total <= 0) return NextResponse.json({ error: "A valid invoice total was not extracted" }, { status: 422 })
    const suggestion = {
      type: "EXPENSE",
      amount: total,
      category: details.supplier ? `Invoice - ${details.supplier}` : "Invoice",
      date: details.invoiceDate || new Date().toISOString(),
      sourceDocumentId: input.documentId,
      anomalies: details.anomalies || [],
    }
    if (!input.commit) return NextResponse.json({ committed: false, suggestion })

    const inserted = await executeOperationalOperation("CreateTransaction", {
      tenantId: profile.tenantId, businessId: profile.businessId, type: "EXPENSE", amount: total,
      date: new Date(suggestion.date).toISOString(), category: suggestion.category,
      receiptUrl: input.documentId, recordedBy: profile.uid,
    })
    const transaction = inserted && "transaction_insert" in inserted ? inserted.transaction_insert : null
    if (!transaction?.id) throw new Error("Expense transaction was not created")
    const recordId = transaction.id as string
    return NextResponse.json({ committed: true, transactionId: recordId, suggestion })
  } catch (error) {
    console.error("Invoice conversion failed", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invoice conversion failed" }, { status: 500 })
  }
}
