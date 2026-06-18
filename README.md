
# SmartERP AI

An AI-powered Enterprise Resource Planning platform for SMEs in Cameroon.

**Official Repository:** [https://github.com/DrALCHEMY44/ERP-M](https://github.com/DrALCHEMY44/ERP-M)

## Data Strategy: NoSQL to SQL Transition

This application is moving towards **Firebase Data Connect** to leverage the power of PostgreSQL for relational SME data.

### Database Options
1. **Cloud Firestore (Current Prototype)**: High-speed NoSQL for real-time updates and notifications.
2. **Firebase Data Connect (SQL Integration)**: Managed PostgreSQL for complex reporting, SYCOHADA accounting integrity, and relational queries.

### Setup Instructions

#### 1. Firebase Data Connect (SQL)
- Go to the [Firebase Console](https://console.firebase.google.com/).
- Navigate to **Data Connect** in the build menu.
- Connect your project to a **Google Cloud SQL for PostgreSQL** instance.
- Run `firebase init dataconnect` in your local CLI to generate the GraphQL SDK.

#### 2. Environment Setup
- Copy configuration values from the console into your `.env` file.
- Ensure your `POSTGRES_CONNECTION_STRING` is secured.

## Project Structure

- `src/app/`: Root routes and core modules.
- `src/ai/`: Genkit flow definitions and AI logic.
- `src/lib/dataconnect/`: (Future) Generated SQL/GraphQL SDKs.
- `src/lib/firebase.ts`: Initialization for Auth, Firestore, and Storage.

## Core Features
- **Multi-Tenant SaaS**: Isolated data via `tenantId`.
- **Relational Integrity**: SQL-ready schemas for accounting and inventory.
- **AI Business Assistant**: Context-aware intelligence powered by Genkit.
