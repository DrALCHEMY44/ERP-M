# SmartERP implementation status

Last verified: 4 September 2026

## Release assessment

The repository is locally release-ready: web, API, Neon schema, Neon Auth
integration, and Flutter checks pass. Firebase Data Connect and Firebase Auth
have been removed from the deployed runtime. The production Neon schema has
migrations `001`–`015`. On 3 September 2026, the configured Neon branch received
an explicitly confirmed factory data reset: all 41 SmartERP application tables
are empty, while schemas, constraints and `system_migrations` remain intact.
The configured private object-storage bucket was also cleared and verified at
zero current objects, stored versions and delete markers.
Final deployment secrets, production smoke tests, first-owner registration and
Android signing inputs remain launch operations; `/api/health` must report
`ready`.

Do not deploy new Data Connect resources to `studio-8058744913-5a601`. It may be
used as the read-only migration source until its data is verified in Neon.
Firebase Auth users must remain available only through the rollback window.
They are not used by the new web/API or Flutter runtime.

## Functional modules

| Module | Production implementation | Status |
|---|---|---|
| Authentication and authorization | Neon Auth cookies/bearer sessions, stable ERP profile links, centralized RBAC, trusted tenant scope, Neon-backed employee sessions | Code complete; database is empty and requires first-owner registration |
| Business profile | Neon-backed contact, entity, tax, description, settings, and private logo storage | Complete |
| Settings | Persisted currency, timezone, fiscal year, tax rate, low-stock threshold, theme and language | Complete |
| Inventory | Neon-authoritative CRUD, persisted status/expiry, low-stock alerts, activity logs and transactional stock movements | Complete |
| Sales | Atomic row-locked sale transaction, idempotency, line items, payment method, inventory decrement, scoped customer validation, audit/outbox, real web/mobile history and receipts | Complete |
| Expenses and finance | Neon-authoritative expenses with descriptions/receipts, immutable void-and-reverse handling, real aggregates, DSF and operational CSV exports | Complete |
| Customers | Neon contact records with committed order/spend summaries, scoped sale validation and historical-sale deletion protection | Complete |
| Suppliers | Persisted location, products, balance status and notes with derived payment summaries | Complete |
| Employees and HR | Atomic employee/login lifecycle, hashed one-time access codes, daily attendance with working time, leave requests/decisions, and immutable employment history | Complete |
| Payroll | Configurable earnings, deductions, progressive tax/social calculations, snapshotted pay runs, owner approval, accounting posting, payment and payroll register | Complete; production posting locked until settings are professionally reviewed and confirmed |
| Accounting | Double-entry chart, immutable journals/reversals, trial balance, management income statement/balance sheet, fiscal close, receivables, payables, bank accounts and reconciliation | Complete; opening balances and SYSCOHADA mapping require accountant sign-off |
| Tasks | Tenant-scoped assignments, validated assignees, role-aware management, assigned-staff completion and authorized overdue notification | Complete |
| Documents | Private object storage, managed-URL validation, failed-upload rollback, authenticated view/download/delete, AI processing and invoice-to-expense flow | Complete |
| Announcements and notifications | Neon-backed announcements, per-user reads, targeted roles/users, inventory/task event publication | Complete |
| Reports | Real tenant-scoped sales, inventory, finance, customer and task aggregates; safe CSV and stored generated reports | Complete |
| AI assistant | Server-only OpenRouter fallback pipeline, authenticated scoped history, minimized/pseudonymized context, assigned-task isolation, provider data-collection denial, durable rate limiting, dashboard cache/local fallback and scheduled retention | Complete; free models are development/low-volume capacity and a production provider plan is still recommended |
| Platform administration | Real tenant/user/plan metrics, workspace lifecycle and notes, invitation lifecycle/session revocation, plan editing, invoices, support cases and platform announcements; fabricated trend indicators removed | Complete |
| Flutter client | Restored Neon sessions and authoritative RBAC; web-aligned inventory/barcode units, cart sales, expenses, customers, suppliers, employee access, tasks, documents, reports, business settings, HR, payroll, full accounting operations and SaaS administration | Complete; signed bundle inputs required |

## Data and security posture

- Neon is authoritative for every relational domain, including identity
  profiles, businesses, settings, tasks, employees, customers, suppliers,
  documents, products, sales, expenses, audit data and search indexes.
- Customer order/spend totals are derived from committed Neon sales rather than
  editable counters.
- The Next.js API verifies Neon sessions, permissions, target ownership and
  tenant scope; clients have no direct Neon credentials.
- PostgreSQL rejects cross-tenant company references through 22 composite
  foreign-key guards; the post-reset verifier reports zero orphan records.
- Migration `011` adds company-scoped HR, payroll, journal, open-item and bank
  records. Posted journals cannot be edited or deleted, unbalanced journals
  cannot post, and closed fiscal periods reject later postings.
- Migration `012` adds governed AI query purposes and a scoped conversation
  index. Daily maintenance enforces AI history retention without exposing query
  content to the cron response.
- Firebase and Firestore are absent from the deployed runtime; their retained
  configuration and generated files are migration history only.
- Object storage is private; file reads and writes require document permissions.
- CSV exports escape formulas as well as delimiters to prevent spreadsheet
  injection.
- Android release builds cannot use debug signing, cleartext traffic, or a
  missing HTTPS API URL.

## Verification evidence

| Check | Result |
|---|---|
| Next.js 16.3.3 production build | Passed in supported Webpack mode; Neon Auth route and reset page included |
| TypeScript strict check | Passed |
| ESLint | Passed with zero warnings/errors |
| Node security/integrity tests | 12/12 test files passed, including login/session recovery, tenant, barcode inventory, customer, employee, transaction/sale, task, payroll/accounting, SaaS control plane and security contracts |
| Neon runtime migration | Neon applied `001`–`015`; identity/session security, tenant guards, HR/payroll/accounting, AI governance, SaaS administration and barcode-unit schema are present without rewriting existing IDs |
| Read-only Neon verifier | PostgreSQL 18.6 reachable through pooled host; 51/51 tables, vector, Neon Auth, auth link and 22/22 tenant guards present; every checked orphan count is zero |
| Rollback-only accounting database test | Balanced journal posted, unbalanced journal rejected, posted journal mutation rejected, and all verification rows rolled back |
| Neon factory reset | 41 application tables and 102 rows cleared; zero application rows remain; migration history preserved; Neon Auth contains zero users |
| Object-storage reset | The final 50,127-byte test object and its stored version were deleted; zero objects remain |
| Flutter analyzer | Passed with zero issues |
| Flutter widget tests | Previously passed; current rerun was blocked because this execution sandbox cannot bind the local test runner socket |
| Automated release coverage | Playwright public/security checks, guarded authenticated read-only production smoke coverage, Flutter navigation/RBAC tests and GitHub CI are present |
| Optimized server smoke test | Neon Auth proxy returned 200; unauthenticated profile and sales returned 401 |
| Security headers | CSP, HSTS, frame denial, MIME, referrer, permissions and cross-origin policies present |
| Unauthenticated protected API test | `/api/sales` returned 401 |
| Production environment validator | Correctly blocked placeholders/missing secrets |
| Production dependency audit | `npm audit --omit=dev` found 0 vulnerabilities; Firebase packages are migration-only dev dependencies |
| AI provider smoke test | Current fallback pipeline completed successfully through `minimax/minimax-m3:free` with provider data collection denied |
| AI tenant/RBAC smoke test | Before the factory reset, live Staff context contained only products, inventory and the assigned task; direct identity/contact keys were absent and all context queries succeeded |

## Remaining launch gates

1. Promote the locally validated Neon/Auth variables to the deployment service,
   then configure Neon Auth trusted origins, production email, and Google OAuth.
2. Configure private S3-compatible storage, backups, and every remaining value
   in `frontend/.env.example`; all three operational secrets must be independent.
3. Register the first Business Owner and new isolated workspace, then verify the
   Neon Auth identity is linked to the new ERP profile.
4. Have a qualified accountant confirm payroll settings, opening balances and
   the company-specific SYSCOHADA chart/presentation. Production payroll posting
   remains locked while its settings are `DRAFT`.
5. Deploy the web/API service and require `/api/health` to return `ready` before
   DNS cutover.
6. Decide the final Android package identity and release process. Gradle and
   Android-emulator tests are intentionally absent from CI at the owner's request.
   A normal Flutter Android package build uses Gradle internally.
7. Approve privacy/retention policy, restore test, monitoring ownership,
   incident response and a dedicated production smoke-test tenant.
8. For sustained production AI traffic, configure an OpenRouter budget/guardrail
   and at least one SLA-backed model; keep the free fallback list for graceful
   degradation rather than treating free quotas as guaranteed capacity.

The complete audit is in `docs/FIREBASE_TO_NEON_MIGRATION.md`; exact commands
and rollback gates are in `DEPLOYMENT.md`.
