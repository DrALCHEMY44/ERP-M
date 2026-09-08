import { NextResponse } from "next/server"
import { z } from "zod"

import { authorizeRequest } from "@/lib/server/auth"
import { requirePermission } from "@/lib/server/authorization"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"
import { consumeRateLimit } from "@/lib/server/rate-limit"
import {
  closeScannerSession, createScannerSession, joinScannerSession, ownerScannerSession, scanIntoSession,
} from "@/lib/server/sale-scanner"

export const runtime = "nodejs"

const token = z.string().min(32).max(200)
const inputSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create") }),
  z.object({ action: z.literal("join"), token }),
  z.object({ action: z.literal("scan"), token, barcode: z.string().trim().min(1).max(128) }),
  z.object({ action: z.literal("close"), sessionId: z.string().uuid(), status: z.enum(["COMPLETED", "CANCELLED"]) }),
])

export async function GET(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "sales:write")
    const sessionId = new URL(request.url).searchParams.get("sessionId")
    if (!sessionId || !z.string().uuid().safeParse(sessionId).success) throw new Error("A valid scanner session is required")
    return NextResponse.json(await ownerScannerSession(profile, sessionId))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scanner session could not be loaded"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requireTrustedMutationOrigin(request)
    requirePermission(profile, "sales:write")
    const input = inputSchema.parse(await request.json())
    const limit = input.action === "scan" ? 90 : 20
    const allowed = await consumeRateLimit({
      request,
      bucket: "sales-scanner:" + profile.uid + ":" + input.action,
      limit,
      windowSeconds: 60,
    })
    if (!allowed) {
      return NextResponse.json({ error: "Too many scanner requests. Please wait a moment." }, { status: 429, headers: { "Retry-After": "60" } })
    }
    if (input.action === "create") return NextResponse.json(await createScannerSession(profile), { status: 201 })
    if (input.action === "join") return NextResponse.json(await joinScannerSession(profile, input.token))
    if (input.action === "scan") return NextResponse.json(await scanIntoSession(profile, input.token, input.barcode))
    await closeScannerSession(profile, input.sessionId, input.status)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scanner operation failed"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401
      : message.includes("stock") ? 409 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
