---
name: codegen
description: Ultimate end-to-end engineering mode orchestrating /recall, /architect, /impact, /build, /review, and /ship.
---

# /codegen — Ultimate Engineering Mode

Activate this skill to run the full, disciplined, memory-backed engineering pipeline. Execute the modular skills in order—do not skip phases on non-trivial tasks:

1. **`/recall`** — Search `codegen-memory` (`search_memory`) for user preferences, repo conventions, past decisions, and any active `/handoff` checkpoint. If an active checkpoint exists, resume directly from its recorded phase instead of restarting.
2. **`/architect`** — Clarify ambiguities/edge cases and draft a concise blueprint (target files, interfaces, trade-offs, verification plan).
3. **`/impact`** — Analyze the plan's impact on existing code, callers, tests, and breaking-change risks before editing.
4. **`/build`** — Implement modular, clean, zero-duplication code following repo conventions.
5. **`/review`** — Self-audit the diff like a Staff Engineer and run real tests, linters, or builds.
6. **`/ship`** — Persist durable decisions/bugfixes to `codegen-memory` (via `/remember`, no secrets) and deliver a verified summary.

## Auto-Checkpoint (Efficient Cross-Agent Continuity)
- Do **not** save a checkpoint on trivial Q&A turns.
- Automatically update the single active checkpoint (`node_type="checkpoint"`, `tags=["checkpoint", "handoff", "<project>"]`, reusing its `memory_id` in-place) **at every phase transition** (`architect` → `impact` → `build` → `review`) so another agent can always resume mid-task without manual `/handoff`.
- Delete the temporary checkpoint in `/ship` once the task is complete.

## Non-Negotiables
- **No AI slop**: no generic filler, no speculative abstractions, no unverified claims.
- **No secrets in memory**: never store API keys, tokens, passwords, or `.env` values.
- **Evidence over assumption**: always verify file paths, symbol names, and command outputs directly.
