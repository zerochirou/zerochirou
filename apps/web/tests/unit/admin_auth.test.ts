import { describe, it, expect, vi, beforeEach } from "vitest";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import {
  createOrUpdateSuperAdmin,
  countSuperAdmins,
} from "@/lib/db/queries";
import { type AppDatabase } from "@/lib/db/client";
import { getServerSession, requireAdminSession } from "@/lib/auth_guard";
import * as authModule from "@/lib/auth";
import * as nextNavigation from "next/navigation";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

describe("Admin Authentication & Super Admin Single-Admin Enforcement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Password Hashing & Verification (Better Auth Crypto)", () => {
    it("hashes password and verifies successfully with valid credentials", async () => {
      const plainPassword = "SuperAdminSecret2026!";
      const hash = await hashPassword(plainPassword);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe("string");
      expect(hash).not.toBe(plainPassword);

      const isValid = await verifyPassword({
        password: plainPassword,
        hash,
      });
      expect(isValid).toBe(true);

      const isInvalid = await verifyPassword({
        password: "WrongPassword!",
        hash,
      });
      expect(isInvalid).toBe(false);
    });
  });

  describe("Single Super Admin Database Invariants", () => {
    it("creates a new super admin when none exists", async () => {
      const mockUser = {
        id: "u-123",
        name: "Zerochirou",
        email: "admin@zerochirou.com",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "admin",
        banned: null,
        banReason: null,
        banExpires: null,
      };

      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([]), // no existing admin
            }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          values: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUser]),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await createOrUpdateSuperAdmin(
        {
          email: "admin@zerochirou.com",
          name: "Zerochirou",
          passwordHash: "mockHash",
        },
        mockDb,
      );

      expect(result.isNew).toBe(true);
      expect(result.user.email).toBe("admin@zerochirou.com");
      expect(result.user.role).toBe("admin");
      expect((mockDb as unknown as { insert: ReturnType<typeof vi.fn> }).insert).toHaveBeenCalledTimes(2); // user and account
    });

    it("prevents creating a second super admin when one already exists without force", async () => {
      const existingAdmin = {
        id: "u-existing",
        name: "Existing Admin",
        email: "primary@zerochirou.com",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "admin",
        banned: null,
        banReason: null,
        banExpires: null,
      };

      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue([existingAdmin]),
            }),
          }),
        }),
      } as unknown as AppDatabase;

      await expect(
        createOrUpdateSuperAdmin(
          {
            email: "second@zerochirou.com",
            name: "Second Admin",
            passwordHash: "anotherHash",
            force: false,
          },
          mockDb,
        ),
      ).rejects.toThrow(/Super admin already exists with email/);
    });

    it("updates existing super admin credentials when force/update is true", async () => {
      const existingAdmin = {
        id: "u-existing",
        name: "Old Name",
        email: "old@zerochirou.com",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        role: "admin",
        banned: null,
        banReason: null,
        banExpires: null,
      };

      const updatedAdmin = {
        ...existingAdmin,
        name: "Updated Admin",
        email: "new@zerochirou.com",
      };

      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValueOnce([existingAdmin]) // getSuperAdmin
                .mockResolvedValueOnce([{ id: "acc-1" }]), // existing account
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([updatedAdmin]),
            }),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await createOrUpdateSuperAdmin(
        {
          email: "new@zerochirou.com",
          name: "Updated Admin",
          passwordHash: "newPasswordHash",
          force: true,
        },
        mockDb,
      );

      expect(result.isNew).toBe(false);
      expect(result.user.name).toBe("Updated Admin");
      expect(result.user.email).toBe("new@zerochirou.com");
      expect((mockDb as unknown as { update: ReturnType<typeof vi.fn> }).update).toHaveBeenCalled();
    });

    it("counts super admins accurately", async () => {
      const mockDb = {
        select: vi.fn().mockReturnValue({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue([{ count: 1 }]),
          }),
        }),
      } as unknown as AppDatabase;

      const count = await countSuperAdmins(mockDb);
      expect(count).toBe(1);
    });
  });

  describe("Server Session & Admin Guard (auth_guard.ts)", () => {
    it("returns null session when getSession throws or is empty", async () => {
      vi.spyOn(authModule.auth.api, "getSession").mockRejectedValue(
        new Error("No session"),
      );

      const session = await getServerSession();
      expect(session).toBeNull();
    });

    it("redirects unauthenticated users to /login", async () => {
      vi.spyOn(authModule.auth.api, "getSession").mockResolvedValue(null as never);

      await requireAdminSession();
      expect(nextNavigation.redirect).toHaveBeenCalledWith("/login");
    });

    it("redirects users with non-admin role to /login", async () => {
      vi.spyOn(authModule.auth.api, "getSession").mockResolvedValue({
        user: { id: "u-1", email: "user@example.com", role: "user" },
        session: { id: "s-1", token: "tok" },
      } as never);

      await requireAdminSession();
      expect(nextNavigation.redirect).toHaveBeenCalledWith("/login");
    });

    it("allows access and returns session for authenticated super admin", async () => {
      const adminSession = {
        user: { id: "u-admin", email: "admin@zerochirou.com", role: "admin" },
        session: { id: "s-1", token: "tok" },
      };
      vi.spyOn(authModule.auth.api, "getSession").mockResolvedValue(
        adminSession as never,
      );

      const session = await requireAdminSession();
      expect(session).toEqual(adminSession);
      expect(nextNavigation.redirect).not.toHaveBeenCalled();
    });
  });
});
