import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";
import { TextAnimate } from "@/components/ui/text_animate";
import { ArrowLeft, ArrowRight, MoveUpRight } from "lucide-react";
import {
  COURSES_DATA,
  COURSE_CHAPTERS,
  formatSlugToTitle,
} from "@/features/course/constants";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = COURSES_DATA.find((c) => c.id === slug);
  const title = course ? course.title : formatSlugToTitle(slug);

  return {
    title: `${title} | Self Course`,
    description: course?.description || `Pustaka modul pembelajaran ${title}.`,
  };
}

export function generateStaticParams() {
  return COURSES_DATA.map((course) => ({
    slug: course.id,
  }));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = COURSES_DATA.find((c) => c.id === slug);
  const courseTitle = course ? course.title : formatSlugToTitle(slug);

  return (
    <div className="w-full">
      <nav aria-label="Navigasi Halaman" className="mb-6 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5 p-0"
          render={<Link href="/course" />}
          nativeButton={false}
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke Katalog Kursus</span>
        </Button>
      </nav>

      <header className="flex items-center justify-center flex-col px-4 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
          <DiaTextReveal
            text={courseTitle}
            colors={["#FFED29", "#0095fe"]}
          />
        </h1>
        <TextAnimate
          animation="blurInUp"
          by="character"
          once
          className="w-full max-w-2xl text-xs sm:text-base md:text-lg mt-3 sm:mt-4 text-muted-foreground/80 text-center px-2 sm:px-4 leading-relaxed"
        >
          Sebuah pustaka sumber terbuka untuk pembelajaran berkelanjutan.
          Dirilis secara publik untuk siapa saja.
        </TextAnimate>
      </header>

      <section className="mx-auto max-w-4xl w-full mt-8 sm:mt-12 px-2 sm:px-0">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 list-none p-0 m-0">
          {COURSE_CHAPTERS.map((chapter) => (
            <li key={chapter.id}>
              <Card className="bg-background border border-border/50 group hover:border-border hover:bg-card/50 transition-all duration-200 h-full flex flex-col justify-between">
                <div>
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <Badge
                      variant={"outline"}
                      className="size-8 text-sm font-semibold rounded-xl text-primary border-primary/30 bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all shrink-0 flex items-center justify-center p-0"
                    >
                      <span className="group-hover:hidden">{chapter.id}</span>
                      <span className="hidden group-hover:flex">
                        <MoveUpRight className="size-4" />
                      </span>
                    </Badge>
                    <CardTitle className="text-base sm:text-lg font-medium leading-snug">
                      {chapter.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-1">
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {chapter.description}
                    </CardDescription>
                  </CardContent>
                </div>
                <CardFooter className="flex justify-end pt-2">
                  <Button
                    variant={"default"}
                    size={"sm"}
                    className="text-xs rounded-xl gap-1.5"
                    render={<Link href={`/course/${slug}/${chapter.slug}`} />}
                    nativeButton={false}
                  >
                    <span>Start</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
