import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Separator } from "@/components/ui/separator";

describe("Separator component", () => {
  it("renders with horizontal orientation by default and correct data-slot", () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator).toBeDefined();
    expect(separator?.getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("supports vertical orientation", () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.querySelector('[data-slot="separator"]');
    expect(separator?.getAttribute("aria-orientation")).toBe("vertical");
  });
});
