---
name: forget
description: Find and delete obsolete, incorrect, or unwanted memories from codegen-memory.
---

# /forget — Delete from Codegen Memory

Use this skill when the user asks to forget, remove, or clean up stored context in `codegen-memory`.

## Steps
1. **Locate targets**: Call `search_memory` on `codegen-memory` using the user's description or topic.
2. **Verify match**: Check the returned IDs and content. If multiple unrelated memories appear, narrow down to only the matching ID(s).
3. **Delete**: Call `delete_memory` with the exact `memory_id` for each target entry.
4. **Report**: Confirm to the user which memory ID(s) and summary were deleted.
