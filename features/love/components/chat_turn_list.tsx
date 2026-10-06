"use client";

import { useState } from "react";
import type { TurnAnalysis } from "../types";

interface ChatTurnListProps {
  turns: TurnAnalysis[];
}

export function ChatTurnList({ turns }: ChatTurnListProps) {
  const [showCleaned, setShowCleaned] = useState(false);

  if (!turns || turns.length === 0) {
    return null;
  }

  return (
    <div
      data-slot="chat-turn-list"
      className="flex flex-col gap-4 rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 backdrop-blur-md"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/20 pb-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Rincian Analisis Per Pesan
          </h3>
          <p className="text-xs text-muted-foreground">
            {turns.length} pesan dianalisis menggunakan normalisasi semantik IndoBERT.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCleaned(!showCleaned)}
          className="self-start sm:self-auto rounded-full border border-border/40 bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {showCleaned ? "Sembunyikan Normalisasi NLP" : "Lihat Normalisasi NLP"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {turns.map((turn, index) => (
          <div
            key={`${turn.speaker}-${index}`}
            className="flex flex-col gap-2 rounded-2xl border border-border/20 bg-background/50 p-4 transition-colors hover:bg-background/80"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {turn.speaker}
                </span>
                <span className="text-xs text-muted-foreground select-none">
                  {turn.emoji}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-foreground">
                  {turn.love_rate.toFixed(1)}%
                </span>
                <span className="text-[11px] text-muted-foreground">
                  ({turn.vibe})
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground/90">{turn.original_text}</p>

            {showCleaned && turn.cleaned_text && turn.cleaned_text !== turn.original_text && (
              <div className="rounded-xl border border-border/20 bg-muted/30 p-2.5 text-xs font-mono text-muted-foreground">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block mb-1">
                  NLP Cleaned Representation:
                </span>
                {turn.cleaned_text}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
