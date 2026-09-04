import "dotenv/config"
import { readFile } from "node:fs/promises"
import { Client } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
if (!process.env.EXPECTED_DATABASE_HOST) throw new Error("EXPECTED_DATABASE_HOST is required")
if (new URL(process.env.DATABASE_URL).hostname !== process.env.EXPECTED_DATABASE_HOST) {
  throw new Error("Neon target does not match EXPECTED_DATABASE_HOST")
}
if (process.env.NEON_MIGRATION_CONFIRMATION !== "APPLY_SMARTERP_NEON_MIGRATIONS") {
  throw new Error("Set NEON_MIGRATION_CONFIRMATION=APPLY_SMARTERP_NEON_MIGRATIONS")
}
const migrations = [
  "../migrations/001_normalized_erp_schema.sql",
  "../migrations/002_document_intelligence.sql",
  "../migrations/003_announcements.sql",
  "../migrations/004_security_transactional_integrity.sql",
  "../migrations/005_targeted_notifications.sql",
  "../migrations/006_operational_fields.sql",
  "../migrations/007_cross_store_customer_reference.sql",
  "../migrations/008_neon_system_of_record.sql",
  "../migrations/009_neon_auth.sql",
  "../migrations/010_tenant_integrity_guards.sql",
  "../migrations/011_hr_payroll_accounting.sql",
  "../migrations/012_ai_governance.sql",
  "../migrations/013_saas_control_plane.sql",
  "../migrations/014_platform_user_administration.sql",
  "../migrations/015_barcode_product_units.sql",
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
