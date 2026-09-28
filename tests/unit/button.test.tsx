import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button component", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined();
  });

  it("applies variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button", { name: "Outline" });
    expect(btn.className).toContain("border-border");
  });
});
