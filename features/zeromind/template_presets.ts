import type { MermaidPreset } from "./types";

export const MERMAID_PRESETS: MermaidPreset[] = [
  {
    id: "nextjs-edge",
    title: "Next.js App Router & Edge Lifecycle",
    category: "Architecture",
    description: "Request handling through Edge middleware, Server Components, and Client hydration.",
    code: `flowchart TD
  Client[Client Browser] -->|HTTP Request| CDN[Edge CDN / Proxy]
  CDN --> MW{Edge Middleware}
  MW -->|Auth Check Passed| RSC[React Server Component Engine]
  MW -->|Unauthorized| Redirect[Redirect /login]
  RSC -->|Parallel Data Fetch| DB[(Primary Database)]
  RSC -->|Cache Lookup| Cache[(Redis Cache Layer)]
  RSC -->|Stream HTML & Payload| Client
  Client --> Hydrate[Client Component Hydration]`,
  },
  {
    id: "event-driven",
    title: "Event-Driven Microservices Architecture",
    category: "Systems",
    description: "Decoupled distributed services communicating via event stream brokers.",
    code: `flowchart LR
  API[API Gateway] --> S1[Order Service]
  S1 -->|Publish OrderCreated| Bus[(Kafka Event Bus)]
  Bus --> S2[Payment Service]
  Bus --> S3[Inventory Service]
  Bus --> S4[Notification Worker]
  S2 -->|PaymentSucceeded| Bus
  S3 -->|StockReserved| Bus`,
  },
  {
    id: "oauth-pkce",
    title: "OAuth 2.0 PKCE Flow",
    category: "Sequence",
    description: "Secure authorization code flow with Proof Key for Code Exchange.",
    code: `sequenceDiagram
  autonumber
  actor User as User Agent
  participant App as SPA Client
  participant Auth as Authorization Server
  participant API as Resource Server

  User->>App: Click Sign In
  App->>App: Generate code_verifier and code_challenge
  App->>Auth: GET /authorize (with code_challenge)
  Auth->>User: Display Login & Consent
  User->>Auth: Submit Credentials
  Auth->>App: Redirect with Authorization Code
  App->>Auth: POST /token (with code + code_verifier)
  Auth->>App: Validate & Return Access Token + Refresh Token
  App->>API: GET /v1/user/profile (Bearer token)
  API->>App: Return Protected Resource Data`,
  },
  {
    id: "database-schema",
    title: "Multi-Tenant SaaS Schema",
    category: "Database",
    description: "Entity relationship structure for tenant isolation and team role-based access.",
    code: `erDiagram
  TENANT ||--o{ USER : contains
  TENANT ||--o{ PROJECT : owns
  USER ||--o{ MEMBERSHIP : has
  PROJECT ||--o{ MEMBERSHIP : assigns
  PROJECT ||--o{ DIAGRAM : stores

  TENANT {
    string id PK
    string name
    string plan
    timestamp created_at
  }
  USER {
    string id PK
    string email
    string full_name
    timestamp last_login_at
  }
  PROJECT {
    string id PK
    string tenant_id FK
    string title
    string visibility
  }
  DIAGRAM {
    string id PK
    string project_id FK
    string canvas_data
    int version
  }`,
  },
  {
    id: "cicd-pipeline",
    title: "Zero-Downtime Deployment Pipeline",
    category: "Flowchart",
    description: "Automated lint, unit test, build container, and blue-green rollouts.",
    code: `flowchart TD
  Commit[Git Push main] --> CI[CI Runner]
  CI --> Lint[Lint & Typecheck]
  CI --> Test[Vitest Suite]
  Lint & Test --> Build[Turbopack Container Build]
  Build --> Stage[Preview Environment Deploy]
  Stage --> E2E[Automated Smoke Tests]
  E2E -->|Pass| BlueGreen[Canary Rollout]
  E2E -->|Fail| Alert[Notify Sentry & Team Slack]
  BlueGreen --> Active[100% Traffic Active]`,
  },
];

