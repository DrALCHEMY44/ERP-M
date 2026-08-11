import { NextResponse } from "next/server"

import { adminDataConnect } from "@/lib/server/firebase-token"
import { db } from "@/lib/server/neon"
import {
  isAuthorizedReconciliationRequest,
  reconcileOutbox,
} from "../../../../../scripts/reconcile-outbox-core.mjs"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function handle(request: Request) {
  if (!isAuthorizedReconciliationRequest(request, process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const summary = await reconcileOutbox({ dc: adminDataConnect(), sql: db(), now: () => new Date() })
    return NextResponse.json({ status: summary.failed ? "partial" : "ok", ...summary }, {
      status: summary.failed ? 503 : 200,
      headers: { "Cache-Control": "no-store" },
    })
  } catch (error) {
    console.error("Outbox reconciliation failed", error)
    return NextResponse.json({ error: "Reconciliation failed" }, { status: 500 })
  }
}

export const GET = handle
export const POST = handle
