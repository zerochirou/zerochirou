import { Hono } from "hono";
import type { AppEnv } from "../types";
import { healthRoutes } from "./health";
import { questionsRoutes } from "./questions";

export const routes = new Hono<AppEnv>();

routes.route("/health", healthRoutes);
routes.route("/api/questions", questionsRoutes);

export * from "./health";
export * from "./questions";
