import { getAuth } from "@/lib/auth/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type AuthRouteContext = { params: Promise<{ path: string[] }> }

const handler = (request: Request, context: AuthRouteContext) => getAuth().handler().GET(request, context)

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler
