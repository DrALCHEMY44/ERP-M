import { NextResponse } from "next/server"
import { adminDataConnect, authorizeRequest } from "@/lib/server/firebase-token"

export async function GET(request: Request) {
  try {
    const user = await authorizeRequest(request)
    const business = await adminDataConnect().executeQuery<{ business: { code?: string } | null }, { id: string }>("getBusinessById", { id: user.businessId })
    return NextResponse.json({ user: { ...user, id: user.uid, businessCode: business.data.business?.code ?? null } })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized" }, { status: 401 })
  }
}
