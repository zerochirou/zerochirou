import { eq, desc, and, sql } from "drizzle-orm";
import type { Database } from "../../db";
import { anonymousQuestions, type NewAnonymousQuestion } from "../../db/schema";

export class QuestionsService {
  static async getPublicQuestions(db: Database, limit = 50) {
    return db
      .select()
      .from(anonymousQuestions)
      .where(
        and(
          eq(anonymousQuestions.isPublic, true),
          eq(anonymousQuestions.isArchived, false),
        ),
      )
      .orderBy(desc(anonymousQuestions.createdAt))
      .limit(limit);
  }

  static async createQuestion(
    db: Database,
    data: Pick<NewAnonymousQuestion, "question" | "prompt" | "ipHash" | "userAgent">,
  ) {
    const [created] = await db
      .insert(anonymousQuestions)
      .values({
        question: data.question.trim(),
        prompt: data.prompt,
        ipHash: data.ipHash,
        userAgent: data.userAgent,
      })
      .returning();

    return created;
  }

  static async likeQuestion(db: Database, id: number) {
    const [updated] = await db
      .update(anonymousQuestions)
      .set({
        likes: sql`${anonymousQuestions.likes} + 1`,
      })
      .where(eq(anonymousQuestions.id, id))
      .returning();

    return updated;
  }
}
