import { NextResponse } from "next/server"

/** Legacy mirror clients receive a permanent response; all relational writes now target Neon directly. */
export async function POST() {
  return NextResponse.json({ error: "This endpoint is permanently retired" }, { status: 410 })
}
