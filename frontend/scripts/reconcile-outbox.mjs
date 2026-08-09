import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getDataConnect } from "firebase-admin/data-connect"
import { neon } from "@neondatabase/serverless"
import { reconcileBatch } from "./outbox-reconciliation.mjs"

for (const name of ["DATABASE_URL", "NEXT_PUBLIC_FIREBASE_PROJECT_ID"]) {
  if (!process.env[name]) throw new Error(`${name} is required`)
}
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
const app = getApps()[0] || initializeApp({
  projectId,
  credential: clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault(),
})
const dc = getDataConnect({ location: "us-east4", serviceId: "studio-8058744913-5a601-service", connector: "example" }, app)
const sql = neon(process.env.DATABASE_URL)
const result = await dc.executeQuery("ListPendingMirrorOutbox")
const summary = await reconcileBatch(result.data.mirrorOutboxes, async (event) => {
    // Neon is authoritative for inventory and financial ledger domains.
    // Old transition events must never overwrite locked operational state.
    if (["product", "transaction"].includes(event.entityType)) return
    await sql`INSERT INTO erp_mirror_records(entity_type,record_id,tenant_id,business_id,operation,payload,firebase_updated_at,mirrored_at)
      VALUES(${event.entityType},${event.recordId},${event.tenantId},${event.businessId},${event.operation},${JSON.stringify(event.payload)}::jsonb,NOW(),NOW())
      ON CONFLICT(entity_type,record_id) DO UPDATE SET operation=EXCLUDED.operation,payload=EXCLUDED.payload,firebase_updated_at=NOW(),mirrored_at=NOW()`
}, async (event, state) => {
  await dc.executeMutation("UpdateMirrorOutbox", { id: event.id, ...state })
})
console.log(JSON.stringify(summary))
