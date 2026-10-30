import { cors } from "hono/cors";
import type { MiddlewareHandler } from "hono";
import type { AppEnv } from "../types";

export const corsMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const customOrigin = c.env.CORS_ORIGIN;
  const corsHandler = cors({
    origin: (origin) => {
      if (!origin) return "*";
      if (customOrigin && customOrigin.split(",").includes(origin)) {
        return origin;
      }
      // Allow localhost and local network development
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".zerochirou.com") ||
        origin === "https://zerochirou.com"
      ) {
        return origin;
      }
      return customOrigin || origin;
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 86400,
    credentials: true,
  });

  return corsHandler(c, next);
};
