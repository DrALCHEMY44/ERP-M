import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")
const sql = neon(process.env.DATABASE_URL)
const events = await sql`SELECT status,COUNT(*)::integer AS count,MIN(created_at) AS oldest
  FROM integration_outbox GROUP BY status ORDER BY status`
console.log(JSON.stringify({ events }))
