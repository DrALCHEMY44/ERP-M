import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth, type DecodedIdToken } from "firebase-admin/auth"
import { getDataConnect } from "firebase-admin/data-connect"
import { dataConnectConfig } from "./environment"

export function firebaseAdminApp() {
  if (getApps()[0]) return getApps()[0]
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
  return initializeApp({
    credential: clientEmail && privateKey && projectId
      ? cert({ projectId, clientEmail, privateKey })
      : applicationDefault(),
    projectId,
  })
}

export function adminDataConnect() {
  const config = dataConnectConfig()
  if (!config.serviceId) throw new Error("FIREBASE_DATACONNECT_SERVICE_ID is required")
  return getDataConnect(config, firebaseAdminApp())
}

export type AuthorizedProfile = {
  uid: string
  email: string
  tenantId: string
  businessId: string
  role: string
  fullName: string
}

export async function verifyRequestIdentity(request: Request): Promise<DecodedIdToken> {
  const authorization = request.headers.get("authorization")
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Missing Firebase authentication token")
  }
  return getAuth(firebaseAdminApp()).verifyIdToken(authorization.slice(7), true)
}

export async function profileForIdentity(decoded: DecodedIdToken): Promise<AuthorizedProfile | null> {
  const dc = adminDataConnect()
  // Firebase UID is the only identity binding. Email is display/contact data
  // and may legitimately occur in more than one tenant.
  const result = await dc.executeQuery<{ user: Record<string, string> | null }, { id: string }>("getUserById", { id: decoded.uid })
  const profile = result.data.user
  if (!profile) return null
  if (!profile.tenantId || !profile.businessId || !profile.role) return null
  return {
    uid: decoded.uid,
    email: decoded.email?.toLowerCase() ?? profile.email ?? "",
    tenantId: profile.tenantId,
    businessId: profile.businessId,
    role: profile.role,
    fullName: profile.fullName ?? "",
  }
}

export async function authorizeRequest(request: Request): Promise<AuthorizedProfile> {
  const decoded = await verifyRequestIdentity(request)
  const profile = await profileForIdentity(decoded)
  if (!profile) throw new Error("Business profile is incomplete")
  return profile
}
