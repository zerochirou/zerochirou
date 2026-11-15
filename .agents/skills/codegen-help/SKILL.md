---
name: codegen-help
description: Quick reference guide for all /codegen skills, workflow phases, and memory commands.
---

# /codegen-help — Command & Skill Reference

Present this concise reference when the user asks what `/codegen` can do or which skill to use.

## 1. End-to-End Autonomous Pipelines
- **`/codegen <task>`** — Full structured pipeline (`recall` → `architect` → `impact` → `build` → `review` → `ship`).
- **`/codegen-auto-pilot <task>`** — Autonomous `/codegen` pipeline that dynamically detects and loads other relevant domain skills and MCP tools.

## 2. Single-Phase Engineering Skills
- **`/recall <topic>`** — Search `codegen-memory` for preferences, past decisions, and project context.
- **`/architect <task>`** — Clarify ambiguities/edge cases and draft a technical blueprint.
- **`/impact`** — Analyze blast radius of the plan on existing code, callers, and tests before editing.
- **`/build`** — Implement modular, clean, zero-duplication code.
- **`/review`** — Self-audit diff like a Staff Engineer and run real tests, linters, or builds.
- **`/ship`** — Persist durable decisions to `codegen-memory` and deliver a verified summary.

## 3. Memory Management
- **`/remember <info>`** — Save an atomic knowledge node (`node_type`, `links`, `tags`) without duplicates.
- **`/update-memory`** — Update an existing memory node in-place by `memory_id`.
- **`/forget`** — Find and delete obsolete or incorrect memory nodes.
- **`/codegen-memory`** — Guidelines for tagging, sizing, and organizing memory nodes for clean retrieval and `Session Context` TUI display.

## 4. Handoff, Setup, & Stress Testing
- **`/handoff`** — Save or resume an active workflow checkpoint when switching agents or sessions.
- **`/codegen-setup`** — Set up and verify the full `codegen` ecosystem (Go CLI, MCP, ChromaDB, skills, TUI).
- **`/setup-codegen-memory`** — Troubleshoot `codegen-memory` MCP server, ChromaDB path scoping, and MemoryTUI.
- **`/the-opposite`** — Adversarial red-team mode to challenge assumptions or stress-test tests and `/review`.
