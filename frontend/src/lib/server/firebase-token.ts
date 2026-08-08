import { getApps, initializeApp, applicationDefault, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

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

export type AuthorizedProfile = {
  uid: string
  tenantId: string
  businessId: string
  role: string
  fullName: string
}

function firestoreString(fields: Record<string, any>, key: string): string {
  return fields?.[key]?.stringValue ?? ""
}

export async function authorizeRequest(request: Request): Promise<AuthorizedProfile> {
  const authorization = request.headers.get("authorization")
  if (!authorization?.startsWith("Bearer ")) {
    throw new Error("Missing Firebase authentication token")
  }

  const token = authorization.slice("Bearer ".length)
  const app = firebaseAdminApp()
  const decoded = await getAuth(app).verifyIdToken(token)
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  if (!projectId) throw new Error("Firebase project is not configured")

  const profileResponse = await fetch(
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/users/${encodeURIComponent(decoded.uid)}`,
    { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" },
  )
  let tenantId = ""
  let businessId = ""
  let role = ""
  let fullName = ""
  if (profileResponse.ok) {
    const profile = await profileResponse.json()
    tenantId = firestoreString(profile.fields, "tenantId")
    businessId = firestoreString(profile.fields, "businessId")
    role = firestoreString(profile.fields, "role")
    fullName = firestoreString(profile.fields, "fullName")
  } else {
    // Current production profiles live in Firebase SQL Connect. Resolve the
    // company scope server-side from the verified token email; never trust a
    // client-provided tenant identifier for authorization. The generated query
    // is intentionally public for pre-login profile discovery and does not
    // require local Application Default Credentials.
    await import("@/lib/firebase")
    const { getUserByEmail, getUserById } = await import("@dataconnect/generated")
    const sqlProfile = decoded.email
      ? (await getUserByEmail({ email: decoded.email })).data.users[0]
      : (await getUserById({ id: decoded.uid })).data.user
    tenantId = sqlProfile?.tenantId ?? ""
    businessId = sqlProfile?.businessId ?? ""
    role = sqlProfile?.role ?? ""
    fullName = sqlProfile?.fullName ?? ""
  }
  if (!tenantId || !businessId) throw new Error("Business profile is incomplete")

  return { uid: decoded.uid, tenantId, businessId, role, fullName }
}
