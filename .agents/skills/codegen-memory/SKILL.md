---
name: codegen-memory
description: Best practices for saving, searching, updating, and organizing AI context in the codegen-memory MCP server (ChromaDB) so retrieval and the Session Context TUI stay clean, accurate, and token-efficient.
---

# Codegen Memory Optimization Skill

Use the `codegen-memory` MCP tools (`save_memory`, `search_memory`, `delete_memory`) intentionally so stored memories remain high-signal, easy to retrieve semantically, and well-organized in the `Session Context` TUI.

## 1. Search Before Saving (Avoid Duplicates)
- Before calling `save_memory` for a preference, architectural decision, or project convention, call `search_memory` with a concise semantic query.
- If a closely related memory already exists:
  - **Update it in-place** by passing its `memory_id` to `save_memory`.
  - **Delete obsolete entries** with `delete_memory` when a decision is reversed.

## 2. Write Atomic Knowledge Nodes
- Store **one clear topic per node** (e.g., one entity, one preference, one architectural decision, or one bugfix) instead of dumping an entire conversation.
- Set `node_type` (e.g., `entity`, `architecture`, `workflow`, `preference`, `bugfix`, `checkpoint`) and optionally `links` (related `memory_id`s) so nodes form a clean knowledge graph.
- Include the **what** and the **why** in plain, searchable language so semantic search matches future queries even with different phrasing.
- Keep entries concise (typically 1–5 sentences or a short bullet list) to keep token usage low.

## 3. Use Consistent Tags (Drives TUI Grouping)
- Always provide `tags` as a list of short, lowercase keywords (e.g. `["preference", "language"]`, `["architecture", "tui"]`, `["bugfix", "chroma"]`).
- Put the **primary category first** (e.g., `preference`, `architecture`, `workflow`, `bugfix`, `convention`, `context`), because the `Session Context` tab in `MemoryTUI` groups token usage by the first tag.

## 4. What to Save vs. What to Skip
- **Save**:
  - Explicit user preferences (language, coding style, UI/UX tastes, tool choices).
  - Project-specific conventions, commands, and non-obvious architecture decisions.
  - Root causes and fixes for tricky bugs that could recur.
- **Never save**:
  - Secrets, API keys, tokens, passwords, or `.env` values.
  - Ephemeral status updates ("running tests now") or raw command outputs.
