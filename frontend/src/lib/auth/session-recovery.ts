"use client"

import { authClient } from "./client"

type AuthenticationError = {
  message?: unknown
  status?: unknown
}

let recoveryPromise: Promise<void> | null = null

export function isAuthenticationFailure(error: unknown) {
  if (!error || typeof error !== "object") return false
  const candidate = error as AuthenticationError
  if (candidate.status === 401) return true
  if (typeof candidate.message !== "string") return false

  const message = candidate.message.toLowerCase()
  return message.includes("authentication session")
    || (message.includes("session") && ["expired", "invalid", "missing"].some((value) => message.includes(value)))
}

/** Clear one stale client session even when several dashboard queries fail together. */
export function recoverAuthenticationSession() {
  recoveryPromise ??= (async () => {
    try {
      await authClient.signOut()
    } catch {
      // Navigation clears in-memory auth state even if the remote session is already gone.
    } finally {
      if (window.location.pathname !== "/login") window.location.replace("/login")
    }
  })()
  return recoveryPromise
}
