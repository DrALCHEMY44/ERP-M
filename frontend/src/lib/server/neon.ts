import { neon } from "@neondatabase/serverless"

let schemaPromise: Promise<unknown> | null = null

function sqlClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not configured")
  return neon(connectionString)
}

export async function ensureMirrorSchema() {
  if (!schemaPromise) {
    const sql = sqlClient()
    schemaPromise = sql`
      CREATE TABLE IF NOT EXISTS erp_mirror_records (
        entity_type TEXT NOT NULL,
        record_id TEXT NOT NULL,
        tenant_id TEXT NOT NULL,
        business_id TEXT NOT NULL,
        operation TEXT NOT NULL CHECK (operation IN ('upsert', 'delete')),
        payload JSONB NOT NULL DEFAULT '{}'::jsonb,
        firebase_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        mirrored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (entity_type, record_id)
      )
    `
  }
  await schemaPromise
}

export async function mirrorRecord(input: {
  entity: string
  recordId: string
  tenantId: string
  businessId: string
  operation: "upsert" | "delete"
  payload: Record<string, unknown>
}) {
  await ensureMirrorSchema()
  const sql = sqlClient()
  const payload = JSON.stringify(input.payload)
  await sql`
    INSERT INTO erp_mirror_records (
      entity_type, record_id, tenant_id, business_id, operation, payload,
      firebase_updated_at, mirrored_at
    ) VALUES (
      ${input.entity}, ${input.recordId}, ${input.tenantId}, ${input.businessId},
      ${input.operation}, ${payload}::jsonb, NOW(), NOW()
    )
    ON CONFLICT (entity_type, record_id) DO UPDATE SET
      tenant_id = EXCLUDED.tenant_id,
      business_id = EXCLUDED.business_id,
      operation = EXCLUDED.operation,
      payload = EXCLUDED.payload,
      firebase_updated_at = NOW(),
      mirrored_at = NOW()
  `
}
