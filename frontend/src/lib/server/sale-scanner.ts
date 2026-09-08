import { createHash, randomBytes, randomUUID } from "crypto"

import type { AuthorizedProfile } from "./auth"
import { pooledDb } from "./neon"

const SESSION_TTL_MINUTES = 10

type SessionRow = Record<string, unknown>

export type ScannerCartItem = {
  productId: string
  unitId: string
  productName: string
  unitName: string
  conversionFactor: number
  unitPrice: number
  quantity: number
  availableBaseStock: number
}

export type ScannerSession = {
  id: string
  status: string
  expiresAt: string
  scannerJoined: boolean
  items: ScannerCartItem[]
}

function hashToken(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function randomToken() {
  return randomBytes(32).toString("base64url")
}

function expiry() {
  return new Date(Date.now() + SESSION_TTL_MINUTES * 60 * 1000)
}

async function cartItems(client: { query: Function }, sessionId: string, tenantId: string, businessId: string) {
  const result = await client.query(
    "SELECT i.product_id,i.unit_id,i.quantity,p.name AS product_name,p.quantity AS available_base_stock," +
      "pu.unit_name,pu.conversion_factor,COALESCE(pu.selling_price,p.selling_price) AS unit_price " +
      "FROM sale_scanner_session_items i " +
      "JOIN products p ON p.id=i.product_id AND p.tenant_id=i.tenant_id AND p.business_id=i.business_id " +
      "JOIN product_units pu ON pu.id=i.unit_id AND pu.product_id=i.product_id AND pu.tenant_id=i.tenant_id AND pu.business_id=i.business_id " +
      "WHERE i.session_id=$1 AND i.tenant_id=$2 AND i.business_id=$3 ORDER BY i.created_at ASC",
    [sessionId, tenantId, businessId],
  )
  return result.rows.map((row: SessionRow): ScannerCartItem => ({
    productId: String(row.product_id), unitId: String(row.unit_id),
    productName: String(row.product_name), unitName: String(row.unit_name),
    conversionFactor: Number(row.conversion_factor), unitPrice: Number(row.unit_price),
    quantity: Number(row.quantity), availableBaseStock: Number(row.available_base_stock),
  }))
}

function sessionResponse(row: SessionRow, items: ScannerCartItem[]): ScannerSession {
  return {
    id: String(row.id),
    status: String(row.status),
    expiresAt: new Date(String(row.expires_at)).toISOString(),
    scannerJoined: Boolean(row.scanner_user_id),
    items,
  }
}

export async function createScannerSession(profile: AuthorizedProfile) {
  const client = await pooledDb().connect()
  try {
    const id = randomUUID()
    const token = randomToken()
    const expiresAt = expiry()
    await client.query(
      "INSERT INTO sale_scanner_sessions(id,tenant_id,business_id,owner_user_id,token_hash,expires_at) VALUES($1,$2,$3,$4,$5,$6)",
      [id, profile.tenantId, profile.businessId, profile.uid, hashToken(token), expiresAt],
    )
    return {
      sessionId: id,
      pairingCode: JSON.stringify({ v: 1, type: "smarterp-sale-scanner", token }),
      expiresAt: expiresAt.toISOString(),
    }
  } finally {
    client.release()
  }
}

export async function ownerScannerSession(profile: AuthorizedProfile, sessionId: string) {
  const client = await pooledDb().connect()
  try {
    await client.query("UPDATE sale_scanner_sessions SET status='EXPIRED',updated_at=NOW() WHERE id=$1 AND status='OPEN' AND expires_at<=NOW()", [sessionId])
    const result = await client.query(
      "SELECT * FROM sale_scanner_sessions WHERE id=$1 AND tenant_id=$2 AND business_id=$3 AND owner_user_id=$4 LIMIT 1",
      [sessionId, profile.tenantId, profile.businessId, profile.uid],
    )
    const row = result.rows[0] as SessionRow | undefined
    if (!row) throw new Error("Scanner session was not found")
    return sessionResponse(row, await cartItems(client, sessionId, profile.tenantId, profile.businessId))
  } finally {
    client.release()
  }
}

async function lockedPairedSession(profile: AuthorizedProfile, token: string) {
  const client = await pooledDb().connect()
  try {
    await client.query("BEGIN")
    const result = await client.query(
      "SELECT * FROM sale_scanner_sessions WHERE token_hash=$1 AND tenant_id=$2 AND business_id=$3 FOR UPDATE",
      [hashToken(token), profile.tenantId, profile.businessId],
    )
    const row = result.rows[0] as SessionRow | undefined
    if (!row) throw new Error("Scanner session is invalid for this business")
    if (row.status !== "OPEN" || new Date(String(row.expires_at)).getTime() <= Date.now()) {
      await client.query("UPDATE sale_scanner_sessions SET status='EXPIRED',updated_at=NOW() WHERE id=$1 AND status='OPEN'", [row.id])
      throw new Error("Scanner session has expired. Ask the web user to create a new one.")
    }
    return { client, row }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined)
    client.release()
    throw error
  }
}

export async function joinScannerSession(profile: AuthorizedProfile, token: string) {
  const { client, row } = await lockedPairedSession(profile, token)
  try {
    if (row.scanner_user_id && String(row.scanner_user_id) !== profile.uid) {
      throw new Error("This scanner session is already paired to another phone")
    }
    await client.query(
      "UPDATE sale_scanner_sessions SET scanner_user_id=$1,joined_at=COALESCE(joined_at,NOW()),updated_at=NOW() WHERE id=$2",
      [profile.uid, row.id],
    )
    await client.query("COMMIT")
    return { sessionId: String(row.id), expiresAt: new Date(String(row.expires_at)).toISOString() }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}

export async function scanIntoSession(profile: AuthorizedProfile, token: string, barcode: string) {
  const { client, row } = await lockedPairedSession(profile, token)
  try {
    if (String(row.scanner_user_id || "") !== profile.uid) {
      throw new Error("Join this scanner session on this phone before scanning products")
    }
    const productResult = await client.query(
      "SELECT p.id AS product_id,p.name,p.quantity,pu.id AS unit_id,pu.unit_name,pu.conversion_factor " +
        "FROM product_units pu JOIN products p ON p.id=pu.product_id AND p.tenant_id=pu.tenant_id AND p.business_id=pu.business_id " +
        "WHERE pu.tenant_id=$1 AND pu.business_id=$2 AND pu.barcode=$3 FOR UPDATE",
      [profile.tenantId, profile.businessId, barcode],
    )
    const product = productResult.rows[0] as SessionRow | undefined
    if (!product) throw new Error("This barcode is not registered in this business inventory")
    const allocatedResult = await client.query(
      "SELECT COALESCE(SUM(i.quantity * pu.conversion_factor),0)::int AS quantity FROM sale_scanner_session_items i " +
        "JOIN product_units pu ON pu.id=i.unit_id AND pu.tenant_id=i.tenant_id AND pu.business_id=i.business_id AND pu.product_id=i.product_id " +
        "WHERE i.session_id=$1 AND i.product_id=$2",
      [row.id, product.product_id],
    )
    const nextAllocated = Number(allocatedResult.rows[0]?.quantity || 0) + Number(product.conversion_factor)
    if (nextAllocated > Number(product.quantity)) throw new Error("Not enough stock available for this scanned product")
    const itemResult = await client.query(
      "INSERT INTO sale_scanner_session_items(session_id,tenant_id,business_id,product_id,unit_id,quantity) VALUES($1,$2,$3,$4,$5,1) " +
        "ON CONFLICT(session_id,product_id,unit_id) DO UPDATE SET quantity=sale_scanner_session_items.quantity+1,updated_at=NOW() RETURNING quantity",
      [row.id, profile.tenantId, profile.businessId, product.product_id, product.unit_id],
    )
    await client.query("UPDATE sale_scanner_sessions SET updated_at=NOW() WHERE id=$1", [row.id])
    await client.query("COMMIT")
    return {
      productName: String(product.name), unitName: String(product.unit_name),
      quantity: Number(itemResult.rows[0].quantity), availableBaseStock: Number(product.quantity),
    }
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined)
    throw error
  } finally {
    client.release()
  }
}

export async function closeScannerSession(profile: AuthorizedProfile, sessionId: string, status: "COMPLETED" | "CANCELLED") {
  const client = await pooledDb().connect()
  try {
    const result = await client.query(
      "UPDATE sale_scanner_sessions SET status=$1,updated_at=NOW() WHERE id=$2 AND tenant_id=$3 AND business_id=$4 AND owner_user_id=$5 AND status='OPEN' RETURNING id",
      [status, sessionId, profile.tenantId, profile.businessId, profile.uid],
    )
    if (!result.rows[0]) throw new Error("Scanner session could not be closed")
  } finally {
    client.release()
  }
}
