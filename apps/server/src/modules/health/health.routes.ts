import { Hono } from "hono";
import { sql } from "drizzle-orm";
import type { AppEnv } from "../../types";

export const healthRoutes = new Hono<AppEnv>();

healthRoutes.get("/", async (c) => {
  const db = c.get("db");
  let dbStatus = "unknown";

  try {
    // Quick test query to verify Cloudflare D1 connectivity
    await db.run(sql`SELECT 1`);
    dbStatus = "connected";
  } catch (err) {
    dbStatus = `disconnected (${(err as Error).message})`;
  }

  return c.json({
    status: "ok",
    service: "zerochirou-server",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    environment: c.env.ENVIRONMENT || "production",
  });
});
