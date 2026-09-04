import { neon, Pool, type NeonQueryFunction } from "@neondatabase/serverless"

type NeonGlobals = typeof globalThis & {
  smartErpNeonHttpUrl?: string
  smartErpNeonHttp?: NeonQueryFunction<false, false>
  smartErpNeonPoolUrl?: string
  smartErpNeonPool?: Pool
}

const neonGlobals = globalThis as NeonGlobals

const TRANSIENT_DATABASE_CODES = new Set([
  "EAI_AGAIN",
  "ECONNREFUSED",
  "ECONNRESET",
  "ENETUNREACH",
  "ETIMEDOUT",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET",
])

const TRANSIENT_DATABASE_MESSAGES = [
  "connection terminated unexpectedly",
  "error connecting to database",
  "fetch failed",
  "network socket disconnected",
  "readiness check timed out",
]

type NestedError = {
  code?: unknown
  message?: unknown
  cause?: unknown
  sourceError?: unknown
  errors?: unknown
}

/** Returns true only for transport failures that are safe to retry on reads. */
export function isTransientDatabaseError(error: unknown) {
  const pending: unknown[] = [error]
  const seen = new Set<unknown>()

  while (pending.length) {
    const current = pending.shift()
    if (!current || seen.has(current)) continue
    seen.add(current)

    if (typeof current === "string") {
      const message = current.toLowerCase()
      if (TRANSIENT_DATABASE_MESSAGES.some((value) => message.includes(value))) return true
      continue
    }
    if (typeof current !== "object") continue

    const nested = current as NestedError
    if (typeof nested.code === "string" && TRANSIENT_DATABASE_CODES.has(nested.code)) return true
    if (typeof nested.message === "string") pending.push(nested.message)
    if (nested.cause) pending.push(nested.cause)
    if (nested.sourceError) pending.push(nested.sourceError)
    if (Array.isArray(nested.errors)) pending.push(...nested.errors)
  }

  return false
}

/** Retry transient database transport errors. Use only for read-only work. */
export async function withTransientDatabaseRetry<T>(
  operation: () => Promise<T>,
  delays: readonly number[] = [250, 750],
): Promise<T> {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      if (!isTransientDatabaseError(error) || attempt >= delays.length) throw error
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]))
    }
  }
}

function connectionString() {
  const value = process.env.DATABASE_URL
  if (!value) throw new Error("DATABASE_URL is not configured")
  return value
}

export function db(): NeonQueryFunction<false, false> {
  const url = connectionString()
  if (!neonGlobals.smartErpNeonHttp || neonGlobals.smartErpNeonHttpUrl !== url) {
    neonGlobals.smartErpNeonHttpUrl = url
    neonGlobals.smartErpNeonHttp = neon(url)
  }
  return neonGlobals.smartErpNeonHttp
}

/** Shared only by code paths that require an interactive transaction. */
export function pooledDb() {
  const url = connectionString()
  if (!neonGlobals.smartErpNeonPool || neonGlobals.smartErpNeonPoolUrl !== url) {
    const configuredMax = Number(process.env.NEON_POOL_MAX ?? 5)
    const max = Number.isInteger(configuredMax) && configuredMax >= 1 && configuredMax <= 20
      ? configuredMax
      : 5
    neonGlobals.smartErpNeonPoolUrl = url
    neonGlobals.smartErpNeonPool = new Pool({
      connectionString: url,
      max,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 30_000,
    })
  }
  return neonGlobals.smartErpNeonPool
}
