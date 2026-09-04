import { NextResponse } from "next/server"
import { adminDatabase, authorizeRequest } from "@/lib/server/auth"
import { ROLE_PERMISSIONS, type Role } from "@/lib/server/authorization"
import { isTransientDatabaseError } from "@/lib/server/neon"

export async function GET(request: Request) {
  try {
    const user = await authorizeRequest(request)
    const business = await adminDatabase().executeQuery<{ business: { code?: string } | null }, { id: string }>("getBusinessById", { id: user.businessId })
    return NextResponse.json({
      user: {
        ...user,
        id: user.uid,
        businessCode: business.data.business?.code ?? null,
        permissions: [...(ROLE_PERMISSIONS[user.role as Role] ?? [])],
      },
    })
  } catch (error) {
    if (isTransientDatabaseError(error)) {
      return NextResponse.json(
        { error: "Database is temporarily unavailable. Your session is still valid; please retry." },
        { status: 503, headers: { "Retry-After": "2" } },
      )
    }
    const message = error instanceof Error ? error.message : "Unauthorized"
    const status = message.includes("not linked") ? 404
      : message.startsWith("Forbidden") ? 403 : 401
    return NextResponse.json({ error: message }, { status })
  }
}
