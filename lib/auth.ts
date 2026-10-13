import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins/admin";
import { nextCookies } from "better-auth/next-js";
import { getDb, type AppDatabase } from "./db/client";
import * as schema from "./db/schema";
import { countSuperAdmins } from "./db/queries";

type ResolvedAdapter = ReturnType<ReturnType<typeof drizzleAdapter>>;

export function createAuthAdapter(
  getDatabase: () => Promise<AppDatabase> = getDb,
) {
  let cachedInstance: ResolvedAdapter | null = null;

  async function resolveAdapter(options: unknown): Promise<ResolvedAdapter> {
    if (!cachedInstance) {
      const db = await getDatabase();
      const factory = drizzleAdapter(db, {
        provider: "sqlite",
        schema,
      });
      cachedInstance = factory(options as Parameters<typeof factory>[0]);
    }
    return cachedInstance;
  }

  return (options: unknown) => ({
    id: "drizzle-sqlite",
    async create(args: Parameters<ResolvedAdapter["create"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.create(args);
    },
    async update(args: Parameters<ResolvedAdapter["update"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.update(args);
    },
    async updateMany(args: Parameters<ResolvedAdapter["updateMany"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.updateMany(args);
    },
    async findOne(args: Parameters<ResolvedAdapter["findOne"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.findOne(args);
    },
    async findMany(args: Parameters<ResolvedAdapter["findMany"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.findMany(args);
    },
    async delete(args: Parameters<ResolvedAdapter["delete"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.delete(args);
    },
    async deleteMany(args: Parameters<ResolvedAdapter["deleteMany"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.deleteMany(args);
    },
    async count(args: Parameters<ResolvedAdapter["count"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.count(args);
    },
    async consumeOne(args: Parameters<ResolvedAdapter["consumeOne"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.consumeOne(args);
    },
    async incrementOne(args: Parameters<ResolvedAdapter["incrementOne"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.incrementOne(args);
    },
    async transaction(cb: Parameters<ResolvedAdapter["transaction"]>[0]) {
      const adapter = await resolveAdapter(options);
      return adapter.transaction(cb);
    },
  });
}

export const auth = betterAuth({
  appName: "Zerochirou Admin",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "zerochirou-portfolio-auth-secret-change-in-production-min-32-chars",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: createAuthAdapter(getDb),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  databaseHooks: {
    user: {
      create: {
        before: async (newUser) => {
          // Rule: Only 1 super admin can exist in this portfolio system!
          if (newUser.role === "admin") {
            const adminCount = await countSuperAdmins();
            if (adminCount >= 1) {
              throw new Error("Only 1 super admin is allowed in this system.");
            }
          }
          return { data: newUser };
        },
      },
    },
  },
  plugins: [
    admin(),
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
