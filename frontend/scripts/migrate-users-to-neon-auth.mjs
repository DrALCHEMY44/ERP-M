import { randomBytes } from "node:crypto"
import { neon } from "@neondatabase/serverless"

const required = ["DATABASE_URL", "EXPECTED_DATABASE_HOST", "NEON_AUTH_BASE_URL", "NEXT_PUBLIC_APP_URL"]
for (const name of required) {
  if (!process.env[name]) throw new Error(`${name} is required`)
}
if (new URL(process.env.DATABASE_URL).hostname !== process.env.EXPECTED_DATABASE_HOST) {
  throw new Error("Neon target does not match EXPECTED_DATABASE_HOST")
}

const confirmation = "MIGRATE_EXISTING_USERS_TO_NEON_AUTH"
const apply = process.env.NEON_AUTH_USER_MIGRATION_CONFIRMATION === confirmation
const sql = neon(process.env.DATABASE_URL)

async function authRequest(path, body) {
  const response = await fetch(`${process.env.NEON_AUTH_BASE_URL}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Origin": new URL(process.env.NEXT_PUBLIC_APP_URL).origin,
    },
    body: JSON.stringify(body),
  })
  let payload = {}
  try { payload = await response.json() } catch {}
  if (!response.ok) {
    const message = payload?.message || payload?.error?.message || payload?.error || `${response.status} ${response.statusText}`
    throw new Error(String(message))
  }
  return payload
}

const profiles = await sql.query(`
    SELECT u.id,u.email,u.full_name
    FROM users u
    JOIN tenants t ON t.id=u.tenant_id
    JOIN businesses b ON b.id=u.business_id AND b.tenant_id=u.tenant_id
    WHERE u.auth_user_id IS NULL AND u.email IS NOT NULL AND btrim(u.email) <> ''
    ORDER BY lower(u.email),u.id
  `)
const duplicates = await sql.query(`
    SELECT lower(u.email) AS email,count(*)::int AS count
    FROM users u
    JOIN tenants t ON t.id=u.tenant_id
    JOIN businesses b ON b.id=u.business_id AND b.tenant_id=u.tenant_id
    WHERE u.auth_user_id IS NULL AND u.email IS NOT NULL AND btrim(u.email) <> ''
    GROUP BY lower(u.email)
    HAVING count(*) > 1
    ORDER BY lower(u.email)
  `)
const [{ invalid_profiles: invalidProfiles }] = await sql.query(`
    SELECT count(*)::int AS invalid_profiles
    FROM users u
    LEFT JOIN tenants t ON t.id=u.tenant_id
    LEFT JOIN businesses b ON b.id=u.business_id AND b.tenant_id=u.tenant_id
    WHERE u.auth_user_id IS NULL
      AND u.email IS NOT NULL
      AND btrim(u.email) <> ''
      AND (t.id IS NULL OR b.id IS NULL)
  `)

console.log(JSON.stringify({
  mode: apply ? "apply" : "dry-run",
  candidates: profiles.length,
  invalidProfiles: Number(invalidProfiles),
  duplicateEmailGroups: duplicates.length,
}, null, 2))
if (Number(invalidProfiles) > 0) throw new Error("Invalid tenant/business profile links must be resolved before Auth migration")
if (duplicates.length) throw new Error("Duplicate ERP emails must be resolved before Auth migration")
if (!apply) {
  console.log(`Dry run only. Set NEON_AUTH_USER_MIGRATION_CONFIRMATION=${confirmation} to create accounts and send reset links.`)
} else {
  const results = []
  for (const profile of profiles) {
    const existing = await sql.query(`SELECT id FROM neon_auth."user" WHERE lower(email)=lower($1)`, [profile.email])
    if (existing.length) {
      results.push({ profileId: profile.id, status: "manual-review", reason: "Neon Auth email already exists" })
      continue
    }
    try {
      const created = await authRequest("sign-up/email", {
        email: profile.email.trim().toLowerCase(),
        name: profile.full_name || profile.email.split("@")[0],
        password: randomBytes(48).toString("base64url"),
      })
      const authUserId = created?.user?.id
      if (!authUserId) throw new Error("Neon Auth did not return a user id")
      await sql.query("UPDATE users SET auth_user_id=$1::uuid WHERE id=$2 AND auth_user_id IS NULL", [authUserId, profile.id])
      try {
        await authRequest("request-password-reset", {
          email: profile.email.trim().toLowerCase(),
          redirectTo: `${new URL(process.env.NEXT_PUBLIC_APP_URL).origin}/reset-password`,
        })
        results.push({ profileId: profile.id, status: "linked-reset-sent" })
      } catch (error) {
        results.push({
          profileId: profile.id,
          status: "linked-reset-request-failed",
          reason: error instanceof Error ? error.message : String(error),
        })
      }
    } catch (error) {
      results.push({ profileId: profile.id, status: "failed", reason: error instanceof Error ? error.message : String(error) })
    }
  }
  console.log(JSON.stringify({ results }, null, 2))
  if (results.some((result) => result.status !== "linked-reset-sent")) process.exitCode = 1
}
