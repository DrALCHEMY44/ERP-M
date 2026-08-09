import { createHmac } from "crypto"
import { neon } from "@neondatabase/serverless"

export async function consumeRateLimit(input: { request: Request; bucket: string; limit: number; windowSeconds: number }) {
  const connection = process.env.DATABASE_URL
  const secret = process.env.RATE_LIMIT_SECRET
  if (!connection || !secret) throw new Error("Durable rate limiting is not configured")
  const address = input.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || input.request.headers.get("x-real-ip") || "unknown"
  const subject = createHmac("sha256", secret).update(address).digest("hex")
  const sql = neon(connection)
  const rows = await sql`INSERT INTO request_rate_limits(bucket,subject_hash,window_started_at,request_count)
    VALUES(${input.bucket},${subject},NOW(),1)
    ON CONFLICT(bucket,subject_hash) DO UPDATE SET
      window_started_at=CASE WHEN request_rate_limits.window_started_at < NOW() - (${input.windowSeconds} * INTERVAL '1 second') THEN NOW() ELSE request_rate_limits.window_started_at END,
      request_count=CASE WHEN request_rate_limits.window_started_at < NOW() - (${input.windowSeconds} * INTERVAL '1 second') THEN 1 ELSE request_rate_limits.request_count + 1 END
    RETURNING request_count`
  return Number(rows[0].request_count) <= input.limit
}
