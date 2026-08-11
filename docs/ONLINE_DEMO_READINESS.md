# Online demo readiness

Status as of 2026-08-11. `PASS` means verified locally; cloud-dependent claims remain `BLOCKED` until tested against the new HTTPS deployment.

| Requirement | Current status | Evidence | Blocking issue | Required correction | Verification method | Final status |
|---|---|---|---|---|---|---|
| Trusted authentication/RBAC boundary | PASS | `firebase-token.ts`, `authorization.ts`, authorization tests | Live identities unavailable | Provision dedicated demo identities | Online role/tenant tests | PASS locally |
| Atomic sales/inventory | PASS | `sales.ts`, migration 004, concurrency/rollback tests | Demo Neon migration not applied | Back up demo branch, migrate and backfill | Online sale plus stock query | PASS locally |
| Expenses and receipts | PARTIAL | authenticated data/files routes | Live storage/database unavailable | Deploy and exercise both paths | Acceptance test with/without receipt | BLOCKED online |
| Tasks and employees | PARTIAL | authenticated data route and mobile providers | Live Firebase profiles unavailable | Seed users and test assignment/completion | Cross-tenant and mobile test | BLOCKED online |
| Documents and AI | PASS | private object route, document intelligence and security tests | Provider/storage credentials unavailable | Configure private services | Upload/search/provider failure tests | PASS locally |
| Durable reconciliation | PASS | protected internal route and shared retry core | Cron not deployed | Set `CRON_SECRET`, deploy schedule | Unauthorized/authorized invocation | PASS locally |
| Firebase rules | PASS locally | default-deny Firestore rules; CLI 15.26.0 emulator startup/parse passed with Java 21 | Behavioral rules test suite is not implemented | Add authenticated/unauthenticated emulator assertions when fixtures are available | Emulator startup plus behavioral rules tests | PASS syntax/startup |
| Data Connect clean deployment | PARTIAL | all operations `NO_ACCESS` | New project ID/resources pending | Compile/deploy to empty demo project | Compile and generated SDK diff | BLOCKED |
| Existing development Data Connect compatibility | BLOCKED | compile reports removed access-code variables, added required hash/id variables, removed audit mutations | Existing project must remain untouched | Use `@retired`/nullable transition in a separate migration branch if ever migrating it | Compile without `--force` | BLOCKED by policy |
| Vercel full-stack deployment | PASS | `frontend/vercel.json`, deterministic build/typegen | Project/env not created | Configure Vercel with `frontend/` root | HTTPS health and workflows | PASS locally |
| Flutter release | PARTIAL | authenticated API and release URL validation | Official stable SDK verification in progress | Complete user-local SDK verification | doctor/analyze/test; release APK only after HTTPS URL | BLOCKED |
| Demo data | PARTIAL | guarded idempotent `demo:seed` script | Cloud resources/UIDs pending | Review on clean schema then run once approved | Second run produces same IDs/counts | BLOCKED online |

## Dependency exposure

The compatible Next.js update to 15.5.23 was applied. Removing unused Genkit and vulnerable SheetJS reduced installation findings from 67 to 9. Remaining production findings are the Next-bundled PostCSS/Sharp chain (fixed only by a reviewed Next 16 migration) and moderate Firebase transitive dependencies. Spreadsheet parsing is disabled; CSV remains supported. No claim is made that every registry advisory is remotely exploitable.

The package-by-package reachability and acceptance rationale is recorded in
`DEPENDENCY_RISK.md`.

## ESLint warning classification

The original 86 warnings were reduced to 80 with zero errors. Six
demonstrated-workflow/correctness-adjacent warnings were fixed: internal
navigation now uses the Next router, sale form observation is stable, and the
sale request no longer sends client-controlled tenant/actor scope. Of the 80
remaining warnings, 79 are cosmetic unused imports, variables, parameters or
catch bindings. One is a deprecation/maintenance-performance warning for an
unoptimized business-logo `<img>`. There are no remaining warnings classified
as correctness/security or demonstrated-workflow risks.

## Document-storage authority

Private S3-compatible object storage is the sole authority for documents,
receipts, generated reports and document-intelligence inputs. Every active path
uses `object-storage.ts` and the authenticated `/api/files` boundary. Firebase
Storage is not an application dependency; its configuration and rules were
removed from deployment scope to avoid ambiguous dual ownership.

## Data Connect compatibility report

The development-project comparison identified these breaking changes: removal of `accessCode` from `ProvisionEmployeeUser`, `CompleteAssignedTask`, `verifyUserLogin`, `verifyEmployeeAccess`, `CreateUser`, and `UpdateUser`; addition of required `accessCodeHash` to three operations; addition of required `id` to `CreateUser`; and removal of `UpdateActivityLog`/`DeleteActivityLog`. Do not force-deploy these changes to `studio-8058744913-5a601`. The new empty demo project receives the current schema as a clean initial deployment. A future development-project migration must first retain removed inputs/operations with `@retired`, introduce nullable hash fields, regenerate clients, migrate callers/data, then remove compatibility fields in a later release.
