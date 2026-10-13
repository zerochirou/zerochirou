import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { getDb, type AppDatabase } from "./client";
import {
  anonymousQuestions,
  user,
  account,
  type AnonymousQuestion,
  type NewAnonymousQuestion,
  type User,
} from "./schema";

export async function askAnonymousQuestion(
  data: Pick<NewAnonymousQuestion, "question" | "prompt" | "ipHash" | "userAgent">,
  db?: AppDatabase,
): Promise<AnonymousQuestion> {
  const client = db ?? (await getDb());
  const trimmed = data.question.trim();

  if (!trimmed) {
    throw new Error("Question content cannot be empty.");
  }

  const [created] = await client
    .insert(anonymousQuestions)
    .values({
      ...data,
      question: trimmed,
    })
    .returning();

  return created;
}

export async function getPublicQuestions(
  options: { limit?: number; offset?: number; answeredOnly?: boolean } = {},
  db?: AppDatabase,
): Promise<AnonymousQuestion[]> {
  const client = db ?? (await getDb());
  const limit = options.limit ?? 30;
  const offset = options.offset ?? 0;

  const conditions = [
    eq(anonymousQuestions.isPublic, true),
    eq(anonymousQuestions.isArchived, false),
  ];

  if (options.answeredOnly) {
    conditions.push(isNotNull(anonymousQuestions.answer));
  }

  return client
    .select()
    .from(anonymousQuestions)
    .where(and(...conditions))
    .orderBy(desc(anonymousQuestions.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getInboxQuestions(
  options: { includeArchived?: boolean; limit?: number; offset?: number } = {},
  db?: AppDatabase,
): Promise<AnonymousQuestion[]> {
  const client = db ?? (await getDb());
  const limit = options.limit ?? 50;
  const offset = options.offset ?? 0;

  const query = client
    .select()
    .from(anonymousQuestions)
    .orderBy(desc(anonymousQuestions.createdAt))
    .limit(limit)
    .offset(offset);

  if (!options.includeArchived) {
    return query.where(eq(anonymousQuestions.isArchived, false));
  }

  return query;
}

export async function answerQuestion(
  id: number,
  answerText: string,
  db?: AppDatabase,
): Promise<AnonymousQuestion | undefined> {
  const client = db ?? (await getDb());
  const [updated] = await client
    .update(anonymousQuestions)
    .set({
      answer: answerText.trim(),
      answeredAt: new Date(),
    })
    .where(eq(anonymousQuestions.id, id))
    .returning();

  return updated;
}

export async function likeQuestion(
  id: number,
  db?: AppDatabase,
): Promise<number> {
  const client = db ?? (await getDb());
  const [updated] = await client
    .update(anonymousQuestions)
    .set({
      likes: sql`${anonymousQuestions.likes} + 1`,
    })
    .where(eq(anonymousQuestions.id, id))
    .returning({ likes: anonymousQuestions.likes });

  return updated?.likes ?? 0;
}

export async function archiveQuestion(
  id: number,
  isArchived: boolean = true,
  db?: AppDatabase,
): Promise<void> {
  const client = db ?? (await getDb());
  await client
    .update(anonymousQuestions)
    .set({ isArchived })
    .where(eq(anonymousQuestions.id, id));
}

export async function deleteQuestion(
  id: number,
  db?: AppDatabase,
): Promise<boolean> {
  const client = db ?? (await getDb());
  const deleted = await client
    .delete(anonymousQuestions)
    .where(eq(anonymousQuestions.id, id))
    .returning({ id: anonymousQuestions.id });

  return deleted.length > 0;
}

export async function editReply(
  id: number,
  answerText: string,
  db?: AppDatabase,
): Promise<AnonymousQuestion | undefined> {
  return answerQuestion(id, answerText, db);
}

export async function deleteReply(
  id: number,
  db?: AppDatabase,
): Promise<AnonymousQuestion | undefined> {
  const client = db ?? (await getDb());
  const [updated] = await client
    .update(anonymousQuestions)
    .set({
      answer: null,
      answeredAt: null,
    })
    .where(eq(anonymousQuestions.id, id))
    .returning();

  return updated;
}

export async function getSuperAdmin(
  db?: AppDatabase,
): Promise<User | undefined> {
  const client = db ?? (await getDb());
  const [found] = await client
    .select()
    .from(user)
    .where(eq(user.role, "admin"))
    .limit(1);

  return found;
}

export async function countSuperAdmins(
  db?: AppDatabase,
): Promise<number> {
  const client = db ?? (await getDb());
  const result = await client
    .select({ count: sql<number>`count(*)` })
    .from(user)
    .where(eq(user.role, "admin"));

  return Number(result[0]?.count ?? 0);
}

export async function createOrUpdateSuperAdmin(
  data: {
    email: string;
    name: string;
    passwordHash: string;
    force?: boolean;
  },
  db?: AppDatabase,
): Promise<{ user: User; isNew: boolean }> {
  const client = db ?? (await getDb());
  const existing = await getSuperAdmin(client);

  const now = new Date();

  if (existing) {
    if (!data.force) {
      throw new Error(
        `Super admin already exists with email: "${existing.email}". Only 1 super admin is allowed in this system. Use --force or --update to update credentials.`,
      );
    }

    const [updatedUser] = await client
      .update(user)
      .set({
        name: data.name,
        email: data.email,
        updatedAt: now,
      })
      .where(eq(user.id, existing.id))
      .returning();

    // Check if credential account exists for this user
    const [existingAccount] = await client
      .select()
      .from(account)
      .where(and(eq(account.userId, existing.id), eq(account.providerId, "credential")))
      .limit(1);

    if (existingAccount) {
      await client
        .update(account)
        .set({
          password: data.passwordHash,
          updatedAt: now,
        })
        .where(eq(account.id, existingAccount.id));
    } else {
      await client.insert(account).values({
        id: crypto.randomUUID(),
        accountId: existing.id,
        providerId: "credential",
        userId: existing.id,
        password: data.passwordHash,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { user: updatedUser, isNew: false };
  }

  const userId = crypto.randomUUID();
  const [newUser] = await client
    .insert(user)
    .values({
      id: userId,
      name: data.name,
      email: data.email,
      emailVerified: true,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  await client.insert(account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: data.passwordHash,
    createdAt: now,
    updatedAt: now,
  });

  return { user: newUser, isNew: true };
}

