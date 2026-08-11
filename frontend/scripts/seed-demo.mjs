import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { neon } from "@neondatabase/serverless"
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getDataConnect } from "firebase-admin/data-connect"

const required = [
  "DATABASE_URL", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "EXPECTED_FIREBASE_PROJECT_ID",
  "FIREBASE_DATACONNECT_LOCATION", "FIREBASE_DATACONNECT_SERVICE_ID",
  "DEMO_OWNER_A_UID", "DEMO_OWNER_A_EMAIL", "DEMO_OWNER_B_UID", "DEMO_OWNER_B_EMAIL",
  "DEMO_EMPLOYEE_UID", "DEMO_EMPLOYEE_EMAIL", "AWS_ENDPOINT_URL_S3", "AWS_REGION",
  "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "S3_BUCKET",
]
for (const name of required) if (!process.env[name]) throw new Error(`${name} is required`)
if (process.env.DEMO_MODE_CONFIRMATION !== "SEED_SMARTERP_DEFENCE_DEMO") throw new Error("Set DEMO_MODE_CONFIRMATION=SEED_SMARTERP_DEFENCE_DEMO")
if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID !== process.env.EXPECTED_FIREBASE_PROJECT_ID) throw new Error("Firebase target mismatch")
const databaseHost = new URL(process.env.DATABASE_URL).hostname
if (process.env.EXPECTED_DATABASE_HOST !== databaseHost) throw new Error("Neon target does not match EXPECTED_DATABASE_HOST")

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
const app = getApps()[0] || initializeApp({
  projectId,
  credential: clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault(),
})
const dc = getDataConnect({
  location: process.env.FIREBASE_DATACONNECT_LOCATION,
  serviceId: process.env.FIREBASE_DATACONNECT_SERVICE_ID,
  connector: process.env.FIREBASE_DATACONNECT_CONNECTOR_ID || "example",
}, app)

const ids = {
  tenantA: "demo-tenant-a", businessA: "demo-business-a", ownerA: process.env.DEMO_OWNER_A_UID,
  employeeA: process.env.DEMO_EMPLOYEE_UID, tenantB: "demo-tenant-b", businessB: "demo-business-b",
  ownerB: process.env.DEMO_OWNER_B_UID,
}
const now = new Date().toISOString()
const due = new Date(Date.now() + 3 * 86400000).toISOString()
const seedMutation = /* GraphQL */ `mutation SeedDefenceDemo($now: Timestamp!, $due: Timestamp!, $ownerA: String!, $ownerAEmail: String!, $ownerB: String!, $ownerBEmail: String!, $employeeA: String!, $employeeEmail: String!) {
  tenantA: tenant_upsert(data:{id:"demo-tenant-a",name:"Defence Demo Company A",businessSector:"Retail",location:"Douala",ownerEmail:$ownerAEmail,status:"ACTIVE",subscriptionTier:"DEMO",createdAt:$now}) { id }
  tenantB: tenant_upsert(data:{id:"demo-tenant-b",name:"Defence Demo Company B",businessSector:"Services",location:"Yaounde",ownerEmail:$ownerBEmail,status:"ACTIVE",subscriptionTier:"DEMO",createdAt:$now}) { id }
  businessA: business_upsert(data:{id:"demo-business-a",tenantId:"demo-tenant-a",name:"Defence Retail A",location:"Douala",businessType:"Retail",region:"Littoral",code:"DEFENCE-A",createdAt:$now}) { id }
  businessB: business_upsert(data:{id:"demo-business-b",tenantId:"demo-tenant-b",name:"Defence Services B",location:"Yaounde",businessType:"Services",region:"Centre",code:"DEFENCE-B",createdAt:$now}) { id }
  ownerA: user_upsert(data:{id:$ownerA,tenantId:"demo-tenant-a",businessId:"demo-business-a",email:$ownerAEmail,role:"Business Owner",fullName:"Demo Owner A",createdAt:$now}) { id }
  ownerB: user_upsert(data:{id:$ownerB,tenantId:"demo-tenant-b",businessId:"demo-business-b",email:$ownerBEmail,role:"Business Owner",fullName:"Demo Owner B",createdAt:$now}) { id }
  employeeA: user_upsert(data:{id:$employeeA,tenantId:"demo-tenant-a",businessId:"demo-business-a",email:$employeeEmail,role:"Staff",fullName:"Demo Employee A",department:"Operations",createdAt:$now}) { id }
  employee: employee_upsert(data:{id:"demo-employee-a",tenantId:"demo-tenant-a",businessId:"demo-business-a",fullName:"Demo Employee A",position:"Sales Assistant",role:"Staff",department:"Operations",startDate:"2026-08-01",status:"Active",createdAt:$now}) { id }
  customer: customer_upsert(data:{id:"demo-customer-a",tenantId:"demo-tenant-a",businessId:"demo-business-a",customerName:"Defence Customer",phoneNumber:"+237600000001",location:"Douala",totalOrders:1,totalSpent:5000,createdAt:$now}) { id }
  supplier: supplier_upsert(data:{id:"demo-supplier-a",tenantId:"demo-tenant-a",businessId:"demo-business-a",supplierName:"Defence Supplier",phoneNumber:"+237600000002",createdAt:$now}) { id }
  pendingTask: task_upsert(data:{id:"demo-task-pending",tenantId:"demo-tenant-a",businessId:"demo-business-a",title:"Verify defence inventory",description:"Controlled demonstration task",status:PENDING,priority:HIGH,dueDate:$due,assignedToId:$employeeA,createdBy:$ownerA,createdAt:$now}) { id }
  completedTask: task_upsert(data:{id:"demo-task-completed",tenantId:"demo-tenant-a",businessId:"demo-business-a",title:"Prepare demonstration counter",status:COMPLETED,priority:MEDIUM,dueDate:$now,assignedToId:$employeeA,createdBy:$ownerA,createdAt:$now,updatedAt:$now}) { id }
  audit: activityLog_upsert(data:{id:"demo-audit-seed",tenantId:"demo-tenant-a",businessId:"demo-business-a",userId:$ownerA,userName:"Demo Owner A",actionType:"DEMO_SEEDED",module:"System",description:"Idempotent controlled defence data prepared",timestamp:$now}) { id }
}`
await dc.executeGraphql(seedMutation, { variables: {
  now, due, ownerA: ids.ownerA, ownerAEmail: process.env.DEMO_OWNER_A_EMAIL,
  ownerB: ids.ownerB, ownerBEmail: process.env.DEMO_OWNER_B_EMAIL,
  employeeA: ids.employeeA, employeeEmail: process.env.DEMO_EMPLOYEE_EMAIL,
} })

const storage = new S3Client({
  endpoint: process.env.AWS_ENDPOINT_URL_S3, region: process.env.AWS_REGION, forcePathStyle: true,
  credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY },
})
const objectKey = `documents/${ids.tenantA}/${ids.businessA}/${ids.ownerA}/demo-safe-evidence.txt`
await storage.send(new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: objectKey, Body: "SmartERP controlled demonstration evidence. No personal data.\n", ContentType: "text/plain" }))
await dc.executeGraphql(/* GraphQL */ `mutation SeedDocument($owner: String!, $now: Timestamp!, $fileUrl: String!) { document_upsert(data:{id:"demo-document-a",tenantId:"demo-tenant-a",businessId:"demo-business-a",title:"Safe defence evidence",documentType:"Text",fileUrl:$fileUrl,uploadedBy:$owner,uploadedAt:$now}) { id } }`, { variables: { owner: ids.ownerA, now, fileUrl: `/api/files?key=${encodeURIComponent(objectKey)}` } })

const sql = neon(process.env.DATABASE_URL)
const products = [
  ["demo-product-a1", ids.tenantA, ids.businessA, "Demo Rice", "DEMO-A-RICE", 25, 800, 1000, 5],
  ["demo-product-a2", ids.tenantA, ids.businessA, "Demo Soap", "DEMO-A-SOAP", 2, 400, 600, 5],
  ["demo-product-b1", ids.tenantB, ids.businessB, "Isolated Demo Item", "DEMO-B-ITEM", 12, 1000, 1500, 3],
]
for (const product of products) {
  await sql`INSERT INTO products(id,tenant_id,business_id,name,sku,category,quantity,cost_price,selling_price,low_stock_level,created_by,created_at)
    VALUES(${product[0]},${product[1]},${product[2]},${product[3]},${product[4]},'Demo',${product[5]},${product[6]},${product[7]},${product[8]},${ids.ownerA},NOW())
    ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,quantity=EXCLUDED.quantity,cost_price=EXCLUDED.cost_price,selling_price=EXCLUDED.selling_price,low_stock_level=EXCLUDED.low_stock_level`
}
await sql`INSERT INTO transactions(id,tenant_id,business_id,type,amount,date,category,recorded_by,created_at)
  VALUES('demo-expense-a',${ids.tenantA},${ids.businessA},'EXPENSE',2500,NOW(),'Demonstration',${ids.ownerA},NOW()) ON CONFLICT(id) DO NOTHING`

console.log(JSON.stringify({ projectId, databaseHost, tenants: 2, users: 3, products: 3, tasks: 2, documents: 1, credentialsCreated: false }))
