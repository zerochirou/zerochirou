import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Book } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CourseItem {
  id: string;
  title: string;
  description: string;
  category: string;
  level?: "Pemula" | "Menengah" | "Lanjutan" | string;
  duration?: string;
  modulesCount?: number;
  slug?: string;
  isPopular?: boolean;
}

export interface CourseCardProps {
  course?: CourseItem;
  className?: string;
  onSelect?: (course: CourseItem) => void;
}

const defaultCourse: CourseItem = {
  id: "fisika-dasar",
  title: "Fisika Dasar",
  description:
    "New to React? Learn the foundational concepts to help you go from JavaScript to React.",
  category: "Fisika",
  level: "Pemula",
  duration: "12 Jam",
  modulesCount: 8,
};

export function CourseCard({
  course = defaultCourse,
  className,
}: CourseCardProps) {
  return (
    <Card
      data-slot="course-card"
      className={cn(
        className,
        "hover:bg-card bg-background transition-all ease-in-out border border-secondary h-full",
      )}
    >
      <CardHeader className="h-full">
        <CardTitle>{course.title}</CardTitle>
        <CardDescription>{course.description}</CardDescription>
        <CardAction className="opacity-50">
          <Book />
        </CardAction>
      </CardHeader>
      <CardFooter className="flex justify-end items-end">
        <Button variant={"default"}>
          Start <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
