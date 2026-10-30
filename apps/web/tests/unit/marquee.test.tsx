import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Marquee } from "@/components/ui/marquee";

describe("Marquee component", () => {
  it("renders children across repeated instances", () => {
    render(<Marquee repeat={3}><span>Marquee Item</span></Marquee>);
    const items = screen.getAllByText("Marquee Item");
    expect(items.length).toBe(3);
  });

  it("applies vertical modifier class when vertical is true", () => {
    const { container } = render(
      <Marquee vertical>
        <span>Vertical Item</span>
      </Marquee>
    );
    const marqueeContainer = container.firstElementChild;
    expect(marqueeContainer?.className).toContain("flex-col");
  });
});
