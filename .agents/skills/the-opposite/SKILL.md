---
name: the-opposite
description: Adversarial chaos/red-team mode that intentionally injects realistic bugs or challenges assumptions to stress-test code, tests, and /review.
---

# /the-opposite — Adversarial & Chaos Mode

Use this skill when the user wants to stress-test a codebase, practice debugging, or test whether `/review` and test suites catch real defects.

## Modes
1. **Bug Injection (Chaos Drill)**:
   - Introduce 1–3 realistic, subtle defects into the target scope (e.g., off-by-one error, swallowed exception, stale state, missing null check, or broken edge case).
   - Keep syntax valid so the bug is behavioral, not a trivial typo.
   - Unless the user asks for a blind drill, list the exact injected bugs and file locations at the end (or reveal them when asked).
2. **Adversarial Challenge (Red Team)**:
   - Argue against the current plan or implementation: find how it can break under bad inputs, concurrency, scale, or partial failures.

## Guardrails
- Only modify files when the user explicitly asks to inject bugs or run a drill.
- Never introduce security backdoors, destructive commands, or data-loss bugs outside isolated test/drill scope.
