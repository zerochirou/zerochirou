"use client"

import { Button } from "@workspace/ui/components/button"
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal"
import { useState } from "react"
import { Terminal as TerminalIcon, Languages } from "lucide-react"
import { DiaTextReveal } from "@/components/ui/dia_text_reveal"
import { TextAnimate } from "@/components/ui/text_animate"
import { STORY_DATA } from "../constants"

function TerminalAbout() {
  return (
    <Terminal className="max-h-[82vh] bg-card sm:max-h-140">
      <TypingAnimation className="text-xs sm:text-sm md:text-base">
        &gt; pnpm dlx @zerochirou/about --all
      </TypingAnimation>
      <AnimatedSpan className="text-xs text-purple-500 sm:text-sm md:text-base">
        ✔ Human
      </AnimatedSpan>
      <AnimatedSpan className="text-xs text-green-500 sm:text-sm md:text-base">
        ✔ Student
      </AnimatedSpan>
      <AnimatedSpan className="text-xs text-green-500 sm:text-sm md:text-base">
        ✔ Programmer
      </AnimatedSpan>
      <AnimatedSpan className="text-xs text-green-500 sm:text-sm md:text-base">
        ✔ Researcher.
      </AnimatedSpan>
      <AnimatedSpan className="text-xs text-green-500 sm:text-sm md:text-base">
        ✔ Business Man.
      </AnimatedSpan>
      <AnimatedSpan className="text-xs text-green-500 sm:text-sm md:text-base">
        ✔ CTO of zense.site
      </AnimatedSpan>
      <AnimatedSpan className="text-xs text-amber-500 sm:text-sm md:text-base">
        ✔ CEO of clickfor.run
      </AnimatedSpan>
      <AnimatedSpan className="text-xs text-gray-500 sm:text-sm md:text-base">
        <span className="text-xs font-semibold sm:text-sm md:text-base">
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
  )
}

function About() {
  const [lang, setLang] = useState<"en" | "id">("en")
  const content = STORY_DATA[lang]

  return (
    <div className="max-h-[75vh] w-full max-w-2xl overflow-y-auto px-2 py-3 text-left sm:max-h-140 sm:px-4">
      {/* Header with Title and Language Switcher */}
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-border/30 pb-4">
        <div>
          <DiaTextReveal
            key={`heading-${lang}`}
            text={content.heading}
            colors={["#FFED29", "#0095fe"]}
            className="text-lg font-semibold tracking-tight text-foreground sm:text-3xl"
          />
          <TextAnimate
            key={`subtitle-${lang}`}
            animation="blurInUp"
            by="line"
            once
            className="sm:text-md mt-1 text-sm text-muted-foreground"
          >
            {content.subtitle}
          </TextAnimate>
        </div>
        <Button
          type="button"
          onClick={() => setLang(lang === "en" ? "id" : "en")}
          className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
          aria-label={
            lang === "en" ? "Switch to Bahasa Indonesia" : "Switch to English"
          }
        >
          <Languages className="size-3.5" />
          <span
            className={
              lang === "en" ? "font-semibold text-foreground" : "opacity-60"
            }
          >
            En
          </span>
          <span className="opacity-40">/</span>
          <span
            className={
              lang === "id" ? "font-semibold text-foreground" : "opacity-60"
            }
          >
            Id
          </span>
        </Button>
      </div>

      {/* Timeline Stream - Minimalist without nested cards */}
      <div
        key={`timeline-${lang}`}
        className="relative space-y-6 border-l border-border/40 pl-6 sm:space-y-8 sm:pl-7"
      >
        {content.timeline.map((item, idx) => {
          return (
            <article key={`${lang}-${idx}`} className="group relative">
              {/* Timeline marker */}
              <div className="absolute top-1 -left-[31px] flex size-4 items-center justify-center rounded-full border border-border bg-background transition-colors group-hover:border-primary sm:-left-[35px]">
                <div className="size-1.5 rounded-full bg-muted-foreground transition-colors group-hover:bg-primary" />
              </div>

              {/* Meta & Title */}
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
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
                  className="flex items-center gap-2 text-sm font-medium text-foreground sm:text-base"
                />
              </div>

              <TextAnimate
                key={`desc-${lang}-${idx}`}
                delay={idx + 2}
                animation="blurInUp"
                by="line"
                once
                className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:text-sm"
              >
                {item.description}
              </TextAnimate>
            </article>
          )
        })}
      </div>

      <div className="mt-8 border-t border-border/20 pt-4">
        <TextAnimate
          key={`closing-${lang}`}
          animation="blurInUp"
          by="line"
          once
          className="text-xs leading-relaxed text-muted-foreground/90 sm:text-sm"
        >
          {content.closing}
        </TextAnimate>
      </div>
    </div>
  )
}

export function AboutSection() {
  const [showAbout, setShowAbout] = useState<boolean>(false)

  return (
    <section
      id="about"
      aria-label="About Zerochirou"
      className="relative min-h-[300vh] w-full sm:min-h-[350vh]"
    >
      <h2 className="sr-only">
        About Zerochirou - Programmer, Researcher, and Founder
      </h2>
      <div className="sticky top-0 z-10 flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4 text-center">
        <div className="w-full max-w-2xl px-2">
          <TypingAnimation className="shimmer text-6xl">
            Not just a developer!
          </TypingAnimation>
        </div>
      </div>

      <div className="sticky top-0 z-20 flex h-screen w-full flex-col items-center justify-center bg-background px-3 sm:px-6">
        <div className="pointer-events-none absolute -top-40 right-0 left-0 z-5 h-65 bg-linear-to-t from-background to-transparent sm:-top-64 sm:h-64" />

        {showAbout ? <About /> : <TerminalAbout />}

        <div className="mt-4 flex flex-row items-center gap-2">
          {showAbout && (
            <Button
              className="h-10 px-4"
              variant={!showAbout ? "default" : "outline"}
              size="sm"
              onClick={() => setShowAbout(false)}
            >
              <TerminalIcon className="size-4" /> Terminal View
            </Button>
          )}
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
  )
}
