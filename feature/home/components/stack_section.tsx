"use client";

import BlurText from "@/components/blur_text";
import Galaxy from "@/components/galaxy";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useState, useEffect } from "react";

export function StackSection() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [showGalaxy, setShowGalaxy] = useState(false);

  useEffect(() => {
    if (!isEnglish) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setShowGalaxy(true);
    }, 4000); // Pastikan delay ini sesuai dengan durasi animasi BlurText Anda

    return () => {
      clearTimeout(timeoutId);
      setShowGalaxy(false);
    };
  }, [isEnglish]);

  const textZh =
    "優秀的開發者是那些能夠解決問題的人，而不是那些只專注於特定技術堆疊的人。";
  const textEn =
    "A good developer is one who solves problems, rather than being fixated on a specific tech stack.";

  return (
    <div className="relative w-full h-[200vh]">
      {/* Layar 1 */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center w-full bg-background z-10 px-4 text-center">
        <BlurText
          text="Then where the tech stack?!"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-5xl mb-2"
        />
        <BlurText
          text="Scroll first!"
          delay={400}
          animateBy="words"
          direction="top"
          className="text-sm md:text-lg mb-8"
        />        
      </div>

      {/* Layar 2 */}
      <div
        className={`relative h-screen flex flex-col items-center justify-center w-full z-20 px-4 gap-8 transition-colors duration-1000 ${
          isEnglish ? "bg-background" : "bg-background"
        }`}
      >
        <div className="pointer-events-none absolute -top-64 left-0 right-0 h-80 z-5 bg-linear-to-t from-background to-transparent" />

        {/* Latar Belakang Galaxy */}
        {isEnglish && (
          <div
            className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
              showGalaxy ? "opacity-100" : "opacity-0"
            }`}
          >
            <Galaxy
              starSpeed={0.1}
              density={1}
              hueShift={140}
              speed={1}
              glowIntensity={0.3}
              saturation={0}
              mouseRepulsion={false}
              repulsionStrength={2}
              twinkleIntensity={0.3}
              rotationSpeed={0.1}
              transparent
            />
          </div>
        )}

        {/* Konten Utama */}
        <div className="max-w-4xl text-center relative z-10">
          <BlurText
            key={isEnglish ? "en" : "zh"}
            text={isEnglish ? textEn : textZh}
            delay={50}
            animateBy="letters"
            direction="bottom"
            className={`text-2xl md:text-4xl leading-relaxed md:leading-normal transition-colors duration-500 ${
              isEnglish ? "text-white" : "text-foreground"
            }`}
          />
        </div>

        <Button
          variant="default"
          className="relative z-10"
          onClick={() => setIsEnglish(!isEnglish)}
        >
          {isEnglish ? (
            <>
              <Languages className="w-4 h-4 mr-2" /> Back
            </>
          ) : (
            <>
              <Languages className="w-4 h-4 mr-2" /> Translate
            </>
          )}
        </Button>

        {/* PERBAIKAN: Pembatas TextLoop */}
        {/* Dibungkus absolute bottom-0 agar selalu berada di dasar Layar 2 */}
      </div>
    </div>
  );
}
