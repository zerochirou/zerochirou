"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { DrawnCard, SpreadType, ReadingStatus, TarotLocale } from "../types";
import { getSpreadOptions, getTarotDeck } from "../constants";
import { fetchTarotSpread } from "../services";
import { TarotCard } from "./tarot_card";
import { ReadingSummary } from "./reading_summary";
import { ShareActions } from "./share_actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SlideCommit } from "@/components/ui/slide_commit";
import { Field, FieldLabel } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function TarotReader() {
  const [locale, setLocale] = useState<TarotLocale>("id");
  const [spread, setSpread] = useState<SpreadType>("three_card");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ReadingStatus>("idle");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [sliderWidth, setSliderWidth] = useState(280);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderContainerRef.current) return;
    const updateWidth = () => {
      if (sliderContainerRef.current) {
        const w = sliderContainerRef.current.clientWidth;
        if (w > 0) setSliderWidth(w);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(sliderContainerRef.current);
    return () => ro.disconnect();
  }, [status]);

  const activeSpreadInfo = getSpreadOptions(locale)[spread] || getSpreadOptions(locale).three_card;

  const handleSwitchLocale = (nextLocale: TarotLocale) => {
    setLocale(nextLocale);
    if (cards.length > 0) {
      const nextDeck = getTarotDeck(nextLocale);
      const nextSpread = getSpreadOptions(nextLocale)[spread];
      setCards((prev) =>
        prev.map((c, i) => {
          const found = nextDeck.find((d) => d.name_short === c.card.name_short) || c.card;
          const pos = nextSpread.positions[i] || {
            name: c.positionName,
            subtitle: c.positionSubtitle,
          };
          return {
            ...c,
            card: found,
            positionName: pos.name,
            positionSubtitle: pos.subtitle,
          };
        })
      );
    }
  };

  const handleDrawCards = () => {
    setStatus("shuffling");
    setErrorMsg(null);
    setCards([]);
    setSelectedCardId(null);

    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const result = await fetchTarotSpread(spread, locale);
        setCards(result.cards);
        setStatus("revealed");
      } catch (err) {
        console.error("Tarot draw error:", err);
        setErrorMsg(
          locale === "id"
            ? "Gagal menarik kartu. Silakan coba lagi."
            : "Failed to draw cards. Please try again."
        );
        setStatus("error");
      }
    });
  };

  const handleFlipCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: !c.isFlipped } : c))
    );
    setSelectedCardId(cardId);
  };

  const handleFlipAll = () => {
    setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));
  };

  const handleReset = () => {
    setStatus("idle");
    setCards([]);
    setSelectedCardId(null);
    setErrorMsg(null);
  };

  const allFlipped = cards.length > 0 && cards.every((c) => c.isFlipped);

  return (
    <div className="w-full flex flex-col items-center gap-6 sm:gap-8 px-4 sm:px-6">
      {/* 1. IDLE / SPREAD SELECTION */}
      {status === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm sm:max-w-md flex flex-col items-center gap-5 sm:gap-6 text-center"
        >
          {/* Top Language Toggle */}
          <div
            role="radiogroup"
            aria-label={locale === "id" ? "Pilihan Bahasa" : "Language selection"}
            className="inline-flex rounded-3xl p-1 bg-muted/40 border border-border/40 text-xs"
          >
            <button
              type="button"
              role="radio"
              aria-checked={locale === "id"}
              onClick={() => handleSwitchLocale("id")}
              className={cn(
                "min-w-9 min-h-8 px-3 py-1 rounded-3xl transition-all cursor-pointer flex items-center justify-center font-medium",
                locale === "id"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              ID
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={locale === "en"}
              onClick={() => handleSwitchLocale("en")}
              className={cn(
                "min-w-9 min-h-8 px-3 py-1 rounded-3xl transition-all cursor-pointer flex items-center justify-center font-medium",
                locale === "en"
                  ? "bg-card text-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              EN
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-2 px-2">
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-foreground">
              {locale === "id" ? "Refleksi Tarot" : "Tarot Reflection"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground font-sans max-w-sm sm:max-w-md mx-auto leading-relaxed">
              {locale === "id"
                ? "Pilih sebaran kartu dan pusatkan fokus pikiran Anda."
                : "Choose your spread and center your attention."}
            </p>
          </div>

          {/* Segmented Spread Toggle */}
          <div
            role="radiogroup"
            aria-label={locale === "id" ? "Opsi Sebaran Tarot" : "Tarot Spread Options"}
            className="inline-flex rounded-3xl p-1 bg-muted/50 border border-border/40 text-xs sm:text-sm"
          >
            <button
              type="button"
              role="radio"
              aria-checked={spread === "single"}
              onClick={() => setSpread("single")}
              className={cn(
                "min-h-9 px-4 sm:px-5 py-1.5 rounded-3xl tracking-wider transition-all cursor-pointer flex items-center justify-center",
                spread === "single"
                  ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10 font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {locale === "id" ? "Satu Kartu" : "Single Card"}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={spread === "three_card"}
              onClick={() => setSpread("three_card")}
              className={cn(
                "min-h-9 px-4 sm:px-5 py-1.5 rounded-3xl tracking-wider transition-all cursor-pointer flex items-center justify-center",
                spread === "three_card"
                  ? "bg-primary text-primary-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10 font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {locale === "id"
                ? "Trinitas"
                : "Trinity"}
            </button>
          </div>

          {/* Minimal Inquiry Input using Field & Textarea primitives */}
          <Field className="w-full max-w-sm sm:max-w-md">
            <FieldLabel htmlFor="tarot-query-input" className="sr-only">
              {locale === "id" ? "Fokus atau Niat" : "Focus or Intention"}
            </FieldLabel>
            <Textarea
              id="tarot-query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                locale === "id"
                  ? "Fokus atau niat batin (opsional)..."
                  : "Focus or intention (optional)..."
              }
              rows={3}
              className=""
            />
          </Field>

          {/* Draw Button using SlideCommit */}
          <div ref={sliderContainerRef} className="w-full max-w-sm sm:max-w-md flex justify-center">
            <SlideCommit
              width={sliderWidth}
              height={52}
              radius={26}
              trackColor="var(--muted)"
              handleColor="var(--primary)"
              successColor="var(--primary)"
              label={
                locale === "id" ? "Geser untuk Tarik Kartu" : "Slide to Draw Cards"
              }
              doneLabel={
                locale === "id" ? "Mengacak..." : "Shuffling..."
              }
              errorLabel={
                locale === "id" ? "Gagal menarik" : "Draw failed"
              }
              disabled={isPending}
              onConfirm={handleDrawCards}
              className="border border-border/40 shadow-xs"
            />
          </div>
        </motion.div>
      )}

      {/* 2. SHUFFLING STATE */}
      {status === "shuffling" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-sm py-12 sm:py-16 flex flex-col items-center justify-center gap-4 text-center"
        >
          <div className="relative flex items-center justify-center">
            <Skeleton className="w-[160px] h-[240px] sm:w-[180px] sm:h-[270px] rounded-3xl border border-border/40 shadow-sm" />
          </div>
          <span className="shimmer text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">
            {locale === "id" ? "Mengacak kartu altar..." : "Shuffling the deck..."}
          </span>
        </motion.div>
      )}

      {/* 3. ERROR STATE */}
      {status === "error" && (
        <div className="w-full max-w-sm sm:max-w-md border border-border/60 rounded-3xl bg-card p-5 sm:p-6 text-center flex flex-col items-center gap-3">
          <p className="text-xs sm:text-sm text-foreground">{errorMsg}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs sm:text-sm rounded-3xl border-border/60 min-h-9 px-4"
          >
            {locale === "id" ? "Kembali" : "Return"}
          </Button>
        </div>
      )}

      {/* 4. REVEALED CARDS STATE */}
      {status === "revealed" && cards.length > 0 && (
        <div className="w-full flex flex-col items-center gap-6 sm:gap-8">
          {/* Top Control Bar */}
          <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 px-2 text-xs sm:text-sm text-muted-foreground">
            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3">
              <span className="uppercase font-medium text-[11px] sm:text-xs tracking-wider truncate max-w-[200px] sm:max-w-none">
                {activeSpreadInfo.title}
              </span>
              {/* Language Switcher in revealed view */}
              <div
                role="radiogroup"
                aria-label="Language"
                className="inline-flex rounded-2xl p-0.5 bg-muted/40 border border-border/40 text-[10px] sm:text-xs shrink-0"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={locale === "id"}
                  onClick={() => handleSwitchLocale("id")}
                  className={cn(
                    "min-w-6 min-h-6 px-2 py-0.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center",
                    locale === "id"
                      ? "bg-card text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  ID
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={locale === "en"}
                  onClick={() => handleSwitchLocale("en")}
                  className={cn(
                    "min-w-6 min-h-6 px-2 py-0.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center",
                    locale === "en"
                      ? "bg-card text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  EN
                </button>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-end gap-2 shrink-0">
              {!allFlipped && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlipAll}
                  className="rounded-3xl text-xs sm:text-sm h-8 sm:h-9 px-3 border-border/60 cursor-pointer"
                >
                  <Eye data-icon="inline-start" />
                  <span>{locale === "id" ? "Buka Semua" : "Reveal All"}</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="rounded-3xl text-xs sm:text-sm h-8 sm:h-9 px-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw data-icon="inline-start" />
                <span>{locale === "id" ? "Mulai Ulang" : "Reset"}</span>
              </Button>
            </div>
          </div>

          {/* Cards Altar */}
          <div
            className={cn(
              "w-full max-w-5xl grid justify-items-center gap-6 sm:gap-8",
              cards.length === 1
                ? "grid-cols-1 max-w-xs"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            <AnimatePresence>
              {cards.map((card, idx) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="w-full flex justify-center"
                >
                  <TarotCard
                    card={card}
                    index={idx}
                    isSelected={selectedCardId === card.id}
                    onFlip={handleFlipCard}
                    locale={locale}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Prompt if any cards are unflipped */}
          {!allFlipped && (
            <p className="text-[11px] tracking-wider text-muted-foreground uppercase">
              {locale === "id"
                ? "Sentuh kartu untuk membuka wawasan maknanya"
                : "Click a card to reveal its insight"}
            </p>
          )}

          {/* Summary & Actions when all cards revealed */}
          {allFlipped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center gap-6 mt-2"
            >
              <ReadingSummary cards={cards} query={query} locale={locale} />

              <ShareActions
                cards={cards}
                spread={spread}
                query={query}
                onReset={handleReset}
                locale={locale}
                className="w-full pt-4 border-t border-border/40"
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
