"use client";

import type { DrawnCard, TarotLocale } from "../types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReadingSummaryProps {
  cards: DrawnCard[];
  query?: string;
  locale?: TarotLocale;
}

export function ReadingSummary({ cards, query, locale = "id" }: ReadingSummaryProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {/* Optional Intention Header */}
      {query && query.trim().length > 0 && (
        <div className="w-full text-center">
          <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">
            {locale === "id" ? "Fokus Niat:" : "Focus:"} <span className="text-foreground italic font-sans lowercase">&ldquo;{query.trim()}&rdquo;</span>
          </p>
        </div>
      )}

      {/* Structured Card Insights */}
      <div
        className={cn(
          "w-full grid gap-4",
          cards.length === 1
            ? "grid-cols-1 max-w-md mx-auto"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {cards.map((drawn) => {
          const meaning = drawn.isReversed ? drawn.card.meaning_rev : drawn.card.meaning_up;
          const shortMeaning = meaning.split(".")[0] + ".";

          return (
            <div
              key={drawn.id}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-border/40 bg-card p-4 sm:p-5 text-card-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10 text-left"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-muted-foreground">
                  <span>{drawn.positionName}</span>
                  <Badge
                    variant={drawn.isReversed ? "destructive" : "secondary"}
                    className="text-[10px] px-1.5 py-0 font-mono tracking-widest uppercase"
                  >
                    {drawn.isReversed
                      ? locale === "id" ? "TERBALIK" : "REV"
                      : locale === "id" ? "TEGAK" : "UP"}
                  </Badge>
                </div>

                <h4 className="font-serif font-bold text-base tracking-wide text-foreground">
                  {drawn.card.name}
                </h4>

                {drawn.card.keywords && drawn.card.keywords.length > 0 && (
                  <p className="text-[11px] font-mono text-muted-foreground">
                    {drawn.card.keywords.slice(0, 3).join(" · ")}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed font-sans border-t border-border/30 pt-2.5">
                {shortMeaning}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
