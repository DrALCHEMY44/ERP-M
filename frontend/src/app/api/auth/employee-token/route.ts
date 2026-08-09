import { NextResponse } from "next/server"
import { getAuth } from "firebase-admin/auth"
import { z } from "zod"

import { adminDataConnect, firebaseAdminApp } from "@/lib/server/firebase-token"
import { consumeRateLimit } from "@/lib/server/rate-limit"
import { verifySecret } from "@/lib/server/secret-hash"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const loginSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  businessName: z.string().trim().min(2).max(200),
  accessCode: z.string().trim().min(8).max(80).transform((value) => value.toUpperCase()),
  roleProfile: z.enum(["Manager", "Employee"]),
})

export async function POST(request: Request) {
  try {
    if (!await consumeRateLimit({ request, bucket: "employee-login", limit: 8, windowSeconds: 60 })) {
      return NextResponse.json({ error: "Too many login attempts. Wait one minute and try again." }, { status: 429 })
    }
    const input = loginSchema.parse(await request.json())
    const dc = adminDataConnect()
    const businesses = await dc.executeQuery<{ businesses: Array<{ id: string; tenantId: string; name: string; code: string }> }, { name: string }>("getBusinessesByName", { name: input.businessName })
    const expectedRole = input.roleProfile === "Manager" ? "Manager" : "Staff"
    for (const business of businesses.data.businesses) {
      const users = await dc.executeQuery<{ users: Array<{ id: string; email: string; role: string; fullName?: string; tenantId: string; businessId: string; accessCodeHash?: string }> }, Record<string, string>>("listUsersByBusiness", {
        tenantId: business.tenantId,
        businessId: business.id,
      })
      for (const account of users.data.users) {
        if (account.fullName?.trim() !== input.fullName || account.role !== expectedRole || !account.accessCodeHash) continue
        if (!await verifySecret(input.accessCode, account.accessCodeHash)) continue
        const token = await getAuth(firebaseAdminApp()).createCustomToken(account.id, {
          tenantId: account.tenantId, businessId: account.businessId, role: account.role,
        })
        return NextResponse.json({ token, user: { ...account, businessCode: business.code, accessCodeHash: undefined } })
      }
    }
    return NextResponse.json({ error: "The supplied employee credentials are incorrect." }, { status: 401 })
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: "Complete all employee login fields." }, { status: 400 })
    console.warn("Employee custom-token login failed", error instanceof Error ? error.message : error)
    return NextResponse.json({ error: "Employee login service is unavailable." }, { status: 503 })
  }
}
