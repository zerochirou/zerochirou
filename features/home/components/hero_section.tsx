"use client";

import { DitherBackground } from "./dither_background";
import { HeroIntro } from "./hero_intro";

interface HeroSectionProps {
  heading?: string;
  nameText?: string;
}

export function HeroSection({
  heading = "Introduction",
  nameText = "Zerochirou",
}: HeroSectionProps) {
  return (
    <div id="hero" className="relative w-full min-h-screen bg-black/5 overflow-hidden flex items-center justify-center">
      {/* 1. LAYER DITHER */}
      <DitherBackground />

      {/* 2. LAYER KONTEN */}
      <div className="relative z-10 px-4 pt-16 sm:pt-0 pointer-events-none flex items-center justify-center min-h-screen w-full">
        <HeroIntro heading={heading} nameText={nameText} />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 sm:h-64 z-[5] bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export default HeroSection;
