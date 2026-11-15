---
name: handoff
description: Save or resume an active workflow checkpoint in codegen-memory so another agent can continue mid-task without starting over.
---

# /handoff — Cross-Agent Checkpoint & Resume

Use this skill when pausing work, switching agents/models, or hitting context limits so the next agent can resume at the exact same phase.

## Saving a Checkpoint (Before Switching)
1. **Search for an existing checkpoint**: Call `search_memory` on `codegen-memory` with `query: "checkpoint handoff <project>"`.
2. **Save/update in-place**: Call `save_memory` (passing `memory_id` if an active checkpoint already exists for this task) with tags `["checkpoint", "handoff", "<project>"]` and a concise structured summary:
   - **Goal**: What is being built/fixed.
   - **Current Phase**: Exact `/codegen` phase (e.g., `architect`, `impact`, `build`, `review`).
   - **Completed**: Files created/edited and verified so far.
   - **Remaining**: Exact next steps / TODOs.
   - **Key Decisions**: Constraints or trade-offs already agreed upon.

## Resuming from a Checkpoint (New Agent)
1. Call `search_memory` on `codegen-memory` with `query: "checkpoint handoff"`.
2. Load the active checkpoint, skip already-completed phases, and continue directly from **Current Phase** / **Remaining**.
3. Once the task finishes (`/ship`), delete the temporary checkpoint with `delete_memory` so `codegen-memory` stays clean.
