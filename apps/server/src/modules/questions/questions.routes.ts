import { Hono } from "hono";
import type { AppEnv } from "../../types";
import { QuestionsService } from "./questions.service";

export const questionsRoutes = new Hono<AppEnv>();

questionsRoutes.get("/", async (c) => {
  const db = c.get("db");
  const limitParam = c.req.query("limit");
  const limit = limitParam ? Math.min(Number(limitParam), 100) : 50;

  const questions = await QuestionsService.getPublicQuestions(db, limit);

  return c.json({
    success: true,
    data: questions,
  });
});

questionsRoutes.post("/", async (c) => {
  const db = c.get("db");
  const body = await c.req.json<{ question?: string; prompt?: string }>();

  if (!body.question || body.question.trim().length === 0) {
    return c.json(
      {
        success: false,
        error: "Question content is required",
      },
      400,
    );
  }

  if (body.question.length > 1000) {
    return c.json(
      {
        success: false,
        error: "Question exceeds maximum length of 1000 characters",
      },
      400,
    );
  }

  const userAgent = c.req.header("user-agent") || undefined;
  const clientIp = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";

  const question = await QuestionsService.createQuestion(db, {
    question: body.question,
    prompt: body.prompt,
    ipHash: clientIp,
    userAgent,
  });

  return c.json(
    {
      success: true,
      data: question,
    },
    201,
  );
});

questionsRoutes.post("/:id/like", async (c) => {
  const db = c.get("db");
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json(
      {
        success: false,
        error: "Invalid question ID",
      },
      400,
    );
  }

  const updated = await QuestionsService.likeQuestion(db, id);

  if (!updated) {
    return c.json(
      {
        success: false,
        error: "Question not found",
      },
      404,
    );
  }

  return c.json({
    success: true,
    data: updated,
  });
});
