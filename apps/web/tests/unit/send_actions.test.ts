import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  submitQuestionAction,
  likeQuestionAction,
  fetchPublicQuestionsAction,
} from "@/features/send/services/send_actions";
import * as db from "@/lib/db";

vi.mock("@/lib/db", async () => {
  const actual = await vi.importActual<typeof import("@/lib/db")>("@/lib/db");
  return {
    ...actual,
    askAnonymousQuestion: vi.fn(),
    likeQuestion: vi.fn(),
    getPublicQuestions: vi.fn(),
  };
});

describe("Send Feature Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitQuestionAction", () => {
    it("returns error when question is empty or only whitespace", async () => {
      const res = await submitQuestionAction({
        question: "   ",
        prompt: "Ask me anything",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Pertanyaan tidak boleh kosong.");
      expect(db.askAnonymousQuestion).not.toHaveBeenCalled();
    });

    it("returns error when question exceeds 500 characters", async () => {
      const longQuestion = "a".repeat(501);
      const res = await submitQuestionAction({
        question: longQuestion,
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Pertanyaan melebihi batas 500 karakter.");
      expect(db.askAnonymousQuestion).not.toHaveBeenCalled();
    });

    it("successfully creates a question and returns success", async () => {
      const mockCreated = {
        id: 42,
        question: "Boleh tanya tech stack?",
        answer: null,
        prompt: "Ask me anything",
        isPublic: true,
        isArchived: false,
        likes: 0,
        ipHash: null,
        userAgent: null,
        answeredAt: null,
        createdAt: new Date("2026-10-13"),
      };

      vi.mocked(db.askAnonymousQuestion).mockResolvedValue(mockCreated);

      const res = await submitQuestionAction({
        question: "  Boleh tanya tech stack?  ",
        prompt: "Ask me anything",
      });

      expect(res.success).toBe(true);
      expect(res.question).toEqual(mockCreated);
      expect(db.askAnonymousQuestion).toHaveBeenCalledWith({
        question: "Boleh tanya tech stack?",
        prompt: "Ask me anything",
      });
    });

    it("handles database errors gracefully and returns error message", async () => {
      vi.mocked(db.askAnonymousQuestion).mockRejectedValue(
        new Error("Database connection timeout"),
      );

      const res = await submitQuestionAction({
        question: "Kenapa error?",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Database connection timeout");
    });
  });

  describe("likeQuestionAction", () => {
    it("returns error when question id is invalid or <= 0", async () => {
      const res = await likeQuestionAction(0);

      expect(res.success).toBe(false);
      expect(res.error).toBe("ID pertanyaan tidak valid.");
      expect(db.likeQuestion).not.toHaveBeenCalled();
    });

    it("increments likes and returns updated like count", async () => {
      vi.mocked(db.likeQuestion).mockResolvedValue(7);

      const res = await likeQuestionAction(10);

      expect(res.success).toBe(true);
      expect(res.likes).toBe(7);
      expect(db.likeQuestion).toHaveBeenCalledWith(10);
    });

    it("handles database errors gracefully when liking", async () => {
      vi.mocked(db.likeQuestion).mockRejectedValue(
        new Error("Record not found"),
      );

      const res = await likeQuestionAction(999);

      expect(res.success).toBe(false);
      expect(res.error).toBe("Record not found");
    });
  });

  describe("fetchPublicQuestionsAction", () => {
    it("fetches public answered questions", async () => {
      const mockList = [
        {
          id: 1,
          question: "Apa kabar?",
          answer: "Baik!",
          prompt: "Ask me anything",
          isPublic: true,
          isArchived: false,
          likes: 3,
          ipHash: null,
          userAgent: null,
          answeredAt: new Date(),
          createdAt: new Date(),
        },
      ];

      vi.mocked(db.getPublicQuestions).mockResolvedValue(mockList);

      const result = await fetchPublicQuestionsAction({ answeredOnly: true });

      expect(result).toEqual(mockList);
      expect(db.getPublicQuestions).toHaveBeenCalledWith({ answeredOnly: true });
    });

    it("returns empty array on error without crashing", async () => {
      vi.mocked(db.getPublicQuestions).mockRejectedValue(new Error("D1 offline"));

      const result = await fetchPublicQuestionsAction();

      expect(result).toEqual([]);
    });
  });
});
