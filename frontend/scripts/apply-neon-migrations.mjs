import "dotenv/config"
import { readFile } from "node:fs/promises"
import { Client } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
const migrations = [
  "../migrations/001_normalized_erp_schema.sql",
  "../migrations/002_document_intelligence.sql",
  "../migrations/003_announcements.sql",
]
const client = new Client(process.env.DATABASE_URL)
try {
  await client.connect()
  for (const path of migrations) {
    const migration = await readFile(new URL(path, import.meta.url), "utf8")
    await client.query(migration)
  }
  console.log("Neon normalized ERP migration applied")
} finally {
  await client.end()
}
