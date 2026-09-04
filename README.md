
# SmartERP AI

An AI-powered Enterprise Resource Planning platform for SMEs in Cameroon.

## Repository structure

```text
.
├── frontend/   # Next.js web application and server-side API routes
├── mobile/     # Flutter application
├── backend/    # Archived Firebase/Data Connect migration source
└── docs/       # Product and architecture documentation
```

The Next.js runtime is the trusted service boundary for web and mobile clients.
It verifies Neon sessions, loads the company profile from Neon, applies
RBAC, and overwrites all tenant/business/actor identifiers before accessing
data. Clients never connect directly to PostgreSQL.

Neon is the sole relational system of record for identity profiles, companies,
settings, tasks, people, HR history, payroll, double-entry journals, open items,
bank reconciliation, documents, audit history, inventory, sales, expenses,
inventory movements, document-search indexes, and authentication. Firebase is
retained only as guarded migration history for the completed Data Connect import.

OpenRouter is called only from Next.js routes. It provides model routing for the
assistant, extraction and embeddings; it is not part of the transactional ERP
core. The repository contains no Python runtime service.

## Common commands

```bash
# Web application
npm --prefix frontend ci
npm run frontend:dev
npm run frontend:typecheck
npm run frontend:build
npm --prefix frontend run lint
npm --prefix frontend test

# Flutter application
cd mobile
flutter pub get
flutter run
flutter analyze
flutter test
```

## Deployment order

1. Provision Neon Auth, Neon PostgreSQL, and a private S3-compatible bucket.
2. Apply Neon migrations `001` through `011`, then run the guarded final Data
   Connect import while the source Cloud SQL service is still readable.
3. Verify source/target counts, freeze old writes, rerun the idempotent import,
   and cut over the web/API deployment to Neon.
4. Configure all variables in `frontend/.env.example`, run `env:check`, deploy
   the Next.js service, and require `/api/health` to return `ready` before DNS
   cutover.
5. Activate existing users with Neon password-reset links, configure a private
   Android upload key, and build Flutter with the verified HTTPS API URL.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the complete production runbook,
rollback gates, and commands.
See [docs/FIREBASE_TO_NEON_MIGRATION.md](./docs/FIREBASE_TO_NEON_MIGRATION.md)
for the full Firebase service, schema, operation, SDK and cutover audit.

Required server variables are documented in `frontend/.env.example`. Never put
Neon database, cookie, S3 or OpenRouter secrets in Flutter or `NEXT_PUBLIC_*`.


## Core features

- Multi-tenant SaaS data model
- Sales, inventory, HR/leave/attendance, controlled payroll, double-entry
  accounting, tasks, documents, and reporting
- Neon PostgreSQL with Neon Auth and Neon-backed employee sessions
- OpenRouter-powered, context-aware AI assistant
- Next.js web and Flutter mobile clients
