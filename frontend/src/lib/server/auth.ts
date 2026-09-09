import { createHash, createHmac, randomBytes, randomUUID } from "crypto"

import { getAuth } from "@/lib/auth/server"
import { db, withTransientDatabaseRetry } from "./neon"
import { neonDataService } from "./neon-data"

const APP_SESSION_PREFIX = "erp_session_"
const APP_SESSION_TTL_DAYS = 30
export const EMPLOYEE_SESSION_COOKIE = "smarterp_employee_session"

export function adminDatabase() {
  return neonDataService()
}

export type VerifiedIdentity = {
  uid: string
  email: string
  emailVerified: boolean
  provider: "neon"
}

type NeonSessionPayload = {
  user?: {
    id?: string | null
    email?: string | null
    emailVerified?: boolean | null
  } | null
}

type BearerIdentityLookup = (token: string) => Promise<VerifiedIdentity | null>

export type AuthorizedProfile = {
  uid: string
  authUserId?: string | null
  email: string
  tenantId: string
  businessId: string
  role: string
  fullName: string
}

type StoredProfile = {
  id: string
  authUserId?: string | null
  email?: string | null
  tenantId?: string | null
  businessId?: string | null
  role?: string | null
  fullName?: string | null
}

function toAuthorizedProfile(profile: StoredProfile, authUserId: string | null): AuthorizedProfile | null {
  if (!profile.tenantId || !profile.businessId || !profile.role) return null
  return {
    uid: profile.id,
    authUserId,
    email: profile.email?.toLowerCase() ?? "",
    tenantId: profile.tenantId,
    businessId: profile.businessId,
    role: profile.role,
    fullName: profile.fullName ?? "",
  }
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function employeeSessionFromCookie(request: Request) {
  const cookieHeader = request.headers.get("cookie") || ""
  const entry = cookieHeader.split(";").map((value) => value.trim())
    .find((value) => value.startsWith(EMPLOYEE_SESSION_COOKIE + "="))
  return entry ? decodeURIComponent(entry.slice(EMPLOYEE_SESSION_COOKIE.length + 1)) : ""
}

function requestIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown"
}

function ipHash(request: Request) {
  const secret = process.env.RATE_LIMIT_SECRET
  if (!secret) return null
  return createHmac("sha256", secret).update(requestIp(request)).digest("hex")
}

export async function issueAppSession(userId: string, request: Request) {
  const sql = db()
  const accessRows = await sql`SELECT u.account_status,t.status AS tenant_status,t.archived_at
    FROM users u JOIN tenants t ON t.id=u.tenant_id WHERE u.id=${userId} LIMIT 1`
  const access = accessRows[0]
  if (!access || access.account_status !== "Active") throw new Error("Forbidden: User account is suspended")
  if (access.archived_at || access.tenant_status !== "Active") throw new Error("Forbidden: Workspace is suspended")
  const token = `${APP_SESSION_PREFIX}${randomBytes(32).toString("base64url")}`
  const expiresAt = new Date(Date.now() + APP_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
  await sql`INSERT INTO app_auth_sessions(id,user_id,token_hash,expires_at,user_agent,ip_hash)
    VALUES(${randomUUID()}::uuid,${userId},${tokenHash(token)},${expiresAt.toISOString()}::timestamptz,
      ${request.headers.get("user-agent")?.slice(0, 500) ?? null},${ipHash(request)})`
  return { token, expiresAt }
}

async function profileForAppSession(token: string): Promise<AuthorizedProfile | null> {
  if (!token.startsWith(APP_SESSION_PREFIX)) return null
  const sql = db()
  const rows = await sql`UPDATE app_auth_sessions s
    SET last_used_at=NOW()
    FROM users u
    WHERE s.token_hash=${tokenHash(token)}
      AND s.user_id=u.id
      AND s.revoked_at IS NULL
      AND s.expires_at>NOW()
    RETURNING u.*`
  if (!rows[0]) return null
  const row = rows[0]
  return toAuthorizedProfile({
    id: String(row.id),
    authUserId: row.auth_user_id ? String(row.auth_user_id) : null,
    email: row.email ? String(row.email) : null,
    tenantId: row.tenant_id ? String(row.tenant_id) : null,
    businessId: row.business_id ? String(row.business_id) : null,
    role: row.role ? String(row.role) : null,
    fullName: row.full_name ? String(row.full_name) : null,
  }, row.auth_user_id ? String(row.auth_user_id) : null)
}

export async function revokeAppSession(token: string) {
  if (!token.startsWith(APP_SESSION_PREFIX)) return false
  const sql = db()
  const rows = await sql`UPDATE app_auth_sessions SET revoked_at=NOW()
    WHERE token_hash=${tokenHash(token)} AND revoked_at IS NULL RETURNING id`
  return rows.length > 0
}

async function identityForNeonBearer(token: string): Promise<VerifiedIdentity | null> {
  if (!token || token.startsWith(APP_SESSION_PREFIX)) return null
  const rows = await withTransientDatabaseRetry(async () => {
    const sql = db()
    return sql`SELECT u.id::text AS id,LOWER(u.email) AS email,u."emailVerified" AS email_verified
      FROM neon_auth.session s
      JOIN neon_auth."user" u ON u.id=s."userId"
      WHERE s.token=${token}
        AND s."expiresAt">NOW()
        AND NOT (COALESCE(u.banned,FALSE)
          AND (u."banExpires" IS NULL OR u."banExpires">NOW()))
      LIMIT 1`
  })
  const row = rows[0]
  if (!row?.id || !row.email) return null
  return {
    uid: String(row.id),
    email: String(row.email).toLowerCase(),
    emailVerified: Boolean(row.email_verified),
    provider: "neon",
  }
}

export async function verifyRequestIdentity(
  request: Request,
  lookupBearer: BearerIdentityLookup = identityForNeonBearer,
): Promise<VerifiedIdentity> {
  const authorization = request.headers.get("authorization")
  const hasBearer = authorization?.startsWith("Bearer ") && authorization.slice(7).trim().length > 0
  if (!hasBearer && !request.headers.get("cookie")) {
    throw new Error("Missing Neon authentication session")
  }

  if (hasBearer) {
    const bearer = authorization!.slice(7).trim()
    const identity = await lookupBearer(bearer)
    if (!identity) throw new Error("Missing Neon authentication session")
    return identity
  }

  const result = await getAuth().getSession()
  const session = result.data as NeonSessionPayload | null
  const user = session?.user
  if (!user?.id || !user.email) throw new Error("Missing Neon authentication session")
  return {
    uid: user.id,
    email: user.email.toLowerCase(),
    emailVerified: Boolean(user.emailVerified),
    provider: "neon",
  }
}

export async function profileForIdentity(identity: VerifiedIdentity): Promise<AuthorizedProfile | null> {
  const result = await adminDatabase().executeQuery<{ user: StoredProfile | null }, { authUserId: string }>(
    "getUserByAuthUserId",
    { authUserId: identity.uid },
  )
  return result.data.user ? toAuthorizedProfile(result.data.user, identity.uid) : null
}

export async function claimPlatformWorkspaceInvite(identity: VerifiedIdentity, invitationToken: string): Promise<AuthorizedProfile | null> {
  if (!invitationToken) return null
  const sql = db()
  const invitationHash = tokenHash(invitationToken)
  const rows = await sql`WITH claimed AS (
      UPDATE users u SET auth_user_id=${identity.uid}::uuid,last_login_at=NOW()
      FROM platform_workspace_invites i
      WHERE i.tenant_id=u.tenant_id
        AND LOWER(i.email)=LOWER(${identity.email})
        AND LOWER(u.email)=LOWER(${identity.email})
        AND i.token_hash=${invitationHash}
        AND i.created_at>NOW()-INTERVAL '7 days'
        AND i.accepted_at IS NULL AND i.revoked_at IS NULL
        AND u.auth_user_id IS NULL
      RETURNING u.*,i.id AS invite_id
    ), accepted AS (
      UPDATE platform_workspace_invites i SET accepted_at=NOW()
      FROM claimed c WHERE i.id=c.invite_id RETURNING i.id
    ) SELECT * FROM claimed LIMIT 1`
  const row = rows[0]
  if (row) {
    return toAuthorizedProfile({
      id: String(row.id), authUserId: identity.uid, email: String(row.email),
      tenantId: String(row.tenant_id), businessId: String(row.business_id),
      role: String(row.role), fullName: row.full_name ? String(row.full_name) : null,
    }, identity.uid)
  }

  const userRows = await sql`WITH claimed AS (
      UPDATE users u SET auth_user_id=${identity.uid}::uuid,last_login_at=NOW()
      FROM platform_user_invites i
      WHERE i.user_id=u.id
        AND LOWER(i.email)=LOWER(${identity.email})
        AND LOWER(u.email)=LOWER(${identity.email})
        AND i.token_hash=${invitationHash}
        AND i.accepted_at IS NULL AND i.revoked_at IS NULL
        AND i.expires_at>NOW() AND u.auth_user_id IS NULL
      RETURNING u.*,i.id AS invite_id
    ), accepted AS (
      UPDATE platform_user_invites i SET accepted_at=NOW()
      FROM claimed c WHERE i.id=c.invite_id RETURNING i.id
    ) SELECT * FROM claimed LIMIT 1`
  const invitedUser = userRows[0]
  if (!invitedUser) return null
  return toAuthorizedProfile({
    id: String(invitedUser.id), authUserId: identity.uid, email: String(invitedUser.email),
    tenantId: String(invitedUser.tenant_id), businessId: String(invitedUser.business_id),
    role: String(invitedUser.role), fullName: invitedUser.full_name ? String(invitedUser.full_name) : null,
  }, identity.uid)
}

export async function authorizeRequest(request: Request): Promise<AuthorizedProfile> {
  const authorization = request.headers.get("authorization")
  const bearer = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : ""
  const employeeSession = bearer.startsWith(APP_SESSION_PREFIX) ? bearer : employeeSessionFromCookie(request)
  if (employeeSession.startsWith(APP_SESSION_PREFIX)) {
    const profile = await profileForAppSession(employeeSession)
    if (!profile) throw new Error("Employee session is invalid or expired")
    await requireActiveProfile(profile)
    return profile
  }

  const identity = await verifyRequestIdentity(request)
  const profile = await profileForIdentity(identity)
  if (!profile) throw new Error("Neon account is not linked to a business profile")
  await requireActiveProfile(profile)
  return profile
}

async function requireActiveProfile(profile: AuthorizedProfile) {
  await withTransientDatabaseRetry(async () => {
    const sql = db()
    const rows = await sql`SELECT u.account_status,t.status AS tenant_status,t.archived_at
      FROM users u JOIN tenants t ON t.id=u.tenant_id
      WHERE u.id=${profile.uid} AND u.tenant_id=${profile.tenantId} LIMIT 1`
    const access = rows[0]
    if (!access) throw new Error("Forbidden: Account profile is unavailable")
    if (access.account_status !== "Active") throw new Error("Forbidden: User account is suspended")
    if (profile.role !== "Platform Super Admin") {
      if (access.archived_at) throw new Error("Forbidden: Workspace is archived")
      if (access.tenant_status !== "Active") throw new Error("Forbidden: Workspace is suspended")
    }
    await sql`UPDATE users SET last_login_at=NOW() WHERE id=${profile.uid}
      AND (last_login_at IS NULL OR last_login_at<NOW()-INTERVAL '5 minutes')`
  })
}
