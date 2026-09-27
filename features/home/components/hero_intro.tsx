"use client";

import TechText from "@/components/tech_text";

interface HeroIntroProps {
  heading?: string;
  nameText?: string;
  getStartedText?: string;
  docsText?: string;
  onGetStarted?: () => void;
  onDocs?: () => void;
}

export function HeroIntro({
  heading = "Introduction",
  nameText = "Zerochirou",
}: HeroIntroProps) {
  return (
    <div className="flex items-center flex-col justify-center w-full px-2 text-center py-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-tight mb-0">
        {heading}
      </h2>
      <div className="w-full max-w-4xl h-24 sm:h-32 md:h-40 pointer-events-auto px-2 overflow-hidden">
        <TechText
          text={nameText}
          fontWeight={700}
          fontSize={150}
          reveal="letter"
          dashLength={4}
          dashGap={10}
          specks={20}
          fontFamily=""
          color="#fff"
          accentColor="#ffffff"
          letterSpacing={-0.05}
          reach={140}
          softness={0.7}
          strokeWidth={1.5}
          speed={1}
          lineStyle="dashed"
          selection
          labels
          draggable={false}
          sweep
        />
      </div>
    </div>
  );
}
