import { randomBytes, scrypt as scryptCallback } from "node:crypto"
import { promisify } from "node:util"
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getDataConnect } from "firebase-admin/data-connect"

const scrypt = promisify(scryptCallback)
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
if (!projectId) throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is required")
if (projectId !== process.env.EXPECTED_FIREBASE_PROJECT_ID) throw new Error("Firebase project does not match EXPECTED_FIREBASE_PROJECT_ID")
if (process.env.DEMO_MODE_CONFIRMATION !== "SEED_SMARTERP_DEFENCE_DEMO") throw new Error("DEMO_MODE_CONFIRMATION is required")
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
const app = getApps()[0] || initializeApp({
  projectId,
  credential: clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault(),
})
const location = process.env.FIREBASE_DATACONNECT_LOCATION
const serviceId = process.env.FIREBASE_DATACONNECT_SERVICE_ID
if (!location || !serviceId) throw new Error("Firebase Data Connect configuration is required")
const dc = getDataConnect({ location, serviceId, connector: process.env.FIREBASE_DATACONNECT_CONNECTOR_ID || "example" }, app)
const result = await dc.executeQuery("ListLegacyAccessCodes")
let migrated = 0
for (const user of result.data.users) {
  if (!user.accessCode) continue
  const salt = randomBytes(16)
  const derived = await scrypt(String(user.accessCode).toUpperCase(), salt, 64, { N: 32768, r: 8, p: 1 })
  const hash = `scrypt$32768$8$1$${salt.toString("base64url")}$${derived.toString("base64url")}`
  await dc.executeMutation("UpdateUser", { id: user.id, accessCodeHash: hash })
  await dc.executeMutation("ClearLegacyAccessCode", { id: user.id })
  migrated++
}
console.log(JSON.stringify({ migrated, plaintextRemaining: 0 }))
