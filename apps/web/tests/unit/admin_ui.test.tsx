import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { LoginForm } from "@/features/auth";
import {
  AdminSidebar,
  AdminQaView,
  ReplyDialog,
  DeleteDialog,
} from "@/features/admin";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { authClient } from "@/lib/auth_client";

const mockRefresh = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  usePathname: () => "/admin",
}));

vi.mock("@/lib/auth_client", () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
    signOut: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock("@/features/admin/services/admin_actions", () => ({
  adminAnswerQuestionAction: vi.fn().mockImplementation((id, answer) =>
    Promise.resolve({
      success: true,
      data: {
        id,
        question: "Are you available for freelance projects?",
        answer,
        answeredAt: new Date(),
        isArchived: false,
        likes: 2,
      },
    }),
  ),
  adminEditReplyAction: vi.fn().mockImplementation((id, answer) =>
    Promise.resolve({
      success: true,
      data: {
        id,
        question: "What is your main programming language?",
        answer,
        answeredAt: new Date(),
        isArchived: false,
        likes: 5,
      },
    }),
  ),
  adminDeleteQuestionAction: vi.fn().mockResolvedValue({ success: true }),
  adminDeleteReplyAction: vi.fn().mockResolvedValue({ success: true }),
  adminToggleArchiveAction: vi.fn().mockImplementation((id, isArchived) =>
    Promise.resolve({ success: true, isArchived }),
  ),
}));

describe("Admin & Auth UI Components", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("LoginForm Component", () => {
    it("renders email and password inputs and submit button", () => {
      render(<LoginForm />);

      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Sign In to Admin/i }),
      ).toBeInTheDocument();
    });

    it("displays error message when email is empty on submission", async () => {
      render(<LoginForm />);

      const submitBtn = screen.getByRole("button", {
        name: /Sign In to Admin/i,
      });
      fireEvent.click(submitBtn);

      expect(
        await screen.findByText(/Please enter your admin email address/i),
      ).toBeInTheDocument();
      expect(authClient.signIn.email).not.toHaveBeenCalled();
    });

    it("submits valid credentials through authClient.signIn.email", async () => {
      vi.mocked(authClient.signIn.email).mockResolvedValue({
        data: { user: { id: "1" }, session: { id: "s1" } },
      } as never);

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: "admin@zerochirou.com" },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "SecretPass123!" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /Sign In to Admin/i }),
      );

      await waitFor(() => {
        expect(authClient.signIn.email).toHaveBeenCalledWith({
          email: "admin@zerochirou.com",
          password: "SecretPass123!",
        });
      });
    });

    it("displays error when authClient returns authentication failure", async () => {
      vi.mocked(authClient.signIn.email).mockResolvedValue({
        error: { message: "Invalid email or password", status: 401 },
      } as never);

      render(<LoginForm />);

      fireEvent.change(screen.getByLabelText(/Email Address/i), {
        target: { value: "admin@zerochirou.com" },
      });
      fireEvent.change(screen.getByLabelText(/Password/i), {
        target: { value: "WrongPassword" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /Sign In to Admin/i }),
      );

      expect(
        await screen.findByText(/Invalid email or password/i),
      ).toBeInTheDocument();
    });
  });

  describe("AdminSidebar Component", () => {
    it("renders sidebar navigation links and user details", () => {
      render(
        <SidebarProvider>
          <AdminSidebar user={{ name: "Zerochirou", email: "admin@test.com" }} />
        </SidebarProvider>,
      );

      expect(screen.getByText("Q&A Inbox")).toBeInTheDocument();
      expect(screen.getByText("Public Q&A")).toBeInTheDocument();
      expect(screen.getByText("Portfolio Home")).toBeInTheDocument();
      expect(screen.getByText("Zerochirou")).toBeInTheDocument();
      expect(screen.getByText("admin@test.com")).toBeInTheDocument();
    });

    it("calls authClient.signOut when clicking sign out", async () => {
      render(
        <SidebarProvider>
          <AdminSidebar user={{ name: "Zerochirou", email: "admin@test.com" }} />
        </SidebarProvider>,
      );

      const userTrigger = screen.getByText("Zerochirou").closest("button");
      expect(userTrigger).toBeInTheDocument();
      if (userTrigger) {
        fireEvent.click(userTrigger);
      }

      const signOutBtn = await screen.findByText(/Sign Out/i);
      fireEvent.click(signOutBtn);

      await waitFor(() => {
        expect(authClient.signOut).toHaveBeenCalled();
      });
    });
  });

  describe("AdminQaView Component", () => {
    const mockQuestions = [
      {
        id: 1,
        question: "What is your main programming language?",
        answer: "TypeScript and Rust",
        prompt: "Ask me anything",
        isPublic: true,
        isArchived: false,
        likes: 5,
        ipHash: null,
        userAgent: null,
        answeredAt: new Date("2026-10-12"),
        createdAt: new Date("2026-10-11"),
      },
      {
        id: 2,
        question: "Are you available for freelance projects?",
        answer: null,
        prompt: null,
        isPublic: true,
        isArchived: false,
        likes: 2,
        ipHash: null,
        userAgent: null,
        answeredAt: null,
        createdAt: new Date("2026-10-12"),
      },
    ];

    it("renders questions and computed statistics", () => {
      render(<AdminQaView initialQuestions={mockQuestions} />);

      // Real statistics
      expect(screen.getByText("Total Inquiries")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument(); // total
      expect(screen.getByText("7")).toBeInTheDocument(); // 5 + 2 likes

      // Questions
      expect(
        screen.getByText("What is your main programming language?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Are you available for freelance projects?"),
      ).toBeInTheDocument();

      // Answer display
      expect(screen.getByText("TypeScript and Rust")).toBeInTheDocument();
    });

    it("filters questions when switching tabs", () => {
      render(<AdminQaView initialQuestions={mockQuestions} />);

      const unansweredTab = screen.getByRole("button", {
        name: /Unanswered \(1\)/i,
      });
      fireEvent.click(unansweredTab);

      expect(
        screen.getByText("Are you available for freelance projects?"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("What is your main programming language?"),
      ).not.toBeInTheDocument();
    });

    it("filters questions using the search bar", () => {
      render(<AdminQaView initialQuestions={mockQuestions} />);

      const searchInput = screen.getByPlaceholderText(
        /Search questions or answers/i,
      );
      fireEvent.change(searchInput, { target: { value: "freelance" } });

      expect(
        screen.getByText("Are you available for freelance projects?"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("What is your main programming language?"),
      ).not.toBeInTheDocument();
    });

    it("opens reply modal, submits answer, immediately updates UI, and calls router.refresh", async () => {
      render(<AdminQaView initialQuestions={mockQuestions} />);

      const replyBtn = screen.getByRole("button", {
        name: /^Reply$/i,
      });
      fireEvent.click(replyBtn);

      const textarea = await screen.findByPlaceholderText(
        /Write your thoughtful reply here/i,
      );
      fireEvent.change(textarea, { target: { value: "Yes, I am available!" } });

      const submitBtn = screen.getByRole("button", { name: /Send Reply/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
        expect(screen.getByText("Yes, I am available!")).toBeInTheDocument();
      });
    });

    it("deletes a question, immediately removes it from the UI, and calls router.refresh", async () => {
      render(<AdminQaView initialQuestions={mockQuestions} />);

      const deleteBtns = screen.getAllByRole("button", {
        name: /Delete Question/i,
      });
      fireEvent.click(deleteBtns[0]);

      const confirmBtn = await screen.findByRole("button", {
        name: "Delete Question",
      });
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
        expect(
          screen.queryByText("What is your main programming language?"),
        ).not.toBeInTheDocument();
      });
    });

    it("toggles archive status, updates state, and calls router.refresh", async () => {
      render(<AdminQaView initialQuestions={mockQuestions} />);

      const archiveBtns = screen.getAllByRole("button", {
        name: /Archive Question/i,
      });
      fireEvent.click(archiveBtns[0]);

      await waitFor(() => {
        expect(mockRefresh).toHaveBeenCalled();
      });
    });
  });

  describe("ReplyDialog Component", () => {
    it("renders dialog with question quote and form inputs", () => {
      const q = {
        id: 10,
        question: "How do you handle animations in React?",
        answer: null,
        prompt: null,
        isPublic: true,
        isArchived: false,
        likes: 0,
        ipHash: null,
        userAgent: null,
        answeredAt: null,
        createdAt: new Date(),
      };

      render(
        <ReplyDialog
          question={q}
          open={true}
          onOpenChange={vi.fn()}
        />,
      );

      expect(screen.getByText(/Reply to Question/i)).toBeInTheDocument();
      expect(
        screen.getByText(/How do you handle animations in React\?/i),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/Write your thoughtful reply here/i),
      ).toBeInTheDocument();
    });
  });

  describe("DeleteDialog Component", () => {
    it("renders confirmation modal with destructive action button", () => {
      render(
        <DeleteDialog
          open={true}
          onOpenChange={vi.fn()}
          title="Delete Question"
          description="Are you sure you want to permanently delete this question?"
          onConfirm={vi.fn().mockResolvedValue(undefined)}
        />,
      );

      expect(screen.getByText("Delete Question")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Are you sure you want to permanently delete this question?",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Delete" }),
      ).toBeInTheDocument();
    });
  });
});
