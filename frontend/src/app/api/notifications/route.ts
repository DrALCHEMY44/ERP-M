import { randomUUID } from "crypto"
import { NextResponse } from "next/server"
import { z } from "zod"

import { requirePermission, ROLES } from "@/lib/server/authorization"
import { authorizeRequest } from "@/lib/server/auth"
import { db } from "@/lib/server/neon"

export const runtime = "nodejs"

const schema = z.object({
  title: z.string().trim().min(3).max(120),
  message: z.string().trim().min(3).max(2000),
  type: z.enum(["info", "warning", "error", "success"]),
  module: z.enum(["Inventory", "Tasks"]),
  targetUserId: z.string().min(1).max(128).optional(),
  targetRoles: z.array(z.enum(ROLES)).min(1).max(7).optional(),
  link: z.string().startsWith("/").max(300).optional(),
})

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    const input = schema.parse(await request.json())
    requirePermission(profile, input.module === "Inventory" ? "inventory:write" : "tasks:write")
    const sql = db()
    const priority = input.type === "error" ? "URGENT" : input.type === "warning" ? "IMPORTANT" : "NORMAL"
    const message = input.link ? `${input.message}\nOpen: ${input.link}` : input.message
    const id = randomUUID()
    await sql`INSERT INTO announcements(
        id,tenant_id,business_id,title,message,priority,created_by_uid,created_by_name,target_user_uid,target_roles
      ) VALUES(
        ${id},${profile.tenantId},${profile.businessId},${input.title},${message},${priority},
        ${profile.uid},${profile.fullName || profile.email},${input.targetUserId ?? null},${input.targetRoles ?? null}
      )`
    return NextResponse.json({ id }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Notification delivery failed"
    const status = message.startsWith("Forbidden") ? 403 : message.includes("authentication") ? 401 : 400
    return NextResponse.json({ error: message }, { status })
  }
}
