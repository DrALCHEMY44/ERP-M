import { NextResponse } from "next/server"
import { z } from "zod"

import { requirePermission } from "@/lib/server/authorization"
import { authorizeRequest } from "@/lib/server/auth"
import { isTransientDatabaseError } from "@/lib/server/neon"
import { requireTrustedMutationOrigin } from "@/lib/server/origin"
import {
  addPlatformTenantNote,
  createPlatformTenant,
  createPlatformUserInvite,
  createPlatformInvoice,
  createPlatformSupportCase,
  getPlatformOverview,
  getPlatformTenantDetails,
  getPlatformUserDetails,
  getPlatformUsers,
  managePlatformTenant,
  managePlatformUser,
  publishPlatformAnnouncement,
  recordPlatformPayment,
  renewPlatformUserInvite,
  revokePlatformUserInvite,
  revokePlatformUserSessions,
  updatePlatformSupportCase,
  updatePlatformPlan,
  voidPlatformInvoice,
} from "@/lib/server/platform-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const planSchema = z.enum(["Basic", "Premium", "Enterprise"])
const roleSchema = z.enum([
  "Platform Super Admin", "Business Owner", "Manager", "Accountant", "HR Officer", "Staff", "Viewer",
])

const requestSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("overview"),
    input: z.object({
      search: z.string().max(200).optional(),
      plan: z.union([z.literal("all"), planSchema]).optional(),
      status: z.enum(["all", "Active", "Suspended", "Archived"]).optional(),
      sort: z.enum(["newest", "oldest", "name", "value"]).optional(),
      page: z.number().int().positive().max(100000).optional(),
      pageSize: z.number().int().min(5).max(50).optional(),
    }).default({}),
  }),
  z.object({ action: z.literal("tenant.details"), input: z.object({ id: z.string().min(1).max(200) }) }),
  z.object({
    action: z.literal("users.list"),
    input: z.object({
      search: z.string().max(200).optional(),
      tenantId: z.string().max(200).optional(),
      role: z.union([z.literal("all"), roleSchema]).optional(),
      status: z.enum(["all", "Active", "Suspended"]).optional(),
      authState: z.enum(["all", "linked", "pending"]).optional(),
      sort: z.enum(["newest", "oldest", "name", "lastActive"]).optional(),
      page: z.number().int().positive().max(100000).optional(),
      pageSize: z.number().int().min(5).max(100).optional(),
    }).default({}),
  }),
  z.object({ action: z.literal("user.details"), input: z.object({ id: z.string().min(1).max(200) }) }),
  z.object({
    action: z.literal("user.invite"),
    input: z.object({
      tenantId: z.string().min(1).max(200),
      businessId: z.string().min(1).max(200),
      email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
      fullName: z.string().trim().min(2).max(160),
      role: roleSchema,
      department: z.string().trim().max(120).nullable().optional(),
      phoneNumber: z.string().trim().max(50).nullable().optional(),
    }),
  }),
  z.object({
    action: z.literal("tenant.create"),
    input: z.object({
      name: z.string().trim().min(2).max(200),
      businessSector: z.string().trim().min(2).max(120),
      location: z.string().trim().min(2).max(200),
      ownerEmail: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
      ownerName: z.string().trim().min(2).max(160),
      plan: planSchema,
    }),
  }),
  z.object({
    action: z.literal("tenant.update"),
    input: z.object({
      id: z.string().min(1).max(200),
      name: z.string().trim().min(2).max(200).optional(),
      businessSector: z.string().trim().min(2).max(120).optional(),
      location: z.string().trim().min(2).max(200).optional(),
      ownerEmail: z.string().trim().email().max(254).transform((value) => value.toLowerCase()).optional(),
      plan: planSchema.optional(),
      status: z.enum(["Active", "Suspended"]).optional(),
      suspensionReason: z.string().trim().max(1000).nullable().optional(),
      billingInterval: z.enum(["monthly", "annual"]).optional(),
      cancelAtPeriodEnd: z.boolean().optional(),
      lifecycle: z.enum(["archive", "restore"]).optional(),
    }).refine((value) => Object.keys(value).some((key) => key !== "id"), "No tenant change was provided"),
  }),
  z.object({
    action: z.literal("user.update"),
    input: z.object({
      id: z.string().min(1).max(200),
      email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()).optional(),
      fullName: z.string().trim().min(2).max(160).optional(),
      department: z.string().trim().max(120).nullable().optional(),
      phoneNumber: z.string().trim().max(50).nullable().optional(),
      businessId: z.string().min(1).max(200).optional(),
      role: roleSchema.optional(),
      status: z.enum(["Active", "Suspended"]).optional(),
    }).refine((value) => Object.keys(value).some((key) => key !== "id"), "No user change was provided"),
  }),
  z.object({ action: z.literal("user.invite.renew"), input: z.object({ id: z.string().min(1).max(200) }) }),
  z.object({ action: z.literal("user.invite.revoke"), input: z.object({ id: z.string().min(1).max(200) }) }),
  z.object({ action: z.literal("user.sessions.revoke"), input: z.object({ id: z.string().min(1).max(200) }) }),
  z.object({
    action: z.literal("plan.update"),
    input: z.object({
      code: planSchema,
      monthlyPriceFcfa: z.number().int().min(0).max(2_000_000_000),
      annualPriceFcfa: z.number().int().min(0).max(2_000_000_000),
      maxUsers: z.number().int().positive().max(1_000_000).nullable(),
      maxBusinesses: z.number().int().positive().max(1_000_000).nullable(),
      maxDocuments: z.number().int().positive().max(100_000_000).nullable(),
      monthlyAiRequests: z.number().int().positive().max(100_000_000).nullable(),
    }),
  }),
  z.object({
    action: z.literal("announcement.publish"),
    input: z.object({
      tenantId: z.string().min(1).max(200).nullable().optional(),
      title: z.string().trim().min(3).max(120),
      message: z.string().trim().min(3).max(4000),
      priority: z.enum(["NORMAL", "IMPORTANT", "URGENT"]),
      expiresAt: z.string().datetime().nullable().optional(),
    }),
  }),
  z.object({
    action: z.literal("invoice.create"),
    input: z.object({
      tenantId: z.string().min(1).max(200),
      amountFcfa: z.number().int().positive().max(2_000_000_000),
      dueAt: z.string().datetime().nullable().optional(),
      description: z.string().trim().max(1000).nullable().optional(),
    }),
  }),
  z.object({
    action: z.literal("invoice.pay"),
    input: z.object({
      invoiceId: z.string().min(1).max(200),
      amountFcfa: z.number().int().positive().max(2_000_000_000).optional(),
      method: z.string().trim().min(1).max(80).optional(),
    }),
  }),
  z.object({ action: z.literal("invoice.void"), input: z.object({ invoiceId: z.string().min(1).max(200) }) }),
  z.object({
    action: z.literal("tenant.note"),
    input: z.object({ tenantId: z.string().min(1).max(200), body: z.string().trim().min(1).max(4000) }),
  }),
  z.object({
    action: z.literal("support.create"),
    input: z.object({
      tenantId: z.string().min(1).max(200), subject: z.string().trim().min(1).max(200),
      description: z.string().trim().max(4000).nullable().optional(),
      priority: z.enum(["low", "normal", "high", "urgent"]),
    }),
  }),
  z.object({
    action: z.literal("support.update"),
    input: z.object({
      id: z.string().min(1).max(200), status: z.enum(["open", "in_progress", "resolved", "closed"]),
      assignedTo: z.string().trim().max(254).nullable().optional(),
    }),
  }),
])

export async function POST(request: Request) {
  try {
    const profile = await authorizeRequest(request)
    requirePermission(profile, "platform:manage")
    requireTrustedMutationOrigin(request)
    const parsed = requestSchema.parse(await request.json())
    const actor = { uid: profile.uid, email: profile.email }

    let data: unknown
    switch (parsed.action) {
      case "overview": data = await getPlatformOverview(parsed.input); break
      case "tenant.details": data = await getPlatformTenantDetails(parsed.input.id); break
      case "users.list": data = await getPlatformUsers(parsed.input); break
      case "user.details": data = await getPlatformUserDetails(parsed.input.id); break
      case "user.invite": data = await createPlatformUserInvite(actor, parsed.input); break
      case "tenant.create": data = await createPlatformTenant(actor, parsed.input); break
      case "tenant.update": data = await managePlatformTenant(actor, parsed.input); break
      case "user.update": data = await managePlatformUser(actor, parsed.input); break
      case "user.invite.renew": data = await renewPlatformUserInvite(actor, parsed.input.id); break
      case "user.invite.revoke": data = await revokePlatformUserInvite(actor, parsed.input.id); break
      case "user.sessions.revoke": data = await revokePlatformUserSessions(actor, parsed.input.id); break
      case "plan.update": data = await updatePlatformPlan(actor, parsed.input); break
      case "announcement.publish": data = await publishPlatformAnnouncement(actor, parsed.input); break
      case "invoice.create": data = await createPlatformInvoice(actor, parsed.input); break
      case "invoice.pay": data = await recordPlatformPayment(actor, parsed.input); break
      case "invoice.void": data = await voidPlatformInvoice(actor, parsed.input.invoiceId); break
      case "tenant.note": data = await addPlatformTenantNote(actor, parsed.input.tenantId, parsed.input.body); break
      case "support.create": data = await createPlatformSupportCase(actor, parsed.input); break
      case "support.update": data = await updatePlatformSupportCase(actor, parsed.input); break
    }
    return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    if (isTransientDatabaseError(error)) {
      console.error("Platform database operation failed after retries", error)
      return NextResponse.json(
        { error: "Database is temporarily unavailable. Please retry." },
        { status: 503, headers: { "Retry-After": "2" } },
      )
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "Invalid platform request" }, { status: 400 })
    }
    const message = error instanceof Error ? error.message : "Platform request failed"
    const status = message.startsWith("Forbidden") ? 403
      : message.includes("authentication") || message.includes("session") ? 401
        : message.includes("not found") ? 404 : 400
    return NextResponse.json({ error: message.replace(/^Forbidden:\s*/, "") }, { status })
  }
}
