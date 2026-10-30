import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const anonymousQuestions = sqliteTable(
  "anonymous_questions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    question: text("question").notNull(),
    answer: text("answer"),
    prompt: text("prompt"),
    isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
    isArchived: integer("is_archived", { mode: "boolean" })
      .notNull()
      .default(false),
    likes: integer("likes").notNull().default(0),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    answeredAt: integer("answered_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => [
    index("anonymous_questions_created_at_idx").on(table.createdAt),
    index("anonymous_questions_public_idx").on(table.isPublic, table.createdAt),
  ],
);

export type AnonymousQuestion = typeof anonymousQuestions.$inferSelect;
export type NewAnonymousQuestion = typeof anonymousQuestions.$inferInsert;
