import { NextResponse } from "next/server"

// Retained as an explicit tombstone so older mobile builds fail closed instead
// of falling back to the former demo-password/JWT implementation.
export async function POST() {
  return NextResponse.json(
    { error: "This legacy login endpoint is permanently disabled. Use Firebase Authentication." },
    { status: 410 },
  )
}
