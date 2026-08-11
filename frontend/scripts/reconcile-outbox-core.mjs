import { reconcileBatch } from "./outbox-reconciliation.mjs"

export function isAuthorizedReconciliationRequest(request, secret) {
  if (!secret || secret.length < 32) return false
  const authorization = request.headers.get("authorization")
  return authorization === `Bearer ${secret}`
}

export async function reconcileOutbox({ dc, sql, now }) {
  const result = await dc.executeQuery("ListPendingMirrorOutbox")
  return reconcileBatch(result.data.mirrorOutboxes, async (event) => {
    if (["product", "transaction"].includes(event.entityType)) return
    await sql`INSERT INTO erp_mirror_records(entity_type,record_id,tenant_id,business_id,operation,payload,firebase_updated_at,mirrored_at)
      VALUES(${event.entityType},${event.recordId},${event.tenantId},${event.businessId},${event.operation},${JSON.stringify(event.payload)}::jsonb,NOW(),NOW())
      ON CONFLICT(entity_type,record_id) DO UPDATE SET operation=EXCLUDED.operation,payload=EXCLUDED.payload,firebase_updated_at=NOW(),mirrored_at=NOW()`
  }, async (event, state) => {
    await dc.executeMutation("UpdateMirrorOutbox", { id: event.id, ...state })
  }, now)
}
