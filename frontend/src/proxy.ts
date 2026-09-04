import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Authorization, Content-Type",
  "Access-Control-Expose-Headers": "Content-Disposition, Retry-After, set-auth-token",
  "Access-Control-Max-Age": "86400",
}

function isAllowedMobileOrigin(origin: string) {
  const configured = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)

  if (configured.includes(origin)) return true
  if (process.env.NODE_ENV === "production") return false

  try {
    const value = new URL(origin)
    return value.protocol === "http:"
      && ["localhost", "127.0.0.1"].includes(value.hostname)
  } catch {
    return false
  }
}

function applyCors(response: NextResponse, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", origin)
  response.headers.append("Vary", "Origin")
  for (const [name, value] of Object.entries(corsHeaders)) {
    response.headers.set(name, value)
  }
  return response
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!origin) return NextResponse.next()

  if (!isAllowedMobileOrigin(origin)) {
    if (request.method === "OPTIONS") {
      return NextResponse.json({ error: "Origin is not allowed" }, { status: 403 })
    }
    return NextResponse.next()
  }

  if (request.method === "OPTIONS") {
    return applyCors(new NextResponse(null, { status: 204 }), origin)
  }

  return applyCors(NextResponse.next(), origin)
}

export const config = {
  matcher: "/api/:path*",
}
