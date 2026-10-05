"use client";

import ScrollFloat from "@/components/ui/scroll_float";
import { Button } from "@/components/ui/button";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";
import { useState } from "react";
import {
  Terminal as TerminalIcon,
  Sparkles,
  BookOpen,
  Compass,
  Languages,
  Flame,
} from "lucide-react";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";
import { TextAnimate } from "@/components/ui/text_animate";

function TerminalAbout() {
  return (
    <Terminal className="max-h-[82vh] sm:max-h-140 bg-card">
      <TypingAnimation className="text-xs sm:text-sm md:text-base">
        &gt; pnpm dlx @zerochirou/about --all
      </TypingAnimation>
      <AnimatedSpan className="text-purple-500 text-xs sm:text-sm md:text-base">
        ✔ Human
      </AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-xs sm:text-sm md:text-base">
        ✔ Student
      </AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-xs sm:text-sm md:text-base">
        ✔ Programmer
      </AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-xs sm:text-sm md:text-base">
        ✔ Researcher.
      </AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-xs sm:text-sm md:text-base">
        ✔ Business Man.
      </AnimatedSpan>
      <AnimatedSpan className="text-green-500 text-xs sm:text-sm md:text-base">
        ✔ CTO of zense.site
      </AnimatedSpan>
      <AnimatedSpan className="text-amber-500 text-xs sm:text-sm md:text-base">
        ✔ CEO of clickfor.run
      </AnimatedSpan>
      <AnimatedSpan className="text-gray-500 text-xs sm:text-sm md:text-base">
        <span className="text-xs sm:text-sm md:text-base font-semibold">
          ℹ Read 4 skills:
        </span>
        <span className="pl-2 text-xs sm:text-sm md:text-base">
          - lib/deep_learning.ipynb
        </span>
        <span className="pl-2 text-xs sm:text-sm md:text-base">
          - lib/web.ts
        </span>
        <span className="pl-2 text-xs sm:text-sm md:text-base">
          - lib/server.go
        </span>
        <span className="pl-2 text-xs sm:text-sm md:text-base">
          - lib/engine.rs
        </span>
      </AnimatedSpan>
    </Terminal>
  );
}

interface TimelineEntry {
  period: string;
  badge: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
}

const STORY_DATA: Record<
  "en" | "id",
  {
    heading: string;
    subtitle: string;
    timeline: TimelineEntry[];
    closing: string;
  }
> = {
  en: {
    heading: "About Me",
    subtitle:
      "High school student, software builder, and systems explorer based in Indonesia.",
    timeline: [
      {
        period: "Origins",
        badge: "The Spark",
        title: "Curiosity for Low-Level Systems",
        description:
          "Drawn into software engineering by curiosity about what happens under the hood. Inspired early on by the open-source ethos, tech pioneers, and computing architectures—learning how operating systems, network protocols, and compilers operate from first principles rather than just consuming high-level abstractions.",
        icon: Flame,
      },
      {
        period: "Present",
        badge: "Education & Craft",
        title: "High School & Applied Systems",
        description:
          "Currently a high school student balancing formal education with disciplined software engineering. Actively developing projects and ventures like Clickfor and Zensekit, while exploring deep learning, distributed architecture, and dependable systems craftsmanship.",
        icon: Flame,
      },
      {
        period: "Future",
        badge: "Horizon",
        title: "Independent Deep Tech Lab",
        description:
          "Working towards establishing an independent software engineering and deep-tech studio. The ambition is to research and build robust computational tools, decentralized infrastructure, and physical-digital integrations that address genuine real-world challenges.",
        icon: Flame,
      },
    ],
    closing:
      "At the core, I value intentional engineering over fleeting trends—believing that great software is built with patience, solid architecture, and a genuine respect for the people who use it.",
  },
  id: {
    heading: "Tentang Saya",
    subtitle:
      "Siswa SMA, software builder, dan penikmat rekayasa sistem di Indonesia.",
    timeline: [
      {
        period: "Masa Lalu",
        badge: "Awal Mula",
        title: "Rasa Ingin Tahu Arsitektur Sistem",
        description:
          "Tertarik ke dunia rekayasa perangkat lunak berawal dari rasa penasaran mendalam terhadap cara kerja komputer di balik layar. Terinspirasi oleh ekosistem open-source, para founder teknologi, serta rekayasa sistem tingkat rendah—bukan sekadar memakai software, melainkan memahami bagaimana OS, protokol jaringan, dan compiler beroperasi dari dasarnya.",
        icon: Sparkles,
      },
      {
        period: "Saat Ini",
        badge: "Pendidikan & Karya",
        title: "Bangku Sekolah & Riset Terapan",
        description:
          "Saat ini menempuh pendidikan di bangku SMA, membagi waktu antara studi formal dan eksplorasi rekayasa perangkat lunak mandiri. Mengembangkan inisiatif dan venture seperti Clickfor serta Zensekit, sembari mendalami distributed systems dan deep learning dengan pendekatan craftsmanship yang terukur.",
        icon: BookOpen,
      },
      {
        period: "Masa Depan",
        badge: "Langkah Depan",
        title: "Studio Rekayasa & Deep Tech Lab",
        description:
          "Membangun lab rekayasa software mandiri yang berorientasi pada deep tech—menciptakan perkakas komputasi yang kokoh, transparan, dan berdaya guna untuk memecahkan masalah nyata di masyarakat.",
        icon: Compass,
      },
    ],
    closing:
      "Pada intinya, saya memprioritaskan rekayasa terarah di atas tren sesaat—percaya bahwa perangkat lunak yang baik dibangun dengan ketekunan, arsitektur yang bersih, serta penghormatan mendalam bagi manusia yang menggunakannya.",
  },
};

function About() {
  const [lang, setLang] = useState<"en" | "id">("en");
  const content = STORY_DATA[lang];

  return (
    <div className="w-full max-w-2xl max-h-[75vh] sm:max-h-140 overflow-y-auto px-2 sm:px-4 py-3 text-left">
      {/* Header with Title and Language Switcher */}
      <div className="flex items-start justify-between gap-4 pb-4 mb-6 border-b border-border/30">
        <div>
          <DiaTextReveal
            key={`heading-${lang}`}
            text={content.heading}
            colors={["#FFED29", "#0095fe"]}
            className="text-lg sm:text-3xl font-semibold tracking-tight text-foreground"
          />
          <TextAnimate
            key={`subtitle-${lang}`}
            animation="blurInUp"
            by="line"
            once
            className="text-sm sm:text-md text-muted-foreground mt-1"
          >
            {content.subtitle}
          </TextAnimate>
        </div>
        <Button
          type="button"
          onClick={() => setLang(lang === "en" ? "id" : "en")}
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground border border-border/60 rounded-full px-2.5 py-1 transition-colors cursor-pointer bg-background/50 hover:bg-muted/50"
          aria-label={
            lang === "en" ? "Switch to Bahasa Indonesia" : "Switch to English"
          }
        >
          <Languages className="size-3.5" />
          <span
            className={
              lang === "en" ? "text-foreground font-semibold" : "opacity-60"
            }
          >
            En
          </span>
          <span className="opacity-40">/</span>
          <span
            className={
              lang === "id" ? "text-foreground font-semibold" : "opacity-60"
            }
          >
            Id
          </span>
        </Button>
      </div>

      {/* Timeline Stream - Minimalist without nested cards */}
      <div key={`timeline-${lang}`} className="relative pl-6 sm:pl-7 border-l border-border/40 space-y-6 sm:space-y-8">
        {content.timeline.map((item, idx) => {
          return (
            <article key={`${lang}-${idx}`} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[35px] top-1 size-4 rounded-full border border-border bg-background flex items-center justify-center group-hover:border-primary transition-colors">
                <div className="size-1.5 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
              </div>

              {/* Meta & Title */}
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <TextAnimate
                  key={`badge-${lang}-${idx}`}
                  delay={idx + 0.5}
                  animation="blurInUp"
                  by="line"
                  once
                  className="text-xs font-medium text-foreground/80"
                >
                  {item.badge}
                </TextAnimate>
              </div>

              <div className="flex flex-row items-center gap-1">
                <DiaTextReveal
                  key={`title-${lang}-${idx}`}
                  delay={idx + 1}
                  text={item.title}
                  colors={["#FFED29", "#0095fe"]}
                  className="text-sm sm:text-base font-medium text-foreground flex items-center gap-2"
                />
              </div>

              {/* Description */}
              <TextAnimate
                key={`desc-${lang}-${idx}`}
                delay={idx + 2}
                animation="blurInUp"
                by="line"
                once
                className="mt-1.5 text-xs sm:text-sm leading-relaxed text-muted-foreground"
              >
                {item.description}
              </TextAnimate>
            </article>
          );
        })}
      </div>

      {/* Closing paragraph */}
      <div className="mt-8 pt-4 border-t border-border/20">
        <TextAnimate
          key={`closing-${lang}`}
          animation="blurInUp"
          by="line"
          once
          className="text-xs sm:text-sm text-muted-foreground/90 leading-relaxed"
        >
          {content.closing}
        </TextAnimate>
      </div>
    </div>
  );
}

export function AboutSection() {
  const [showAbout, setShowAbout] = useState<boolean>(false);

  return (
    <section
      id="about"
      aria-label="About Zerochirou"
      className="relative w-full min-h-[300vh] sm:min-h-[350vh]"
    >
      <h2 className="sr-only">
        About Zerochirou - Programmer, Researcher, and Founder
      </h2>
      {/* Layar 1: Tertahan di posisi atas berkat 'sticky top-0' */}
      <div className="sticky top-0 h-screen flex items-center justify-center flex-col w-full bg-background z-10 px-4 text-center overflow-hidden">
        <div className="w-full max-w-2xl px-2">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            Not just a developer!
          </ScrollFloat>
        </div>
      </div>

      {/* Layar 2: Akan menutupi Layar 1 saat di-scroll ke bawah dan tertahan di top-0 */}
      <div className="sticky top-0 flex-col h-screen flex items-center justify-center w-full bg-background z-20 px-3 sm:px-6">
        {/* Shadow memancar ke atas di luar container */}
        <div className="pointer-events-none absolute -top-40 sm:-top-64 left-0 right-0 h-65 sm:h-64 z-5 bg-linear-to-t from-background to-transparent" />

        {showAbout ? <About /> : <TerminalAbout />}

        {/* View Switchers */}
        <div className="flex gap-2 mt-4 flex-row items-center">
          {showAbout && <Button
            className="h-10 px-4"
            variant={!showAbout ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAbout(false)}
          >
            <TerminalIcon className="size-4" /> Terminal View
          </Button>}
          <Button
            className="h-10 px-4"
            variant={showAbout ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAbout(true)}
          >
            Story View
          </Button>
        </div>
      </div>
    </section>
  );
}
