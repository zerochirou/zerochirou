import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  HelpCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";
import { Separator } from "@/components/ui/separator";
import {
  COURSES_DATA,
  COURSE_CHAPTERS,
  MOCK_SUBCOURSES,
  formatSlugToTitle,
} from "@/features/course/constants";

interface SubCoursePageProps {
  params: Promise<{
    slug: string;
    "slug-sub": string;
  }>;
}

export function generateStaticParams() {
  const params: { slug: string; "slug-sub": string }[] = [];
  for (const course of COURSES_DATA) {
    for (const chapter of COURSE_CHAPTERS) {
      params.push({
        slug: course.id,
        "slug-sub": chapter.slug,
      });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: SubCoursePageProps): Promise<Metadata> {
  const { "slug-sub": subSlug } = await params;
  const title = MOCK_SUBCOURSES[subSlug]?.title || formatSlugToTitle(subSlug);

  return {
    title: `${title} | Self Course`,
    description: `Materi pembelajaran mendalam topik ${title}.`,
  };
}

export default async function SubCoursePage({ params }: SubCoursePageProps) {
  const { slug, "slug-sub": subSlug } = await params;
  const course = COURSES_DATA.find((c) => c.id === slug);
  const courseTitle = course ? course.title : formatSlugToTitle(slug);

  const subData = MOCK_SUBCOURSES[subSlug] || {
    title: formatSlugToTitle(subSlug),
    readTime: "20 Menit",
    level: "Menengah",
    intuition: `Topik ${formatSlugToTitle(subSlug)} dirancang untuk memberikan kerangka berpikir logis dan pemahaman konsep secara komprehensif.`,
    formula: {
      label: "Model Matematis Konseptual",
      equation: "f(t) = \\int_{0}^{t} \\phi(\\tau) d\\tau + C",
      explanation: "Integrasi variabel keadaan terhadap waktu untuk menganalisis evolusi sistem fisik.",
    },
    keyTakeaways: [
      `Memahami konsep dasar pada modul ${formatSlugToTitle(subSlug)}.`,
      "Mampu menganalisis fenomena fisis dan memodelkannya secara matematis.",
      "Menguasai simulasi komputasi dan pemecahan masalah.",
    ],
    code: {
      fileName: "simulation.py",
      language: "python",
      snippet: `# Simulasi numerik sederhana untuk ${formatSlugToTitle(subSlug)}
def simulate_step(current_val, rate, dt=0.01):
    return current_val + rate * dt

val = 0.0
for _ in range(100):
    val = simulate_step(val, 9.8)
print("Hasil simulasi:", round(val, 2))`,
    },
    exercise: {
      question: `Bagaimana Anda mengaplikasikan prinsip ${formatSlugToTitle(subSlug)} dalam pemecahan masalah di dunia nyata?`,
      hint: "Tinjau kembali asumsi dasar model dan kondisi batas sistem.",
    },
    nextSlug: undefined,
    nextTitle: undefined,
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <nav aria-label="Navigasi Halaman" className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5 p-0"
          render={<Link href={`/course/${slug}`} />}
          nativeButton={false}
        >
          <ArrowLeft className="size-4" />
          <span>Kembali ke {courseTitle}</span>
        </Button>
      </nav>

      <header className="flex items-center justify-center flex-col text-center px-4 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs rounded-full px-2.5">
            {courseTitle}
          </Badge>
          <Badge variant="outline" className="text-xs rounded-full text-muted-foreground border-border/40">
            {subData.level}
          </Badge>
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>{subData.readTime}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
          <DiaTextReveal
            text={subData.title}
            colors={["#FFED29", "#0095fe"]}
          />
        </h1>

        <p className="w-full max-w-2xl text-xs sm:text-sm md:text-base text-muted-foreground/80 text-center leading-relaxed">
          Silabus dan panduan pembelajaran terstruktur untuk penguasaan topik{" "}
          <strong className="text-foreground font-medium">{subData.title}</strong>.
        </p>
      </header>

      <Separator className="bg-border/30" />

      <section className="w-full space-y-8 sm:space-y-10">
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Lightbulb className="size-5 text-primary" />
            <span>1. Intuisi Konseptual</span>
          </h2>
          <div className="p-4 sm:p-5 rounded-2xl bg-card/40 border border-border/40 leading-relaxed text-sm sm:text-base text-muted-foreground">
            {subData.intuition}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            <span>2. Formulasi Matematis & Teori</span>
          </h2>
          <Card className="bg-card/40 border-border/40 rounded-2xl overflow-hidden">
            <CardHeader className="p-4 sm:p-5 pb-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {subData.formula.label}
              </span>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
              <div className="py-3 px-4 rounded-xl bg-muted/40 font-mono text-sm sm:text-base text-foreground text-center overflow-x-auto border border-border/20">
                <code>{subData.formula.equation}</code>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {subData.formula.explanation}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <span>3. Poin Kunci Pembelajaran</span>
          </h2>
          <ul className="space-y-2 list-none p-0 m-0">
            {subData.keyTakeaways.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-xl bg-card/30 border border-border/30 text-xs sm:text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Code2 className="size-5 text-primary" />
            <span>4. Implementasi Numerik & Komputasi</span>
          </h2>
          <div className="rounded-2xl border border-border/40 bg-card/60 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border/30 text-xs text-muted-foreground font-mono">
              <span>{subData.code.fileName}</span>
              <span className="uppercase text-[10px] tracking-wider text-muted-foreground/70">
                {subData.code.language}
              </span>
            </div>
            <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono overflow-x-auto leading-relaxed text-foreground bg-black/40">
              <code>{subData.code.snippet}</code>
            </pre>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <HelpCircle className="size-5 text-primary" />
            <span>5. Latihan & Refleksi Mandiri</span>
          </h2>
          <Card className="bg-card/40 border-border/40 rounded-2xl">
            <CardHeader className="p-4 sm:p-5 pb-2">
              <CardTitle className="text-sm sm:text-base font-medium">
                {subData.exercise.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              <div className="text-xs text-muted-foreground/90 bg-muted/30 p-3 rounded-xl border border-border/20">
                <strong className="text-primary font-medium">Petunjuk:</strong>{" "}
                {subData.exercise.hint}
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="bg-border/30" />

        <footer className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs rounded-xl border-border/40 gap-1.5"
            render={<Link href={`/course/${slug}`} />}
            nativeButton={false}
          >
            <ArrowLeft className="size-3.5" />
            <span>Daftar Bab</span>
          </Button>

          {subData.nextSlug ? (
            <Button
              variant="default"
              size="sm"
              className="text-xs rounded-xl gap-1.5"
              render={<Link href={`/course/${slug}/${subData.nextSlug}`} />}
              nativeButton={false}
            >
              <span>Lanjut: {subData.nextTitle}</span>
              <ArrowRight className="size-3.5" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="text-xs rounded-xl gap-1.5"
              render={<Link href={`/course/${slug}`} />}
              nativeButton={false}
            >
              <span>Selesai Bab</span>
              <CheckCircle2 className="size-3.5" />
            </Button>
          )}
        </footer>
      </section>
    </div>
  );
}
