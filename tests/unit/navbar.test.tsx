import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/features/commons/navbar";

describe("Navbar component", () => {
  it("renders brand title/subtitle and primary navigation items", () => {
    render(<Navbar subtitle="Portfolio" />);

    expect(screen.getByLabelText("Zerochirou Homepage")).toBeDefined();
    expect(screen.getByText("Portfolio")).toBeDefined();
    expect(screen.getByText("Blog")).toBeDefined();
    expect(screen.getByText("Learn Journey")).toBeDefined();
    expect(screen.getByText("Human")).toBeDefined();
    expect(screen.getByText("Radio")).toBeDefined();
    expect(screen.getByText("Zeromind")).toBeDefined();
  });

  it("renders with custom subtitle", () => {
    render(<Navbar subtitle="Engineering & Design" />);
    expect(screen.getByText("Engineering & Design")).toBeDefined();
  });
});
