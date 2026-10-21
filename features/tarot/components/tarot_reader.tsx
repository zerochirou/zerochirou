"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { DrawnCard, SpreadType, ReadingStatus } from "../types";
import { SPREAD_OPTIONS } from "../constants";
import { fetchTarotSpread } from "../services";
import { TarotCard } from "./tarot_card";
import { ReadingSummary } from "./reading_summary";
import { ShareActions } from "./share_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Eye, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export function TarotReader() {
  const [spread, setSpread] = useState<SpreadType>("three_card");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ReadingStatus>("idle");
  const [cards, setCards] = useState<DrawnCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeSpreadInfo = SPREAD_OPTIONS[spread] || SPREAD_OPTIONS.three_card;

  const handleDrawCards = () => {
    setStatus("shuffling");
    setErrorMsg(null);
    setCards([]);
    setSelectedCardId(null);

    startTransition(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));
        const result = await fetchTarotSpread(spread);
        setCards(result.cards);
        setStatus("revealed");
      } catch (err) {
        console.error("Tarot draw error:", err);
        setErrorMsg("Failed to draw cards. Please try again.");
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
    <div className="w-full flex flex-col items-center gap-8">
      {/* 1. IDLE / SPREAD SELECTION */}
      {status === "idle" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg flex flex-col items-center gap-6 text-center"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
              Tarot Reflection
            </h2>
            <p className="text-xs text-muted-foreground font-sans">
              Choose your spread and center your attention.
            </p>
          </div>

          {/* Segmented Spread Toggle */}
          <div
            role="radiogroup"
            aria-label="Tarot Spread Options"
            className="inline-flex rounded-3xl p-1 bg-muted/50 border border-border/40"
          >
            <button
              type="button"
              role="radio"
              aria-checked={spread === "single"}
              onClick={() => setSpread("single")}
              className={cn(
                "px-4 py-1.5 rounded-3xl text-xs font-mono tracking-wider transition-all cursor-pointer",
                spread === "single"
                  ? "bg-card text-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Single Card
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={spread === "three_card"}
              onClick={() => setSpread("three_card")}
              className={cn(
                "px-4 py-1.5 rounded-3xl text-xs font-mono tracking-wider transition-all cursor-pointer",
                spread === "three_card"
                  ? "bg-card text-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Trinity (Past · Present · Future)
            </button>
          </div>

          {/* Minimal Inquiry Input using Field & Input primitives */}
          <Field className="w-full max-w-sm">
            <FieldLabel htmlFor="tarot-query-input" className="sr-only">
              Focus or Intention
            </FieldLabel>
            <Input
              id="tarot-query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Focus or intention (optional)..."
              className="text-center rounded-3xl"
            />
          </Field>

          {/* Draw Button with Spinner composition */}
          <Button
            size="default"
            onClick={handleDrawCards}
            disabled={isPending}
            className="rounded-4xl px-7 h-10 text-xs tracking-wider uppercase font-mono shadow-sm cursor-pointer"
          >
            {isPending ? (
              <>
                <Spinner data-icon="inline-start" />
                <span>Shuffling...</span>
              </>
            ) : (
              <>
                <Sparkles data-icon="inline-start" />
                <span>Draw Cards</span>
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* 2. SHUFFLING STATE — using Skeleton & Shimmer utility */}
      {status === "shuffling" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-sm py-16 flex flex-col items-center justify-center gap-4 text-center"
        >
          <div className="relative flex items-center justify-center">
            <Skeleton className="w-[180px] h-[270px] rounded-3xl border border-border/40 shadow-sm" />
          </div>
          <span className="shimmer text-xs font-mono tracking-widest text-muted-foreground uppercase">
            Shuffling the deck...
          </span>
        </motion.div>
      )}

      {/* 3. ERROR STATE */}
      {status === "error" && (
        <div className="w-full max-w-md border border-border/60 rounded-3xl bg-card p-5 text-center flex flex-col items-center gap-3">
          <p className="text-xs text-foreground font-mono">{errorMsg}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs rounded-3xl border-border/60"
          >
            Return
          </Button>
        </div>
      )}

      {/* 4. REVEALED CARDS STATE */}
      {status === "revealed" && cards.length > 0 && (
        <div className="w-full flex flex-col items-center gap-8">
          {/* Top Control Bar */}
          <div className="w-full max-w-4xl flex items-center justify-between px-2 text-xs font-mono text-muted-foreground">
            <span className="uppercase tracking-widest">
              {activeSpreadInfo.title}
            </span>

            <div className="flex items-center gap-2">
              {!allFlipped && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlipAll}
                  className="rounded-3xl text-xs h-7 px-2.5 border-border/60"
                >
                  <Eye data-icon="inline-start" />
                  <span>Reveal All</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="rounded-3xl text-xs h-7 px-2 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw data-icon="inline-start" />
                <span>Reset</span>
              </Button>
            </div>
          </div>

          {/* Cards Altar */}
          <div
            className={cn(
              "w-full max-w-5xl grid justify-items-center gap-6",
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
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Prompt if any cards are unflipped */}
          {!allFlipped && (
            <p className="text-[11px] font-mono tracking-wider text-muted-foreground uppercase">
              Click a card to reveal its insight
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
              <ReadingSummary cards={cards} query={query} />

              <ShareActions
                cards={cards}
                spread={spread}
                query={query}
                onReset={handleReset}
                className="w-full pt-4 border-t border-border/40"
              />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
