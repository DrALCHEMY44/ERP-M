import { randomBytes, scrypt as scryptCallback } from "node:crypto"
import { promisify } from "node:util"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { Pool } from "@neondatabase/serverless"

const required = [
  "DATABASE_URL", "EXPECTED_DATABASE_HOST", "DEMO_OWNER_A_UID", "DEMO_OWNER_A_EMAIL",
  "DEMO_OWNER_B_UID", "DEMO_OWNER_B_EMAIL", "DEMO_EMPLOYEE_UID",
  "DEMO_EMPLOYEE_EMAIL", "DEMO_EMPLOYEE_ACCESS_CODE", "AWS_ENDPOINT_URL_S3",
  "AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "S3_BUCKET",
]
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required`)
if (process.env.DEMO_MODE_CONFIRMATION !== "SEED_SMARTERP_DEFENCE_DEMO") throw new Error("Set DEMO_MODE_CONFIRMATION=SEED_SMARTERP_DEFENCE_DEMO")
const databaseHost = new URL(process.env.DATABASE_URL).hostname
if (process.env.EXPECTED_DATABASE_HOST !== databaseHost) throw new Error("Neon target does not match EXPECTED_DATABASE_HOST")

const ids = {
  tenantA: "demo-tenant-a", businessA: "demo-business-a", ownerA: process.env.DEMO_OWNER_A_UID,
  employeeA: process.env.DEMO_EMPLOYEE_UID, tenantB: "demo-tenant-b", businessB: "demo-business-b",
  ownerB: process.env.DEMO_OWNER_B_UID,
}
const scrypt = promisify(scryptCallback)
const salt = randomBytes(16)
const key = await scrypt(process.env.DEMO_EMPLOYEE_ACCESS_CODE.toUpperCase(), salt, 64)
const accessCodeHash = `scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`
const due = new Date(Date.now() + 3 * 86400000).toISOString()
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const client = await pool.connect()
try {
  await client.query("BEGIN")
  await client.query("INSERT INTO tenants(id,name,business_sector,location,owner_email,status,subscription_tier) VALUES($1,'Defence Demo Company A','Retail','Douala',$2,'Active','Basic'),($3,'Defence Demo Company B','Services','Yaounde',$4,'Active','Basic') ON CONFLICT(id) DO NOTHING", [ids.tenantA,process.env.DEMO_OWNER_A_EMAIL,ids.tenantB,process.env.DEMO_OWNER_B_EMAIL])
  await client.query("INSERT INTO businesses(id,tenant_id,name,location,business_type,region,code) VALUES($1,$2,'Defence Retail A','Douala','Retail','Littoral','DEFENCE-A'),($3,$4,'Defence Services B','Yaounde','Services','Centre','DEFENCE-B') ON CONFLICT(id) DO NOTHING", [ids.businessA,ids.tenantA,ids.businessB,ids.tenantB])
  await client.query("INSERT INTO business_settings(business_id,tenant_id,currency,timezone,fiscal_year_start,tax_rate,low_stock_threshold) VALUES($1,$2,'FCFA','Africa/Douala','01-01',0,5),($3,$4,'FCFA','Africa/Douala','01-01',0,5) ON CONFLICT(business_id) DO NOTHING", [ids.businessA,ids.tenantA,ids.businessB,ids.tenantB])
  await client.query("INSERT INTO users(id,tenant_id,business_id,email,role,full_name,department,access_code_hash) VALUES($1,$2,$3,$4,'Business Owner','Demo Owner A',NULL,NULL),($5,$6,$7,$8,'Business Owner','Demo Owner B',NULL,NULL),($9,$2,$3,$10,'Staff','Demo Employee A','Operations',$11) ON CONFLICT(id) DO UPDATE SET access_code_hash=EXCLUDED.access_code_hash", [ids.ownerA,ids.tenantA,ids.businessA,process.env.DEMO_OWNER_A_EMAIL,ids.ownerB,ids.tenantB,ids.businessB,process.env.DEMO_OWNER_B_EMAIL,ids.employeeA,process.env.DEMO_EMPLOYEE_EMAIL,accessCodeHash])
  await client.query("INSERT INTO employees(id,tenant_id,business_id,full_name,position,role,department,email,start_date,status) VALUES('demo-employee-a',$1,$2,'Demo Employee A','Sales Assistant','Staff','Operations',$3,'2026-08-01','Active') ON CONFLICT(id) DO NOTHING", [ids.tenantA,ids.businessA,process.env.DEMO_EMPLOYEE_EMAIL])
  await client.query("INSERT INTO customers(id,tenant_id,business_id,customer_name,phone_number,location) VALUES('demo-customer-a',$1,$2,'Defence Customer','+237600000001','Douala') ON CONFLICT(id) DO NOTHING", [ids.tenantA,ids.businessA])
  await client.query("INSERT INTO suppliers(id,tenant_id,business_id,supplier_name,phone_number) VALUES('demo-supplier-a',$1,$2,'Defence Supplier','+237600000002') ON CONFLICT(id) DO NOTHING", [ids.tenantA,ids.businessA])
  await client.query("INSERT INTO tasks(id,tenant_id,business_id,title,description,status,priority,due_date,assigned_to_id,created_by) VALUES('demo-task-pending',$1,$2,'Verify defence inventory','Controlled demonstration task','PENDING','HIGH',$3,$4,$5),('demo-task-completed',$1,$2,'Prepare demonstration counter',NULL,'COMPLETED','MEDIUM',NOW(),$4,$5) ON CONFLICT(id) DO NOTHING", [ids.tenantA,ids.businessA,due,ids.employeeA,ids.ownerA])
  const products = [
    ["demo-product-a1",ids.tenantA,ids.businessA,"Demo Rice","DEMO-A-RICE",25,800,1000,5],
    ["demo-product-a2",ids.tenantA,ids.businessA,"Demo Soap","DEMO-A-SOAP",2,400,600,5],
    ["demo-product-b1",ids.tenantB,ids.businessB,"Isolated Demo Item","DEMO-B-ITEM",12,1000,1500,3],
  ]
  for (const product of products) await client.query("INSERT INTO products(id,tenant_id,business_id,name,sku,category,quantity,cost_price,selling_price,low_stock_level,created_by) VALUES($1,$2,$3,$4,$5,'Demo',$6,$7,$8,$9,$10) ON CONFLICT(id) DO UPDATE SET quantity=EXCLUDED.quantity,cost_price=EXCLUDED.cost_price,selling_price=EXCLUDED.selling_price", [...product,ids.ownerA])
  await client.query("INSERT INTO transactions(id,tenant_id,business_id,type,amount,date,category,recorded_by) VALUES('demo-expense-a',$1,$2,'EXPENSE',2500,NOW(),'Demonstration',$3) ON CONFLICT(id) DO NOTHING", [ids.tenantA,ids.businessA,ids.ownerA])
  await client.query("INSERT INTO activity_logs(id,tenant_id,business_id,user_id,user_name,action_type,module,description) VALUES('demo-audit-seed',$1,$2,$3,'Demo Owner A','DEMO_SEEDED','System','Idempotent controlled defence data prepared') ON CONFLICT(id) DO NOTHING", [ids.tenantA,ids.businessA,ids.ownerA])
  await client.query("COMMIT")
} catch (error) {
  await client.query("ROLLBACK")
  throw error
} finally {
  client.release()
  await pool.end()
}

const storage = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3, region: process.env.AWS_REGION, forcePathStyle: true,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
})
const objectKey = `documents/${ids.tenantA}/${ids.businessA}/${ids.ownerA}/demo-safe-evidence.txt`
await storage.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: objectKey, Body: "SmartERP controlled demonstration evidence. No personal data.\n", ContentType: "text/plain" }))
const documentPool = new Pool({ connectionString: process.env.DATABASE_URL })
await documentPool.query("INSERT INTO documents(id,tenant_id,business_id,title,document_type,file_url,uploaded_by) VALUES('demo-document-a',$1,$2,'Safe defence evidence','Text',$3,$4) ON CONFLICT(id) DO UPDATE SET file_url=EXCLUDED.file_url", [ids.tenantA,ids.businessA,`/api/files?key=${encodeURIComponent(objectKey)}`,ids.ownerA])
await documentPool.end()

console.log(JSON.stringify({ databaseHost, tenants: 2, users: 3, products: 3, tasks: 2, documents: 1, credentialsCreated: false }))
