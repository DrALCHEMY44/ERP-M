import { NextResponse } from "next/server"
import { z } from "zod"
import { adminDataConnect, profileForIdentity, verifyRequestIdentity } from "@/lib/server/firebase-token"

export const runtime = "nodejs"

const schema = z.object({
  fullName: z.string().trim().min(2).max(160),
  businessName: z.string().trim().min(2).max(200),
  businessSector: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(200),
  region: z.string().trim().min(2).max(120),
})

export async function POST(request: Request) {
  try {
    const identity = await verifyRequestIdentity(request)
    if (!identity.email) return NextResponse.json({ error: "A verified email identity is required" }, { status: 400 })
    if (await profileForIdentity(identity)) return NextResponse.json({ error: "Account already has a company" }, { status: 409 })
    const input = schema.parse(await request.json())
    const dc = adminDataConnect()
    const tenant = await dc.executeMutation<{ tenant_insert: { id: string } }, Record<string, unknown>>("CreateTenant", {
      name: input.businessName,
      businessSector: input.businessSector,
      location: input.location,
      ownerEmail: identity.email.toLowerCase(),
      subscriptionTier: "Basic",
      status: "Active",
    })
    const tenantId = tenant.data.tenant_insert.id
    const normalized = input.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    const business = await dc.executeMutation<{ business_insert: { id: string } }, Record<string, unknown>>("CreateBusiness", {
      tenantId,
      name: input.businessName,
      location: input.location,
      businessType: input.businessSector,
      region: input.region,
      code: `${normalized}_${tenantId.slice(0, 8)}`,
    })
    const businessId = business.data.business_insert.id
    await dc.executeMutation("CreateUser", {
      id: identity.uid,
      tenantId,
      businessId,
      email: identity.email.toLowerCase(),
      role: "Business Owner",
      fullName: input.fullName,
    })
    return NextResponse.json({ tenantId, businessId })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Bootstrap failed" }, { status: 400 })
  }
}
