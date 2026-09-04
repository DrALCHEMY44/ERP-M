import { NextResponse } from "next/server"
import { z } from "zod"

import { requirePermission } from "@/lib/server/authorization"
import { authorizeRequest } from "@/lib/server/auth"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"
import {
  addEmploymentEvent,
  createLeaveRequest,
  decideLeaveRequest,
  getHrWorkspace,
  recordAttendance,
} from "@/lib/server/hr"

export const runtime = "nodejs"

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const attendance = z.object({
  action: z.literal("recordAttendance"), employeeId: z.string().min(1).max(200), attendanceDate: date,
  checkIn: z.string().datetime().nullable().optional(), checkOut: z.string().datetime().nullable().optional(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED", "REMOTE", "LEAVE"]),
  notes: z.string().max(2000).nullable().optional(),
})
const leave = z.object({
  action: z.literal("createLeave"), employeeId: z.string().min(1).max(200),
  leaveType: z.enum(["ANNUAL", "SICK", "MATERNITY", "PATERNITY", "COMPASSIONATE", "UNPAID", "OTHER"]),
  startDate: date, endDate: date, requestedDays: z.number().positive().max(366),
  reason: z.string().max(2000).nullable().optional(),
})
const decide = z.object({
  action: z.literal("decideLeave"), requestId: z.string().min(1).max(200),
  decision: z.enum(["APPROVED", "REJECTED", "CANCELLED"]), notes: z.string().max(2000).nullable().optional(),
})
const event = z.object({
  action: z.literal("addEmploymentEvent"), employeeId: z.string().min(1).max(200),
  eventType: z.enum(["HIRE", "PROMOTION", "TRANSFER", "LEAVE", "RETURN", "SUSPENSION", "TERMINATION", "NOTE"]),
  effectiveDate: date, position: z.string().max(200).nullable().optional(), department: z.string().max(200).nullable().optional(),
  employmentStatus: z.string().max(80).nullable().optional(), notes: z.string().max(2000).nullable().optional(),
})
const actionSchema = z.discriminatedUnion("action", [attendance, leave, decide, event])

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : "HR request failed"
  const status = message.startsWith("Forbidden") ? 403 : message.toLowerCase().includes("session") ? 401 : 400
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "hr:read")
    return NextResponse.json(await getHrWorkspace(profile.tenantId, profile.businessId))
  } catch (error) {
    return failure(error)
  }
}

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requireTrustedMutationOrigin(request)
    requirePermission(profile, "hr:write")
    const input = actionSchema.parse(await request.json())
    const scope = { tenantId: profile.tenantId, businessId: profile.businessId, actorId: profile.uid }
    const result = input.action === "recordAttendance"
      ? await recordAttendance({ ...scope, ...input })
      : input.action === "createLeave"
        ? await createLeaveRequest({ ...scope, ...input })
        : input.action === "decideLeave"
          ? await decideLeaveRequest(scope, input.requestId, input.decision, input.notes)
          : await addEmploymentEvent({ ...scope, ...input })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    return failure(error)
  }
}
