import { describe, it, expect, vi } from "vitest";
import {
  createDb,
  getDb,
  askAnonymousQuestion,
  getPublicQuestions,
  getInboxQuestions,
  answerQuestion,
  likeQuestion,
  archiveQuestion,
  deleteQuestion,
  anonymousQuestions,
} from "@/lib/db";

function createMockD1(rawRows: unknown[][] = []): D1Database {
  const statement: D1PreparedStatement = {
    bind: vi.fn().mockReturnThis(),
    all: vi.fn().mockResolvedValue({
      results: [],
      success: true,
      meta: {},
    }),
    first: vi.fn().mockResolvedValue(null),
    run: vi.fn().mockResolvedValue({
      success: true,
      meta: { changes: 1, last_row_id: 1 },
    }),
    raw: vi.fn().mockResolvedValue(rawRows),
  };

  return {
    prepare: vi.fn().mockReturnValue(statement),
    dump: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    batch: vi.fn().mockResolvedValue([]),
    exec: vi.fn().mockResolvedValue({ count: 1, duration: 0 }),
  } as unknown as D1Database;
}

describe("Database Module (Drizzle + Cloudflare D1)", () => {
  describe("Schema Definitions", () => {
    it("defines anonymous_questions table with expected columns", () => {
      expect(anonymousQuestions.id).toBeDefined();
      expect(anonymousQuestions.question).toBeDefined();
      expect(anonymousQuestions.answer).toBeDefined();
      expect(anonymousQuestions.prompt).toBeDefined();
      expect(anonymousQuestions.isPublic).toBeDefined();
      expect(anonymousQuestions.isArchived).toBeDefined();
      expect(anonymousQuestions.likes).toBeDefined();
      expect(anonymousQuestions.ipHash).toBeDefined();
      expect(anonymousQuestions.userAgent).toBeDefined();
      expect(anonymousQuestions.answeredAt).toBeDefined();
      expect(anonymousQuestions.createdAt).toBeDefined();
    });
  });

  describe("Client & Seam (createDb / getDb)", () => {
    it("creates a drizzle client instance from D1Database adapter", () => {
      const mockD1 = createMockD1();
      const db = createDb(mockD1);
      expect(db).toBeDefined();
      expect(db.query).toBeDefined();
    });

    it("uses explicitly injected D1 database when passed to getDb", async () => {
      const mockD1 = createMockD1();
      const db = await getDb(mockD1);
      expect(db).toBeDefined();
    });

    it("throws helpful error when Cloudflare context lacks zerochirou_db", async () => {
      await expect(getDb()).rejects.toThrow(
        /Cloudflare D1 database unavailable/
      );
    });
  });

  describe("Q&A Domain Queries", () => {
    it("creates an anonymous question", async () => {
      const row = [
        1,
        "What is your stack?",
        null,
        "Ask me anything",
        1,
        0,
        0,
        "hash123",
        "Mozilla/5.0",
        null,
        1710000000000,
      ];
      const mockD1 = createMockD1([row]);
      const db = createDb(mockD1);

      const created = await askAnonymousQuestion(
        {
          question: "  What is your stack?  ",
          prompt: "Ask me anything",
        },
        db,
      );

      expect(created.id).toBe(1);
      expect(created.question).toBe("What is your stack?");
      expect(mockD1.prepare).toHaveBeenCalled();
    });

    it("rejects empty anonymous question", async () => {
      const mockD1 = createMockD1([]);
      const db = createDb(mockD1);

      await expect(
        askAnonymousQuestion({ question: "   " }, db),
      ).rejects.toThrow(/Question content cannot be empty/);
    });

    it("fetches public questions with optional answered filter", async () => {
      const row = [
        1,
        "Favorite editor?",
        "Neovim / VSCode",
        null,
        1,
        0,
        3,
        null,
        null,
        1710000050000,
        1710000000000,
      ];
      const mockD1 = createMockD1([row]);
      const db = createDb(mockD1);

      const list = await getPublicQuestions({ answeredOnly: true }, db);
      expect(list).toHaveLength(1);
      expect(list[0].answer).toBe("Neovim / VSCode");
      expect(mockD1.prepare).toHaveBeenCalled();
    });

    it("fetches inbox questions for review", async () => {
      const row = [
        2,
        "Unanswered question",
        null,
        null,
        1,
        0,
        0,
        null,
        null,
        null,
        1710000000000,
      ];
      const mockD1 = createMockD1([row]);
      const db = createDb(mockD1);

      const inbox = await getInboxQuestions({ limit: 10 }, db);
      expect(inbox).toHaveLength(1);
      expect(inbox[0].question).toBe("Unanswered question");
    });

    it("answers an anonymous question", async () => {
      const updatedRow = [
        1,
        "Favorite editor?",
        "Neovim",
        null,
        1,
        0,
        0,
        null,
        null,
        1710000050000,
        1710000000000,
      ];
      const mockD1 = createMockD1([updatedRow]);
      const db = createDb(mockD1);

      const updated = await answerQuestion(1, "  Neovim  ", db);
      expect(updated).toBeDefined();
      expect(updated?.answer).toBe("Neovim");
      expect(mockD1.prepare).toHaveBeenCalled();
    });

    it("likes a question and returns incremented like count", async () => {
      const mockD1 = createMockD1([[7]]);
      const db = createDb(mockD1);

      const likes = await likeQuestion(1, db);
      expect(likes).toBe(7);
      expect(mockD1.prepare).toHaveBeenCalled();
    });

    it("archives a question", async () => {
      const mockD1 = createMockD1([]);
      const db = createDb(mockD1);

      await expect(archiveQuestion(1, true, db)).resolves.toBeUndefined();
      expect(mockD1.prepare).toHaveBeenCalled();
    });

    it("deletes a question by id", async () => {
      const mockD1 = createMockD1([[1]]);
      const db = createDb(mockD1);

      const deleted = await deleteQuestion(1, db);
      expect(deleted).toBe(true);
      expect(mockD1.prepare).toHaveBeenCalled();
    });
  });
});
