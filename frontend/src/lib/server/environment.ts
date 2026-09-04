import { z } from "zod"

const serverSchema = z.object({
  NEON_AUTH_BASE_URL: z.string().url(),
  NEON_AUTH_COOKIE_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  EXPECTED_DATABASE_HOST: z.string().min(1),
  NEON_POOL_MAX: z.coerce.number().int().min(1).max(20).default(5),
  AWS_ENDPOINT_URL_S3: z.string().url(),
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(3),
  OPENROUTER_API_KEY: z.string().min(10),
  OPENROUTER_MODELS: z.string().optional(),
  OPENROUTER_DATA_COLLECTION: z.enum(["deny", "allow"]).default("deny"),
  OPENROUTER_REQUIRE_ZDR: z.enum(["true", "false"]).default("false"),
  CRON_SECRET: z.string().min(32),
  RATE_LIMIT_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string().min(1),
  AI_RETENTION_DAYS: z.coerce.number().int().positive().max(3650).default(30),
  AI_INSIGHT_CACHE_MINUTES: z.coerce.number().int().positive().max(1440).default(15),
})

export type ServerEnvironment = z.infer<typeof serverSchema>

export function validateServerEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): ServerEnvironment {
  const result = serverSchema.safeParse(source)
  if (!result.success) {
    const names = [...new Set(result.error.issues.map((issue) => issue.path[0]))]
    throw new Error(`Invalid server environment: ${names.join(", ")}`)
  }
  const authUrl = new URL(result.data.NEON_AUTH_BASE_URL)
  if (authUrl.protocol !== "https:" || !/\.neonauth\.[a-z0-9-]+\.aws\.neon\.tech$/.test(authUrl.hostname)) {
    throw new Error("NEON_AUTH_BASE_URL must be a branch-specific Neon Auth endpoint")
  }
  const databaseUrl = new URL(result.data.DATABASE_URL)
  if (databaseUrl.hostname !== result.data.EXPECTED_DATABASE_HOST) {
    throw new Error("DATABASE_URL must match EXPECTED_DATABASE_HOST")
  }
  if (!databaseUrl.hostname.includes("-pooler.")) {
    throw new Error("DATABASE_URL must use the pooled Neon hostname")
  }
  const appUrl = new URL(result.data.NEXT_PUBLIC_APP_URL)
  if (appUrl.protocol !== "https:" && !["localhost", "127.0.0.1"].includes(appUrl.hostname)) {
    throw new Error("NEXT_PUBLIC_APP_URL must use HTTPS outside local development")
  }
  const allowedOrigins = result.data.ALLOWED_ORIGINS.split(",").map((value) => value.trim()).filter(Boolean)
  if (!allowedOrigins.every((value) => {
    try {
      const parsed = new URL(value)
      return parsed.origin === value && (parsed.protocol === "https:" || ["localhost", "127.0.0.1"].includes(parsed.hostname))
    } catch {
      return false
    }
  })) {
    throw new Error("ALLOWED_ORIGINS must contain comma-separated HTTPS origins")
  }
  if (!allowedOrigins.includes(appUrl.origin)) {
    throw new Error("ALLOWED_ORIGINS must include NEXT_PUBLIC_APP_URL")
  }
  if (new Set([
    result.data.CRON_SECRET,
    result.data.RATE_LIMIT_SECRET,
    result.data.NEON_AUTH_COOKIE_SECRET,
  ]).size !== 3) {
    throw new Error("CRON_SECRET, RATE_LIMIT_SECRET, and NEON_AUTH_COOKIE_SECRET must be independent")
  }
  return result.data
}
