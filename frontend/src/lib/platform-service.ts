"use client"

import { ApiOperationError } from "@/lib/api-operation-error"

const retriableReads = new Set(["overview", "tenant.details", "users.list", "user.details"])

const wait = (milliseconds: number) => new Promise((resolve) => window.setTimeout(resolve, milliseconds))

async function platformOperation<T = unknown>(action: string, input: Record<string, unknown> = {}): Promise<{ data: T }> {
  if (typeof window === "undefined") throw new Error(`${action} must be called through the browser`)

  for (let attempt = 0; ; attempt += 1) {
    const response = await fetch("/api/platform", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, input }),
      cache: "no-store",
    })
    const body = await response.json().catch(() => ({})) as { error?: unknown; data?: T }
    if (response.ok) return body as { data: T }

    const error = new ApiOperationError(
      typeof body.error === "string" ? body.error : `${action} failed`,
      response.status,
    )
    if (response.status !== 503 || !retriableReads.has(action) || attempt >= 2) throw error

    const retryAfter = Number(response.headers.get("Retry-After"))
    await wait(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 750 * 2 ** attempt)
  }
}

export const platformOverviewQuery = (input: Record<string, unknown> = {}) => platformOperation("overview", input)
export const platformTenantDetailsQuery = (input: Record<string, unknown>) => platformOperation("tenant.details", input)
export const platformUsersQuery = (input: Record<string, unknown> = {}) => platformOperation("users.list", input)
export const platformUserDetailsQuery = (input: Record<string, unknown>) => platformOperation("user.details", input)
export const createPlatformTenant = (input: Record<string, unknown>) => platformOperation("tenant.create", input)
export const invitePlatformUser = (input: Record<string, unknown>) => platformOperation("user.invite", input)
export const updatePlatformTenant = (input: Record<string, unknown>) => platformOperation("tenant.update", input)
export const updatePlatformUser = (input: Record<string, unknown>) => platformOperation("user.update", input)
export const renewPlatformUserInvite = (id: string) => platformOperation("user.invite.renew", { id })
export const revokePlatformUserInvite = (id: string) => platformOperation("user.invite.revoke", { id })
export const revokePlatformUserSessions = (id: string) => platformOperation("user.sessions.revoke", { id })
export const updateSaaSPlan = (input: Record<string, unknown>) => platformOperation("plan.update", input)
export const publishPlatformAnnouncement = (input: Record<string, unknown>) => platformOperation("announcement.publish", input)
export const createSaaSInvoice = (input: Record<string, unknown>) => platformOperation("invoice.create", input)
export const recordSaaSPayment = (input: Record<string, unknown>) => platformOperation("invoice.pay", input)
export const voidSaaSInvoice = (invoiceId: string) => platformOperation("invoice.void", { invoiceId })
export const addPlatformTenantNote = (tenantId: string, body: string) => platformOperation("tenant.note", { tenantId, body })
export const createPlatformSupportCase = (input: Record<string, unknown>) => platformOperation("support.create", input)
export const updatePlatformSupportCase = (input: Record<string, unknown>) => platformOperation("support.update", input)
