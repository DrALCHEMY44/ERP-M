# SmartERP AI

An AI-powered Enterprise Resource Planning platform for SMEs in Cameroon.

**Official Repository:** [https://github.com/DrALCHEMY44/ERP-M](https://github.com/DrALCHEMY44/ERP-M)

## Getting Started

The application is built with Next.js and utilizes Genkit for AI functionalities, with a Cloud Firestore backend.

### Database Setup (Firebase)

To connect to your live database:
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Add a **Web App** to your project.
4. Copy the configuration values into your `.env` file.
5. Enable **Authentication** (Email/Password) and **Cloud Firestore** in the Firebase sidebar.
6. Deploy the rules found in `firestore.rules`.

### Project Structure

- `src/app/`: Root routes and core modules (Dashboard, Inventory, Sales, Tasks, AI Assistant).
- `src/ai/`: Genkit flow definitions and AI logic with Role-Based Access Control.
- `src/components/`: Reusable UI components powered by ShadCN.
- `src/lib/`: Types, Firestore hooks, and utility functions for multi-tenancy.

## Core Features

- **Multi-Tenant SaaS**: Isolated business data per tenant using `tenantId` and `businessId`.
- **AI Business Assistant**: Read-only, context-aware intelligence powered by Genkit.
- **Inventory & Sales**: Real-time stock tracking and automatic inventory deduction.
- **Finance & HR**: SYCOHADA-compliant reporting and employee management.
- **Audit Trail**: Immutable activity logs for every system interaction.
- **Notifications**: Real-time alerts for low stock, tasks, and high-priority events.

## Deployment

This project is optimized for Firebase App Hosting.

1. Ensure your `.env` contains the required Firebase and Gemini API keys.
2. Run `npm run build` to verify the production build.
3. Deploy to Firebase using the official CLI or App Hosting GitHub integration.
