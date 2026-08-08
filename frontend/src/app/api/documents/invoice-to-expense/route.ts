import { getDataConnect } from "firebase-admin/data-connect"
import { NextResponse } from "next/server"
import { z } from "zod"
import { neon } from "@neondatabase/serverless"
import { authorizeRequest, firebaseAdminApp } from "@/lib/server/firebase-token"
import { mirrorRecord } from "@/lib/server/neon"

export const runtime = "nodejs"
const schema = z.object({ documentId: z.string().min(1), commit: z.boolean().default(false) })

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const input = schema.parse(await request.json())
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
    const sql = neon(process.env.DATABASE_URL)
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

    const dc = getDataConnect({ location: "us-east4", serviceId: "studio-8058744913-5a601-service", connector: "example" }, firebaseAdminApp())
    const inserted = await dc.executeMutation<{ transaction_insert: { id: string } }, any>("CreateTransaction", {
      tenantId: profile.tenantId, businessId: profile.businessId, type: "EXPENSE", amount: total,
      date: new Date(suggestion.date).toISOString(), category: suggestion.category,
      receiptUrl: input.documentId, recordedBy: profile.uid,
    })
    const recordId = inserted.data.transaction_insert.id
    await mirrorRecord({ entity: "transaction", operation: "upsert", recordId, tenantId: profile.tenantId, businessId: profile.businessId,
      payload: { id: recordId, tenantId: profile.tenantId, businessId: profile.businessId, ...suggestion, receiptUrl: input.documentId, recordedBy: profile.uid, createdAt: new Date().toISOString() } })
    return NextResponse.json({ committed: true, transactionId: recordId, suggestion })
  } catch (error) {
    console.error("Invoice conversion failed", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invoice conversion failed" }, { status: 500 })
  }
}
