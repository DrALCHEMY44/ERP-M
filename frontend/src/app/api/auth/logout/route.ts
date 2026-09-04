import { NextResponse } from "next/server"

import { revokeAppSession } from "@/lib/server/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization")
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : ""
  if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  const revoked = await revokeAppSession(token)
  return NextResponse.json({ revoked })
}
