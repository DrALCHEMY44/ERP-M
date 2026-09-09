import { randomUUID } from "crypto"
import type { PoolClient } from "@neondatabase/serverless"

import { db, pooledDb, withTransientDatabaseRetry } from "./neon"
import { ensureDefaultAccounts } from "./accounting"

type Variables = Record<string, unknown>
type Row = Record<string, unknown>

const has = (variables: Variables, key: string) => Object.prototype.hasOwnProperty.call(variables, key)
const text = (value: unknown) => value == null ? null : String(value)
const number = (value: unknown) => value == null || value === "" ? null : Number(value)

const camelTenant = (row: Row) => ({
  id: row.id, name: row.name, businessSector: row.business_sector, location: row.location,
  ownerEmail: row.owner_email, taxId: row.tax_id, logoUrl: row.logo_url,
  subscriptionTier: row.subscription_tier, status: row.status, createdAt: row.created_at,
})

const camelUser = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, email: row.email,
  role: row.role, fullName: row.full_name, department: row.department,
  phoneNumber: row.phone_number, createdAt: row.created_at, accessCodeHash: row.access_code_hash,
  authUserId: row.auth_user_id,
})

const camelBusiness = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, name: row.name, location: row.location,
  businessType: row.business_type, entityType: row.entity_type, city: row.city,
  region: row.region, phone: row.phone, email: row.email, taxId: row.tax_id,
  description: row.description, logoUrl: row.logo_url, createdAt: row.created_at,
  code: row.code, version: row.version,
})

const camelSettings = (row: Row) => ({
  businessId: row.business_id, tenantId: row.tenant_id, currency: row.currency,
  timezone: row.timezone, fiscalYearStart: row.fiscal_year_start,
  taxRate: Number(row.tax_rate), lowStockThreshold: Number(row.low_stock_threshold),
  updatedAt: row.updated_at,
})

const camelProduct = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, name: row.name,
  category: row.category, quantity: Number(row.quantity),
  costPrice: row.cost_price == null ? null : Number(row.cost_price),
  sellingPrice: Number(row.selling_price), expiryDate: row.expiry_date,
  lowStockLevel: row.low_stock_level == null ? null : Number(row.low_stock_level),
  status: row.status, createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.updated_at,
})

const camelTransaction = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, type: row.type,
  amount: Number(row.amount), date: row.date, category: row.category,
  description: row.description, receiptUrl: row.receipt_url,
  recordedBy: row.recorded_by, createdAt: row.created_at,
})

const camelCustomer = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id,
  customerName: row.customer_name, phoneNumber: row.phone_number, email: row.email,
  location: row.location, totalOrders: Number(row.total_orders ?? 0),
  totalSpent: Number(row.total_spent ?? 0), notes: row.notes, createdAt: row.created_at,
})

const camelSupplier = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id,
  supplierName: row.supplier_name, phoneNumber: row.phone_number, email: row.email,
  location: row.location, productsSupplied: row.products_supplied,
  paymentStatus: row.payment_status, notes: row.notes, createdAt: row.created_at,
})

const camelEmployee = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id,
  fullName: row.full_name, position: row.position, role: row.role,
  salary: row.salary == null ? null : Number(row.salary), department: row.department,
  email: row.email, contact: row.contact, startDate: row.start_date, status: row.status,
  attendance: row.attendance == null ? null : Number(row.attendance),
  salaryPaymentStatus: row.salary_payment_status, createdAt: row.created_at,
})

const camelTask = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, title: row.title,
  description: row.description, status: row.status, priority: row.priority, dueDate: row.due_date,
  assignedTo: row.assigned_id ? {
    id: row.assigned_id, email: row.assigned_email, role: row.assigned_role,
    fullName: row.assigned_full_name, department: row.assigned_department,
  } : null,
  createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.updated_at,
})

const camelDocument = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, title: row.title,
  documentType: row.document_type, fileUrl: row.file_url, description: row.description,
  uploadedBy: row.uploaded_by, uploadedAt: row.uploaded_at,
})

const camelLog = (row: Row) => ({
  id: row.id, tenantId: row.tenant_id, businessId: row.business_id, userId: row.user_id,
  userName: row.user_name, actionType: row.action_type, module: row.module,
  description: row.description, recordId: row.record_id, timestamp: row.timestamp,
})

async function transaction<T>(work: (client: PoolClient) => Promise<T>) {
  const pool = pooledDb()
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await work(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    try { await client.query("ROLLBACK") } catch {}
    throw error
  } finally {
    client.release()
  }
}

async function tasksFor(variables: Variables, assignedOnly: boolean) {
  const sql = db()
  const tenantId = String(variables.tenantId)
  const businessId = String(variables.businessId)
  const rows = assignedOnly
    ? await sql`SELECT t.*,u.id AS assigned_id,u.email AS assigned_email,u.role AS assigned_role,
        u.full_name AS assigned_full_name,u.department AS assigned_department
      FROM tasks t LEFT JOIN users u ON u.id=t.assigned_to_id AND u.tenant_id=t.tenant_id AND u.business_id=t.business_id
      WHERE t.tenant_id=${tenantId} AND t.business_id=${businessId} AND t.assigned_to_id=${String(variables.userId)}
      ORDER BY t.due_date`
    : await sql`SELECT t.*,u.id AS assigned_id,u.email AS assigned_email,u.role AS assigned_role,
        u.full_name AS assigned_full_name,u.department AS assigned_department
      FROM tasks t LEFT JOIN users u ON u.id=t.assigned_to_id AND u.tenant_id=t.tenant_id AND u.business_id=t.business_id
      WHERE t.tenant_id=${tenantId} AND t.business_id=${businessId} ORDER BY t.due_date`
  return rows.map((row) => camelTask(row as Row))
}

class NeonDataService {
  async executeQuery<T = Record<string, unknown>, V extends Variables = Variables>(operation: string, input?: V) {
    return withTransientDatabaseRetry(() => this.executeQueryOnce<T, V>(operation, input))
  }

  private async executeQueryOnce<T = Record<string, unknown>, V extends Variables = Variables>(operation: string, input?: V) {
    const variables = (input ?? {}) as Variables
    const sql = db()
    const tenantId = String(variables.tenantId ?? "")
    const businessId = String(variables.businessId ?? "")
    let data: Record<string, unknown>

    switch (operation) {
      case "ListTenants": {
        const rows = await sql`SELECT * FROM tenants ORDER BY created_at DESC`
        data = { tenants: rows.map((row) => camelTenant(row as Row)) }
        break
      }
      case "ListUsers": {
        const rows = await sql`SELECT id FROM users`
        data = { users: rows.map((row) => ({ id: row.id })) }
        break
      }
      case "ListBusinesses": {
        const rows = await sql`SELECT * FROM businesses WHERE tenant_id=${tenantId} ORDER BY name`
        data = { businesses: rows.map((row) => camelBusiness(row as Row)) }
        break
      }
      case "getUserById": {
        const rows = await sql`SELECT * FROM users WHERE id=${String(variables.id)} LIMIT 1`
        data = { user: rows[0] ? camelUser(rows[0] as Row) : null }
        break
      }
      case "getUserByAuthUserId": {
        const rows = await sql`SELECT * FROM users WHERE auth_user_id=${String(variables.authUserId)}::uuid LIMIT 1`
        data = { user: rows[0] ? camelUser(rows[0] as Row) : null }
        break
      }
      case "getUserByEmail": {
        const rows = await sql`SELECT * FROM users WHERE lower(email)=lower(${String(variables.email)}) ORDER BY created_at`
        data = { users: rows.map((row) => camelUser(row as Row)) }
        break
      }
      case "getBusinessById": {
        const rows = await sql`SELECT * FROM businesses WHERE id=${String(variables.id)} LIMIT 1`
        data = { business: rows[0] ? camelBusiness(rows[0] as Row) : null }
        break
      }
      case "getBusinessByCode": {
        const rows = await sql`SELECT * FROM businesses WHERE code=${String(variables.code)}`
        data = { businesses: rows.map((row) => camelBusiness(row as Row)) }
        break
      }
      case "getBusinessesByName": {
        const rows = await sql`SELECT * FROM businesses WHERE lower(name)=lower(${String(variables.name)}) ORDER BY created_at`
        data = { businesses: rows.map((row) => camelBusiness(row as Row)) }
        break
      }
      case "getBusinessSettings": {
        const rows = await sql`SELECT * FROM business_settings WHERE tenant_id=${tenantId} AND business_id=${businessId} LIMIT 1`
        data = { businessSettings: rows.map((row) => camelSettings(row as Row)) }
        break
      }
      case "listProductsByBusiness":
      case "listSaleProductsByBusiness": {
        const rows = await sql`SELECT * FROM products WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY name`
        data = { products: rows.map((row) => camelProduct(row as Row)) }
        break
      }
      case "listTransactionsByBusiness": {
        const rows = await sql`SELECT * FROM transactions WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY date DESC`
        data = { transactions: rows.map((row) => camelTransaction(row as Row)) }
        break
      }
      case "listTransactionsByType": {
        const rows = await sql`SELECT * FROM transactions WHERE tenant_id=${tenantId} AND business_id=${businessId} AND type=${String(variables.type)} ORDER BY date DESC`
        data = { transactions: rows.map((row) => camelTransaction(row as Row)) }
        break
      }
      case "listCustomersByBusiness":
      case "listSaleCustomersByBusiness": {
        const rows = await sql`SELECT * FROM customers WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY customer_name`
        data = { customers: rows.map((row) => camelCustomer(row as Row)) }
        break
      }
      case "getCustomerForCompany": {
        const rows = await sql`SELECT id FROM customers WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} LIMIT 1`
        data = { customer: rows[0] ? { id: rows[0].id } : null }
        break
      }
      case "listTaskAssigneesByBusiness":
      case "listUsersByBusiness": {
        const rows = await sql`SELECT * FROM users WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY full_name,email`
        data = { users: rows.map((row) => camelUser(row as Row)) }
        break
      }
      case "listSuppliersByBusiness": {
        const rows = await sql`SELECT * FROM suppliers WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY supplier_name`
        data = { suppliers: rows.map((row) => camelSupplier(row as Row)) }
        break
      }
      case "listTasksByBusiness":
        data = { tasks: await tasksFor(variables, false) }
        break
      case "listTasksAssignedToUser":
        data = { tasks: await tasksFor(variables, true) }
        break
      case "listEmployeesByBusiness": {
        const rows = await sql`SELECT * FROM employees WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY full_name`
        data = { employees: rows.map((row) => camelEmployee(row as Row)) }
        break
      }
      case "listDocumentsByBusiness": {
        const rows = await sql`SELECT * FROM documents WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY uploaded_at DESC`
        data = { documents: rows.map((row) => camelDocument(row as Row)) }
        break
      }
      case "listActivityLogsByUser": {
        const rows = await sql`SELECT * FROM activity_logs WHERE tenant_id=${tenantId} AND business_id=${businessId} AND user_id=${String(variables.userId)} ORDER BY timestamp DESC`
        data = { activityLogs: rows.map((row) => camelLog(row as Row)) }
        break
      }
      case "listActivityLogsByBusiness": {
        const rows = await sql`SELECT * FROM activity_logs WHERE tenant_id=${tenantId} AND business_id=${businessId} ORDER BY timestamp DESC`
        data = { activityLogs: rows.map((row) => camelLog(row as Row)) }
        break
      }
      case "listNotifications": {
        const rows = await sql`SELECT * FROM notifications WHERE tenant_id=${tenantId} AND business_id=${businessId} AND user_id=${String(variables.userId)} ORDER BY created_at DESC`
        data = { notifications: rows.map((row) => ({
          id: row.id, tenantId: row.tenant_id, businessId: row.business_id,
          userId: row.user_id, message: row.message, isRead: row.is_read, createdAt: row.created_at,
        })) }
        break
      }
      default:
        throw new Error(`Unsupported Neon query operation: ${operation}`)
    }
    return { data: data as T }
  }

  async executeMutation<T = Record<string, unknown>, V extends Variables = Variables>(operation: string, input?: V) {
    const variables = (input ?? {}) as Variables
    const sql = db()
    const tenantId = String(variables.tenantId ?? "")
    const businessId = String(variables.businessId ?? "")
    let data: Record<string, unknown>

    switch (operation) {
      case "BootstrapWorkspace": {
        data = await transaction(async (client) => {
          await client.query("INSERT INTO tenants(id,name,business_sector,location,owner_email,subscription_tier,status) VALUES($1,$2,$3,$4,$5,'Basic','Active')", [variables.tenantId, variables.name, variables.businessSector, variables.location, variables.ownerEmail])
          await client.query("INSERT INTO businesses(id,tenant_id,name,location,business_type,region,code) VALUES($1,$2,$3,$4,$5,$6,$7)", [variables.businessId, variables.tenantId, variables.name, variables.location, variables.businessSector, variables.region, variables.code])
          await client.query("INSERT INTO business_settings(business_id,tenant_id,currency,timezone,fiscal_year_start,tax_rate,low_stock_threshold) VALUES($1,$2,'FCFA','Africa/Douala','01-01',0,10)", [variables.businessId, variables.tenantId])
          await client.query("INSERT INTO users(id,tenant_id,business_id,email,role,full_name,auth_user_id) VALUES($1,$2,$3,$4,'Business Owner',$5,$6::uuid)", [variables.userId, variables.tenantId, variables.businessId, variables.ownerEmail, variables.fullName, variables.authUserId])
          await ensureDefaultAccounts(client, {
            tenantId: String(variables.tenantId),
            businessId: String(variables.businessId),
            actorId: String(variables.userId),
          })
          return { tenant_insert: { id: variables.tenantId }, business_insert: { id: variables.businessId }, user_insert: { id: variables.userId } }
        })
        break
      }
      case "CreateBusiness": {
        const newId = randomUUID()
        const rows = await sql`INSERT INTO businesses(id,tenant_id,name,location,business_type,region,code)
          VALUES(${newId},${tenantId},${String(variables.name)},${String(variables.location)},${text(variables.businessType)},${text(variables.region)},${String(variables.code)}) RETURNING *`
        data = { business_insert: camelBusiness(rows[0] as Row) }
        break
      }
      case "UpdateBusiness": {
        const rows = await sql`UPDATE businesses SET
          name=CASE WHEN ${has(variables,"name")} THEN ${text(variables.name)} ELSE name END,
          location=CASE WHEN ${has(variables,"location")} THEN ${text(variables.location)} ELSE location END,
          business_type=CASE WHEN ${has(variables,"businessType")} THEN ${text(variables.businessType)} ELSE business_type END,
          entity_type=CASE WHEN ${has(variables,"entityType")} THEN ${text(variables.entityType)} ELSE entity_type END,
          city=CASE WHEN ${has(variables,"city")} THEN ${text(variables.city)} ELSE city END,
          region=CASE WHEN ${has(variables,"region")} THEN ${text(variables.region)} ELSE region END,
          phone=CASE WHEN ${has(variables,"phone")} THEN ${text(variables.phone)} ELSE phone END,
          email=CASE WHEN ${has(variables,"email")} THEN ${text(variables.email)} ELSE email END,
          tax_id=CASE WHEN ${has(variables,"taxId")} THEN ${text(variables.taxId)} ELSE tax_id END,
          description=CASE WHEN ${has(variables,"description")} THEN ${text(variables.description)} ELSE description END,
          logo_url=CASE WHEN ${has(variables,"logoUrl")} THEN ${text(variables.logoUrl)} ELSE logo_url END,
          code=CASE WHEN ${has(variables,"code")} THEN ${text(variables.code)} ELSE code END,version=version+1
          WHERE id=${String(variables.id)} AND tenant_id=${tenantId} RETURNING *`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { business_update: camelBusiness(rows[0] as Row) }
        break
      }
      case "UpsertBusinessSettings": {
        const rows = await sql`INSERT INTO business_settings(business_id,tenant_id,currency,timezone,fiscal_year_start,tax_rate,low_stock_threshold)
          VALUES(${businessId},${tenantId},${String(variables.currency)},${String(variables.timezone)},${String(variables.fiscalYearStart)},${Number(variables.taxRate)},${Number(variables.lowStockThreshold)})
          ON CONFLICT(business_id) DO UPDATE SET tenant_id=EXCLUDED.tenant_id,currency=EXCLUDED.currency,
            timezone=EXCLUDED.timezone,fiscal_year_start=EXCLUDED.fiscal_year_start,tax_rate=EXCLUDED.tax_rate,
            low_stock_threshold=EXCLUDED.low_stock_threshold,updated_at=NOW() RETURNING *`
        data = { businessSetting_upsert: camelSettings(rows[0] as Row) }
        break
      }
      case "UpdateTenant": {
        const rows = await sql`UPDATE tenants SET
          name=CASE WHEN ${has(variables,"name")} THEN ${text(variables.name)} ELSE name END,
          business_sector=CASE WHEN ${has(variables,"businessSector")} THEN ${text(variables.businessSector)} ELSE business_sector END,
          location=CASE WHEN ${has(variables,"location")} THEN ${text(variables.location)} ELSE location END,
          owner_email=CASE WHEN ${has(variables,"ownerEmail")} THEN ${text(variables.ownerEmail)} ELSE owner_email END,
          tax_id=CASE WHEN ${has(variables,"taxId")} THEN ${text(variables.taxId)} ELSE tax_id END,
          logo_url=CASE WHEN ${has(variables,"logoUrl")} THEN ${text(variables.logoUrl)} ELSE logo_url END,
          subscription_tier=CASE WHEN ${has(variables,"subscriptionTier")} THEN ${text(variables.subscriptionTier)} ELSE subscription_tier END,
          status=CASE WHEN ${has(variables,"status")} THEN ${text(variables.status)} ELSE status END
          WHERE id=${String(variables.id)} RETURNING *`
        if (!rows[0]) throw new Error("Tenant not found")
        data = { tenant_update: camelTenant(rows[0] as Row) }
        break
      }
      case "UpdateUser": {
        const rows = await sql`UPDATE users SET
          email=CASE WHEN ${has(variables,"email")} THEN ${text(variables.email)} ELSE email END,
          role=CASE WHEN ${has(variables,"role")} THEN ${text(variables.role)} ELSE role END,
          full_name=CASE WHEN ${has(variables,"fullName")} THEN ${text(variables.fullName)} ELSE full_name END,
          department=CASE WHEN ${has(variables,"department")} THEN ${text(variables.department)} ELSE department END,
          phone_number=CASE WHEN ${has(variables,"phoneNumber")} THEN ${text(variables.phoneNumber)} ELSE phone_number END,
          access_code_hash=CASE WHEN ${has(variables,"accessCodeHash")} THEN ${text(variables.accessCodeHash)} ELSE access_code_hash END
          WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING *`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { user_update: camelUser(rows[0] as Row) }
        break
      }
      case "ProvisionEmployeeUser": {
        const userId = randomUUID()
        const rows = await sql`INSERT INTO users(id,tenant_id,business_id,email,role,full_name,department,phone_number,access_code_hash)
          VALUES(${userId},${tenantId},${businessId},${String(variables.email)},${String(variables.role)},${String(variables.fullName)},${text(variables.department)},${text(variables.phoneNumber)},${String(variables.accessCodeHash)}) RETURNING *`
        data = { user_insert: camelUser(rows[0] as Row) }
        break
      }
      case "CreateTask": {
        const taskId = randomUUID()
        const rows = await sql`INSERT INTO tasks(id,tenant_id,business_id,title,description,status,priority,due_date,assigned_to_id,created_by)
          VALUES(${taskId},${tenantId},${businessId},${String(variables.title)},${text(variables.description)},${String(variables.status)},${text(variables.priority)},${String(variables.dueDate)},${text(variables.assignedToId)},${String(variables.createdBy)}) RETURNING *`
        data = { task_insert: camelTask(rows[0] as Row) }
        break
      }
      case "UpdateTask": {
        const rows = await sql`UPDATE tasks SET
          title=CASE WHEN ${has(variables,"title")} THEN ${text(variables.title)} ELSE title END,
          description=CASE WHEN ${has(variables,"description")} THEN ${text(variables.description)} ELSE description END,
          status=CASE WHEN ${has(variables,"status")} THEN ${text(variables.status)} ELSE status END,
          priority=CASE WHEN ${has(variables,"priority")} THEN ${text(variables.priority)} ELSE priority END,
          due_date=CASE WHEN ${has(variables,"dueDate")} THEN ${text(variables.dueDate)}::timestamptz ELSE due_date END,
          assigned_to_id=CASE WHEN ${has(variables,"assignedToId")} THEN ${text(variables.assignedToId)} ELSE assigned_to_id END,
          updated_at=NOW() WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING *`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { task_update: camelTask(rows[0] as Row) }
        break
      }
      case "DeleteTask": {
        const rows = await sql`DELETE FROM tasks WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING id`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { task_delete: { id: rows[0].id } }
        break
      }
      case "CompleteAssignedTask": {
        const rows = await sql`UPDATE tasks SET status='COMPLETED',updated_at=NOW()
          WHERE id=${String(variables.taskId)} AND tenant_id=${tenantId} AND business_id=${businessId}
            AND assigned_to_id=${String(variables.userId)}
            AND EXISTS(SELECT 1 FROM users WHERE id=${String(variables.userId)} AND tenant_id=${tenantId} AND business_id=${businessId})
          RETURNING *`
        if (!rows[0]) throw new Error("Task is not assigned to this employee")
        data = { task_update: camelTask(rows[0] as Row) }
        break
      }
      case "CreateEmployee": {
        const employeeId = randomUUID()
        const rows = await sql`INSERT INTO employees(id,tenant_id,business_id,full_name,position,role,salary,department,email,contact,start_date,status,attendance,salary_payment_status)
          VALUES(${employeeId},${tenantId},${businessId},${String(variables.fullName)},${String(variables.position)},${text(variables.role)},${number(variables.salary)},${text(variables.department)},${text(variables.email)},${text(variables.contact)},${text(variables.startDate)},${text(variables.status)},${number(variables.attendance)},${text(variables.salaryPaymentStatus)}) RETURNING *`
        data = { employee_insert: camelEmployee(rows[0] as Row) }
        break
      }
      case "CreateEmployeeWithAccess": {
        data = await transaction(async (client) => {
          const employeeId = randomUUID()
          const userId = randomUUID()
          const employee = await client.query("INSERT INTO employees(id,tenant_id,business_id,full_name,position,role,salary,department,email,contact,start_date,status,attendance,salary_payment_status) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *", [employeeId, tenantId, businessId, variables.fullName, variables.position, text(variables.role), number(variables.salary), text(variables.department), variables.email, text(variables.contact), text(variables.startDate), text(variables.status), number(variables.attendance), text(variables.salaryPaymentStatus)])
          const user = await client.query("INSERT INTO users(id,tenant_id,business_id,email,role,full_name,department,phone_number,access_code_hash) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *", [userId, tenantId, businessId, variables.email, variables.userRole, variables.fullName, text(variables.department), text(variables.contact), variables.accessCodeHash])
          return { employee_insert: camelEmployee(employee.rows[0] as Row), user_insert: camelUser(user.rows[0] as Row) }
        })
        break
      }
      case "UpdateEmployee": {
        const rows = await sql`UPDATE employees SET
          full_name=CASE WHEN ${has(variables,"fullName")} THEN ${text(variables.fullName)} ELSE full_name END,
          position=CASE WHEN ${has(variables,"position")} THEN ${text(variables.position)} ELSE position END,
          role=CASE WHEN ${has(variables,"role")} THEN ${text(variables.role)} ELSE role END,
          salary=CASE WHEN ${has(variables,"salary")} THEN ${number(variables.salary)} ELSE salary END,
          department=CASE WHEN ${has(variables,"department")} THEN ${text(variables.department)} ELSE department END,
          email=CASE WHEN ${has(variables,"email")} THEN ${text(variables.email)} ELSE email END,
          contact=CASE WHEN ${has(variables,"contact")} THEN ${text(variables.contact)} ELSE contact END,
          start_date=CASE WHEN ${has(variables,"startDate")} THEN ${text(variables.startDate)}::date ELSE start_date END,
          status=CASE WHEN ${has(variables,"status")} THEN ${text(variables.status)} ELSE status END,
          attendance=CASE WHEN ${has(variables,"attendance")} THEN ${number(variables.attendance)} ELSE attendance END,
          salary_payment_status=CASE WHEN ${has(variables,"salaryPaymentStatus")} THEN ${text(variables.salaryPaymentStatus)} ELSE salary_payment_status END
          WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING *`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { employee_update: camelEmployee(rows[0] as Row) }
        break
      }
      case "UpdateEmployeeWithAccess": {
        data = await transaction(async (client) => {
          const employee = await client.query("UPDATE employees SET full_name=$1,position=$2,role=$3,salary=$4,department=$5,email=$6,contact=$7,start_date=$8,status=$9,attendance=$10,salary_payment_status=$11 WHERE id=$12 AND tenant_id=$13 AND business_id=$14 AND lower(email)=lower($15) RETURNING *", [variables.fullName, variables.position, text(variables.role), number(variables.salary), text(variables.department), variables.email, text(variables.contact), text(variables.startDate), text(variables.status), number(variables.attendance), text(variables.salaryPaymentStatus), variables.id, tenantId, businessId, variables.currentEmail])
          if (employee.rowCount !== 1) throw new Error("Employee login binding changed")
          const user = await client.query("UPDATE users SET email=$1,role=$2,full_name=$3,department=$4,phone_number=$5,access_code_hash=COALESCE($6,access_code_hash) WHERE tenant_id=$7 AND business_id=$8 AND lower(email)=lower($9) RETURNING *", [variables.email, variables.userRole, variables.fullName, text(variables.department), text(variables.contact), text(variables.accessCodeHash), tenantId, businessId, variables.currentEmail])
          if (user.rowCount !== 1) throw new Error("Employee login profile is missing or duplicated")
          if (variables.accessCodeHash) {
            await client.query("UPDATE app_auth_sessions SET revoked_at=NOW() WHERE user_id=$1 AND revoked_at IS NULL", [user.rows[0].id])
          }
          return { employee_update: camelEmployee(employee.rows[0] as Row), user_updateMany: 1 }
        })
        break
      }
      case "DeleteEmployee": {
        const rows = await sql`DELETE FROM employees WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING id`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { employee_delete: { id: rows[0].id } }
        break
      }
      case "DeleteEmployeeWithAccess": {
        data = await transaction(async (client) => {
          const employee = await client.query("DELETE FROM employees WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND lower(email)=lower($4) RETURNING id", [variables.id, tenantId, businessId, variables.currentEmail])
          if (employee.rowCount !== 1) throw new Error("Employee login binding changed")
          const user = await client.query("DELETE FROM users WHERE tenant_id=$1 AND business_id=$2 AND lower(email)=lower($3) RETURNING id", [tenantId, businessId, variables.currentEmail])
          if (user.rowCount !== 1) throw new Error("Employee login profile is missing or duplicated")
          return { employee_delete: { id: employee.rows[0].id }, user_deleteMany: 1 }
        })
        break
      }
      case "CreateCustomer": {
        const customerId = randomUUID()
        const rows = await sql`INSERT INTO customers(id,tenant_id,business_id,customer_name,phone_number,email,location,notes)
          VALUES(${customerId},${tenantId},${businessId},${String(variables.customerName)},${text(variables.phoneNumber)},${text(variables.email)},${text(variables.location)},${text(variables.notes)}) RETURNING *`
        data = { customer_insert: camelCustomer(rows[0] as Row) }
        break
      }
      case "UpdateCustomer": {
        const rows = await sql`UPDATE customers SET
          customer_name=CASE WHEN ${has(variables,"customerName")} THEN ${text(variables.customerName)} ELSE customer_name END,
          phone_number=CASE WHEN ${has(variables,"phoneNumber")} THEN ${text(variables.phoneNumber)} ELSE phone_number END,
          email=CASE WHEN ${has(variables,"email")} THEN ${text(variables.email)} ELSE email END,
          location=CASE WHEN ${has(variables,"location")} THEN ${text(variables.location)} ELSE location END,
          notes=CASE WHEN ${has(variables,"notes")} THEN ${text(variables.notes)} ELSE notes END
          WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING *`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { customer_update: camelCustomer(rows[0] as Row) }
        break
      }
      case "DeleteCustomer": {
        const rows = await sql`DELETE FROM customers WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING id`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { customer_delete: { id: rows[0].id } }
        break
      }
      case "CreateSupplier": {
        const supplierId = randomUUID()
        const rows = await sql`INSERT INTO suppliers(id,tenant_id,business_id,supplier_name,phone_number,email,location,products_supplied,payment_status,notes)
          VALUES(${supplierId},${tenantId},${businessId},${String(variables.supplierName)},${text(variables.phoneNumber)},${text(variables.email)},${text(variables.location)},${text(variables.productsSupplied)},${text(variables.paymentStatus)},${text(variables.notes)}) RETURNING *`
        data = { supplier_insert: camelSupplier(rows[0] as Row) }
        break
      }
      case "UpdateSupplier": {
        const rows = await sql`UPDATE suppliers SET
          supplier_name=CASE WHEN ${has(variables,"supplierName")} THEN ${text(variables.supplierName)} ELSE supplier_name END,
          phone_number=CASE WHEN ${has(variables,"phoneNumber")} THEN ${text(variables.phoneNumber)} ELSE phone_number END,
          email=CASE WHEN ${has(variables,"email")} THEN ${text(variables.email)} ELSE email END,
          location=CASE WHEN ${has(variables,"location")} THEN ${text(variables.location)} ELSE location END,
          products_supplied=CASE WHEN ${has(variables,"productsSupplied")} THEN ${text(variables.productsSupplied)} ELSE products_supplied END,
          payment_status=CASE WHEN ${has(variables,"paymentStatus")} THEN ${text(variables.paymentStatus)} ELSE payment_status END,
          notes=CASE WHEN ${has(variables,"notes")} THEN ${text(variables.notes)} ELSE notes END
          WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING *`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { supplier_update: camelSupplier(rows[0] as Row) }
        break
      }
      case "DeleteSupplier": {
        const rows = await sql`DELETE FROM suppliers WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING id`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { supplier_delete: { id: rows[0].id } }
        break
      }
      case "CreateDocument": {
        const documentId = randomUUID()
        const rows = await sql`INSERT INTO documents(id,tenant_id,business_id,title,document_type,file_url,description,uploaded_by)
          VALUES(${documentId},${tenantId},${businessId},${String(variables.title)},${String(variables.documentType)},${String(variables.fileUrl)},${text(variables.description)},${String(variables.uploadedBy)}) RETURNING *`
        data = { document_insert: camelDocument(rows[0] as Row) }
        break
      }
      case "DeleteDocument": {
        const rows = await sql`DELETE FROM documents WHERE id=${String(variables.id)} AND tenant_id=${tenantId} AND business_id=${businessId} RETURNING id`
        if (!rows[0]) throw new Error("Record is outside the authenticated company")
        data = { document_delete: { id: rows[0].id } }
        break
      }
      case "CreateActivityLog": {
        const logId = randomUUID()
        const rows = await sql`INSERT INTO activity_logs(id,tenant_id,business_id,user_id,user_name,action_type,module,description,record_id)
          VALUES(${logId},${tenantId},${businessId},${String(variables.userId)},${String(variables.userName)},${String(variables.actionType)},${String(variables.module)},${text(variables.description)},${text(variables.recordId)}) RETURNING *`
        data = { activityLog_insert: camelLog(rows[0] as Row) }
        break
      }
      case "CreateAiQuery": {
        const queryId = randomUUID()
        const purpose = variables.purpose === "dashboard" ? "dashboard" : "assistant"
        const rows = await sql`INSERT INTO ai_queries(id,tenant_id,business_id,user_id,query_text,response,purpose)
          VALUES(${queryId},${tenantId},${businessId},${String(variables.userId)},${String(variables.queryText)},${text(variables.response)},${purpose}) RETURNING *`
        data = { aiQuery_insert: { id: rows[0].id } }
        break
      }
      default:
        throw new Error(`Unsupported Neon mutation operation: ${operation}`)
    }
    return { data: data as T }
  }
}

let service: NeonDataService | undefined

export function neonDataService() {
  service ??= new NeonDataService()
  return service
}
