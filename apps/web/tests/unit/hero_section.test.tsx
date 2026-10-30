import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "@/features/home/components/hero_section";

// Mock background WebGL components to avoid WebGL context requirements in jsdom
vi.mock("@/components/ui/gradient_ascii", () => ({
  GradientASCII: () => <div data-testid="mock-gradient-ascii" />,
  GradientAscii: () => <div data-testid="mock-gradient-ascii" />,
  default: () => <div data-testid="mock-gradient-ascii" />,
}));
vi.mock("@/features/home/components/dither_background", () => ({
  DitherBackground: () => <div data-testid="mock-dither" />,
}));

describe("HeroSection component", () => {
  it("renders with default props matching the layout", () => {
    render(<HeroSection />);

    // Screen reader accessible title
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();

    // Default typography lines
    expect(screen.getAllByText("ZERO").length).toBeGreaterThan(0);
    expect(screen.getAllByText("CHIROU.").length).toBeGreaterThan(0);

    // Bio paragraph
    expect(
      screen.getByText(
        "Zerochirou is an Indonesian software engineer, researcher, and tech founder. Just developer who works differently, and also the CEO of Clickfor and the CTO of Zense."
      )
    ).toBeDefined();

    // CTA button with correct link
    const ctaButton = screen.getByRole("button", { name: /See The Projects/i });
    expect(ctaButton).toBeDefined();
    expect(ctaButton.closest("a")?.getAttribute("href")).toBe("#projects");
  });

  it("renders custom names when provided via firstName and lastName props", () => {
    render(
      <HeroSection
        firstName="MIKE"
        lastName="WILCOCK"
        bio="Custom bio for Mike Wilcock."
        ctaText="EXPLORE WORK"
        ctaHref="#about"
      />
    );

    expect(screen.getAllByText("MIKE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("WILCOCK").length).toBeGreaterThan(0);
    expect(screen.getByText("Custom bio for Mike Wilcock.")).toBeDefined();

    const ctaButton = screen.getByRole("button", { name: /EXPLORE WORK/i });
    expect(ctaButton.closest("a")?.getAttribute("href")).toBe("#about");
  });

  it("renders custom multi-word nameText properly", () => {
    render(<HeroSection nameText="Alex Morgan" />);

    expect(screen.getAllByText("ALEX").length).toBeGreaterThan(0);
    expect(screen.getAllByText("MORGAN").length).toBeGreaterThan(0);
  });
});
