import { Hono } from "hono";
import { logger } from "hono/logger";
import type { AppEnv } from "./types";
import {
  corsMiddleware,
  dbMiddleware,
  errorHandler,
  notFoundHandler,
} from "./middlewares";
import { routes } from "./modules";

const app = new Hono<AppEnv>();

// Global Middlewares
app.use("*", logger());
app.use("*", corsMiddleware);
app.use("*", dbMiddleware);

// Root informational endpoint
app.get("/", (c) => {
  return c.json({
    service: "zerochirou-api",
    version: "1.0.0",
    docs: "/health",
    message: "Zerochirou Edge API Gateway v1.0 powered by Hono, Drizzle ORM, Cloudflare D1 & Workers",
  });
});

// Mount domain routes
app.route("/", routes);

// Global Error & Not Found Handlers
app.notFound(notFoundHandler);
app.onError(errorHandler);

export default app;
