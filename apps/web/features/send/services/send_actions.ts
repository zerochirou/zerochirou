"use server";

import { revalidatePath } from "next/cache";
import {
  askAnonymousQuestion,
  likeQuestion,
  getPublicQuestions,
  type AnonymousQuestion,
} from "@/lib/db";
import type { SendQuestionInput, SendResult, LikeResult } from "../types";

export async function submitQuestionAction(
  input: SendQuestionInput,
): Promise<SendResult> {
  try {
    const trimmed = input.question?.trim();
    if (!trimmed) {
      return {
        success: false,
        error: "Pertanyaan tidak boleh kosong.",
      };
    }

    if (trimmed.length > 500) {
      return {
        success: false,
        error: "Pertanyaan melebihi batas 500 karakter.",
      };
    }

    const created: AnonymousQuestion = await askAnonymousQuestion({
      question: trimmed,
      prompt: input.prompt?.slice(0, 100),
    });

    try {
      revalidatePath("/send");
    } catch {
      // revalidatePath is ignored in non-Next.js request environments (such as unit tests)
    }

    return {
      success: true,
      question: created,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal mengirimkan pertanyaan.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function likeQuestionAction(id: number): Promise<LikeResult> {
  try {
    if (!id || id <= 0) {
      return {
        success: false,
        error: "ID pertanyaan tidak valid.",
      };
    }

    const updatedLikes = await likeQuestion(id);

    try {
      revalidatePath("/send");
    } catch {
      // revalidatePath is ignored in non-Next.js request environments (such as unit tests)
    }

    return {
      success: true,
      likes: updatedLikes,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal menyukai pertanyaan.";
    return {
      success: false,
      error: message,
    };
  }
}

export async function fetchPublicQuestionsAction(options?: {
  answeredOnly?: boolean;
  limit?: number;
}): Promise<AnonymousQuestion[]> {
  try {
    return await getPublicQuestions(options);
  } catch {
    return [];
  }
}
