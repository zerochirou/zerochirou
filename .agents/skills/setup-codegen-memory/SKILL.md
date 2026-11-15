---
name: setup-codegen-memory
description: Set up and verify the codegen-memory MCP server, ChromaDB storage, environment variables, and MemoryTUI.
---

# /setup-codegen-memory — Setup Codegen Memory

Use this skill when setting up `codegen-memory` in a new environment or troubleshooting its MCP server and TUI.

## Steps
1. **Install `codegen` CLI (Go)**:
   - Run `go install github.com/zerochirou/codegen/cmd/codegen@latest` (or `./scripts/setup.sh` from the repository root).
2. **Initialize workspace or global config**:
   - Run `codegen init` in the workspace for per-project ChromaDB (`<project>/chroma_data`), or choose Global for `~/.codegen/chroma_data`.
3. **Register MCP server**:
   - Ensure the client's MCP config (`~/.gemini/config/mcp_config.json`, `.agents/plugins/codegen-memory/mcp_config.json`, or `.gemini/mcp_config.json`) runs `codegen run`.
4. **Verify**:
   - Run `go test ./...` in the `codegen` repo to confirm ChromaDB, MCP, init wizard, CLI, and TUI tests pass.
   - Launch `codegen tui` (per-project) or `codegen tui --global` (global) to inspect stored context.
