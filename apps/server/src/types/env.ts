import type { Database } from "../db";

export type Bindings = {
  DB: D1Database;
  ENVIRONMENT?: string;
  CORS_ORIGIN?: string;
};

export type Variables = {
  db: Database;
};

export type AppEnv = {
  Bindings: Bindings;
  Variables: Variables;
};
