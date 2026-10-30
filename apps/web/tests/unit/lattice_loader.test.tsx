import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LatticeLoader } from "@/components/ui/lattice_loader";

describe("LatticeLoader component", () => {
  it("renders with working status and accessible announcement", () => {
    render(<LatticeLoader label="Analyzing" status="working" />);
    expect(screen.getByText("Analyzing, in progress")).toBeDefined();
  });

  it("renders with done status and custom labels", () => {
    render(
      <LatticeLoader
        status="done"
        doneLabel="Completed in"
        elapsed={2.5}
        showTimer
      />
    );
    expect(screen.getByText(/Completed in 2.5 seconds/)).toBeDefined();
  });

  it("renders 4x4 grid without errors", () => {
    const { container } = render(
      <LatticeLoader grid={4} pattern="spin" status="working" />
    );
    const root = container.querySelector('[data-slot="lattice-loader"]');
    expect(root).toBeDefined();
    expect(root?.getAttribute("data-status")).toBe("working");
  });
});

