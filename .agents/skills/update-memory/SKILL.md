---
name: update-memory
description: Update an existing memory in codegen-memory in-place by its memory_id.
---

# /update-memory — Update Existing Codegen Memory

Use this skill when a user preference, convention, or project decision has changed and an existing memory needs to be revised.

## Steps
1. **Find the existing memory**: Call `search_memory` on `codegen-memory` to locate the relevant `memory_id`.
2. **Update in-place**: Call `save_memory` with `memory_id` set to the existing ID, revised `content`, and updated `tags` (keeping the primary category tag first).
3. **If not found**: Inform the user or create a new memory if they intended to add one.
4. **Confirm**: Report the updated `memory_id` and a brief summary of the change.
