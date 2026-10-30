"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Galaxy = dynamic(() => import("@/components/ui/galaxy"), {
  ssr: false,
});

export function TarotBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen flex flex-col items-center justify-center w-full px-3 sm:px-6 md:px-8 py-16 sm:py-20 gap-6 sm:gap-8">
      {/* Viewport-sized and fixed so the shader cost stays constant however tall the reading gets. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <Galaxy
          starSpeed={0.1}
          density={1}
          hueShift={140}
          speed={0.5}
          glowIntensity={0.3}
          saturation={0.1}
          mouseInteraction={false}
          mouseRepulsion={false}
          repulsionStrength={2}
          twinkleIntensity={0.5}
          rotationSpeed={0.05}
        />
      </div>
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
