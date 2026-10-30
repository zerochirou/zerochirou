import type { CourseItem, CourseCardProps } from "./components/course_card";
import type { SearchBarProps } from "./components/search_bar";

export type { CourseItem, CourseCardProps, SearchBarProps };

export interface CourseChapter {
  id: number;
  slug: string;
  title: string;
  description: string;
}

export interface SubCourseDetail {
  title: string;
  readTime: string;
  level: string;
  intuition: string;
  formula: {
    label: string;
    equation: string;
    explanation: string;
  };
  keyTakeaways: string[];
  code: {
    fileName: string;
    language: string;
    snippet: string;
  };
  exercise: {
    question: string;
    hint: string;
  };
  nextSlug?: string;
  nextTitle?: string;
}
