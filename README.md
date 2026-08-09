
# SmartERP AI

An AI-powered Enterprise Resource Planning platform for SMEs in Cameroon.

## Repository structure

```text
.
├── frontend/   # Next.js web application and server-side API routes
├── mobile/     # Flutter application
├── backend/    # Firebase configuration, Data Connect schema and operations
└── docs/       # Product and architecture documentation
```

The Next.js runtime is the trusted service boundary for web and mobile clients.
It verifies Firebase ID tokens, loads the server-side company profile, applies
RBAC, and overwrites all tenant/business/actor identifiers before accessing
data. Data Connect operations are `NO_ACCESS` to ordinary clients and are
called through the Firebase Admin SDK.

Firebase Data Connect remains authoritative for identity profiles, companies,
tasks, people, documents and audit records. Neon is authoritative for inventory,
sales, expenses, inventory movement history and document-search indexes because
these workflows require row locks and multi-statement transactions. The durable
Data Connect outbox mirrors non-operational records into an idempotent raw Neon
mirror; `npm --prefix frontend run db:reconcile:outbox` retries failures.

OpenRouter is called only from Next.js routes. It provides model routing for the
assistant, extraction and embeddings; it is not part of the transactional ERP
core. The repository contains no Python runtime service.

## Common commands

```bash
# Web application
npm run frontend:dev
npm run frontend:typecheck
npm run frontend:build
npm --prefix frontend run lint
npm --prefix frontend test

# Firebase emulators and Data Connect SDK generation
npm run backend:emulators
npm run backend:generate

# Flutter application
cd mobile
flutter pub get
flutter run
flutter analyze
flutter test
```

## Deployment order

1. Back up both PostgreSQL services and verify Firebase Admin credentials.
2. Deploy the backward-compatible Data Connect schema, then run
   `npm --prefix frontend run security:backfill-access-codes`; verify zero
   plaintext codes before removing the transitional column in a later release.
3. Apply `frontend/migrations/004_security_transactional_integrity.sql` with
   `npm --prefix frontend run db:migrate:neon` after reviewing the generated SKU
   backfill and constraints against production data.
4. Run `db:backfill:neon`, deploy the Next.js service, schedule
   `db:reconcile:outbox`, then deploy the generated clients.
5. Deploy Firestore and Storage rules and verify them in a Firebase project with
   Java 21+ before enabling clients.

Required server variables are documented in `frontend/.env.example`. Never put
Firebase Admin, Neon, S3 or OpenRouter secrets in Flutter or `NEXT_PUBLIC_*`.


## Core features

- Multi-tenant SaaS data model
- Sales, inventory, finance, HR, tasks, documents, and reporting
- Firebase Data Connect/PostgreSQL relational backend
- OpenRouter-powered, context-aware AI assistant
- Next.js web and Flutter mobile clients
