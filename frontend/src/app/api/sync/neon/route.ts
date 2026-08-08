import { NextResponse } from "next/server"
import { z } from "zod"
import { authorizeRequest } from "@/lib/server/firebase-token"
import { mirrorRecord } from "@/lib/server/neon"

export const runtime = "nodejs"

const allowedEntities = [
  "product", "transaction", "task", "employee", "customer", "supplier",
  "document", "activity_log", "notification", "user", "business", "tenant",
  "task_comment", "ai_query",
] as const

const bodySchema = z.object({
  entity: z.enum(allowedEntities),
  operation: z.enum(["upsert", "delete"]),
  recordId: z.string().min(1).max(200),
  payload: z.record(z.unknown()).default({}),
})

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    if (process.env.DUAL_DATABASE_WRITE !== "true") {
      return NextResponse.json({ mirrored: false, reason: "disabled" })
    }
    const body = bodySchema.parse(await request.json())
    const payloadTenant = typeof body.payload.tenantId === "string" ? body.payload.tenantId : profile.tenantId
    const payloadBusiness = typeof body.payload.businessId === "string" ? body.payload.businessId : profile.businessId
    if (payloadTenant !== profile.tenantId || payloadBusiness !== profile.businessId) {
      return NextResponse.json({ error: "Cross-company mirror write denied" }, { status: 403 })
    }
    await mirrorRecord({
      entity: body.entity,
      operation: body.operation,
      recordId: body.recordId,
      payload: body.payload,
      tenantId: profile.tenantId,
      businessId: profile.businessId,
    })
    return NextResponse.json({ mirrored: true })
  } catch (error) {
    console.error("Neon mirror failed", error)
    return NextResponse.json({ error: "Neon mirror failed" }, { status: 500 })
  }
}
