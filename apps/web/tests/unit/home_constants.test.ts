import { describe, it, expect } from "vitest";
import {
  TECH_STACK_ITEMS,
  STORY_DATA,
  FEATURED_PROJECTS,
} from "@/features/home/constants";

describe("Home Domain Constants", () => {
  it("maintains tech stack items with valid links and descriptions", () => {
    expect(TECH_STACK_ITEMS.length).toBeGreaterThan(10);
    for (const item of TECH_STACK_ITEMS) {
      expect(item.title).toBeTruthy();
      expect(item.description).toBeTruthy();
      expect(item.link).toMatch(/^https?:\/\//);
      expect(item.image).toMatch(/^https?:\/\//);
    }
  });

  it("maintains English and Indonesian story data consistency", () => {
    expect(STORY_DATA.en).toBeDefined();
    expect(STORY_DATA.id).toBeDefined();

    expect(STORY_DATA.en.timeline.length).toBe(STORY_DATA.id.timeline.length);
    expect(STORY_DATA.en.heading).toBeTruthy();
    expect(STORY_DATA.id.heading).toBeTruthy();
    expect(STORY_DATA.en.closing).toBeTruthy();
    expect(STORY_DATA.id.closing).toBeTruthy();
  });

  it("maintains featured projects with valid IDs and logo URLs", () => {
    expect(FEATURED_PROJECTS.length).toBeGreaterThan(0);
    const ids = FEATURED_PROJECTS.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    for (const project of FEATURED_PROJECTS) {
      expect(project.id).toBeTruthy();
      expect(project.title).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(project.logoUrl).toBeTruthy();
      expect(project.width).toBeGreaterThan(0);
      expect(project.height).toBeGreaterThan(0);
    }
  });
});
