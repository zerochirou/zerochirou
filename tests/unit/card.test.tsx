import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

describe("Card component", () => {
  it("renders card structure correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>Card Content Body</CardContent>
      </Card>
    );
    expect(screen.getByText("Card Title")).toBeDefined();
    expect(screen.getByText("Card Content Body")).toBeDefined();
  });
});
