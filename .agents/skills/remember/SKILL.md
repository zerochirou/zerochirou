---
name: remember
description: Save a new preference, decision, or project context to codegen-memory without creating duplicates.
---

# /remember — Save to Codegen Memory

Use this skill when the user asks to remember something or when a durable preference, convention, or architectural decision should be persisted.

## Steps
1. **Search first**: Call `search_memory` on `codegen-memory` with a short query for the topic.
2. **Avoid duplicates**: If an identical or closely related memory already exists, update it in-place using `save_memory` with its `memory_id` instead of creating a new entry.
3. **Write atomically**: Store one clear, self-contained fact (1–5 sentences) including the **what** and **why**.
4. **Tag consistently**: Provide lowercase `tags` with the primary category first (`preference`, `architecture`, `workflow`, `bugfix`, `convention`, `context`).
5. **Never store secrets**: Do not save API keys, tokens, passwords, or `.env` values.
