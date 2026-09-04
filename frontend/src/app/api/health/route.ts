import { HeadBucketCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

import { validateServerEnvironment } from "@/lib/server/environment"
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
    configuration: false,
    neonAuth: false,
    neon: false,
    objectStorage: false,
  }

  try {
    validateServerEnvironment()
    checks.configuration = true
  } catch {}
  try {
    const baseUrl = process.env.NEON_AUTH_BASE_URL
    if (!baseUrl) throw new Error("NEON_AUTH_BASE_URL is missing")
    const response = await within(fetch(`${baseUrl}/ok`, { cache: "no-store" }))
    checks.neonAuth = response.ok
  } catch {}
  try {
    const rows = await within(db()`SELECT
      to_regclass('public.users') IS NOT NULL AS users_ready,
      to_regclass('public.app_auth_sessions') IS NOT NULL AS auth_sessions_ready,
      to_regclass('public.business_settings') IS NOT NULL AS settings_ready,
      to_regclass('public.sales') IS NOT NULL AS sales_ready`)
    checks.neon = rows[0]?.users_ready === true && rows[0]?.auth_sessions_ready === true
      && rows[0]?.settings_ready === true && rows[0]?.sales_ready === true
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
