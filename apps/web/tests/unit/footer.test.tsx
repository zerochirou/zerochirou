import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MinimalFooter } from "@/features/commons/footer";

describe("MinimalFooter component", () => {
  it("renders navigation and brand copy", () => {
    render(<MinimalFooter />);
    expect(screen.getByText("A developer who works differently.")).toBeDefined();
    expect(screen.getByText("Navigation")).toBeDefined();
    expect(screen.getByText("Social")).toBeDefined();
  });
});
