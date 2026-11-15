---
name: architect
description: Clarify ambiguities and edge cases, then design a concise technical blueprint (files, interfaces, trade-offs, verification plan) before implementation.
---

# /architect — Clarify & Architect

Use this skill before coding to eliminate assumptions, surface edge cases, and design a clear technical blueprint.

## Steps
1. **Clarify & challenge**: Identify unclear requirements, implicit assumptions, failure modes, and boundary inputs. Ask focused questions if critical intent is unclear—never silently guess.
2. **Locate targets**: Search for relevant files, symbols, and existing patterns first.
3. **Draft blueprint**:
   - **Scope**: Exact files/modules to create or modify.
   - **Design**: Data flow, interfaces, and key trade-offs.
   - **Verification**: Exact tests or commands that will prove correctness.
4. **Keep it minimal**: Prefer reusing existing helpers and patterns over introducing new abstractions.
