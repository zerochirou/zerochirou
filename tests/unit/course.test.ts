import { describe, it, expect } from "vitest";
import {
  COURSES_DATA,
  COURSE_CHAPTERS,
  COURSE_CATEGORIES,
  MOCK_SUBCOURSES,
  formatSlugToTitle,
} from "@/features/course/constants";

describe("Course Domain Constants and Helpers", () => {
  it("formats slug strings to title case correctly", () => {
    expect(formatSlugToTitle("besaran-dan-pengukuran")).toBe(
      "Besaran Dan Pengukuran",
    );
    expect(formatSlugToTitle("vektor-dan-kinematika")).toBe(
      "Vektor Dan Kinematika",
    );
    expect(formatSlugToTitle("single")).toBe("Single");
  });

  it("contains unique and non-empty courses", () => {
    expect(COURSES_DATA.length).toBeGreaterThan(0);
    const ids = COURSES_DATA.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    for (const course of COURSES_DATA) {
      expect(course.title).toBeTruthy();
      expect(course.category).toBeTruthy();
      expect(course.duration).toBeTruthy();
    }
  });

  it("contains valid categories including 'Semua'", () => {
    expect(COURSE_CATEGORIES).toContain("Semua");
    expect(COURSE_CATEGORIES).toContain("Fisika");
    expect(COURSE_CATEGORIES).toContain("Matematika");
    expect(COURSE_CATEGORIES.length).toBeGreaterThanOrEqual(4);
  });

  it("contains sequential course chapters", () => {
    expect(COURSE_CHAPTERS.length).toBeGreaterThan(0);
    COURSE_CHAPTERS.forEach((chapter, index) => {
      expect(chapter.id).toBe(index + 1);
      expect(chapter.slug).toBeTruthy();
      expect(chapter.title).toBeTruthy();
    });
  });

  it("provides detailed subcourse mock definitions with required fields", () => {
    const keys = Object.keys(MOCK_SUBCOURSES);
    expect(keys.length).toBeGreaterThan(0);

    for (const key of keys) {
      const sub = MOCK_SUBCOURSES[key];
      expect(sub.title).toBeTruthy();
      expect(sub.readTime).toBeTruthy();
      expect(sub.level).toBeTruthy();
      expect(sub.formula.equation).toBeTruthy();
      expect(sub.keyTakeaways.length).toBeGreaterThan(0);
      expect(sub.code.snippet).toBeTruthy();
    }
  });
});
