import { NextResponse } from "next/server"

import { db } from "@/lib/server/neon"
import { isAuthorizedReconciliationRequest } from "../../../../../scripts/reconcile-outbox-core.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function handle(request: Request) {
  if (!isAuthorizedReconciliationRequest(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const rows = await db()`SELECT status,COUNT(*)::integer AS count,
      MIN(created_at) AS oldest FROM integration_outbox GROUP BY status ORDER BY status`
    return NextResponse.json({ status: "ok", events: rows }, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("Neon outbox inspection failed", error)
    return NextResponse.json({ error: "Outbox inspection failed" }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
