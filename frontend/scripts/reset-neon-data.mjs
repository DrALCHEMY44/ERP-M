import { Pool } from "@neondatabase/serverless"

const REQUIRED_CONFIRMATION = "RESET_ALL_SMARTERP_DATA"

function target() {
  const connectionString = process.env.DATABASE_URL
  const expectedHost = process.env.EXPECTED_DATABASE_HOST
  if (!connectionString || !expectedHost) {
    throw new Error("DATABASE_URL and EXPECTED_DATABASE_HOST are required")
  }

  const url = new URL(connectionString)
  if (url.hostname !== expectedHost || !url.hostname.includes("-pooler.")) {
    throw new Error("Refusing reset because the configured Neon host is unexpected or not pooled")
  }
  return {
    connectionString,
    description: { host: url.hostname, database: url.pathname.slice(1) },
  }
}

function quoteIdentifier(value) {
  return `"${value.replaceAll('"', '""')}"`
}

async function exactCounts(client, names) {
  const counts = []
  for (const name of names) {
    const result = await client.query(`SELECT COUNT(*)::int AS count FROM public.${quoteIdentifier(name)}`)
    counts.push({ table: name, rows: result.rows[0].count })
  }
  return counts
}

const database = target()
const pool = new Pool({ connectionString: database.connectionString, max: 1 })
const client = await pool.connect()

try {
  const tablesResult = await client.query(`SELECT tablename
    FROM pg_tables
    WHERE schemaname='public' AND tablename <> 'system_migrations'
    ORDER BY tablename`)
  const tables = tablesResult.rows.map((row) => row.tablename)
  if (tables.length < 40) {
    throw new Error(`Refusing reset because only ${tables.length} SmartERP application tables were found`)
  }

  const before = await exactCounts(client, tables)
  const migrationResult = await client.query("SELECT COUNT(*)::int AS count FROM public.system_migrations")
  const authResult = await client.query('SELECT COUNT(*)::int AS count FROM neon_auth."user"')
  const summary = {
    target: database.description,
    applicationTables: tables.length,
    applicationRows: before.reduce((total, item) => total + item.rows, 0),
    migrationRowsPreserved: migrationResult.rows[0].count,
    neonAuthUsers: authResult.rows[0].count,
    mode: process.env.RESET_NEON_DATA_CONFIRMATION === REQUIRED_CONFIRMATION ? "execute" : "preview",
  }
  console.log(JSON.stringify(summary, null, 2))

  if (process.env.RESET_NEON_DATA_CONFIRMATION !== REQUIRED_CONFIRMATION) {
    console.log(`No data changed. Set RESET_NEON_DATA_CONFIRMATION=${REQUIRED_CONFIRMATION} to execute.`)
    process.exitCode = 2
  } else {
    await client.query("BEGIN")
    try {
      await client.query("SET LOCAL lock_timeout = '15s'")
      const qualifiedTables = tables.map((name) => `public.${quoteIdentifier(name)}`).join(", ")
      await client.query(`TRUNCATE TABLE ${qualifiedTables} RESTART IDENTITY CASCADE`)
      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    }

    const after = await exactCounts(client, tables)
    const remainingRows = after.reduce((total, item) => total + item.rows, 0)
    if (remainingRows !== 0) throw new Error(`Reset verification failed: ${remainingRows} rows remain`)

    const preservedResult = await client.query("SELECT COUNT(*)::int AS count FROM public.system_migrations")
    if (preservedResult.rows[0].count !== migrationResult.rows[0].count) {
      throw new Error("Reset verification failed: migration history changed")
    }
    console.log(JSON.stringify({ resetComplete: true, applicationRowsRemaining: 0, migrationRowsPreserved: preservedResult.rows[0].count }, null, 2))
  }
} finally {
  client.release()
  await pool.end()
}
