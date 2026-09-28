import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge component", () => {
  it("renders badge text correctly", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeDefined();
  });

  it("applies variant classes", () => {
    render(<Badge variant="secondary">Active</Badge>);
    const badge = screen.getByText("Active");
    expect(badge.className).toContain("bg-secondary");
  });
});
