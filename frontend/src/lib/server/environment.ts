import { z } from "zod"

const serverSchema = z.object({
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(6),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().email().optional(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().min(40).optional(),
  FIREBASE_DATACONNECT_LOCATION: z.string().min(2),
  FIREBASE_DATACONNECT_SERVICE_ID: z.string().min(3),
  FIREBASE_DATACONNECT_CONNECTOR_ID: z.string().min(1).default("example"),
  DATABASE_URL: z.string().url(),
  AWS_ENDPOINT_URL_S3: z.string().url(),
  AWS_REGION: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  S3_BUCKET: z.string().min(3),
  OPENROUTER_API_KEY: z.string().min(10),
  CRON_SECRET: z.string().min(32),
  RATE_LIMIT_SECRET: z.string().min(32),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  ALLOWED_ORIGINS: z.string().min(1),
  AI_RETENTION_DAYS: z.coerce.number().int().positive().default(30),
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
  const hasEmail = Boolean(result.data.FIREBASE_ADMIN_CLIENT_EMAIL)
  const hasKey = Boolean(result.data.FIREBASE_ADMIN_PRIVATE_KEY)
  if (hasEmail !== hasKey) {
    throw new Error("Firebase Admin email and private key must be configured together")
  }
  return result.data
}

export function dataConnectConfig() {
  return {
    location: process.env.FIREBASE_DATACONNECT_LOCATION || "us-east4",
    serviceId: process.env.FIREBASE_DATACONNECT_SERVICE_ID || "",
    connector: process.env.FIREBASE_DATACONNECT_CONNECTOR_ID || "example",
  }
}
