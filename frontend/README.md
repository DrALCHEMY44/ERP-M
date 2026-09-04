# SmartERP frontend

The web client is a Next.js application. It includes React pages and components,
server-side API routes, Neon PostgreSQL/Neon Auth integration, and the OpenRouter
AI endpoint. Browsers never receive database credentials.

```bash
npm install
npm run dev
```

Place web environment variables in `.env`. The development server listens on
port 9002 by default. See the repository `DEPLOYMENT.md` and `.env.example` for
the required Neon Auth and production settings.
