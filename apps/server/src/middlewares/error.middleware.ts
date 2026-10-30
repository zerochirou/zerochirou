import type { ErrorHandler, NotFoundHandler } from "hono";
import type { AppEnv } from "../types";

export const errorHandler: ErrorHandler<AppEnv> = (err, c) => {
  console.error(`[Server Error] ${c.req.method} ${c.req.url}:`, err);

  const status = "status" in err && typeof err.status === "number" ? err.status : 500;
  return c.json(
    {
      success: false,
      error: err.message || "Internal Server Error",
      ...(c.env.ENVIRONMENT === "development" ? { stack: err.stack } : {}),
    },
    status as any,
  );
};

export const notFoundHandler: NotFoundHandler<AppEnv> = (c) => {
  return c.json(
    {
      success: false,
      error: `Route not found: ${c.req.method} ${c.req.path}`,
    },
    404,
  );
};
