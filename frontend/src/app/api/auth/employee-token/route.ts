import { NextResponse } from "next/server"
import { z } from "zod"

import { adminDatabase, EMPLOYEE_SESSION_COOKIE, issueAppSession } from "@/lib/server/auth"
import { consumeRateLimit } from "@/lib/server/rate-limit"
import { verifySecret } from "@/lib/server/secret-hash"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const loginSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  businessName: z.string().trim().min(2).max(200),
  accessCode: z.string().trim().min(8).max(80).transform((value) => value.toUpperCase()),
  roleProfile: z.enum(["Manager", "Accountant", "HR Officer", "Staff", "Viewer", "Employee"]),
})

export async function POST(request: Request) {
  try {
    if (!await consumeRateLimit({ request, bucket: "employee-login", limit: 8, windowSeconds: 60 })) {
      return NextResponse.json({ error: "Too many login attempts. Wait one minute and try again." }, { status: 429 })
    }
    const input = loginSchema.parse(await request.json())
    const database = adminDatabase()
    const businesses = await database.executeQuery<{ businesses: Array<{ id: string; tenantId: string; name: string; code: string }> }, { name: string }>("getBusinessesByName", { name: input.businessName })
    const expectedRole = input.roleProfile === "Employee" ? "Staff" : input.roleProfile
    for (const business of businesses.data.businesses) {
      const users = await database.executeQuery<{ users: Array<{ id: string; email: string; role: string; fullName?: string; tenantId: string; businessId: string; accessCodeHash?: string }> }, Record<string, string>>("listUsersByBusiness", {
        tenantId: business.tenantId,
        businessId: business.id,
      })
      for (const account of users.data.users) {
        if (account.fullName?.trim().toLocaleLowerCase() !== input.fullName.trim().toLocaleLowerCase() || account.role !== expectedRole || !account.accessCodeHash) continue
        if (!await verifySecret(input.accessCode, account.accessCodeHash)) continue
        const session = await issueAppSession(account.id, request)
        const response = NextResponse.json({
          token: session.token,
          expiresAt: session.expiresAt.toISOString(),
          user: { ...account, businessCode: business.code, accessCodeHash: undefined },
        })
        response.cookies.set(EMPLOYEE_SESSION_COOKIE, session.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          expires: session.expiresAt,
        })
        return response
      }
    }
    return NextResponse.json({ error: "The supplied employee credentials are incorrect." }, { status: 401 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Complete all employee login fields." }, { status: 400 })
    if (error instanceof Error && error.message.startsWith("Forbidden:")) {
      return NextResponse.json({ error: error.message.replace(/^Forbidden:\s*/, "") }, { status: 403 })
    }
    console.warn("Employee session login failed", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Employee login service is unavailable." }, { status: 503 })
  }
}
