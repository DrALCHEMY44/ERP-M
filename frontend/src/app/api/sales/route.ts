import { NextResponse } from "next/server"
import { z } from "zod"
import { requirePermission } from "@/lib/server/authorization"
import { authorizeRequest } from "@/lib/server/firebase-token"
import { recordSale } from "@/lib/server/sales"

export const runtime = "nodejs"
const schema = z.object({
  idempotencyKey: z.string().min(16).max(200),
  customerId: z.string().min(1).max(200).optional(),
  paymentMethod: z.enum(["CASH", "MOBILE_MONEY", "BANK_TRANSFER", "CREDIT"]),
  items: z.array(z.object({ productId: z.string().min(1).max(200), quantity: z.number().int().positive().max(100000) })).min(1).max(100),
})

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "sales:write")
    const input = schema.parse(await request.json())
    const result = await recordSale({ ...input, tenantId: profile.tenantId, businessId: profile.businessId, actorId: profile.uid })
    return NextResponse.json(result, { status: result.duplicate ? 200 : 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sale failed"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : message.includes("Insufficient") ? 409 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
