import { HeadBucketCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

import { firebaseAdminApp } from "@/lib/server/firebase-token"
import { db } from "@/lib/server/neon"
import { objectStorage, storageBucket } from "@/lib/server/object-storage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

async function within<T>(promise: Promise<T>, milliseconds = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Readiness check timed out")), milliseconds)),
  ])
}

export async function GET() {
  const checks: Record<string, boolean> = {
    configuration: Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_DATACONNECT_SERVICE_ID &&
      process.env.DATABASE_URL &&
      process.env.S3_BUCKET &&
      process.env.OPENROUTER_API_KEY &&
      process.env.CRON_SECRET,
    ),
    firebaseAdmin: false,
    database: false,
    objectStorage: false,
  }

  try {
    firebaseAdminApp()
    checks.firebaseAdmin = true
  } catch {}
  try {
    await within(db()`SELECT 1`)
    checks.database = true
  } catch {}
  try {
    await within(objectStorage().send(new HeadBucketCommand({ Bucket: storageBucket() })))
    checks.objectStorage = true
  } catch {}

  const ready = Object.values(checks).every(Boolean)
  return NextResponse.json(
    { status: ready ? "ready" : "not_ready", checks },
    { status: ready ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  )
}
