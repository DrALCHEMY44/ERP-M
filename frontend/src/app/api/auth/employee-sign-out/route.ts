import { NextResponse } from "next/server"

import { employeeSessionFromCookie, EMPLOYEE_SESSION_COOKIE, revokeAppSession } from "@/lib/server/auth"

export async function POST(request: Request) {
  const token = employeeSessionFromCookie(request)
  if (token) await revokeAppSession(token).catch(() => false)
  const response = NextResponse.json({ ok: true })
  response.cookies.set(EMPLOYEE_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
