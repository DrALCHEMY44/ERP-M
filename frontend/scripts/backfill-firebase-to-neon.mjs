import "dotenv/config"
import { randomBytes, scrypt as scryptCallback } from "node:crypto"
import { promisify } from "node:util"
import { applicationDefault, cert, initializeApp } from "firebase-admin/app"
import { getDataConnect } from "firebase-admin/data-connect"
import { Pool } from "@neondatabase/serverless"

const scrypt = promisify(scryptCallback)
const required = [
  "DATABASE_URL", "EXPECTED_DATABASE_HOST", "SOURCE_FIREBASE_PROJECT_ID",
  "SOURCE_FIREBASE_DATACONNECT_LOCATION", "SOURCE_FIREBASE_DATACONNECT_SERVICE_ID",
]
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required`)
if (process.env.MIGRATION_CONFIRMATION !== "MIGRATE_DATACONNECT_TO_NEON") {
  throw new Error("Set MIGRATION_CONFIRMATION=MIGRATE_DATACONNECT_TO_NEON")
}
const databaseHost = new URL(process.env.DATABASE_URL).hostname
if (databaseHost !== process.env.EXPECTED_DATABASE_HOST) throw new Error("Neon target does not match EXPECTED_DATABASE_HOST")

const sourceProject = process.env.SOURCE_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
const app = initializeApp({
  projectId: sourceProject,
  credential: clientEmail && privateKey
    ? cert({ projectId: sourceProject, clientEmail, privateKey })
    : applicationDefault(),
}, "dataconnect-neon-migration")
const sourceService = process.env.SOURCE_FIREBASE_DATACONNECT_SERVICE_ID
const dc = getDataConnect({
  location: process.env.SOURCE_FIREBASE_DATACONNECT_LOCATION,
  serviceId: sourceService,
  connector: process.env.SOURCE_FIREBASE_DATACONNECT_CONNECTOR_ID || "example",
}, app)

const exportQuery = /* GraphQL */ `
  query NeonFinalMigrationExport($limit: Int!, $offset: Int!) {
    tenants(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id name businessSector location ownerEmail taxId logoUrl subscriptionTier status createdAt }
    users(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId email role fullName department phoneNumber createdAt accessCode }
    businesses(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId name location businessType region createdAt code }
    products(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId name category quantity costPrice sellingPrice expiryDate lowStockLevel createdBy createdAt updatedAt }
    transactions(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId type amount date category receiptUrl recordedBy createdAt }
    tasks(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId title description status priority dueDate assignedTo { id } createdBy createdAt updatedAt }
    taskComments(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId task { id } user { id } content createdAt }
    employees(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId fullName position role salary department startDate status createdAt }
    customers(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId customerName phoneNumber email location totalOrders totalSpent createdAt }
    suppliers(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId supplierName phoneNumber email createdAt }
    documents(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId title documentType fileUrl uploadedBy uploadedAt }
    activityLogs(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId userId userName actionType module description recordId timestamp }
    aiQueries(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId userId queryText response timestamp }
    notifications(limit: $limit, offset: $offset, orderBy: [{ id: ASC }]) { id tenantId businessId userId message isRead createdAt }
  }
`

async function accessHash(user) {
  if (user.accessCode) {
    const salt = randomBytes(16)
    const derived = await scrypt(String(user.accessCode).toUpperCase(), salt, 64)
    return `scrypt:${salt.toString("base64url")}:${derived.toString("base64url")}`
  }
  return user.accessCodeHash || null
}

const collectionNames = [
  "tenants", "users", "businesses", "businessSettings", "products", "transactions",
  "tasks", "taskComments", "employees", "customers", "suppliers", "documents",
  "activityLogs", "aiQueries", "notifications",
]
const collections = Object.fromEntries(collectionNames.map((name) => [name, []]))
const pageSize = 100
for (let offset = 0; ; offset += pageSize) {
  const response = await dc.executeGraphqlRead(exportQuery, { variables: { limit: pageSize, offset } })
  let hasAnotherPage = false
  for (const name of collectionNames) {
    const rows = response.data[name] ?? []
    collections[name].push(...rows)
    if (rows.length === pageSize) hasAnotherPage = true
  }
  if (!hasAnotherPage) break
  if (offset >= 10_000_000) throw new Error("Source export exceeded the safety pagination limit")
}

// The deployed legacy schema predates business settings. Materialize the
// application's documented defaults once per imported business.
const sourceBusinessSettingsCount = collections.businessSettings.length
if (!sourceBusinessSettingsCount) {
  collections.businessSettings.push(...collections.businesses.map((business) => ({
    businessId: business.id,
    tenantId: business.tenantId,
    currency: "FCFA",
    timezone: "Africa/Douala",
    fiscalYearStart: "01-01",
    taxRate: 0,
    lowStockThreshold: 10,
    updatedAt: business.createdAt,
  })))
}
const synthesizedBusinessSettingsCount = collections.businessSettings.length - sourceBusinessSettingsCount
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()

try {
  await client.query("BEGIN")
  for (const row of collections.tenants) await client.query(
    `INSERT INTO tenants(id,name,business_sector,location,owner_email,tax_id,logo_url,subscription_tier,status,created_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(id) DO UPDATE SET
     name=EXCLUDED.name,business_sector=EXCLUDED.business_sector,location=EXCLUDED.location,
     owner_email=EXCLUDED.owner_email,tax_id=EXCLUDED.tax_id,logo_url=EXCLUDED.logo_url,
     subscription_tier=EXCLUDED.subscription_tier,status=EXCLUDED.status`,
    [row.id,row.name,row.businessSector,row.location,row.ownerEmail,row.taxId,row.logoUrl,row.subscriptionTier,row.status,row.createdAt],
  )
  for (const row of collections.businesses) await client.query(
    `INSERT INTO businesses(id,tenant_id,name,location,business_type,entity_type,city,region,phone,email,tax_id,description,logo_url,created_at,code)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) ON CONFLICT(id) DO UPDATE SET
     tenant_id=EXCLUDED.tenant_id,name=EXCLUDED.name,location=EXCLUDED.location,business_type=EXCLUDED.business_type,
     entity_type=EXCLUDED.entity_type,city=EXCLUDED.city,region=EXCLUDED.region,phone=EXCLUDED.phone,email=EXCLUDED.email,
     tax_id=EXCLUDED.tax_id,description=EXCLUDED.description,logo_url=EXCLUDED.logo_url,code=EXCLUDED.code`,
    [row.id,row.tenantId,row.name,row.location,row.businessType,row.entityType,row.city,row.region,row.phone,row.email,row.taxId,row.description,row.logoUrl,row.createdAt,row.code],
  )
  for (const row of collections.businessSettings) await client.query(
    `INSERT INTO business_settings(business_id,tenant_id,currency,timezone,fiscal_year_start,tax_rate,low_stock_threshold,updated_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(business_id) DO UPDATE SET tenant_id=EXCLUDED.tenant_id,
     currency=EXCLUDED.currency,timezone=EXCLUDED.timezone,fiscal_year_start=EXCLUDED.fiscal_year_start,
     tax_rate=EXCLUDED.tax_rate,low_stock_threshold=EXCLUDED.low_stock_threshold,updated_at=EXCLUDED.updated_at`,
    [row.businessId,row.tenantId,row.currency,row.timezone,row.fiscalYearStart,row.taxRate,row.lowStockThreshold,row.updatedAt],
  )
  for (const row of collections.users) await client.query(
    `INSERT INTO users(id,tenant_id,business_id,email,role,full_name,department,phone_number,created_at,access_code_hash)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(id) DO UPDATE SET tenant_id=EXCLUDED.tenant_id,
     business_id=EXCLUDED.business_id,email=EXCLUDED.email,role=EXCLUDED.role,full_name=EXCLUDED.full_name,
     department=EXCLUDED.department,phone_number=EXCLUDED.phone_number,access_code_hash=EXCLUDED.access_code_hash`,
    [row.id,row.tenantId,row.businessId,row.email,row.role,row.fullName,row.department,row.phoneNumber,row.createdAt,await accessHash(row)],
  )
  // Firebase remains authoritative until the documented final write freeze.
  // A rerun must therefore refresh changed source rows before deployment.
  for (const row of collections.products) await client.query(
    `INSERT INTO products(id,tenant_id,business_id,name,category,quantity,cost_price,selling_price,expiry_date,low_stock_level,status,created_by,created_at,updated_at,sku)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) ON CONFLICT(id) DO UPDATE SET
     tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,name=EXCLUDED.name,category=EXCLUDED.category,
     quantity=EXCLUDED.quantity,cost_price=EXCLUDED.cost_price,selling_price=EXCLUDED.selling_price,
     expiry_date=EXCLUDED.expiry_date,low_stock_level=EXCLUDED.low_stock_level,status=EXCLUDED.status,
     created_by=EXCLUDED.created_by,created_at=EXCLUDED.created_at,updated_at=EXCLUDED.updated_at,sku=EXCLUDED.sku`,
    [row.id,row.tenantId,row.businessId,row.name,row.category,row.quantity,row.costPrice,row.sellingPrice,row.expiryDate,row.lowStockLevel,row.status || "active",row.createdBy,row.createdAt,row.updatedAt,`MIGRATED-${row.id}`],
  )
  for (const row of collections.transactions) await client.query(
    `INSERT INTO transactions(id,tenant_id,business_id,type,amount,date,category,description,receipt_url,recorded_by,created_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT(id) DO UPDATE SET
     tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,type=EXCLUDED.type,amount=EXCLUDED.amount,
     date=EXCLUDED.date,category=EXCLUDED.category,description=EXCLUDED.description,receipt_url=EXCLUDED.receipt_url,
     recorded_by=EXCLUDED.recorded_by,created_at=EXCLUDED.created_at`,
    [row.id,row.tenantId,row.businessId,row.type,row.amount,row.date,row.category,row.description,row.receiptUrl,row.recordedBy,row.createdAt],
  )
  const legacySaleTransactions = collections.transactions.filter((row) => row.type === "SALE")
  for (const row of legacySaleTransactions) await client.query(
    `INSERT INTO sales(id,tenant_id,business_id,customer_id,payment_method,total_amount,recorded_by,idempotency_key,created_at)
     VALUES($1,$2,$3,NULL,'UNKNOWN',$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET
     tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,total_amount=EXCLUDED.total_amount,
     recorded_by=EXCLUDED.recorded_by,idempotency_key=EXCLUDED.idempotency_key,created_at=EXCLUDED.created_at`,
    [row.id,row.tenantId,row.businessId,row.amount,row.recordedBy,`dataconnect:${row.id}`,row.date || row.createdAt],
  )
  for (const row of collections.tasks) await client.query(
    `INSERT INTO tasks(id,tenant_id,business_id,title,description,status,priority,due_date,assigned_to_id,created_by,created_at,updated_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT(id) DO UPDATE SET tenant_id=EXCLUDED.tenant_id,
     business_id=EXCLUDED.business_id,title=EXCLUDED.title,description=EXCLUDED.description,status=EXCLUDED.status,
     priority=EXCLUDED.priority,due_date=EXCLUDED.due_date,assigned_to_id=EXCLUDED.assigned_to_id,
     created_by=EXCLUDED.created_by,updated_at=EXCLUDED.updated_at`,
    [row.id,row.tenantId,row.businessId,row.title,row.description,row.status,row.priority,row.dueDate,row.assignedTo?.id ?? null,row.createdBy,row.createdAt,row.updatedAt],
  )
  for (const row of collections.taskComments) await client.query(
    `INSERT INTO task_comments(id,tenant_id,business_id,task_id,user_id,content,created_at) VALUES($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT(id) DO UPDATE SET content=EXCLUDED.content`,
    [row.id,row.tenantId,row.businessId,row.task?.id,row.user?.id,row.content,row.createdAt],
  )
  for (const row of collections.employees) await client.query(
    `INSERT INTO employees(id,tenant_id,business_id,full_name,position,role,salary,department,email,contact,start_date,status,attendance,salary_payment_status,created_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) ON CONFLICT(id) DO UPDATE SET
     tenant_id=EXCLUDED.tenant_id,business_id=EXCLUDED.business_id,full_name=EXCLUDED.full_name,position=EXCLUDED.position,
     role=EXCLUDED.role,salary=EXCLUDED.salary,department=EXCLUDED.department,email=EXCLUDED.email,contact=EXCLUDED.contact,
     start_date=EXCLUDED.start_date,status=EXCLUDED.status,attendance=EXCLUDED.attendance,salary_payment_status=EXCLUDED.salary_payment_status`,
    [row.id,row.tenantId,row.businessId,row.fullName,row.position,row.role,row.salary,row.department,row.email,row.contact,row.startDate,row.status,row.attendance,row.salaryPaymentStatus,row.createdAt],
  )
  for (const row of collections.customers) await client.query(
    `INSERT INTO customers(id,tenant_id,business_id,customer_name,phone_number,email,location,total_orders,total_spent,notes,created_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT(id) DO UPDATE SET tenant_id=EXCLUDED.tenant_id,
     business_id=EXCLUDED.business_id,customer_name=EXCLUDED.customer_name,phone_number=EXCLUDED.phone_number,
     email=EXCLUDED.email,location=EXCLUDED.location,notes=EXCLUDED.notes`,
    [row.id,row.tenantId,row.businessId,row.customerName,row.phoneNumber,row.email,row.location,row.totalOrders,row.totalSpent,row.notes,row.createdAt],
  )
  for (const row of collections.suppliers) await client.query(
    `INSERT INTO suppliers(id,tenant_id,business_id,supplier_name,phone_number,email,location,products_supplied,payment_status,notes,created_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) ON CONFLICT(id) DO UPDATE SET tenant_id=EXCLUDED.tenant_id,
     business_id=EXCLUDED.business_id,supplier_name=EXCLUDED.supplier_name,phone_number=EXCLUDED.phone_number,
     email=EXCLUDED.email,location=EXCLUDED.location,products_supplied=EXCLUDED.products_supplied,
     payment_status=EXCLUDED.payment_status,notes=EXCLUDED.notes`,
    [row.id,row.tenantId,row.businessId,row.supplierName,row.phoneNumber,row.email,row.location,row.productsSupplied,row.paymentStatus,row.notes,row.createdAt],
  )
  for (const row of collections.documents) await client.query(
    `INSERT INTO documents(id,tenant_id,business_id,title,document_type,file_url,description,uploaded_by,uploaded_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT(id) DO UPDATE SET tenant_id=EXCLUDED.tenant_id,
     business_id=EXCLUDED.business_id,title=EXCLUDED.title,document_type=EXCLUDED.document_type,file_url=EXCLUDED.file_url,
     description=EXCLUDED.description,uploaded_by=EXCLUDED.uploaded_by`,
    [row.id,row.tenantId,row.businessId,row.title,row.documentType,row.fileUrl,row.description,row.uploadedBy,row.uploadedAt],
  )
  for (const row of collections.activityLogs) await client.query(
    `INSERT INTO activity_logs(id,tenant_id,business_id,user_id,user_name,action_type,module,description,record_id,timestamp)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT(id) DO NOTHING`,
    [row.id,row.tenantId,row.businessId,row.userId,row.userName,row.actionType,row.module,row.description,row.recordId,row.timestamp],
  )
  for (const row of collections.aiQueries) await client.query(
    `INSERT INTO ai_queries(id,tenant_id,business_id,user_id,query_text,response,timestamp) VALUES($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT(id) DO NOTHING`, [row.id,row.tenantId,row.businessId,row.userId,row.queryText,row.response,row.timestamp],
  )
  for (const row of collections.notifications) await client.query(
    `INSERT INTO notifications(id,tenant_id,business_id,user_id,message,is_read,created_at) VALUES($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT(id) DO UPDATE SET message=EXCLUDED.message,is_read=EXCLUDED.is_read`,
    [row.id,row.tenantId,row.businessId,row.userId,row.message,row.isRead,row.createdAt],
  )

  const counts = Object.fromEntries(Object.entries(collections).map(([name, rows]) => [name, rows.length]))
  counts.businessSettings = sourceBusinessSettingsCount
  counts.synthesizedBusinessSettings = synthesizedBusinessSettingsCount
  const targetTables = {
    tenants: ["tenants", "id", "id"], users: ["users", "id", "id"],
    businesses: ["businesses", "id", "id"], businessSettings: ["business_settings", "business_id", "businessId"],
    products: ["products", "id", "id"], transactions: ["transactions", "id", "id"],
    tasks: ["tasks", "id", "id"], taskComments: ["task_comments", "id", "id"],
    employees: ["employees", "id", "id"], customers: ["customers", "id", "id"],
    suppliers: ["suppliers", "id", "id"], documents: ["documents", "id", "id"],
    activityLogs: ["activity_logs", "id", "id"], aiQueries: ["ai_queries", "id", "id"],
    notifications: ["notifications", "id", "id"],
  }
  const targetCounts = {}
  for (const [name, [table, targetKey, sourceKey]] of Object.entries(targetTables)) {
    const sourceIds = [...new Set(collections[name].map((row) => String(row[sourceKey])))]
    if (sourceIds.length) {
      const verified = await client.query(`SELECT COUNT(*)::integer AS count FROM ${table} WHERE ${targetKey}=ANY($1::text[])`, [sourceIds])
      if (verified.rows[0].count !== sourceIds.length) throw new Error(`Neon record verification failed for ${name}`)
    }
    const result = await client.query(`SELECT COUNT(*)::integer AS count FROM ${table}`)
    targetCounts[name] = result.rows[0].count
    if (targetCounts[name] < counts[name]) throw new Error(`Neon verification failed for ${name}`)
  }
  const legacySaleIds = [...new Set(legacySaleTransactions.map((row) => String(row.id)))]
  if (legacySaleIds.length) {
    const verified = await client.query("SELECT COUNT(*)::integer AS count FROM sales WHERE id=ANY($1::text[])", [legacySaleIds])
    if (verified.rows[0].count !== legacySaleIds.length) throw new Error("Neon record verification failed for legacy sales")
  }
  counts.legacySales = legacySaleIds.length
  targetCounts.sales = (await client.query("SELECT COUNT(*)::integer AS count FROM sales")).rows[0].count
  await client.query("ALTER TABLE sales VALIDATE CONSTRAINT sales_customer_scope_fkey")
  await client.query(
    `INSERT INTO system_migrations(id,source_project,source_service,record_counts)
     VALUES('dataconnect-final-import',$1,$2,$3::jsonb) ON CONFLICT(id) DO UPDATE SET
     source_project=EXCLUDED.source_project,source_service=EXCLUDED.source_service,
     record_counts=EXCLUDED.record_counts,completed_at=NOW()`,
    [sourceProject, sourceService, JSON.stringify({ source: counts, target: targetCounts })],
  )
  await client.query("COMMIT")
  console.log(JSON.stringify({ sourceProject, sourceService, databaseHost, sourceCounts: counts, targetCounts }))
} catch (error) {
  await client.query("ROLLBACK")
  throw error
} finally {
  client.release()
  await pool.end()
}
