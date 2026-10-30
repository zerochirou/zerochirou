import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SendCard } from "@/features/send/components/send_card";
import { SendFeed } from "@/features/send/components/send_feed";
import { SendView } from "@/features/send/components/send_view";
import {
  submitQuestionAction,
  likeQuestionAction,
  fetchPublicQuestionsAction,
} from "@/features/send/services/send_actions";
import type { QuestionItem } from "@/features/send/types";

vi.mock("@/features/send/services/send_actions", () => ({
  submitQuestionAction: vi.fn(),
  likeQuestionAction: vi.fn(),
  fetchPublicQuestionsAction: vi.fn(),
}));

describe("Send Feature UI Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("SendCard", () => {
    it("renders default prompt and textarea", () => {
      render(<SendCard />);

      expect(
        screen.getByText("Send me anonymous messages!"),
      ).toBeDefined();
      expect(
        screen.getByPlaceholderText(/Tulis pesan anonim kamu/i),
      ).toBeDefined();
      expect(screen.getByRole("button", { name: /kirim/i })).toBeDefined();
    });

    it("displays character count and updates on typing", () => {
      render(<SendCard />);

      expect(screen.getByText("0/300")).toBeDefined();

      const textarea = screen.getByPlaceholderText(/Tulis pesan anonim kamu/i);
      fireEvent.change(textarea, { target: { value: "Hello Zerochirou" } });

      expect(screen.getByText("16/300")).toBeDefined();
    });

    it("cycles prompts when shuffle button is clicked", () => {
      render(<SendCard />);

      const shuffleBtn = screen.getByRole("button", { name: /ganti prompt/i });
      fireEvent.click(shuffleBtn);

      // Prompt should change to the next preset
      expect(
        screen.queryByText("Send me anonymous messages!"),
      ).toBeNull();
    });

    it("prevents submitting empty or whitespace question", async () => {
      const handleSubmit = vi.fn();
      render(<SendCard onSubmit={handleSubmit} />);

      const submitBtn = screen.getByRole("button", { name: /kirim/i });
      fireEvent.click(submitBtn);

      expect(handleSubmit).not.toHaveBeenCalled();
      expect(
        screen.getByText(/Pesan tidak boleh kosong/i),
      ).toBeDefined();
    });

    it("calls onSubmit with question and prompt when valid", async () => {
      const handleSubmit = vi.fn().mockResolvedValue({ success: true });
      render(<SendCard onSubmit={handleSubmit} />);

      const textarea = screen.getByPlaceholderText(/Tulis pesan anonim kamu/i);
      fireEvent.change(textarea, { target: { value: "Semangat terus karyanya!" } });

      const submitBtn = screen.getByRole("button", { name: /kirim/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          question: "Semangat terus karyanya!",
          prompt: "Send me anonymous messages!",
        });
      });
    });

    it("renders loading spinner when submitting", () => {
      render(<SendCard isSubmitting={true} />);

      const submitBtn = screen.getByRole("button", { name: /mengirim/i });
      expect(submitBtn.hasAttribute("disabled")).toBe(true);
      expect(submitBtn.querySelector("[data-slot='spinner']")).toBeDefined();
    });

    it("displays success message and reset button after successful send", () => {
      render(<SendCard isSuccess={true} onReset={vi.fn()} />);

      expect(screen.getByText(/Pesan Terkirim/i)).toBeDefined();
      expect(
        screen.getByRole("button", { name: /kirim pesan lain/i }),
      ).toBeDefined();
    });
  });

  describe("SendFeed", () => {
    it("renders empty state when questions list is empty", () => {
      render(<SendFeed questions={[]} />);

      expect(
        screen.getByText(/Belum ada pertanyaan yang dijawab/i),
      ).toBeDefined();
    });

    it("renders list of answered questions with answer text and like button", () => {
      const mockQuestions: QuestionItem[] = [
        {
          id: 1,
          question: "Apa text editor favoritmu?",
          answer: "Neovim untuk efisiensi, VSCode saat pair programming.",
          prompt: "Ask me anything",
          isPublic: true,
          isArchived: false,
          likes: 4,
          ipHash: null,
          userAgent: null,
          answeredAt: new Date("2026-10-10"),
          createdAt: new Date("2026-10-09"),
        },
      ];

      const handleLike = vi.fn();
      render(<SendFeed questions={mockQuestions} onLike={handleLike} />);

      expect(screen.getByText("Apa text editor favoritmu?")).toBeDefined();
      expect(
        screen.getByText("Neovim untuk efisiensi, VSCode saat pair programming."),
      ).toBeDefined();
      expect(screen.getByText("4")).toBeDefined();

      const likeBtn = screen.getByRole("button", { name: /suka/i });
      fireEvent.click(likeBtn);

      expect(handleLike).toHaveBeenCalledWith(1);
    });
  });

  describe("SendView", () => {
    it("renders page header and navigation tabs", () => {
      render(<SendView />);

      expect(screen.getByText("Tanya Anonim")).toBeDefined();
      expect(
        screen.getByRole("button", { name: /^kirim pesan$/i }),
      ).toBeDefined();
      expect(
        screen.getByRole("button", { name: /q&a terjawab/i }),
      ).toBeDefined();
    });

    it("switches to feed view when clicking Q&A Terjawab tab", () => {
      const mockQuestions: QuestionItem[] = [
        {
          id: 1,
          question: "Apa proyek favoritmu?",
          answer: "Clickfor dan Devinion.",
          prompt: "Ask me anything",
          isPublic: true,
          isArchived: false,
          likes: 2,
          ipHash: null,
          userAgent: null,
          answeredAt: new Date("2026-10-10"),
          createdAt: new Date("2026-10-09"),
        },
      ];

      render(<SendView initialQuestions={mockQuestions} />);

      const feedTab = screen.getByRole("button", { name: /q&a terjawab/i });
      fireEvent.click(feedTab);

      expect(screen.getByText("Apa proyek favoritmu?")).toBeDefined();
      expect(screen.getByText("Clickfor dan Devinion.")).toBeDefined();
    });

    it("copies link when share button is clicked", async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      render(<SendView />);

      const shareBtn = screen.getByRole("button", { name: /bagikan tautan/i });
      fireEvent.click(shareBtn);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalled();
      });
    });

    it("submits question via submitQuestionAction and displays success state", async () => {
      vi.mocked(submitQuestionAction).mockResolvedValue({
        success: true,
      });

      render(<SendView />);

      const textarea = screen.getByPlaceholderText(/Tulis pesan anonim kamu/i);
      fireEvent.change(textarea, { target: { value: "Halo dari unit test!" } });

      const submitBtn = screen.getByRole("button", { name: /kirim pesan anonim/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(submitQuestionAction).toHaveBeenCalledWith({
          question: "Halo dari unit test!",
          prompt: "Send me anonymous messages!",
        });
        expect(screen.getByText(/Pesan Terkirim!/i)).toBeDefined();
      });

      // Test reset flow
      const resetBtn = screen.getByRole("button", { name: /kirim pesan lain/i });
      fireEvent.click(resetBtn);

      expect(screen.getByPlaceholderText(/Tulis pesan anonim kamu/i)).toBeDefined();
    });

    it("displays error when submitQuestionAction returns failure", async () => {
      vi.mocked(submitQuestionAction).mockResolvedValue({
        success: false,
        error: "Batas pengiriman terlampaui.",
      });

      render(<SendView />);

      const textarea = screen.getByPlaceholderText(/Tulis pesan anonim kamu/i);
      fireEvent.change(textarea, { target: { value: "Pertanyaan yang gagal" } });

      const submitBtn = screen.getByRole("button", { name: /kirim pesan anonim/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(screen.getByText("Batas pengiriman terlampaui.")).toBeDefined();
      });
    });

    it("optimistically increments like and updates when likeQuestionAction succeeds", async () => {
      const mockQuestions: QuestionItem[] = [
        {
          id: 5,
          question: "Berapa lama belajar React?",
          answer: "Sekitar 6 bulan intensif.",
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

      vi.mocked(likeQuestionAction).mockResolvedValue({
        success: true,
        likes: 4,
      });

      render(<SendView initialQuestions={mockQuestions} />);

      const feedTab = screen.getByRole("button", { name: /q&a terjawab/i });
      fireEvent.click(feedTab);

      expect(screen.getByText("3")).toBeDefined();

      const likeBtn = screen.getByRole("button", { name: /suka/i });
      fireEvent.click(likeBtn);

      await waitFor(() => {
        expect(likeQuestionAction).toHaveBeenCalledWith(5);
        expect(screen.getByText("4")).toBeDefined();
      });
    });

    it("rolls back optimistic like count when likeQuestionAction fails", async () => {
      const mockQuestions: QuestionItem[] = [
        {
          id: 7,
          question: "Bagaimana cara setup D1?",
          answer: "Pakai Drizzle ORM dan OpenNext.",
          prompt: "Ask me anything",
          isPublic: true,
          isArchived: false,
          likes: 10,
          ipHash: null,
          userAgent: null,
          answeredAt: new Date(),
          createdAt: new Date(),
        },
      ];

      vi.mocked(likeQuestionAction).mockResolvedValue({
        success: false,
        error: "Gagal menyimpan like",
      });

      render(<SendView initialQuestions={mockQuestions} />);

      const feedTab = screen.getByRole("button", { name: /q&a terjawab/i });
      fireEvent.click(feedTab);

      const likeBtn = screen.getByRole("button", { name: /suka/i });
      fireEvent.click(likeBtn);

      await waitFor(() => {
        expect(likeQuestionAction).toHaveBeenCalledWith(7);
        // Should rollback to original 10
        expect(screen.getByText("10")).toBeDefined();
      });
    });

    it("fetches fresh questions when switching to feed tab", async () => {
      const freshQuestions: QuestionItem[] = [
        {
          id: 99,
          question: "Pertanyaan terbaru dari server?",
          answer: "Sudah terjawab sekarang!",
          prompt: "Ask me anything",
          isPublic: true,
          isArchived: false,
          likes: 8,
          ipHash: null,
          userAgent: null,
          answeredAt: new Date(),
          createdAt: new Date(),
        },
      ];

      vi.mocked(fetchPublicQuestionsAction).mockResolvedValue(freshQuestions);

      render(<SendView initialQuestions={[]} />);

      const feedTab = screen.getByRole("button", { name: /q&a terjawab/i });
      fireEvent.click(feedTab);

      await waitFor(() => {
        expect(fetchPublicQuestionsAction).toHaveBeenCalledWith({
          answeredOnly: true,
          limit: 30,
        });
        expect(screen.getByText("Pertanyaan terbaru dari server?")).toBeDefined();
      });
    });
  });
});

