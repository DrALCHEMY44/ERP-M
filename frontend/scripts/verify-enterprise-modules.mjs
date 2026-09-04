import { randomUUID } from "node:crypto"
import { Client } from "@neondatabase/serverless"

const databaseUrl = process.env.DATABASE_URL
const expectedHost = process.env.EXPECTED_DATABASE_HOST
if (!databaseUrl || !expectedHost) throw new Error("DATABASE_URL and EXPECTED_DATABASE_HOST are required")
const parsed = new URL(databaseUrl)
if (parsed.hostname !== expectedHost || !parsed.hostname.includes("-pooler.")) {
  throw new Error("Refusing to test an unexpected or non-pooled database target")
}

const client = new Client(databaseUrl)
const result = {
  companyScopeAvailable: false,
  balancedJournalPosted: false,
  unbalancedJournalRejected: false,
  postedJournalImmutable: false,
  changesRolledBack: false,
}

try {
  await client.connect()
  const scope = await client.query(`SELECT u.id AS actor_id,u.tenant_id,u.business_id
    FROM users u JOIN tenants t ON t.id=u.tenant_id
    JOIN businesses b ON b.id=u.business_id AND b.tenant_id=u.tenant_id
    ORDER BY u.created_at LIMIT 1`)
  if (!scope.rows[0]) throw new Error("No valid company user is available for the rollback-only module verification")
  result.companyScopeAvailable = true
  const { actor_id: actorId, tenant_id: tenantId, business_id: businessId } = scope.rows[0]
  const suffix = randomUUID().slice(0, 8)
  const debitAccount = randomUUID()
  const creditAccount = randomUUID()
  const journalId = randomUUID()

  await client.query("BEGIN")
  await client.query(
    `INSERT INTO chart_of_accounts(id,tenant_id,business_id,code,name,account_type,normal_balance,created_by)
     VALUES($1,$2,$3,$4,'Rollback verification cash','ASSET','DEBIT',$5),
           ($6,$2,$3,$7,'Rollback verification equity','EQUITY','CREDIT',$5)`,
    [debitAccount, tenantId, businessId, `VERIFY-D-${suffix}`, actorId, creditAccount, `VERIFY-C-${suffix}`],
  )
  await client.query(
    `INSERT INTO journal_entries(id,tenant_id,business_id,entry_date,reference,description,source_type,created_by)
     VALUES($1,$2,$3,CURRENT_DATE,$4,'Rollback-only balanced journal verification','VERIFY',$5)`,
    [journalId, tenantId, businessId, `VERIFY-${suffix}`, actorId],
  )
  await client.query(
    `INSERT INTO journal_lines(tenant_id,business_id,journal_entry_id,account_id,line_number,debit,credit)
     VALUES($1,$2,$3,$4,1,100,0),($1,$2,$3,$5,2,0,100)`,
    [tenantId, businessId, journalId, debitAccount, creditAccount],
  )
  await client.query(
    "UPDATE journal_entries SET status='POSTED',posted_by=$1 WHERE id=$2",
    [actorId, journalId],
  )
  result.balancedJournalPosted = true

  await client.query("SAVEPOINT immutability_test")
  try {
    await client.query("UPDATE journal_entries SET description='Forbidden rewrite' WHERE id=$1", [journalId])
  } catch {
    result.postedJournalImmutable = true
    await client.query("ROLLBACK TO SAVEPOINT immutability_test")
  }

  await client.query("SAVEPOINT balance_test")
  const unbalancedId = randomUUID()
  try {
    await client.query(
      `INSERT INTO journal_entries(id,tenant_id,business_id,entry_date,reference,description,source_type,created_by)
       VALUES($1,$2,$3,CURRENT_DATE,$4,'Rollback-only unbalanced journal verification','VERIFY',$5)`,
      [unbalancedId, tenantId, businessId, `VERIFY-BAD-${suffix}`, actorId],
    )
    await client.query(
      `INSERT INTO journal_lines(tenant_id,business_id,journal_entry_id,account_id,line_number,debit,credit)
       VALUES($1,$2,$3,$4,1,100,0),($1,$2,$3,$5,2,0,99)`,
      [tenantId, businessId, unbalancedId, debitAccount, creditAccount],
    )
    await client.query("UPDATE journal_entries SET status='POSTED',posted_by=$1 WHERE id=$2", [actorId, unbalancedId])
  } catch {
    result.unbalancedJournalRejected = true
    await client.query("ROLLBACK TO SAVEPOINT balance_test")
  }
  await client.query("ROLLBACK")
  result.changesRolledBack = true
} finally {
  await client.end()
}

console.log(JSON.stringify(result, null, 2))
if (Object.values(result).some((value) => !value)) process.exitCode = 1
