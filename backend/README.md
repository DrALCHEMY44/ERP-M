# SmartERP backend

This directory contains the Firebase backend configuration:

- `dataconnect/` — PostgreSQL schema, GraphQL operations, and SDK generation
- `firebase.json` — emulator and Firebase CLI configuration
- `firestore.rules` — Firestore authorization rules
- `scripts/` — legacy schema/query maintenance scripts

Run backend commands from the repository root through the scripts in the root
`package.json`, or run Firebase CLI commands from this directory.

Generated clients are written to:

- `frontend/src/dataconnect-generated`
- `mobile/lib/generated` and `mobile/lib/generated_sdk`
