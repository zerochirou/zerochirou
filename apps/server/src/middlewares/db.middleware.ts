import { createMiddleware } from "hono/factory";
import { createDb } from "../db";
import type { AppEnv } from "../types";

export const dbMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  if (!c.get("db")) {
    if (!c.env.DB) {
      return c.json(
        {
          success: false,
          error: "Database binding 'DB' is missing in Cloudflare environment",
        },
        500,
      );
    }
    c.set("db", createDb(c.env.DB));
  }
  await next();
});
