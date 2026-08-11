# SmartERP AI implementation status

This file compares the academic report with the source code after the August
2026 remediation. It is an engineering status record, not a silent rewrite of
the report.

| Academic claim | Previous implementation status | Remediation performed | Evidence | Remaining limitation |
|---|---|---|---|---|
| Authentication is separated from authorization | Firebase sign-in existed, but client identifiers and public operations bypassed the intended boundary | Verified Firebase tokens, server profile lookup, centralized permission matrix and authenticated REST boundary | `frontend/src/lib/server/firebase-token.ts`, `authorization.ts`, `tests/authorization.test.ts` | MFA and independent penetration testing remain deployment work |
| Enterprise records are tenant-isolated | Most queries accepted browser-supplied company IDs | Server overwrites scope and actor fields; scoped updates/deletes verify ownership or use scoped SQL predicates | `frontend/src/app/api/data/route.ts`, `operational-data.ts` | Production integration tests require isolated Firebase/Neon test projects |
| Typed SQL Connect operations support web and mobile | Sensitive operations were public and clients called them directly | All connector operations are `NO_ACCESS`; generated SDKs were regenerated; clients call authenticated routes | `backend/dataconnect/example`, generated SDK timestamps, authorization tests | Direct generated SDK calls retained by unfinished screens must be migrated before those screens are enabled |
| Relational integrity protects business records | Float money, weak relationships and client-side stock decrement | Fixed-decimal migration, scoped keys/FKs/checks, sale lines, movements, idempotency and row locking | `frontend/migrations/004_security_transactional_integrity.sql`, `sales.ts`, `sales-transaction.test.ts` | Migration was not applied to production because that needs an approved backup/data window |
| Web and mobile sales update inventory consistently | Web/mobile created transactions and changed stock separately | Both call `/api/sales`; one Neon transaction locks products, creates ledger/audit/outbox records and rolls back as a unit | web sales page, mobile transaction provider, concurrency/rollback tests | Neon backfill must complete before cutover |
| PostgreSQL is the shared relational core | Firebase SQL Connect and Neon roles were ambiguous and mirroring was best-effort | Domain authority is explicit: Data Connect for company/reference domains; Neon for locked inventory/finance domains; durable retry outbox for raw mirror | README, `reconcile-outbox.mjs`, `outbox-recovery.test.ts` | Cross-database writes cannot be globally atomic; reconciliation must be monitored |
| OpenRouter AI is controlled and role-aware | AI accepted client role/company fields; mobile returned simulations | Server ignores spoofed fields, derives RBAC context, rate-limits durably, times out providers; mobile calls the same API | AI route, `ai-request.ts`, mobile core provider, security tests | Model quality and load benchmarking remain research gaps |
| Document AI treats evidence safely | Structured output and retrieved text were weakly validated | Strict schema parsing, untrusted-content delimiters, prompt-injection instruction, tenant predicates and common PII redaction | `document-intelligence.ts`, `security-primitives.test.ts` | Redaction is heuristic; legal retention approval and broader PII detection remain necessary |
| Audit records are traceable | Client code could create/update/delete audit records | Update/delete operations removed; trusted routes derive audit actor and append records | connector mutations, `/api/audit`, authorization test | Cross-store audit delivery needs operational alerting |
| Employee codes are secure | Plaintext codes and a universal demo password were present | Scrypt hashes with random salts, durable rate limits, custom Firebase tokens, transitional hash-and-clear backfill | `secret-hash.ts`, employee-token route, backfill script, tests | Run the credentialed backfill before final plaintext-column removal |
| Firestore enforces isolation | Rules allowed unsafe legacy patterns | Rules v2 default-deny; only a user may read their own strictly shaped legacy profile; all client writes denied | `backend/firestore.rules`, `backend/firebase.json`; CLI 15.26.0 emulator startup passed with workspace-local Temurin 21.0.12 | Behavioral emulator assertions still require dedicated fixtures; startup verification proves rules parsing/loading |
| Flutter is a real cross-client implementation | AI and authentication had local/demo fallbacks and duplicated provider code | Authenticated REST service, real AI endpoint, atomic sale endpoint, no seeded password or successful fallback, refreshed widget test | mobile services/providers/test | Analyzer still reports 61 first-party warnings/info; several legacy screens use deprecated UI APIs or placeholder data |
| The implementation uses Python AI services | No deployed Python service existed in the repository | Documentation now states the implemented Next.js/TypeScript service layer | README and Next.js API routes | The report should be amended explicitly if submitted again |
| Technical verification covers failure boundaries | Tests were sparse and stale | Added security, role spoofing, tenant scope, hashing, malformed AI output, PII, sale concurrency/rollback and outbox recovery tests | `frontend/tests`, mobile widget test | Live provider timeout/cross-project tests require dedicated credentials and controlled fixtures |

## Data retention and privacy assumptions

- AI prompts and responses are currently retained in Data Connect for audit.
  A deployment must select and implement a legal retention period (recommended
  prototype default: 30 days) before real personal data is processed.
- Extracted document text and chunks remain until the source document is
  deleted by an authorized retention job. Object storage must remain private.
- The current email/phone redaction is best-effort and does not constitute a
  complete DLP system. Users must not submit special-category or unnecessary PII.
- OpenRouter receives only role-filtered context and relevant, redacted evidence;
  provider terms, region and retention settings still require institutional review.

## Firestore rules audit

```json
{
  "overall_score": 92,
  "rating": "Strong prototype default-deny posture",
  "critical_issues": [],
  "warnings": [
    "Legacy profile reads still expose the authenticated user's own role and company identifiers",
    "Rules could not be emulator-compiled locally because Firebase CLI requires Java 21"
  ],
  "model_assumptions": [
    "users/{uid} is migration-only and server-managed",
    "Data Connect and Neon are authoritative; Firestore client writes are retired"
  ],
  "devils_advocate": "A stolen valid Firebase session can read that user's legacy profile; revoke sessions and remove the legacy collection after migration. No submitted document field can grant broader access because every write is denied."
}
```
