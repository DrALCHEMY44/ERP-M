import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app"
import { getDataConnect } from "firebase-admin/data-connect"
import { neon } from "@neondatabase/serverless"
import { reconcileOutbox } from "./reconcile-outbox-core.mjs"

for (const name of ["DATABASE_URL", "NEXT_PUBLIC_FIREBASE_PROJECT_ID"]) {
  if (!process.env[name]) throw new Error(`${name} is required`)
}
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n")
const app = getApps()[0] || initializeApp({
  projectId,
  credential: clientEmail && privateKey ? cert({ projectId, clientEmail, privateKey }) : applicationDefault(),
})
for (const name of ["FIREBASE_DATACONNECT_LOCATION", "FIREBASE_DATACONNECT_SERVICE_ID"]) {
  if (!process.env[name]) throw new Error(`${name} is required`)
}
const dc = getDataConnect({
  location: process.env.FIREBASE_DATACONNECT_LOCATION,
  serviceId: process.env.FIREBASE_DATACONNECT_SERVICE_ID,
  connector: process.env.FIREBASE_DATACONNECT_CONNECTOR_ID || "example",
}, app)
const sql = neon(process.env.DATABASE_URL)
const summary = await reconcileOutbox({ dc, sql })
console.log(JSON.stringify(summary))
