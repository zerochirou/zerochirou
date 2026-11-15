---
name: recall
description: Search and retrieve stored preferences, decisions, or project context from codegen-memory.
---

# /recall — Recall from Codegen Memory

Use this skill when the user asks to remember, recall, or look up previously saved preferences, conventions, architectural decisions, or project context.

## Steps
1. **Formulate a semantic query**: Extract the core topic or keywords from the user's request into a concise `query` string.
2. **Search memory**: Call `search_memory` on `codegen-memory` (default `n_results=5`, or increase to `10` for broad topics).
3. **Refine if needed**: If the initial results are too narrow or miss expected context, run a follow-up `search_memory` with alternative keywords or broader terms.
4. **Present clearly**: Summarize the relevant memories found (including their `id`, `tags`, and key details) in the user's preferred language. If nothing relevant is found, state that clearly without guessing.
