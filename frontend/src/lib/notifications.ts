import type { Role } from "./types"

export async function createNotification(params: {
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  module: "Inventory" | "Tasks"
  targetUserId?: string
  targetRoles?: Role[]
  link?: string
  userProfile?: { tenantId: string; businessId: string }
}) {
  const response = await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: params.title,
      message: params.message,
      type: params.type,
      module: params.module,
      targetUserId: params.targetUserId,
      targetRoles: params.targetRoles,
      link: params.link,
    }),
  })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Notification delivery failed")
  window.dispatchEvent(new Event("smarterp:announcement"))
  return body
}
