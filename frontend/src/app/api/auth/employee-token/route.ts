import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { z } from "zod"

import { firebaseAdminApp } from "@/lib/server/firebase-token"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const loginSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  businessName: z.string().trim().min(2).max(200),
  accessCode: z.string().trim().min(8).max(80).transform((value) => value.toUpperCase()),
  roleProfile: z.enum(["Manager", "Employee"]),
})

type Attempt = { count: number; resetAt: number }
const attempts = new Map<string, Attempt>()

function rateLimited(request: Request) {
  const key = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "local"
  const now = Date.now()
  const attempt = attempts.get(key)
  if (!attempt || attempt.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 })
    return false
  }
  attempt.count += 1
  return attempt.count > 10
}

export async function POST(request: Request) {
  try {
    if (rateLimited(request)) {
      return NextResponse.json(
        { error: "Too many login attempts. Wait one minute and try again." },
        { status: 429 },
      )
    }

    const input = loginSchema.parse(await request.json())
    await import("@/lib/firebase")
    const { getBusinessesByName, verifyEmployeeAccess } = await import("@dataconnect/generated")
    const businessResult = await getBusinessesByName({ name: input.businessName })
    const expectedRole = input.roleProfile === "Manager" ? "Manager" : "Staff"

    for (const business of businessResult.data.businesses) {
      const result = await verifyEmployeeAccess({
        fullName: input.fullName,
        role: expectedRole,
        accessCode: input.accessCode,
        tenantId: business.tenantId,
        businessId: business.id,
      })
      const account = result.data.users[0]
      if (!account) continue

      const token = await getAuth(firebaseAdminApp()).createCustomToken(account.id, {
        tenantId: account.tenantId,
        businessId: account.businessId,
        role: account.role,
      })
      return NextResponse.json({
        token,
        user: {
          id: account.id,
          fullName: account.fullName || input.fullName,
          email: account.email,
          role: account.role,
          tenantId: account.tenantId,
          businessId: account.businessId,
          businessCode: business.code,
        },
      })
    }

    return NextResponse.json(
      { error: "The name, business, role, or employee code is incorrect." },
      { status: 401 },
    )
  } catch (error) {
    console.warn("Employee custom-token login failed", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Complete all employee login fields." }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : ""
    if (message.includes("Failed to determine service account") || message.includes("signBlob")) {
      return NextResponse.json(
        { error: "Employee login signing is not configured on the backend." },
        { status: 503 },
      )
    }
    return NextResponse.json(
      { error: "Employee login service is temporarily unavailable." },
      { status: 503 },
    )
  }
}
