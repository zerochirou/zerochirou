import { hashPassword } from "better-auth/crypto";
import { getDb } from "../lib/db/client";
import { createOrUpdateSuperAdmin, getSuperAdmin } from "../lib/db/queries";

async function main() {
  const args = process.argv.slice(2);
  const isForce = args.includes("--force") || args.includes("--update");
  const filteredArgs = args.filter(
    (arg) => arg !== "--force" && arg !== "--update",
  );

  const email =
    filteredArgs[0] || process.env.SUPER_ADMIN_EMAIL || process.env.ADMIN_EMAIL;
  const password =
    filteredArgs[1] ||
    process.env.SUPER_ADMIN_PASSWORD ||
    process.env.ADMIN_PASSWORD;
  const name =
    filteredArgs[2] ||
    process.env.SUPER_ADMIN_NAME ||
    process.env.ADMIN_NAME ||
    "Super Admin";

  if (!email || !password) {
    console.log(`
Usage:
  pnpm tsx scripts/create_super_admin.ts <email> <password> [name] [--force]

Examples:
  pnpm tsx scripts/create_super_admin.ts admin@example.com MyStrongPassword123! "Zerochirou Admin"
  pnpm tsx scripts/create_super_admin.ts admin@example.com NewPassword123! --force

Options:
  --force, --update   Overwrite and update existing super admin credentials.
`);
    process.exit(1);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error(`❌ Invalid email format: "${email}"`);
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters long.");
    process.exit(1);
  }

  try {
    const db = await getDb();
    const existing = await getSuperAdmin(db);

    if (existing && !isForce) {
      console.warn(
        `⚠️  Super admin already exists with email: "${existing.email}" (ID: ${existing.id}).`,
      );
      console.warn(
        "   Only 1 super admin is allowed in this system.",
      );
      console.warn(
        "   To update existing super admin credentials, re-run with --force or --update.",
      );
      process.exit(1);
    }

    const passwordHash = await hashPassword(password);
    const result = await createOrUpdateSuperAdmin(
      {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        passwordHash,
        force: isForce,
      },
      db,
    );

    if (result.isNew) {
      console.log("✅ Super admin created successfully!");
    } else {
      console.log("✅ Super admin credentials updated successfully!");
    }

    console.log(`   Email: ${result.user.email}`);
    console.log(`   Name:  ${result.user.name}`);
    console.log(`   Role:  ${result.user.role}`);
    console.log(`   ID:    ${result.user.id}`);
    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Failed to configure super admin:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

main();
