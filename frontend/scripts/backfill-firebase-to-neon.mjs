import "dotenv/config"
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app"
import { getDataConnect } from "firebase-admin/data-connect"
import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured")
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
if (!projectId) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not configured")

const app = getApps()[0] ?? initializeApp({ credential: applicationDefault(), projectId })
const dc = getDataConnect({
  location: "us-east4",
  serviceId: "studio-8058744913-5a601-service",
  connector: "example",
}, app)

const exportQuery = /* GraphQL */ `
  query NeonMigrationExport {
    tenants { id name businessSector location ownerEmail taxId logoUrl subscriptionTier status createdAt }
    users { id tenantId businessId email role fullName department phoneNumber createdAt accessCode }
    businesses { id tenantId name location businessType region createdAt code }
    products { id tenantId businessId name category quantity costPrice sellingPrice expiryDate lowStockLevel createdBy createdAt updatedAt }
    transactions { id tenantId businessId type amount date category receiptUrl recordedBy createdAt }
    tasks { id tenantId businessId title description status priority dueDate assignedTo { id } createdBy createdAt updatedAt }
    taskComments { id tenantId businessId task { id } user { id } content createdAt }
    employees { id tenantId businessId fullName position role salary department startDate status createdAt code }
    customers { id tenantId businessId customerName phoneNumber email location totalOrders totalSpent createdAt }
    suppliers { id tenantId businessId supplierName phoneNumber email createdAt }
    documents { id tenantId businessId title documentType fileUrl uploadedBy uploadedAt }
    activityLogs { id tenantId businessId userId userName actionType module description recordId timestamp }
    aiQueries { id tenantId businessId userId queryText response timestamp }
    notifications { id tenantId businessId userId message isRead createdAt }
  }
`

const response = await dc.executeGraphqlRead(exportQuery)
const data = response.data
const sql = neon(process.env.DATABASE_URL)

const collections = [
  ["tenant", data.tenants ?? []],
  ["business", data.businesses ?? []],
  ["user", data.users ?? []],
  ["product", data.products ?? []],
  ["transaction", data.transactions ?? []],
  ["task", data.tasks ?? []],
  ["task_comment", data.taskComments ?? []],
  ["employee", data.employees ?? []],
  ["customer", data.customers ?? []],
  ["supplier", data.suppliers ?? []],
  ["document", data.documents ?? []],
  ["activity_log", data.activityLogs ?? []],
  ["ai_query", data.aiQueries ?? []],
  ["notification", data.notifications ?? []],
]

let total = 0
for (const [entity, records] of collections) {
  for (const record of records) {
    const tenantId = record.tenantId ?? record.id
    const businessId = record.businessId ?? (entity === "business" ? record.id : "__tenant__")
    await sql`
      INSERT INTO erp_mirror_records (
        entity_type, record_id, tenant_id, business_id, operation, payload,
        firebase_updated_at, mirrored_at
      ) VALUES (
        ${entity}, ${record.id}, ${tenantId}, ${businessId}, 'upsert',
        ${JSON.stringify(record)}::jsonb, NOW(), NOW()
      )
      ON CONFLICT (entity_type, record_id) DO UPDATE SET
        tenant_id=EXCLUDED.tenant_id, business_id=EXCLUDED.business_id,
        operation='upsert', payload=EXCLUDED.payload,
        firebase_updated_at=NOW(), mirrored_at=NOW()
    `
    total += 1
  }
  console.log(`${entity}: ${records.length}`)
}
console.log(`Firebase to Neon backfill complete: ${total} records`)
