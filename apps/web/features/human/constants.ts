import type { ComparisonRow } from "./types";

export const CRAFT_COMPARISONS: readonly ComparisonRow[] = [
  {
    aspect: "Code Philosophy",
    vibeCoding: "Accepting any output that appears to run without reading or understanding the underlying logic.",
    intentionalCraft: "Writing and dissecting every line of code with a deep grasp of its architecture and lifecycle.",
  },
  {
    aspect: "Design & UI/UX Decisions",
    vibeCoding: "Relying on generic template layouts, harsh gradients, and uniform visual clichés.",
    intentionalCraft: "Weighing every pixel increment, contrast ratio, corner curve, and typographic scale for real visual comfort.",
  },
  {
    aspect: "Performance & Memory Discipline",
    vibeCoding: "Stacking unvetted dependencies, ignoring memory leaks in animation loops and event listeners.",
    intentionalCraft: "Ensuring zero-cost abstractions, strict unmount disposal routines, and efficient asset delivery.",
  },
  {
    aspect: "Relationship with Clients & Users",
    vibeCoding: "Chasing personal speed shortcuts with zero concern for long-term maintenance burdens on the client.",
    intentionalCraft: "Working with genuine empathy, respecting client time, and honoring the human on the other side of the glass.",
  },
];
