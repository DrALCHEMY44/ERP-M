
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

The OpenRouter integration lives in `frontend/src/app/api/ai/query`. Next.js API
routes remain with the frontend because they are compiled and deployed by the
Next.js server. The database schema, GraphQL operations, generated-client
configuration, Firestore rules, and Firebase emulator configuration are in
`backend/`.

## Common commands

```bash
# Web application
npm run frontend:dev
npm run frontend:typecheck
npm run frontend:build

# Firebase emulators and Data Connect SDK generation
npm run backend:emulators
npm run backend:generate

# Flutter application
cd mobile
flutter pub get
flutter run
```

Environment variables used by Next.js belong in `frontend/.env`.

## Core features

- Multi-tenant SaaS data model
- Sales, inventory, finance, HR, tasks, documents, and reporting
- Firebase Data Connect/PostgreSQL relational backend
- OpenRouter-powered, context-aware AI assistant
- Next.js web and Flutter mobile clients
