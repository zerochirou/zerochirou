# Zerochirou Server (API Gateway)

High-performance, edge-first API server built with [Hono](https://hono.dev/), [Drizzle ORM](https://orm.drizzle.team/), and [Cloudflare D1](https://developers.cloudflare.com/d1/).

---

## ◈ Architecture & Project Structure

The codebase follows modular, feature-based and layered design best practices:

```text
apps/server/
├── drizzle/                      # Generated SQL migration files
├── src/
│   ├── db/                       # Drizzle ORM database layer
│   │   ├── schema/               # Modular schema definitions (SQLite/D1)
│   │   │   ├── auth.ts           # Users, sessions, accounts, verifications
│   │   │   ├── questions.ts      # Anonymous questions table & types
│   │   │   └── index.ts          # Schema barrel export
│   │   ├── client.ts             # D1 Drizzle instance factory
│   │   └── index.ts
│   ├── middlewares/              # Hono custom middlewares
│   │   ├── cors.middleware.ts    # Secure dynamic CORS handler
│   │   ├── db.middleware.ts      # Context database injection (c.get('db'))
│   │   ├── error.middleware.ts   # Global error & 404 handlers
│   │   └── index.ts
│   ├── modules/                  # Domain-driven feature modules
│   │   ├── health/               # Health check & DB connectivity probe
│   │   │   ├── health.routes.ts
│   │   │   └── index.ts
│   │   ├── questions/            # Questions domain (controller & service)
│   │   │   ├── questions.routes.ts
│   │   │   ├── questions.service.ts
│   │   │   └── index.ts
│   │   └── index.ts              # Route aggregator
│   ├── types/                    # Global type declarations & Worker bindings
│   │   ├── env.ts                # AppEnv (Bindings & Context Variables)
│   │   └── index.ts
│   └── index.ts                  # Worker entry point & app composition
├── drizzle.config.ts             # Drizzle Kit CLI configuration
├── wrangler.jsonc                # Cloudflare Worker configuration & D1 bindings
├── tsconfig.json                 # Strict TypeScript configuration
└── package.json                  # Dependencies & execution scripts
```

---

## ◈ Scripts

All commands can be executed via `pnpm` from the monorepo root or directly within `apps/server`:

```bash
# Start local development server (Cloudflare Worker runtime with Miniflare)
pnpm --filter server dev

# Type check TypeScript definitions
pnpm --filter server typecheck

# Lint source files
pnpm --filter server lint

# Generate D1 TypeScript bindings
pnpm --filter server cf-typegen

# Generate Drizzle migration files from schemas
pnpm --filter server db:generate

# Apply migrations locally (local Miniflare SQLite)
pnpm --filter server db:migrate:local

# Apply migrations to remote Cloudflare D1
pnpm --filter server db:migrate:remote

# Launch Drizzle Studio GUI
pnpm --filter server db:studio

# Deploy worker to Cloudflare
pnpm --filter server deploy
```

---

## ◈ Endpoints

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/` | API status & metadata |
| `GET` | `/health` | Health check with Cloudflare D1 probe |
| `GET` | `/api/questions` | List public questions |
| `POST` | `/api/questions` | Submit an anonymous question |
| `POST` | `/api/questions/:id/like` | Like a question |
