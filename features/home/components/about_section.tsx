"use client";

import ScrollFloat from "@/components/scroll_float";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";

export function AboutSection() {
  return (
    <section id="about" aria-label="About Zerochirou" className="relative w-full min-h-[300vh] sm:min-h-[350vh]">
      <h2 className="sr-only">About Zerochirou - Programmer, Researcher, and Founder</h2>
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
      <div className="sticky top-0 h-screen flex items-center justify-center w-full bg-background z-20 px-3 sm:px-6">
        {/* Shadow memancar ke atas di luar container */}
        <div className="pointer-events-none absolute -top-40 sm:-top-64 left-0 right-0 h-40 sm:h-64 z-[5] bg-gradient-to-t from-background to-transparent" />

        <Terminal className="max-h-[82vh] sm:max-h-140">
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
            <span className="text-xs sm:text-sm md:text-base font-semibold">ℹ Read 4 file:</span>
            <span className="pl-2 text-xs sm:text-sm md:text-base">- lib/deep_learning.ipynb</span>
            <span className="pl-2 text-xs sm:text-sm md:text-base">- lib/web.ts</span>
            <span className="pl-2 text-xs sm:text-sm md:text-base">- lib/server.go</span>
            <span className="pl-2 text-xs sm:text-sm md:text-base">- lib/engine.rs</span>
          </AnimatedSpan>
          <TypingAnimation className="text-muted-foreground text-xs sm:text-sm md:text-base">
            Success! Project initialization completed.
          </TypingAnimation>
          <TypingAnimation className="text-muted-foreground text-xs sm:text-sm md:text-base">
            You may now add components.
          </TypingAnimation>
        </Terminal>
      </div>
    </section>
  );
}
