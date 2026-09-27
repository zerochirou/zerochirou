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
    <div className="flex items-center flex-col justify-center min-h-screen">
      <h2 className="text-4xl font-bold">{heading}</h2>
      <div className="w-full h-40 pointer-events-auto">
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
          reach={200}
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
      {/*<div className="flex items-center gap-2 mt-10 pointer-events-auto">
        <Button
          variant="default"
          className="h-12 text-lg px-4"
          onClick={onGetStarted}
        >
          {getStartedText} <Rocket />
        </Button>
        <Button
          variant="outline"
          className="h-12 text-lg px-4"
          onClick={onDocs}
        >
          {docsText}
        </Button>
      </div>*/}
    </div>
  );
}
