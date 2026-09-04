import { NextResponse } from "next/server"

import { purgeExpiredAiData } from "@/lib/server/ai-governance"
import { isAuthorizedReconciliationRequest } from "../../../../../scripts/reconcile-outbox-core.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function handle(request: Request) {
  if (!isAuthorizedReconciliationRequest(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const retentionDays = Number(process.env.AI_RETENTION_DAYS || 30)
    const result = await purgeExpiredAiData(retentionDays)
    return NextResponse.json(
      { status: "ok", retentionDays, ...result },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    console.error("AI retention maintenance failed", error)
    return NextResponse.json({ error: "AI maintenance failed" }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
