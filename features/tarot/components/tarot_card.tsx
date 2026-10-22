"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { DrawnCard, TarotLocale } from "../types";
import { HoloCard } from "@/components/ui/holo_card";
import { cn } from "@/lib/utils";
import { getTarotImageUrl } from "../lib/tarot_image";

interface TarotCardProps {
  card: DrawnCard;
  index: number;
  isSelected?: boolean;
  onFlip: (id: string) => void;
  className?: string;
  locale?: TarotLocale;
}

function getRomanNumeral(val: number): string {
  const romanMap: Record<number, string> = {
    0: "0",
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
    6: "VI",
    7: "VII",
    8: "VIII",
    9: "IX",
    10: "X",
    11: "XI",
    12: "XII",
    13: "XIII",
    14: "XIV",
    15: "XV",
    16: "XVI",
    17: "XVII",
    18: "XVIII",
    19: "XIX",
    20: "XX",
    21: "XXI",
  };
  return romanMap[val] ?? `${val}`;
}

function CardSigil({ suit, name }: { suit: string; name: string }) {
  const lower = name.toLowerCase();

  if (lower.includes("sun")) {
    return (
      <svg
        viewBox="0 0 100 100"
        className="size-20 text-foreground/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="50" cy="50" r="18" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="14" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 50 + Math.cos(angle) * 20;
          const y1 = 50 + Math.sin(angle) * 20;
          const x2 = 50 + Math.cos(angle) * (i % 2 === 0 ? 32 : 26);
          const y2 = 50 + Math.sin(angle) * (i % 2 === 0 ? 32 : 26);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </svg>
    );
  }

  if (lower.includes("moon")) {
    return (
      <svg
        viewBox="0 0 100 100"
        className="size-20 text-foreground/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M50 20 A30 30 0 1 0 76 68 A26 26 0 1 1 50 20 Z" />
        <circle cx="36" cy="48" r="1.5" fill="currentColor" />
        <circle cx="68" cy="30" r="1" fill="currentColor" />
        <circle cx="72" cy="44" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (lower.includes("star")) {
    return (
      <svg
        viewBox="0 0 100 100"
        className="size-20 text-foreground/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M50 15 L54 40 L78 40 L58 55 L66 80 L50 64 L34 80 L42 55 L22 40 L46 40 Z" />
        <circle cx="50" cy="50" r="28" strokeDasharray="1 3" />
      </svg>
    );
  }

  if (suit === "cups" || lower.includes("cup")) {
    return (
      <svg
        viewBox="0 0 100 100"
        className="size-20 text-foreground/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path d="M30 30 Q50 65 70 30 Z" />
        <line x1="50" y1="52" x2="50" y2="72" />
        <line x1="38" y1="72" x2="62" y2="72" />
        <path d="M46 22 Q50 16 54 22 Z" fill="currentColor" opacity="0.6" />
        <circle cx="50" cy="50" r="34" strokeDasharray="1 3" />
      </svg>
    );
  }

  if (suit === "swords" || lower.includes("sword")) {
    return (
      <svg
        viewBox="0 0 100 100"
        className="size-20 text-foreground/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <line x1="50" y1="18" x2="50" y2="70" strokeWidth="1.8" />
        <path d="M46 22 L50 14 L54 22 Z" fill="currentColor" />
        <line x1="38" y1="64" x2="62" y2="64" strokeWidth="1.8" />
        <circle cx="50" cy="76" r="3" />
        <circle cx="50" cy="46" r="32" strokeDasharray="1 3" />
      </svg>
    );
  }

  if (suit === "wands" || lower.includes("wand")) {
    return (
      <svg
        viewBox="0 0 100 100"
        className="size-20 text-foreground/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <line x1="34" y1="78" x2="66" y2="22" strokeWidth="1.8" />
        <circle cx="68" cy="18" r="4" fill="currentColor" />
        <path d="M48 48 Q56 42 54 36" />
        <path d="M44 60 Q38 54 42 48" />
        <circle cx="50" cy="50" r="32" strokeDasharray="1 3" />
      </svg>
    );
  }

  if (suit === "pentacles" || lower.includes("pentacle")) {
    return (
      <svg
        viewBox="0 0 100 100"
        className="size-20 text-foreground/80"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <circle cx="50" cy="50" r="28" />
        <circle cx="50" cy="50" r="24" strokeDasharray="2 2" />
        <path d="M50 26 L57 48 L35 34 L65 34 L43 48 Z" />
      </svg>
    );
  }

  // Universal Occult Celestial Sigil
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-20 text-foreground/80"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <circle cx="50" cy="50" r="32" />
      <circle cx="50" cy="50" r="28" strokeDasharray="1 2.5" />
      <polygon points="50,22 74,64 26,64" opacity="0.6" />
      <polygon points="50,78 74,36 26,36" opacity="0.6" />
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}

export function TarotCard({
  card,
  isSelected,
  onFlip,
  className,
  locale = "id",
}: TarotCardProps) {
  const roman = getRomanNumeral(card.card.value_int);
  const imageUrl = useMemo(
    () => getTarotImageUrl(card.card.name_short, 480),
    [card.card.name_short],
  );
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const cardPreset = useMemo(() => {
    const lower = card.card.name.toLowerCase();
    if (
      lower.includes("star") ||
      lower.includes("wheel") ||
      lower.includes("sun")
    )
      return "stars";
    if (
      lower.includes("moon") ||
      lower.includes("world") ||
      lower.includes("priestess")
    )
      return "cosmos";
    return "gold";
  }, [card.card.name]);

  return (
    <HoloCard
      preset={cardPreset}
      intensity={0.9}
      edgeSparkle={0.8}
      glare={0.4}
      radius={24}
      width={260}
      aspectRatio={260 / 420}
      faceDown={!card.isFlipped}
      onFlip={() => onFlip(card.id)}
      foilColor="#e2e6ec"
      alt={`${card.positionName}: ${card.card.name}. ${locale === "id" ? "Klik untuk membalik." : "Click to flip."}`}
      ariaPressed={card.isFlipped}
      className={cn(
        "rounded-3xl shadow-md transition-shadow duration-300",
        isSelected && "shadow-xl",
        className,
      )}
      backContent={
        <div className="w-full h-full p-2.5 bg-card flex flex-col justify-between overflow-hidden">
          <div className="relative w-full h-full rounded-2xl p-3.5 flex flex-col justify-between items-center bg-muted/20">
            {/* Top Info */}
            <div className="w-full flex items-center justify-between text-[10px] font-mono tracking-widest text-muted-foreground">
              <span>{card.positionName}</span>
              <span>{roman}</span>
            </div>

            {/* Guilloché Diamond Centerpiece */}
            <Image src={"/favicon.ico"} alt="" width={100} height={100} />

            {/* Bottom Prompt */}
            <div className="w-full text-center">
              <span className="text-[10px] font-mono tracking-widest text-muted-foreground">
                {locale === "id" ? "Sentuh untuk Membuka" : "Tap to Reveal"}
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div className="w-full h-full bg-card flex flex-col justify-between overflow-hidden text-card-foreground">
        <div className="relative w-full h-full rounded-2xl border border-border/40 flex flex-col justify-between items-center bg-transparent">
          <div className="relative my-2 flex w-full min-h-0 flex-1 items-center justify-center">
            {imageUrl && !imageFailed ? (
              <div
                className={cn(
                  "relative h-full aspect-7/12  max-w-full overflow-hidden rounded-xl border border-border/40 bg-muted/30 transition-transform duration-500",
                  card.isReversed && "rotate-180",
                )}
              >
                {!imageLoaded && (
                  <div
                    className="absolute inset-0 animate-pulse bg-muted/50"
                    aria-hidden
                  />
                )}
                <Image
                  src={imageUrl}
                  alt={card.card.name}
                  fill
                  sizes="160px"
                  unoptimized
                  draggable={false}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageFailed(true)}
                  className={cn(
                    "object-cover select-none transition-opacity duration-300",
                    imageLoaded ? "opacity-100" : "opacity-0",
                  )}
                />
              </div>
            ) : (
              <div
                className={cn(
                  "relative flex flex-col items-center justify-center p-3 transition-transform duration-500",
                  card.isReversed && "rotate-180",
                )}
              >
                <div className="relative size-28 rounded-t-full rounded-b-xl border border-border/40 flex items-center justify-center bg-muted/30">
                  <CardSigil suit={card.card.suit} name={card.card.name} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HoloCard>
  );
}
