"use server";

import { revalidatePath } from "next/cache";
import {
  answerQuestion,
  archiveQuestion,
  deleteQuestion,
  deleteReply,
  editReply,
} from "@/lib/db/queries";
import { type AppDatabase } from "@/lib/db/client";
import { getServerSession } from "@/lib/auth_guard";

export interface AdminActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

async function verifyAdminAuth(): Promise<void> {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Unauthorized: Admin privileges required.");
  }
}

export async function adminAnswerQuestionAction(
  questionId: number,
  answerText: string,
  options?: { db?: AppDatabase; skipAuthCheck?: boolean },
): Promise<AdminActionResult> {
  try {
    if (!options?.skipAuthCheck) {
      await verifyAdminAuth();
    }

    const trimmed = answerText.trim();
    if (!trimmed) {
      return { success: false, error: "Answer content cannot be empty." };
    }

    const updated = await answerQuestion(questionId, trimmed, options?.db);
    if (!updated) {
      return { success: false, error: "Question not found." };
    }

    try {
      revalidatePath("/admin");
      revalidatePath("/send");
    } catch {
      // In test runner or non-request context, ignore revalidatePath
    }

    return { success: true, data: updated };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save answer.",
    };
  }
}

export async function adminEditReplyAction(
  questionId: number,
  answerText: string,
  options?: { db?: AppDatabase; skipAuthCheck?: boolean },
): Promise<AdminActionResult> {
  try {
    if (!options?.skipAuthCheck) {
      await verifyAdminAuth();
    }

    const trimmed = answerText.trim();
    if (!trimmed) {
      return { success: false, error: "Reply content cannot be empty." };
    }

    const updated = await editReply(questionId, trimmed, options?.db);
    if (!updated) {
      return { success: false, error: "Question not found." };
    }

    try {
      revalidatePath("/admin");
      revalidatePath("/send");
    } catch {
      // Ignore in non-request test contexts
    }

    return { success: true, data: updated };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update reply.",
    };
  }
}

export async function adminDeleteReplyAction(
  questionId: number,
  options?: { db?: AppDatabase; skipAuthCheck?: boolean },
): Promise<AdminActionResult> {
  try {
    if (!options?.skipAuthCheck) {
      await verifyAdminAuth();
    }

    const updated = await deleteReply(questionId, options?.db);
    if (!updated) {
      return { success: false, error: "Question not found." };
    }

    try {
      revalidatePath("/admin");
      revalidatePath("/send");
    } catch {
      // Ignore in non-request test contexts
    }

    return { success: true, data: updated };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete reply.",
    };
  }
}

export async function adminDeleteQuestionAction(
  questionId: number,
  options?: { db?: AppDatabase; skipAuthCheck?: boolean },
): Promise<AdminActionResult> {
  try {
    if (!options?.skipAuthCheck) {
      await verifyAdminAuth();
    }

    const deleted = await deleteQuestion(questionId, options?.db);
    if (!deleted) {
      return { success: false, error: "Question could not be deleted." };
    }

    try {
      revalidatePath("/admin");
      revalidatePath("/send");
    } catch {
      // Ignore in non-request test contexts
    }

    return { success: true, data: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete question.",
    };
  }
}

export async function adminToggleArchiveAction(
  questionId: number,
  isArchived: boolean,
  options?: { db?: AppDatabase; skipAuthCheck?: boolean },
): Promise<AdminActionResult> {
  try {
    if (!options?.skipAuthCheck) {
      await verifyAdminAuth();
    }

    await archiveQuestion(questionId, isArchived, options?.db);

    try {
      revalidatePath("/admin");
      revalidatePath("/send");
    } catch {
      // Ignore in non-request test contexts
    }

    return { success: true, data: isArchived };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to toggle archive status.",
    };
  }
}
