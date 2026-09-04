# Firebase-to-Neon migration audit and implementation

Audit date: 3 September 2026

This is the source-of-truth inventory for the SmartERP backend migration. It
documents retained Firebase assets as migration/rollback inputs; it does not
authorize deleting any Firebase project, user, database, or hosting resource.

## 1. Application frameworks

| Client | Framework | Backend access after migration |
|---|---|---|
| Web and API | Next.js 16.3.3 App Router, React 19.2, TypeScript 5.9, Node 24 | Same-origin Next.js route handlers |
| Mobile | Flutter 3.44.4, Dart 3.12.2 | HTTPS calls to the same Next.js API; tokens use platform secure storage |
| Database | Neon PostgreSQL 18.6, Neon serverless driver 1.1 | Server-only HTTP queries and a bounded pool for interactive transactions |

Neither browser JavaScript nor the Flutter application contains or receives
`DATABASE_URL`. Both clients use the shared API under `frontend/src/app/api`.

## 2. Firebase service inventory

| Firebase service | Repository evidence | Migration status |
|---|---|---|
| Data Connect / SQL Connect | `backend/dataconnect`, generated web and Dart SDKs | Data imported into Neon with original IDs; live calls replaced by authenticated API routes |
| Authentication | Former email/password, Google popup and custom-token flows | Replaced by Neon Auth for owners/web and revocable Neon-backed employee sessions |
| Firestore | Legacy `users/{uid}` profile lookup and notifications | Retired from runtime; `backend/firestore.rules` remains fail-closed historical configuration |
| App Hosting | `frontend/apphosting.yaml` | Preserved as rollback/deployment history; Next.js can run on any supported host |
| Auth emulator | `backend/firebase.json` | Preserved for legacy verification only |
| Firebase Storage | No active bucket integration found | Private S3-compatible storage is the implemented replacement |
| Cloud Functions | No Functions source or deployed function configuration found | Server work now uses Next.js route handlers; cron reconciliation is an authenticated internal route |
| Classic Hosting | No active Classic Hosting configuration found | Not part of the runtime |
| Messaging, Crashlytics, Analytics, Remote Config | No active SDK calls found | No migration required |

`firebase` and `firebase-admin` remain dev dependencies only because the guarded,
one-time import utilities need them. A source scan finds no Firebase imports in
the deployed web or mobile runtime.

## 3. Complete Data Connect schema inventory

Enums:

- `TransactionType`: `SALE`, `EXPENSE`
- `TaskStatus`: `PENDING`, `ONGOING`, `COMPLETED`, `LATE`
- `TaskPriority`: `LOW`, `MEDIUM`, `HIGH`

Tables and fields:

- `Tenant`: id, name, businessSector, location, ownerEmail, taxId, logoUrl,
  subscriptionTier, status, createdAt.
- `User`: id, tenantId, businessId, email, role, fullName, department,
  phoneNumber, createdAt, accessCodeHash, and transitional accessCode.
- `Business`: id, tenantId, name, location, businessType, entityType, city,
  region, phone, email, taxId, description, logoUrl, createdAt, code.
- `BusinessSetting`: businessId, tenantId, currency, timezone,
  fiscalYearStart, taxRate, lowStockThreshold, updatedAt.
- `Product`: id, tenantId, businessId, name, category, quantity, costPrice,
  sellingPrice, expiryDate, lowStockLevel, status, createdBy, createdAt,
  updatedAt.
- `Transaction`: id, tenantId, businessId, type, amount, date, category,
  description, receiptUrl, recordedBy, createdAt.
- `Task`: id, tenantId, businessId, title, description, status, priority,
  dueDate, assignedTo, createdBy, createdAt, updatedAt.
- `TaskComment`: id, tenantId, businessId, task, user, content, createdAt.
- `Employee`: id, tenantId, businessId, fullName, position, role, salary,
  department, email, contact, startDate, status, attendance,
  salaryPaymentStatus, createdAt, and transitional code.
- `Customer`: id, tenantId, businessId, customerName, phoneNumber, email,
  location, totalOrders, totalSpent, notes, createdAt.
- `Supplier`: id, tenantId, businessId, supplierName, phoneNumber, email,
  location, productsSupplied, paymentStatus, notes, createdAt.
- `Document`: id, tenantId, businessId, title, documentType, fileUrl,
  description, uploadedBy, uploadedAt.
- `ActivityLog`: id, tenantId, businessId, userId, userName, actionType,
  module, description, recordId, timestamp.
- `AiQuery`: id, tenantId, businessId, userId, queryText, response, timestamp.
- `Notification`: id, tenantId, businessId, userId, message, isRead, createdAt.
- `MirrorOutbox`: id, tenantId, businessId, entityType, operation, recordId,
  payload, status, attempts, nextAttemptAt, lastError, createdAt, deliveredAt.

The normalized Neon schema preserves these entities and IDs. It also adds
business settings, atomic sales and sale lines, inventory movements, document
intelligence/vector search, announcements/read receipts, durable rate limits,
revocable app sessions, migration metadata, employment events, attendance,
leave, payroll settings/runs/items, chart of accounts, fiscal periods,
immutable journal entries/lines, bank reconciliation, receivables and payables.

## 4. Complete Data Connect operation inventory

The connector contains 29 queries:

`ListTenants`, `ListUsers`, `ListLegacyAccessCodes`, `ListBusinesses`,
`getUserByEmail`, `getBusinessById`, `getBusinessSettings`,
`getBusinessByCode`, `getBusinessesByName`, `verifyEmployeeAccess`,
`verifyUserLogin`, `listProductsByBusiness`, `listCustomersByBusiness`,
`getCustomerForCompany`, `listSaleCustomersByBusiness`,
`listTaskAssigneesByBusiness`, `listUsersByBusiness`,
`listSuppliersByBusiness`, `listTasksByBusiness`,
`listTasksAssignedToUser`, `listTransactionsByBusiness`,
`listTransactionsByType`, `listEmployeesByBusiness`,
`listDocumentsByBusiness`, `listActivityLogsByUser`,
`listActivityLogsByBusiness`, `getUserById`, `listNotifications`, and
`ListPendingMirrorOutbox`.

The connector contains 50 mutations:

`BootstrapWorkspace`, `CreateTenant`, `UpdateTenant`, `DeleteTenant`,
`CreateUser`, `UpdateUser`, `DeleteUser`, `ClearLegacyAccessCode`,
`CreateBusiness`, `UpdateBusiness`, `UpsertBusinessSettings`,
`DeleteBusiness`, `ProvisionEmployeeUser`, `CompleteAssignedTask`,
`CreateProduct`, `UpdateProduct`, `DeleteProduct`, `CreateTransaction`,
`UpdateTransaction`, `DeleteTransaction`, `CreateTaskComment`,
`UpdateTaskComment`, `DeleteTaskComment`, `CreateEmployeeWithAccess`,
`UpdateEmployeeWithAccess`, `DeleteEmployeeWithAccess`, `CreateEmployee`,
`UpdateEmployee`, `DeleteEmployee`, `CreateCustomer`, `UpdateCustomer`,
`DeleteCustomer`, `CreateSupplier`, `UpdateSupplier`, `DeleteSupplier`,
`CreateDocument`, `UpdateDocument`, `DeleteDocument`, `CreateActivityLog`,
`CreateAiQuery`, `UpdateAiQuery`, `DeleteAiQuery`, `CreateNotification`,
`UpdateNotification`, `DeleteNotification`, `CreateTask`, `UpdateTask`,
`DeleteTask`, `CreateMirrorOutbox`, and `UpdateMirrorOutbox`.

### Generated SDK calls

The current TypeScript SDK at `frontend/src/dataconnect-generated` exposes all
79 operations above as lower-camel action calls and `*Ref` factories. Its React
SDK exposes the matching `use<Operation>` hooks. The Dart SDK at
`mobile/lib/generated` contains one variables/data builder unit per operation.
These are retained for source comparison only; there are no runtime imports of
them in web or mobile.

An older, stale SDK at `frontend/src/lib/dataconnect-sdk` exposes these 24
actions and matching refs: `createBusiness`, `createCustomer`, `createEmployee`,
`createNotification`, `createProduct`, `createSupplier`, `createTask`,
`createTenant`, `createTransaction`, `deleteEmployee`, `deleteProduct`,
`deleteTask`, `getTenant`, `listCustomers`, `listEmployees`,
`listNotifications`, `listProducts`, `listSuppliers`, `listTasks`,
`listTransactions`, `listUsers`, `markNotificationRead`, `updateProduct`, and
`updateTask`. It is also not imported by runtime code.

### Replacement routing

- Active ERP CRUD goes through authenticated `POST /api/data`; its allow-list
  assigns a permission to every exposed operation and replaces tenant,
  business, user, and actor identifiers with the authenticated profile values.
- Registration uses atomic `POST /api/bootstrap`, not three client mutations.
- Login/profile operations use `/api/auth/*`, `/api/auth/employee-token`, and
  `/api/profile`.
- Sales use `/api/sales`, a row-locked and idempotent database transaction;
  generic transactions are restricted to expenses.
- HR history/attendance/leave use `/api/hr`, controlled payroll uses
  `/api/payroll`, and double-entry accounting/open-items/banking use
  `/api/accounting`. The same routes serve web and Flutter.
- Files, AI, reports, audit events, announcements and notification delivery use
  their dedicated authenticated routes.
- Legacy access-code and mirror-outbox operations are migration/internal jobs,
  not client endpoints.
- Unused generated admin/destructive operations remain intentionally
  unexposed. This prevents a client from bypassing RBAC while preserving the
  historical operation definitions for audit and rollback.

## 5. Authentication, storage, hosting and environment

Authentication uses a same-origin Neon Auth proxy and HttpOnly cookies on web.
Mobile owner sessions are Neon Auth bearer tokens stored with
`flutter_secure_storage`. Employee access-code login returns a random opaque
token; only its SHA-256 digest is stored in `app_auth_sessions`, and logout
revokes it. `users.auth_user_id` links the Neon identity to the stable imported
ERP profile ID.

Firebase passwords are not copied. The guarded Auth migration creates missing
Neon accounts, sends password-reset links, and links identities only after
successful creation. Duplicate emails and already-existing Auth identities are
sent to manual review.

Files use a private S3-compatible bucket. Object keys include tenant, business,
and user scope; authenticated API routes validate ownership before upload,
download, or deletion. No Firebase Storage data path was found to migrate.

Runtime server variables are `DATABASE_URL`, `EXPECTED_DATABASE_HOST`,
`NEON_POOL_MAX`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_COOKIE_SECRET`, S3-compatible
storage settings, `OPENROUTER_API_KEY`, optional `OPENROUTER_MODELS`,
`OPENROUTER_DATA_COLLECTION`, `OPENROUTER_REQUIRE_ZDR`, `RATE_LIMIT_SECRET`,
`CRON_SECRET`, `AI_RETENTION_DAYS`, and `AI_INSIGHT_CACHE_MINUTES`. Public deployment settings are `NEXT_PUBLIC_APP_URL` and
`ALLOWED_ORIGINS`. Firebase Admin and `SOURCE_FIREBASE_DATACONNECT_*` variables
are source-only migration inputs and must not be promoted to the deployed app.

The environment validator requires a pooled Neon hostname, pins it with
`EXPECTED_DATABASE_HOST`, rejects placeholders/insecure production origins,
and requires independent operational secrets. Values are always redacted.

## 6. Database migrations, seeding and tenant isolation

- `001`–`003`: normalized ERP, document intelligence/vector data, announcements.
- `004`: transactional sales, inventory movements, idempotency, integrity and
  security hardening.
- `005`–`007`: targeted notifications, operational fields, customer/sale scope.
- `008`: final Neon system-of-record fields and migration metadata.
- `009`: Neon Auth profile links and revocable employee sessions.
- `010`: database-enforced tenant/business ownership for 21 relationships.
- `011`: tenant-scoped HR/payroll/accounting tables, balanced-posting and
  immutable-ledger triggers, fiscal close, open items and bank reconciliation.
- `012`: AI history purpose constraints and the tenant/user conversation index
  used by assistant memory, dashboard caching and scheduled retention.

Migration `010` uses `NOT VALID` foreign keys: new invalid writes are rejected,
while imported legacy rows remain available for explicit reconciliation. After
all historical orphans are resolved, the constraints can be validated without
changing application data.

`scripts/seed-demo.mjs` is a confirmation-guarded optional seed. Production
migrations and source imports have separate exact confirmation variables and
an expected-host check.

### Accounting and payroll compliance boundary

The accounting engine enforces double-entry mechanics, immutable postings,
reversals and fiscal-period locks, but its built-in chart is intentionally a
simplified internal chart. It is not represented as a certified statutory
SYSCOHADA chart. The current OHADA accounting framework and presentation must
be mapped and approved for each reporting entity; see the official
[OHADA UAAFR/SYSCOHADA publication](https://www.ohada.org/en/publication-of-a-new-uniform-act-on-accounting-law-and-financial-reporting-uaafr/).

Payroll settings are configurable and start in `DRAFT`. CNPS describes the
employer as responsible for calculating and remitting employer and employee
contributions, while Cameroon DGI guidance governs employment-income taxation.
Production posting therefore remains locked until the Business Owner confirms
professionally reviewed settings. References:
[CNPS employer rules](https://www.cnps.cm/fr/employeurs/regles-generales-pour-les-employeurs1.html),
[CNPS employer obligations](https://www.cnps.cm/fr/employeurs/obligations-de-lemployeur1.html), and
[DGI individual income tax guidance](https://www.impots.cm/fr/document/tout-savoir-sur-lirpp).

## 7. Verification result

Local verification against the configured pooled Neon branch reports:

- PostgreSQL `18.6 (c5250a2)` reachable.
- All 41 required tables present.
- `vector` extension present.
- Neon Auth schema and `users.auth_user_id` present.
- All 21 tenant-integrity guards present.
- Zero orphan businesses, settings, products, transactions, tasks/comments,
  employees, customers, suppliers, documents, document-intelligence rows, AI
  queries, notifications, sales, announcements, outbox records, task links, or
  records in any migration-011 HR/payroll/accounting table.
- One preserved orphan Business Owner profile references missing tenant
  `tenant_bambi_646` and business `biz_bambi`; no deterministic owner match
  exists. It was not modified or deleted.
- Four historical activity logs have missing company references: three use that
  same `tenant_bambi_646` / `biz_bambi` scope and one uses the former mock
  platform sentinel `system_root` / `platform_master`. Their contents were not
  exposed or altered.

Web tests (8/8), strict type checking, ESLint, environment validation, the
Next.js production build, Flutter analysis, and Flutter tests all pass. The
domain suite covers login, tenants, products, customers, employees,
transactions/sales, tasks, payroll identities, balanced journals, module
tenant scoping, server-only pooling, and the read-only verifier. A rollback-only
database check also proves that balanced journals post, unbalanced journals are
rejected and posted journals are immutable without retaining its test rows.
The hardened Auth dry run found nine valid activation candidates, zero duplicate
email groups, and one invalid profile; it stopped before creating any account or
sending any reset email.

## 8. Safe phased migration and cutover plan

1. **Inventory and freeze definitions — complete.** Preserve Firebase, record
   every schema/operation/service, and stop adding new Firebase dependencies.
2. **Build Neon in parallel — complete.** Apply normalized migrations, import
   Data Connect in one transaction, preserve IDs, and verify record counts.
3. **Move clients behind one API — complete.** Web and Flutter use the same
   authenticated Next.js routes; no client has database credentials.
4. **Migrate identity and files — implementation complete, activation pending.**
   Neon Auth/session and private object storage paths are implemented. Configure
   production email/OAuth/trusted origins, preview the user migration, then send
   reset links. Keep Firebase Auth for rollback.
5. **Reconcile data — blocked by owner decisions.** Identify the orphan owner's
   correct company or explicitly approve retirement, and decide whether the
   four historical audit rows should be reassigned or archived. Re-run
   `npm run db:verify:neon` until every orphan count is zero, then validate all
   `NOT VALID` tenant constraints.
6. **Canary and production cutover — pending.** Deploy with production secrets,
   require `/api/health` to be ready, test every module in a dedicated tenant,
   test backup restoration, then move traffic. Do not dual-write after cutover.
7. **Rollback window and later decommission — pending.** Retain the prior app,
   Firebase Auth users and Data Connect during the agreed window. Only after
   sign-off should source credentials be revoked and Firebase resources be
   archived or removed through a separate approved operation.

## 9. Secret handling finding

The tracked Firebase Auth export `frontend/accounts.json` included password
hash/salt material. It is removed from the working tree and matching export
names are ignored. Because it exists in Git history, rotate affected
credentials/sessions and rewrite repository history before making the
repository public. No secret values are reproduced in this document.
