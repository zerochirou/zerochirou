"use client";

import ScrollFloat from "@/components/scroll-float";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/ui/terminal";

export function AboutSection() {
  return (
    <div className="relative w-full h-[350vh]">
      {/* Layar 1: Tertahan di posisi atas berkat 'sticky top-0' */}
      <div className="sticky top-0 h-screen flex items-center justify-center flex-col w-full bg-background z-10">
        <div className="text-4xl">
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
      <div className="sticky top-0 h-screen flex items-center justify-center w-full bg-background z-20">
        {/* Shadow memancar 80px ke atas di luar container */}
        <div className="pointer-events-none absolute -top-64 left-0 right-0 h-64 z-[5] bg-gradient-to-t from-background to-transparent" />

        <Terminal className="">
          <TypingAnimation className="text-lg">
            &gt; pnpm dlx @zerochirou/about --all
          </TypingAnimation>
          <AnimatedSpan className="text-purple-500 text-lg">
            ✔ Human
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500 text-lg">
            ✔ Student
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500 text-lg">
            ✔ Programmer
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500 text-lg">
            ✔ Researcher.
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500 text-lg">
            ✔ Business Man.
          </AnimatedSpan>
          <AnimatedSpan className="text-green-500 text-lg">
            ✔ CTO of zense.site
          </AnimatedSpan>
          <AnimatedSpan className="text-amber-500 text-lg">
            ✔ CEO of clickfor.run
          </AnimatedSpan>
          <AnimatedSpan className="text-gray-500 text-lg">
            <span className="text-lg">ℹ Read 4 file:</span>
            <span className="pl-2 text-lg">- lib/deep_learning.ipynb</span>
            <span className="pl-2 text-lg">- lib/web.ts</span>
            <span className="pl-2 text-lg">- lib/server.go</span>
            <span className="pl-2 text-lg">- lib/engine.rs</span>
          </AnimatedSpan>
          <TypingAnimation className="text-muted-foreground text-lg">
            Success! Project initialization completed.
          </TypingAnimation>
          <TypingAnimation className="text-muted-foreground text-lg">
            You may now add components.
          </TypingAnimation>
        </Terminal>
      </div>
    </div>
  );
}
