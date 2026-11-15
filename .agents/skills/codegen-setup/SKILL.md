---
name: codegen-setup
description: Set up and verify the codegen ecosystem (codegen Go CLI, codegen-memory MCP server, ChromaDB storage, skills, and MemoryTUI).
---

# /codegen-setup — Setup & Health Check

Use this skill to initialize or verify the `codegen` environment on a machine or workspace.

## Steps
1. **Verify `codegen` CLI**: Check that `codegen --version` works (built with Go or installed via `go install github.com/zerochirou/codegen/cmd/codegen@latest`).
2. **Verify Workspace / Global Initialization**: Run `codegen init` in the project (or check `.codegen/config.json`, `.gemini/mcp_config.json`, and `~/.gemini/config/mcp_config.json`).
3. **Verify MCP Server (`codegen-memory`)**: Confirm `codegen-memory` (`codegen run`) is registered and `save_memory`, `search_memory`, and `delete_memory` are callable.
4. **Verify ChromaDB Storage**: Confirm the per-project `<project>/chroma_data` (or global `~/.codegen/chroma_data`) directory exists and is inspectable via `codegen tui` / `codegen tui --global`.
5. **Verify Skills**: Confirm `.agents/skills/` contains the core workflow skills (`/codegen`, `/recall`, `/architect`, `/impact`, `/build`, `/review`, `/ship`, `/handoff`).
6. **Report Status**: Output a concise pass/fail checklist and exact next steps if anything is missing.
