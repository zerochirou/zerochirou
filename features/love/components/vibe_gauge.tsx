"use client";

import { motion } from "motion/react";
import type { LovePredictionResult } from "../types";

interface VibeGaugeProps {
  result: LovePredictionResult;
}

export function VibeGauge({ result }: VibeGaugeProps) {
  const {
    overall_love_rate,
    overall_confidence,
    relationship_vibe,
    emoji,
    summary,
    latency_ms,
    engine,
  } = result;

  const boundedScore = Math.max(0, Math.min(100, overall_love_rate));

  return (
    <div
      data-slot="vibe-gauge"
      className="flex flex-col gap-6 rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 backdrop-blur-md shadow-sm"
    >
      {/* Top Header: Vibe & Emoji */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/20 pb-5">
        <div className="flex items-center gap-3">
          <span className="text-3xl sm:text-4xl select-none" aria-hidden="true">
            {emoji}
          </span>
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Dinamika Hubungan
            </span>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {relationship_vibe}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {engine && (
            <span className="rounded-full border border-border/40 bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              {engine === "onnx-server"
                ? "ONNX Runtime"
                : "Calibrated Transformer Engine"}
            </span>
          )}
          {latency_ms !== undefined && (
            <span className="rounded-full border border-border/40 bg-secondary/50 px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
              {latency_ms}ms
            </span>
          )}
        </div>
      </div>

      {/* Primary Metrics: Love Rate & Confidence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Love Rate Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/30 bg-background/50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Love Rate
            </span>
            <span className="text-xs font-medium text-primary">
              Skor Afeksi
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              {overall_love_rate.toFixed(1)}
            </span>
            <span className="text-lg font-medium text-muted-foreground">%</span>
          </div>

          {/* Animated Gauge Track */}
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/60">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${boundedScore}%` }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0% (Konflik)</span>
              <span>50% (Santai)</span>
              <span>100% (Bucin)</span>
            </div>
          </div>
        </div>

        {/* Confidence Card */}
        <div className="flex flex-col justify-between rounded-2xl border border-border/30 bg-background/50 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">
              Tingkat Kepastian
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              Confidence
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              {overall_confidence.toFixed(1)}
            </span>
            <span className="text-lg font-medium text-muted-foreground">%</span>
          </div>

          {/* Animated Confidence Track */}
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/60">
              <motion.div
                className="h-full rounded-full bg-muted-foreground/60"
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(100, overall_confidence))}%` }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Model Certainty</span>
              <span>
                {overall_confidence >= 80 ? "Sangat Kuat" : "Cukup Yakin"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Narrative */}
      <div className="rounded-2xl border border-border/20 bg-background/40 p-4 sm:p-5 text-sm leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">Interpretasi: </span>
        {summary}
      </div>
    </div>
  );
}
