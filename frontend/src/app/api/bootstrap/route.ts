import { NextResponse } from "next/server"
import { z } from "zod"
import { randomUUID } from "crypto"
import { adminDatabase, claimPlatformWorkspaceInvite, profileForIdentity, verifyRequestIdentity } from "@/lib/server/auth"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"

export const runtime = "nodejs"

const schema = z.object({
  fullName: z.string().trim().min(2).max(160),
  businessName: z.string().trim().min(2).max(200),
  businessSector: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(200),
  region: z.string().trim().min(2).max(120),
  invitationToken: z.string().min(20).max(200).optional(),
})

export async function POST(request: Request) {
  try {
    const identity = await verifyRequestIdentity(request)
    requireTrustedMutationOrigin(request)
    const input = schema.parse(await request.json())
    if (!identity.email) return NextResponse.json({ error: "A verified email identity is required" }, { status: 400 })
    if (await profileForIdentity(identity)) return NextResponse.json({ error: "Account already has a company" }, { status: 409 })
    if (input.invitationToken) {
      const invited = await claimPlatformWorkspaceInvite(identity, input.invitationToken)
      if (!invited) return NextResponse.json({ error: "This invitation is invalid, expired, or belongs to another email" }, { status: 403 })
      return NextResponse.json({ tenantId: invited.tenantId, businessId: invited.businessId, claimedInvite: true })
    }
    const database = adminDatabase()
    const tenantId = randomUUID()
    const businessId = randomUUID()
    const normalized = input.businessName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "")
    await database.executeMutation("BootstrapWorkspace", {
      tenantId,
      businessId,
      userId: identity.uid,
      authUserId: identity.uid,
      name: input.businessName,
      fullName: input.fullName,
      ownerEmail: identity.email.toLowerCase(),
      location: input.location,
      businessSector: input.businessSector,
      region: input.region,
      code: `${normalized}_${tenantId.slice(0, 8)}`,
    })
    return NextResponse.json({ tenantId, businessId })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Bootstrap failed" }, { status: 400 })
  }
}
