"use client";

import type { LovePredictionResult } from "../types";

interface SpeakerStatsCardProps {
  result: LovePredictionResult;
}

export function SpeakerStatsCard({ result }: SpeakerStatsCardProps) {
  const { speaker_breakdown, sweetest_message, coldest_message, total_turns } =
    result;

  const speakers = Object.entries(speaker_breakdown);

  if (total_turns <= 1 && speakers.length <= 1) {
    return null;
  }

  return (
    <div
      data-slot="speaker-stats-card"
      className="flex flex-col gap-6 rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 backdrop-blur-md"
    >
      <div className="flex flex-col gap-1 border-b border-border/20 pb-4">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Perbandingan Antar Penutur
        </h3>
        <p className="text-xs text-muted-foreground">
          Distribusi afeksi dan jumlah pesan yang dikirimkan masing-masing pihak.
        </p>
      </div>

      {/* Speaker Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {speakers.map(([speakerName, stats]) => (
          <div
            key={speakerName}
            className="flex flex-col justify-between rounded-2xl border border-border/30 bg-background/50 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {speakerName}
              </span>
              <span className="text-xs text-muted-foreground">
                {stats.turns_count} pesan
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stats.average_love_rate.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sweetest vs Coldest Message Highlights */}
      {(sweetest_message || coldest_message) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {sweetest_message && (
            <div className="flex flex-col gap-2 rounded-2xl border border-border/30 bg-background/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-primary">
                  Pesan Paling Hangat
                </span>
                <span className="text-xs text-muted-foreground">Top Affection</span>
              </div>
              <blockquote className="text-sm italic text-foreground/90 border-l-2 border-primary/40 pl-3">
                &ldquo;{sweetest_message}&rdquo;
              </blockquote>
            </div>
          )}

          {coldest_message && sweetest_message !== coldest_message && (
            <div className="flex flex-col gap-2 rounded-2xl border border-border/30 bg-background/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  Pesan Paling Datar / Dingin
                </span>
                <span className="text-xs text-muted-foreground">Lowest Affection</span>
              </div>
              <blockquote className="text-sm italic text-foreground/80 border-l-2 border-border/40 pl-3">
                &ldquo;{coldest_message}&rdquo;
              </blockquote>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
