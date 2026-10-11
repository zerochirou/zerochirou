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

interface SubCoursePageProps {
  params: Promise<{
    slug: string;
    "slug-sub": string;
  }>;
}

function formatSlugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const mockSubcourses: Record<
  string,
  {
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
> = {
  "besaran-dan-pengukuran": {
    title: "Besaran dan Pengukuran",
    readTime: "20 Menit",
    level: "Dasar",
    intuition:
      "Dalam fisika empiris, pengukuran adalah gerbang utama antara matematika teoretis dan realitas alamiah. Setiap besaran fisik diukur dengan standar satuan internasional (SI) serta memiliki tingkat ketidakpastian (margin of error) yang harus dicatat secara sistematis.",
    formula: {
      label: "Persamaan Ketidakpastian Pengukuran Berulang",
      equation: "\\Delta x = \\frac{1}{N} \\sqrt{\\frac{N\\sum x_i^2 - (\\sum x_i)^2}{N - 1}}",
      explanation:
        "Standar deviasi rata-rata digunakan untuk menentukan presisi dan ketidakpastian mutlak dari rangkaian pengukuran sampel berulang.",
    },
    keyTakeaways: [
      "Besaran pokok SI mencakup panjang (m), massa (kg), waktu (s), kuat arus (A), suhu (K), intensitas cahaya (cd), dan jumlah zat (mol).",
      "Analisis dimensi membantu memverifikasi konsistensi matematis dari suatu rumus fisika.",
      "Aturan angka penting (significant figures) harus konsisten dari tahap perhitungan hingga hasil akhir.",
    ],
    code: {
      fileName: "measurement_uncertainty.py",
      language: "python",
      snippet: `import numpy as np

# Data sampel eksperimen pengukuran diameter silinder (mm)
data = np.array([12.45, 12.48, 12.46, 12.47, 12.45, 12.46])

mean = np.mean(data)
std_dev = np.std(data, ddof=1)
uncertainty = std_dev / np.sqrt(len(data))

print(f"Hasil: ({mean:.3f} ± {uncertainty:.3f}) mm")`,
    },
    exercise: {
      question:
        "Jika sebuah kubus memiliki panjang sisi (5.0 ± 0.1) cm, tentukan volume kubus beserta estimasi ketidakpastian relatifnya.",
      hint: "Gunakan propagasi ketidakpastian volume: ΔV/V = 3 × (Δs/s).",
    },
    nextSlug: "vektor-dan-kinematika",
    nextTitle: "Vektor & Kinematika Partikel",
  },
  "vektor-dan-kinematika": {
    title: "Vektor & Kinematika Partikel",
    readTime: "25 Menit",
    level: "Dasar - Menengah",
    intuition:
      "Besaran skalar seperti suhu hanya memerlukan angka, namun gerak roket atau partikel di medan listrik memiliki orientasi arah. Vektor adalah bahasa dasar untuk mendeskripsikan ruang multi-dimensi secara presisi.",
    formula: {
      label: "Dekomposisi Vektor & Laju Kecepatan Sesaat",
      equation: "\\vec{v}(t) = \\frac{d\\vec{r}}{dt} = \\dot{x}\\hat{i} + \\dot{y}\\hat{j} + \\dot{z}\\hat{k}",
      explanation:
        "Kecepatan sesaat partikel merupakan turunan pertama dari vektor posisi terhadap waktu dalam basis koordinat ortonormal.",
    },
    keyTakeaways: [
      "Vektor memiliki magnitudo dan orientasi yang invarian terhadap pergeseran sistem koordinat.",
      "Dot product (A · B) menghasilkan skalar untuk menghitung usaha dan proyeksi ortogonal.",
      "Cross product (A × B) menghasilkan vektor tegak lurus untuk torsi dan momentum sudut.",
    ],
    code: {
      fileName: "vector_trajectory.py",
      language: "python",
      snippet: `import numpy as np

# Posisi awal dan kecepatan awal
r0 = np.array([0.0, 0.0])
v0 = np.array([20.0, 15.0]) # vx, vy
g  = np.array([0.0, -9.81])

t = np.linspace(0, 3.0, 100)
positions = [r0 + v0 * ti + 0.5 * g * (ti**2) for ti in t]
print("Simulasi posisi selesai, 100 titik terhitung.")`,
    },
    exercise: {
      question:
        "Diberikan dua vektor A = 3i + 4j dan B = -2i + 5j. Hitunglah nilai perkalian skalar (A · B) dan sudut di antara keduanya.",
      hint: "Gunakan hubungan A · B = |A| |B| cos(θ).",
    },
    nextSlug: "dinamika-hukum-newton",
    nextTitle: "Dinamika Gerak & Hukum Newton",
  },
};

export async function generateMetadata({
  params,
}: SubCoursePageProps): Promise<Metadata> {
  const { "slug-sub": subSlug } = await params;
  const title = mockSubcourses[subSlug]?.title || formatSlugToTitle(subSlug);

  return {
    title: `${title} | Self Course`,
    description: `Materi pembelajaran mendalam topik ${title}.`,
  };
}

export default async function SubCoursePage({ params }: SubCoursePageProps) {
  const { slug, "slug-sub": subSlug } = await params;
  const courseTitle =
    slug === "fisika-dasar"
      ? "Fisika Mekanika & Termodinamika"
      : formatSlugToTitle(slug);

  const subData = mockSubcourses[subSlug] || {
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
      {/* 1. Breadcrumb Navigation */}
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

      {/* 2. Header */}
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

      {/* 3. Main Syllabus & Content Section */}
      <section className="w-full space-y-8 sm:space-y-10">
        {/* Section 1: Intuisi Konsep */}
        <div className="space-y-3">
          <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Lightbulb className="size-5 text-primary" />
            <span>1. Intuisi Konseptual</span>
          </h2>
          <div className="p-4 sm:p-5 rounded-2xl bg-card/40 border border-border/40 leading-relaxed text-sm sm:text-base text-muted-foreground">
            {subData.intuition}
          </div>
        </div>

        {/* Section 2: Formulasi Matematis */}
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

        {/* Section 3: Poin Kunci */}
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

        {/* Section 4: Simulasi Komputasi / Kode */}
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

        {/* Section 5: Latihan Mandiri */}
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

        {/* Footer Navigasi Materi */}
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
