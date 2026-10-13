import type { AnonymousQuestion } from "@/lib/db";

export type QuestionItem = AnonymousQuestion;

export interface SendQuestionInput {
  question: string;
  prompt?: string;
}

export interface SendResult {
  success: boolean;
  error?: string;
  question?: QuestionItem;
}

export interface LikeResult {
  success: boolean;
  likes?: number;
  error?: string;
}
