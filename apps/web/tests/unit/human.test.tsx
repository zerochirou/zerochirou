import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  HumanHero,
  RatioBreakdown,
  ManifestoContent,
  CraftComparison,
  HumanSeal,
} from "@/features/human/components";

describe("Human Feature Components", () => {
  it("renders HumanHero with 90/10 ratio headline", () => {
    render(<HumanHero />);
    expect(screen.getByText(/90% Human Hands, 10% AI/i)).toBeDefined();
  });

  it("renders RatioBreakdown transparent sections", () => {
    render(<RatioBreakdown />);
    expect(screen.getByText(/PROCESS TRANSPARENCY/i)).toBeDefined();
    expect(screen.getByText(/Human Mind & Hand/i)).toBeDefined();
    expect(screen.getAllByText(/Artificial Intelligence/i).length).toBeGreaterThan(0);
  });

  it("renders ManifestoContent essay sections", () => {
    render(<ManifestoContent />);
    expect(screen.getByText(/Infinite Context Still Lacks Consciousness/i)).toBeDefined();
    expect(screen.getByText(/The Risk of Vibe-Coding/i)).toBeDefined();
    expect(screen.getByText(/Full Consciousness of the Human Behind the Screen/i)).toBeDefined();
  });

  it("renders CraftComparison matrix", () => {
    render(<CraftComparison />);
    expect(screen.getByText(/Vibe-Coding vs. Intentional Craftsmanship/i)).toBeDefined();
    expect(screen.getAllByText(/Vibe-Coding Approach/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Intentional Craftsman/i).length).toBeGreaterThan(0);
  });

  it("renders HumanSeal verification section", () => {
    render(<HumanSeal />);
    expect(screen.getByText(/Built with Heart and Consciousness/i)).toBeDefined();
    expect(screen.getByText(/Explore Portfolio Projects/i)).toBeDefined();
  });
});
