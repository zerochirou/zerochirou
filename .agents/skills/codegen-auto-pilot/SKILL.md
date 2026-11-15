---
name: codegen-auto-pilot
description: Autonomous end-to-end engineering mode that runs the full /codegen pipeline from start to finish while dynamically detecting and loading relevant domain skills and MCP tools.
---

# /codegen-auto-pilot — Autonomous Adaptive Pipeline

Use this skill to execute a task from initial research to verified shipping with minimal manual steering, while adapting to any relevant skills or MCP tools available in the environment.

## 1. Detect & Load Correlated Skills
- Before planning, inspect available skills (`.agents/skills/` and installed global skills) and MCP servers.
- Match the task domain to relevant skills/tools (e.g., `better-auth` for auth, `shadcn` for UI, `next-dev-loop` for Next.js runtime checks, `codegen-memory` for persistent context).
- Read and follow the matched `SKILL.md` instructions alongside the core pipeline.

## 2. Run Full `/codegen` Pipeline
Execute every phase in order without skipping:
1. **`/recall`** — Pull user preferences, repo conventions, past decisions, and any active `/handoff` checkpoint from `codegen-memory`.
2. **`/architect`** — Clarify ambiguities/edge cases (only pause to ask the user if critical intent is genuinely ambiguous) and draft a concise blueprint.
3. **`/impact`** — Trace callers, dependents, tests, and breaking-change risks before editing.
4. **`/build`** — Implement modular, clean, zero-duplication code following repo conventions and any loaded domain skills.
5. **`/review`** — Self-audit the diff like a Staff Engineer and run real tests, linters, or builds.
6. **`/ship`** — Persist durable knowledge nodes (`node_type`, `links`, `tags`) to `codegen-memory`, remove temporary checkpoints, and deliver a verified summary.

## 3. Auto-Checkpoint
- Update the single active `checkpoint` node (`node_type="checkpoint"`, `tags=["checkpoint", "handoff", "<project>"]`) in-place at each phase transition so another agent can resume seamlessly if interrupted.
