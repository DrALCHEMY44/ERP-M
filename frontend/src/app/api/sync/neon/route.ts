import { NextResponse } from "next/server"

/** Client-driven best-effort mirroring was retired in favor of the outbox job. */
export async function POST() {
  return NextResponse.json({ error: "This endpoint is permanently retired" }, { status: 410 })
}
