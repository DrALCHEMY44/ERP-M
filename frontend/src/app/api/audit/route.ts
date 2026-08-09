import { NextResponse } from "next/server"
import { z } from "zod"

import { adminDataConnect, authorizeRequest } from "@/lib/server/firebase-token"

const schema = z.object({
  actionType: z.string().min(1).max(80),
  module: z.string().min(1).max(80),
  description: z.string().max(1000).optional(),
  recordId: z.string().max(200).optional(),
})

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const input = schema.parse(await request.json())
    const result = await adminDataConnect().executeMutation("CreateActivityLog", {
      tenantId: profile.tenantId,
      businessId: profile.businessId,
      userId: profile.uid,
      userName: profile.fullName || profile.email,
      ...input,
    })
    return NextResponse.json({ data: result.data }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Audit write failed"
    return NextResponse.json({ error: message }, { status: message.includes("authentication") ? 401 : 400 })
  }
}
