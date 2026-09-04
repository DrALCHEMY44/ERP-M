import { NextResponse } from "next/server"
import { z } from "zod"

import { hasPermission, requirePermission } from "@/lib/server/authorization"
import { authorizeRequest } from "@/lib/server/auth"
import { findProductByBarcode, receiveBarcodeStock } from "@/lib/server/barcode-inventory"
import { isTransientDatabaseError } from "@/lib/server/neon"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"

export const runtime = "nodejs"

const schema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("lookup"),
    barcode: z.string().trim().min(1).max(128),
  }),
  z.object({
    action: z.literal("receive"),
    barcode: z.string().trim().min(1).max(128),
    quantity: z.number().int().positive().max(100_000),
  }),
])

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requireTrustedMutationOrigin(request)
    const input = schema.parse(await request.json())

    if (input.action === "lookup") {
      if (!hasPermission(profile, "inventory:read") && !hasPermission(profile, "sales:read")) {
        throw new Error("Forbidden: barcode lookup")
      }
      const match = await findProductByBarcode(profile.tenantId, profile.businessId, input.barcode)
      return NextResponse.json({ match })
    }

    requirePermission(profile, "inventory:write")
    const result = await receiveBarcodeStock({
      tenantId: profile.tenantId,
      businessId: profile.businessId,
      actorId: profile.uid,
      barcode: input.barcode,
      packageQuantity: input.quantity,
    })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (isTransientDatabaseError(error)) {
      return NextResponse.json(
        { error: "Database is temporarily unavailable. Please retry." },
        { status: 503, headers: { "Retry-After": "1" } },
      )
    }
    const message = error instanceof Error ? error.message : "Barcode operation failed"
    const status = message.startsWith("Forbidden") ? 403
      : message.includes("authentication") ? 401
        : message.includes("not registered") ? 404
          : 400
    return NextResponse.json({ error: message }, { status })
  }
}
