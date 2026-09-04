import { randomUUID } from "crypto"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { z } from "zod"
import { adminDatabase, authorizeRequest } from "@/lib/server/auth"
import { hasPermission, requirePermission, type Permission } from "@/lib/server/authorization"
import { db } from "@/lib/server/neon"
import { objectStorage, storageBucket } from "@/lib/server/object-storage"
import { processStoredDocument } from "@/lib/server/document-intelligence"
import { serializeCsv } from "@/lib/csv"

export const runtime = "nodejs"
const schema = z.object({ reportType: z.enum(["sales", "expenses", "inventory", "tasks"]) })

function csv(rows: Record<string, unknown>[]) {
  if (!rows.length) return serializeCsv([["No records"]])
  const headers = Object.keys(rows[0])
  return serializeCsv([headers, ...rows.map((row) => headers.map((key) => row[key]))])
}

const reportPermissions: Record<z.infer<typeof schema>["reportType"], Permission> = {
  sales: "sales:read",
  expenses: "expenses:read",
  inventory: "inventory:read",
  tasks: "tasks:read",
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "reports:read")
    const { reportType } = schema.parse(await request.json())
    if (!hasPermission(profile, reportPermissions[reportType])) {
      return NextResponse.json({ error: "This role cannot export the requested report data." }, { status: 403 })
    }
    const sql = db()
    let rows: Record<string, unknown>[] = []
    if (reportType === "sales" || reportType === "expenses") {
      const type = reportType === "sales" ? "SALE" : "EXPENSE"
      rows = await sql`SELECT id,type,amount,date,category,recorded_by FROM transactions
        WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId} AND type=${type} ORDER BY date DESC`
    } else if (reportType === "inventory") {
      rows = await sql`SELECT id,name,category,quantity,cost_price,selling_price,low_stock_level FROM products
        WHERE tenant_id=${profile.tenantId} AND business_id=${profile.businessId} ORDER BY name`
    } else {
      const tasks = await adminDatabase().executeQuery<{ tasks: Record<string, unknown>[] }, Record<string, unknown>>("listTasksByBusiness", {
        tenantId: profile.tenantId, businessId: profile.businessId,
      })
      rows = tasks.data.tasks
    }

    const filename = `${reportType}-report-${new Date().toISOString().slice(0,10)}.csv`
    const key = `documents/${profile.tenantId}/${profile.businessId}/${profile.uid}/${randomUUID()}_${filename}`
    const bytes = Buffer.from(csv(rows), "utf8")
    await objectStorage().send(new PutObjectCommand({ Bucket: storageBucket(), Key: key, Body: bytes, ContentType: "text/csv" }))
    const fileUrl = `/api/files?key=${encodeURIComponent(key)}`

    const database = adminDatabase()
    const inserted = await database.executeMutation<{ document_insert: { id: string } }, any>("CreateDocument", {
      tenantId: profile.tenantId,
      businessId: profile.businessId,
      title: filename,
      documentType: "Report",
      fileUrl,
      uploadedBy: profile.uid,
    })
    const documentId = inserted.data.document_insert.id
    await processStoredDocument({ documentId, tenantId: profile.tenantId, businessId: profile.businessId, objectKey: key, filename }).catch((error) => {
      console.warn("Report created, but document intelligence indexing failed", error instanceof Error ? error.message : error)
    })
    return NextResponse.json({ documentId, fileUrl, filename, records: rows.length })
  } catch (error) {
    console.error("Report generation failed", error)
    const message = error instanceof Error ? error.message : "Report generation failed"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
