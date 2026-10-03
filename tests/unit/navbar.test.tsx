import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "@/features/commons/navbar";

describe("Navbar component", () => {
  it("renders brand title/subtitle and primary navigation items", () => {
    render(<Navbar subtitle="Portfolio" />);

    expect(screen.getByLabelText("Zerochirou Homepage")).toBeDefined();
    expect(screen.getByText("Portfolio")).toBeDefined();
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("About")).toBeDefined();
    expect(screen.getByText("Stack")).toBeDefined();
    expect(screen.getByText("Projects")).toBeDefined();
  });

  it("renders with custom subtitle", () => {
    render(<Navbar subtitle="Engineering & Design" />);
    expect(screen.getByText("Engineering & Design")).toBeDefined();
  });
});
