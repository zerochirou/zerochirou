"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { DitherBackground } from "./dither_background";
import { cn } from "@/lib/utils";

export interface HeroSectionProps {
  firstName?: string;
  lastName?: string;
  nameText?: string;
  heading?: string;
  bio?: string;
  ctaText?: string;
  ctaHref?: string;
  showDither?: boolean;
  className?: string;
  centerElement?: React.ReactNode;
}

export function HeroSection({
  firstName,
  lastName,
  nameText,
  heading = "Hi, introduction",
  bio = "Zerochirou is an Indonesian software engineer, researcher, and tech founder. Just developer who works differently, and also the CEO of Clickfor and the CTO of Zense.",
  ctaText = "See The Projects",
  ctaHref = "#projects",
  showDither = true,
  className,
  centerElement,
}: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  let line1 = firstName;
  let line2 = lastName;

  if (!line1 && !line2) {
    if (nameText && nameText !== "Zerochirou." && nameText !== "Zerochirou") {
      const parts = nameText.replace(/\.+$/, "").trim().split(/\s+/);
      line1 = parts[0]?.toUpperCase() ?? "MIKE";
      line2 = parts.slice(1).join(" ")?.toUpperCase() ?? "WILCOCK";
    } else {
      line1 = "ZERO";
      line2 = "CHIROU.";
    }
  } else {
    line1 = line1 ? line1.toUpperCase() : "";
    line2 = line2 ? line2.toUpperCase() : "";
  }

  const lineVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 36 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.85,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  const footerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.85,
        delay: shouldReduceMotion ? 0 : 0.28,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className={cn(
        "relative w-full min-h-svh flex flex-col justify-between overflow-x-clip bg-background text-foreground select-none",
        className,
      )}
    >
      {/* Background Interactive Shader with Bottom Gradient */}
      {showDither && (
        <div className="pointer-events-none md:pointer-events-auto absolute inset-0 z-0 opacity-20 transition-opacity duration-700 hover:opacity-35">
          <DitherBackground />
        </div>
      )}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 sm:h-48 z-[5] bg-gradient-to-t from-background to-transparent" />

      {/* Screen Reader Semantic Heading */}
      <h1 className="sr-only">
        {line1} {line2} - Software Engineer & Founder
      </h1>
      {heading && <span className="sr-only">{heading}</span>}

      {/* Main Content Layout Container */}
      <div className="relative z-10 w-full max-w-[1720px] mx-auto px-6 sm:px-10 md:px-14 lg:px-18 xl:px-22 flex flex-col justify-between flex-1 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 md:pb-16 pointer-events-auto">
        {/* Massive Staggered Editorial Typography */}
        <div className="flex flex-col justify-center flex-1 my-auto py-8 sm:py-12 md:py-16">
          <div className="mx-auto max-w-7xl w-full flex flex-col">
            {/* Line 1 (Left Aligned) */}
            <div className="w-full flex justify-start overflow-hidden">
              <motion.span
                custom={0.05}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="font-black uppercase tracking-tighter text-foreground leading-[0.82] select-none text-[17.5vw] sm:text-[16vw] md:text-[14.5vw] lg:text-[13.5vw] xl:text-[13vw] inline-block"
              >
                {line1}
              </motion.span>
            </div>

            {/* Line 2 (Right/Staggered Aligned) */}
            {line2 && (
              <div className="w-full flex justify-end overflow-hidden">
                <motion.span
                  custom={0.16}
                  variants={lineVariants}
                  initial="hidden"
                  animate="visible"
                  className="font-black uppercase tracking-tighter text-foreground leading-[0.82] select-none text-[17.5vw] sm:text-[16vw] md:text-[14.5vw] lg:text-[13.5vw] xl:text-[13vw] inline-block text-right"
                >
                  {line2}
                </motion.span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section: Bio & CTA Button */}
        <motion.div
          variants={footerVariants}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 sm:gap-8 pt-6 sm:pt-10 border-t border-border/10"
        >
          {/* Bio Description (Left Rail) */}
          <p className="text-sm sm:text-base md:text-[17px] text-muted-foreground/90 font-normal leading-relaxed max-w-xs sm:max-w-sm md:max-w-md">
            {bio}
          </p>

          {/* Optional Center Custom Slot */}
          {centerElement && (
            <div className="hidden lg:flex items-center justify-center">
              {centerElement}
            </div>
          )}

          {/* CTA Link Pill (Right Rail) */}
          <div className="w-full sm:w-auto flex items-center justify-start sm:justify-end">
            <Button
              render={<Link href={ctaHref} />}
              nativeButton={false}
              variant={"outline"}
            >
              <span>{ctaText}</span>
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
