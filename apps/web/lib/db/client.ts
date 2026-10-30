import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export type AppDatabase = DrizzleD1Database<typeof schema>;

// D1 operates over HTTP/Worker IPC without persistent TCP connections,
// so instantiating Drizzle per binding resolution has negligible overhead.
export function createDb(d1: D1Database): AppDatabase {
  return drizzle(d1, { schema });
}

// Cached platform proxy for local development
let devBindingPromise: Promise<D1Database | undefined> | null = null;

async function getDevD1Binding(): Promise<D1Database | undefined> {
  if (
    typeof window !== "undefined" ||
    process.env.NODE_ENV === "test" ||
    process.env.VITEST
  ) {
    return undefined;
  }

  if (!devBindingPromise) {
    devBindingPromise = (async () => {
      try {
        // Obfuscate module name so Turbopack/Webpack does not attempt to trace or bundle wrangler CLI assets
        const wranglerPkg = `${"__wrangler".replaceAll("_", "")}`;
        const { getPlatformProxy } = await import(/* webpackIgnore: true */ wranglerPkg);
        const path = await import("path");
        const proxy = await getPlatformProxy({
          configPath: path.resolve(process.cwd(), "wrangler.jsonc"),
        });
        return proxy.env.zerochirou_db as unknown as D1Database;
      } catch (err) {
        console.warn("Wrangler dev platform proxy initialization error:", err);
        return undefined;
      }
    })();
  }

  return devBindingPromise;
}

// Accepts an optional D1 instance at the seam to allow dependency injection
// in tests without mocking runtime module imports.
export async function getDb(d1?: D1Database): Promise<AppDatabase> {
  if (d1) {
    return createDb(d1);
  }

  // 1. Primary: Cloudflare Workers production / OpenNext environment
  try {
    const context = await getCloudflareContext({ async: true });
    if (context?.env?.zerochirou_db) {
      return createDb(context.env.zerochirou_db);
    }
  } catch {
    // Falls through to development proxy in local Node.js environment
  }

  // 2. Fallback: Local dev (next dev) via Wrangler platform proxy.
  // Because wrangler.jsonc specifies "remote": true, this connects directly to Cloudflare D1 remote.
  try {
    const devDb = await getDevD1Binding();
    if (devDb) {
      return createDb(devDb);
    }
  } catch (err) {
    console.warn("Dev D1 binding error:", err);
  }

  throw new Error(
    "Cloudflare D1 database unavailable: D1 binding 'zerochirou_db' was not found in Cloudflare environment context.",
  );
}
