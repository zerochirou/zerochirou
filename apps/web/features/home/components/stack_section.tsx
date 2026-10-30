"use client";

import BlurText from "@/components/ui/blur_text";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Languages } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { TECH_STACK_ITEMS } from "../constants";

const Galaxy = dynamic(() => import("@/components/ui/galaxy"), {
  ssr: false,
});

export function StackSection() {
  const [isEnglish, setIsEnglish] = useState(false);
  const [showGalaxy, setShowGalaxy] = useState(false);
  const [showStack, setShowStack] = useState(false);

  useEffect(() => {
    if (!isEnglish || showStack) return;

    const timeoutId = setTimeout(() => {
      setShowGalaxy(true);
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isEnglish, showStack]);

  const handleLanguageToggle = () => {
    if (isEnglish) {
      setIsEnglish(false);
      setShowGalaxy(false);
      setShowStack(false);
    } else {
      setIsEnglish(true);
    }
  };

  const textZh =
    "優秀的開發者是那些能夠解決問題的人，而不是那些只專注於特定技術堆疊的人。";
  const textEn =
    "A good developer is one who solves problems, rather than being fixated on a specific tech stack.";

  return (
    <section
      id="stack"
      aria-label="Tech Stack and Skills"
      className="relative w-full min-h-[200vh] h-auto"
    >
      <h2 className="sr-only">
        Tech Stack &amp; Core Engineering Skills - Zerochirou
      </h2>
      <div className="sr-only">
        <h3>Zerochirou Technology Stack &amp; Systems Capabilities</h3>
        <ul>
          {TECH_STACK_ITEMS.map((item) => (
            <li key={`seo-${item.title}`}>
              <strong>{item.title}</strong>: {item.description}
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky top-0 h-screen flex flex-col items-center justify-center w-full bg-background z-10 px-4 text-center overflow-hidden">
        <BlurText
          text="Then where the tech stack?!"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-2xl sm:text-5xl md:text-5xl mb-2 justify-center"
        />
        <BlurText
          text="Where is Next.js? Where are Rust and Go?"
          delay={400}
          animateBy="words"
          direction="top"
          className="text-xs sm:text-base md:text-lg mb-8 text-muted-foreground justify-center"
        />
        <Button>Keep Scroll</Button>
      </div>

      <div
        className={`relative min-h-screen flex flex-col items-center justify-center w-full z-20 px-3 sm:px-6 md:px-8 py-16 sm:py-20 gap-6 sm:gap-8 transition-colors duration-1000 ${
          isEnglish
            ? "bg-background text-white"
            : "bg-background text-foreground"
        }`}
      >
        <div className="pointer-events-none absolute -top-40 sm:-top-64 left-0 right-0 h-40 sm:h-80 z-5 bg-gradient-to-t from-background to-transparent" />

        <div
          className={`pointer-events-none absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
            showGalaxy ? "opacity-100" : "opacity-0"
          }`}
        >
          {isEnglish && (
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
          )}
        </div>

        <div className="max-w-4xl text-center relative z-10 w-full px-2">
          {!showStack && (
            <BlurText
              key={isEnglish ? "en" : "zh"}
              text={isEnglish ? textEn : textZh}
              delay={100}
              animateBy={isEnglish ? "words" : "letters"}
              direction="top"
              className="text-2xl sm:text-2xl md:text-4xl md:leading-normal md:justify-center"
            />
          )}
        </div>

        {showStack && (
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-2 sm:mt-4">
            <ul className="grid grid-cols-2 min-[440px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-0 border border-border/40">
              {TECH_STACK_ITEMS.map((item) => (
                <Card
                  key={item.title}
                  className="animate-in group fade-in zoom-in duration-500 group bg-background rounded-none border-none py-3 px-2 sm:py-4 sm:px-3 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-1 sm:gap-1.5"
                >
                  <CardHeader className="flex items-center justify-center p-0 mb-1.5 sm:mb-2">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain group-hover:scale-110 group-hover:spin  transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-0 w-full text-center">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={item.description}
                      className="text-center w-full min-w-0"
                    >
                      <span className="text-xs sm:text-sm font-medium block truncate max-w-full px-1">
                        {item.title}
                      </span>
                    </a>
                  </CardContent>
                </Card>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10 mt-4 sm:mt-6 max-w-md">
          <Button
            variant={isEnglish ? "secondary" : "default"}
            className="transition-all duration-300 flex-1 sm:flex-none h-10 sm:h-11 text-xs sm:text-sm px-4"
            onClick={handleLanguageToggle}
          >
            <Languages className="w-4 h-4 mr-2 shrink-0" />
            {isEnglish ? "Back to Chinese" : "Translate"}
          </Button>

          {isEnglish && (
            <Button
              variant="outline"
              className={`transition-all duration-300 flex-1 sm:flex-none h-10 sm:h-11 text-xs sm:text-sm px-4 ${
                showStack
                  ? "bg-primary text-primary-foreground border-transparent hover:bg-primary/90"
                  : "bg-transparent text-white border-white/30 hover:bg-white/10"
              }`}
              onClick={() => {
                const next = !showStack;
                setShowStack(next);
                if (next) {
                  setShowGalaxy(false);
                }
              }}
            >
              {showStack ? "Hide Tech Stack" : "Okey, you want see it"}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
