import { randomUUID } from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { getDataConnect } from "firebase-admin/data-connect"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authorizeRequest, firebaseAdminApp } from "@/lib/server/firebase-token"
import { mirrorRecord } from "@/lib/server/neon"
import { objectStorage, storageBucket } from "@/lib/server/object-storage"
import { neon } from "@neondatabase/serverless"
import { processStoredDocument } from "@/lib/server/document-intelligence"

export const runtime = "nodejs"
const schema = z.object({ reportType: z.enum(["sales", "expenses", "inventory", "tasks"]) })

function csv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "No records\n"
  const headers = Object.keys(rows[0])
  const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`
  return [headers.map(escape).join(","), ...rows.map(row => headers.map(key => escape(row[key])).join(","))].join("\n")
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const { reportType } = schema.parse(await request.json())
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
    const sql = neon(process.env.DATABASE_URL)
    let rows: Record<string, unknown>[] = []
    if (reportType === "sales" || reportType === "expenses") {
      const type = reportType === "sales" ? "SALE" : "EXPENSE"
      rows = await sql`SELECT id,type,amount,date,category,recorded_by FROM transactions
        WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId} AND type=${type} ORDER BY date DESC`
    } else if (reportType === "inventory") {
      rows = await sql`SELECT id,name,category,quantity,cost_price,selling_price,low_stock_level FROM products
        WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId} ORDER BY name`
    } else {
      rows = await sql`SELECT id,title,status,priority,due_date,assigned_to_id,created_by FROM tasks
        WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId} ORDER BY due_date DESC`
    }

    const filename = `${reportType}-report-${new Date().toISOString().slice(0,10)}.csv`
    const key = `documents/${profile.tenantId}/${profile.businessId}/${profile.uid}/${randomUUID()}_${filename}`
    const bytes = Buffer.from(csv(rows), "utf8")
    await objectStorage().send(new PutObjectCommand({ Bucket: storageBucket(), Key: key, Body: bytes, ContentType: "text/csv" }))
    const fileUrl = `/api/files?key=${encodeURIComponent(key)}`

    const dc = getDataConnect({ location: "us-east4", serviceId: "studio-8058744913-5a601-service", connector: "example" }, firebaseAdminApp())
    const inserted = await dc.executeMutation<{ document_insert: { id: string } }, any>("CreateDocument", {
      tenantId: profile.tenantId,
      businessId: profile.businessId,
      title: filename,
      documentType: "Report",
      fileUrl,
      uploadedBy: profile.uid,
    })
    const documentId = inserted.data.document_insert.id
    await mirrorRecord({
      entity: "document", operation: "upsert", recordId: documentId,
      tenantId: profile.tenantId, businessId: profile.businessId,
      payload: { id: documentId, tenantId: profile.tenantId, businessId: profile.businessId, title: filename, documentType: "Report", fileUrl, uploadedBy: profile.uid, uploadedAt: new Date().toISOString() },
    })
    await processStoredDocument({ documentId, tenantId: profile.tenantId, businessId: profile.businessId, objectKey: key, filename })
    return NextResponse.json({ documentId, fileUrl, filename, records: rows.length })
  } catch (error) {
    console.error("Report generation failed", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Report generation failed" }, { status: 500 })
  }
}
