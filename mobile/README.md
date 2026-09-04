# SmartERP mobile

The Flutter client connects to the SmartERP API. Production uses the deployed
HTTPS API; local Chrome development can use the Next.js server on localhost.
Owner accounts use Neon Auth bearer sessions; employee access-code accounts
use revocable Neon-backed application sessions stored in secure storage.

HR, payroll and accounting use the same authenticated `/api/hr`, `/api/payroll`
and `/api/accounting` endpoints as the web application. The mobile client never
receives a Neon connection string or supplies authoritative tenant identifiers.

## Getting Started

Supply the deployed API origin when running locally:

```bash
flutter run --dart-define=API_BASE_URL=https://your-domain.example
```

For the Flutter client running in Chrome against the local Next.js server,
start the API on port 9002 and run:

```bash
flutter run -d chrome --dart-define=API_BASE_URL=http://localhost:9002
```

The login screen keeps both flows: **Email and password** for linked accounts,
and **Team access code** for provisioned Managers and Staff.

Production builds require HTTPS and private Android signing configuration. See
the repository `DEPLOYMENT.md` for the release command.

A few resources to get you started if this is your first Flutter project:

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.
