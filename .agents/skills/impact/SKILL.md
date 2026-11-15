---
name: impact
description: Analyze the impact of a completed architectural plan on existing code, dependents, tests, and runtime behavior before editing.
---

# /impact — Impact Analysis

Use this skill right after `/architect` (and before `/build`) to evaluate how the planned changes affect the existing codebase.

## Steps
1. **Trace dependents**: Search for all callers, imports, subclasses, configs, and tests referencing the symbols or files in the plan.
2. **Check breaking changes**: Identify signature changes, schema/data-format shifts, or behavioral changes that could break existing callers or stored data.
3. **Assess blast radius**: Note affected tests, CLI/TUI flows, MCP tools, or external integrations.
4. **Mitigate**: Adjust the plan or add compatibility/migration steps if high-risk side effects are found before writing code.
