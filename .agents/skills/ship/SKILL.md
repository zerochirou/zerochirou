---
name: ship
description: Persist durable decisions to codegen-memory and deliver a verified, concise summary.
---

# /ship — Persist & Ship

Use this skill at the end of a task to persist durable knowledge and present the final result.

## Steps
1. **Persist durable knowledge**: If a new architectural decision, convention, or non-obvious bugfix emerged, save it via `/remember` (`save_memory` on `codegen-memory`, searching first to avoid duplicates; primary category tag first; never store secrets).
2. **Deliver summary**: Present the final changes concisely with clickable `file://` links and observed verification results.
