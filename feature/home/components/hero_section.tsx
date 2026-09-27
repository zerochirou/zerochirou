"use client";

import { DitherBackground } from "./dither_background";
import { Navbar } from "./navbar";
import { HeroIntro } from "./hero_intro";
import type { MenuItem } from "./menu_drawer";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  menuItems?: MenuItem[];
  heading?: string;
  nameText?: string;
}

export function HeroSection({
  title = "Zerochirou",
  subtitle = "Portofolio",
  menuItems,
  heading = "Introduction",
  nameText = "Zerochirou",
}: HeroSectionProps) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black/5 ">
      {/* 1. LAYER DITHER */}
      <DitherBackground />

      {/* 2. LAYER KONTEN (pointer-events-none agar kursor mouse tembus ke canvas Dither) */}
      <div className="relative z-10 p-4 pointer-events-none">
        <Navbar title={title} subtitle={subtitle} menuItems={menuItems} />
        <HeroIntro heading={heading} nameText={nameText} />
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-64 z-[5] bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export default HeroSection;
