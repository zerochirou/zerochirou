'use client'

import Link from "next/link";
import {
  ArrowLeft,
  User,
  Sparkles,
  SlidersHorizontal,
  Brain,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";
import { motion } from "motion/react";

export function HumanHero() {
  const ratio = 90;

  return (
    <section className="relative w-full pt-28 pb-16 sm:pt-36 overflow-hidden">
      <div className="relative mx-auto max-w-3xl px-4 flex flex-col gap-8 ">
        <motion.div
          initial={{
            opacity: 0,
            y: -100
          }}
          animate={{
            y: 0,
            opacity: 1
          }}
          transition={{
            delay: 1.5,
          }}
          className="flex items-center"
        >
          <Brain className="size-15 bg-transparent backdrop-blur-3xl border rounded-sm p-2" />
        </motion.div>
        <div className="flex flex-row gap-4 max-w-3xl">
          <DiaTextReveal
            className="text-4xl font-medium font-newsreader tracking-tight sm:text-6xl md:text-5xl text-foreground"
            delay={0.25}
            duration={1.4}
            text="90% Human Hands, 10% AI."
          />
          {/* 
          <DiaTextReveal
            delay={1.25}
            duration={1.4}
            className="font-newsreader italic text-xl sm:text-2xl text-foreground/80 max-w-2xl mx-auto pt-2"
            text="&ldquo;No matter how capable the artificial intelligence, no matter
            how vast its context window, a product born from human hands carries
            an authentic soul that cannot be synthesized.&rdquo;"
          /> */}
        </div>
      </div>
    </section>
  );
}
