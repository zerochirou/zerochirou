import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
  });

  it("should handle conditional classes", () => {
    expect(cn("base-class", true && "active", false && "disabled")).toBe("base-class active");
  });

  it("should handle empty or undefined arguments", () => {
    expect(cn("base-class", undefined, null, false)).toBe("base-class");
  });
});
