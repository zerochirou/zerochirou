import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  adminAnswerQuestionAction,
  adminEditReplyAction,
  adminDeleteReplyAction,
  adminDeleteQuestionAction,
  adminToggleArchiveAction,
} from "@/features/admin/services/admin_actions";
import { type AppDatabase } from "@/lib/db/client";
import * as authGuard from "@/lib/auth_guard";

vi.mock("@/lib/auth_guard", () => ({
  getServerSession: vi.fn(),
  requireAdminSession: vi.fn(),
}));

describe("Admin Q&A Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockAdminSession = {
    user: { id: "u-admin", email: "admin@zerochirou.com", role: "admin" },
    session: { id: "s-1", token: "token123" },
  };

  describe("Authorization Checks", () => {
    it("rejects actions when caller is unauthenticated", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(null);

      const result = await adminAnswerQuestionAction(1, "Answer content");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Admin privileges required/);
    });

    it("rejects actions when caller has non-admin role", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue({
        user: { id: "u-user", email: "regular@example.com", role: "user" },
        session: { id: "s-2", token: "tok" },
      } as never);

      const result = await adminDeleteQuestionAction(1);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Admin privileges required/);
    });
  });

  describe("adminAnswerQuestionAction", () => {
    it("rejects empty or whitespace-only answer", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const result = await adminAnswerQuestionAction(1, "    ");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Answer content cannot be empty.");
    });

    it("successfully answers a question and returns updated record", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const updatedRow = {
        id: 1,
        question: "Favorite framework?",
        answer: "Next.js + React 19",
        prompt: null,
        isPublic: true,
        isArchived: false,
        likes: 0,
        ipHash: null,
        userAgent: null,
        answeredAt: new Date(),
        createdAt: new Date(),
      };

      const mockDb = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([updatedRow]),
            }),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await adminAnswerQuestionAction(
        1,
        "  Next.js + React 19  ",
        { db: mockDb },
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedRow);
      expect((mockDb as unknown as { update: ReturnType<typeof vi.fn> }).update).toHaveBeenCalled();
    });

    it("returns error when question ID does not exist", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const mockDb = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([]),
            }),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await adminAnswerQuestionAction(999, "Answer", {
        db: mockDb,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Question not found.");
    });
  });

  describe("adminEditReplyAction", () => {
    it("updates existing reply content", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const updatedRow = {
        id: 2,
        question: "Editor?",
        answer: "Neovim only",
        answeredAt: new Date(),
      };

      const mockDb = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([updatedRow]),
            }),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await adminEditReplyAction(2, "Neovim only", {
        db: mockDb,
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedRow);
    });

    it("rejects empty edit reply content", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const result = await adminEditReplyAction(2, "   ");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Reply content cannot be empty.");
    });
  });

  describe("adminDeleteReplyAction", () => {
    it("clears answer and answeredAt returning question to unanswered state", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const updatedRow = {
        id: 3,
        question: "Some question",
        answer: null,
        answeredAt: null,
      };

      const mockDb = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              returning: vi.fn().mockResolvedValue([updatedRow]),
            }),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await adminDeleteReplyAction(3, { db: mockDb });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedRow);
      expect((mockDb as unknown as { update: ReturnType<typeof vi.fn> }).update).toHaveBeenCalled();
    });
  });

  describe("adminDeleteQuestionAction", () => {
    it("deletes question completely from database", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const mockDb = {
        delete: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([{ id: 4 }]),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await adminDeleteQuestionAction(4, { db: mockDb });

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect((mockDb as unknown as { delete: ReturnType<typeof vi.fn> }).delete).toHaveBeenCalled();
    });

    it("returns error when question does not exist for deletion", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const mockDb = {
        delete: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await adminDeleteQuestionAction(404, { db: mockDb });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Question could not be deleted.");
    });
  });

  describe("adminToggleArchiveAction", () => {
    it("updates archive status and returns success", async () => {
      vi.mocked(authGuard.getServerSession).mockResolvedValue(
        mockAdminSession as never,
      );

      const mockDb = {
        update: vi.fn().mockReturnValue({
          set: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
          }),
        }),
      } as unknown as AppDatabase;

      const result = await adminToggleArchiveAction(5, true, { db: mockDb });

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect((mockDb as unknown as { update: ReturnType<typeof vi.fn> }).update).toHaveBeenCalled();
    });
  });
});
