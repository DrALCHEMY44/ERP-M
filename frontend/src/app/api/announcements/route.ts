import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { z } from "zod"
import { authorizeRequest } from "@/lib/server/firebase-token"
import { neon } from "@neondatabase/serverless"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
const createSchema = z.object({
  title: z.string().trim().min(3).max(120),
  message: z.string().trim().min(3).max(4000),
  priority: z.enum(["NORMAL", "IMPORTANT", "URGENT"]).default("NORMAL"),
  expiresAt: z.string().datetime().nullable().optional(),
})

function sqlClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
  return neon(process.env.DATABASE_URL)
}

function canPublish(role: string) {
  return ["Business Owner", "Manager", "Platform Super Admin"].includes(role)
}

async function withDatabaseRetry<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    // Neon's HTTP driver can occasionally lose a pooled connection while a
    // development server is hot-reloading. A single retry makes mutations
    // resilient without risking duplicate announcements because the id is
    // generated once and is protected by the primary key.
    await new Promise((resolve) => setTimeout(resolve, 250))
    return operation()
  }
}

function errorResponse(error: unknown, fallback: string) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.issues[0]?.message || "Invalid announcement data" },
      { status: 400 },
    )
  }
  const message = error instanceof Error ? error.message : ""
  if (message.includes("authentication token") || message.includes("Business profile")) {
    return NextResponse.json({ error: "Your session has expired. Please sign in again." }, { status: 401 })
  }
  return NextResponse.json({ error: fallback }, { status: 503 })
}

export async function GET(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const sql = sqlClient()
    const rows = await withDatabaseRetry(() => sql`
      SELECT a.id,a.title,a.message,a.priority,a.created_by_name,a.created_at,a.expires_at,
             (r.user_uid IS NOT NULL) AS is_read
      FROM announcements a
      LEFT JOIN announcement_reads r ON r.announcement_id=a.id AND r.user_uid=${profile.uid}
      WHERE a.tenant_id=${profile.tenantId} AND a.business_id=${profile.businessId}
        AND (a.expires_at IS NULL OR a.expires_at > NOW())
      ORDER BY a.created_at DESC LIMIT 100`)
    return NextResponse.json({ announcements: rows, canPublish: canPublish(profile.role) })
  } catch (error) {
    console.warn("Announcement list failed", error)
    return errorResponse(error, "Could not load announcements. Please retry.")
  }
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    if (!canPublish(profile.role)) return NextResponse.json({ error: "Only owners and managers can publish announcements" }, { status: 403 })
    const input = createSchema.parse(await request.json())
    const id = randomUUID()
    const sql = sqlClient()
    await withDatabaseRetry(() => sql`
      INSERT INTO announcements(
        id, tenant_id, business_id, title, message, priority,
        created_by_uid, created_by_name, expires_at
      ) VALUES(
        ${id}, ${profile.tenantId}, ${profile.businessId}, ${input.title},
        ${input.message}, ${input.priority}, ${profile.uid},
        ${profile.fullName || "Manager"}, ${input.expiresAt ?? null}
      )
      ON CONFLICT (id) DO NOTHING
    `)
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    console.warn("Announcement publish failed", error)
    return errorResponse(error, "Could not publish announcement. Please retry.")
  }
}

export async function PATCH(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const { id } = z.object({ id: z.string().uuid() }).parse(await request.json())
    const sql = sqlClient()
    const allowed = await withDatabaseRetry(() => sql`SELECT id FROM announcements WHERE id=${id} AND tenant_id=${profile.tenantId} AND business_id=${profile.businessId}`)
    if (!allowed.length) return NextResponse.json({ error: "Announcement not found" }, { status: 404 })
    await withDatabaseRetry(() => sql`INSERT INTO announcement_reads(announcement_id,user_uid) VALUES(${id},${profile.uid}) ON CONFLICT DO NOTHING`)
    return NextResponse.json({ read: true })
  } catch (error) {
    console.warn("Announcement read update failed", error)
    return errorResponse(error, "Could not update notification. Please retry.")
  }
}
