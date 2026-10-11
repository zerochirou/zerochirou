import type { Metadata } from "next";
import {
  CourseListSection,
  HeaderCourseSection,
} from "@/features/course/components";

export const metadata: Metadata = {
  title: "Self Course",
  description:
    "Sebuah pustaka sumber terbuka untuk pembelajaran berkelanjutan. Fisika, Matematika, Komputasi, dan Rekayasa.",
};

export default function Course() {
  return (
    <div className="w-full">
      <HeaderCourseSection />
      <CourseListSection />
    </div>
  );
}
