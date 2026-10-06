"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { LOVE_PRESETS } from "../presets";
import { parseChatTurns } from "../text_cleaner";
import { analyzeSingleText, analyzeDialogue } from "../analyzer_engine";
import { VibeGauge } from "./vibe_gauge";
import { SpeakerStatsCard } from "./speaker_stats_card";
import { ChatTurnList } from "./chat_turn_list";
import type { LovePredictionResult } from "../types";

type InputMode = "single" | "conversation";
type ExecutionEngine = "api" | "client";

export function LoveView() {
  const [mode, setMode] = useState<InputMode>("single");
  const [engineMode, setEngineMode] = useState<ExecutionEngine>("api");

  // Input states
  const [singleText, setSingleText] = useState(
    "kangeeeennn bgt ayanggg ❤️🥺 pengen meluk kamu"
  );
  const [conversationText, setConversationText] = useState(
    `Aurel: kangeeeennn bgt ayanggg ❤️🥺 pengen meluk kamu\nRizky: aku jg kangen parah syg, nanti malem aku jemput yaa 🥰\nAurel: beneran yaa? makasih ayangku tersayang, love you most! 💕\nRizky: selalu buat kamu cantikku 🫂 jangan lupa mam ya`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<LovePredictionResult | null>(null);

  const handleSelectPreset = (presetId: string) => {
    const selected = LOVE_PRESETS.find((p) => p.id === presetId);
    if (!selected) return;

    const formatted = selected.messages
      .map((m) => `${m.speaker}: ${m.text}`)
      .join("\n");

    setConversationText(formatted);
    setError(null);
  };

  const handleAnalyze = async () => {
    setError(null);

    if (mode === "single") {
      const trimmed = singleText.trim();
      if (!trimmed) {
        setError("Silakan masukkan teks pesan terlebih dahulu.");
        return;
      }

      setIsLoading(true);
      const startTime = Date.now();

      try {
        if (engineMode === "client") {
          // Instant On-Device / Client-Side Heuristic Inference
          const turn = analyzeSingleText(trimmed, "User");
          const localRes: LovePredictionResult = {
            overall_love_rate: turn.love_rate,
            overall_confidence: turn.confidence,
            relationship_vibe: turn.vibe,
            emoji: turn.emoji,
            summary: `Berdasarkan analisis pesan tunggal, dinamika berada pada kategori '${turn.vibe}' dengan skor ${turn.love_rate}% dan confidence ${turn.confidence}%. ${turn.description}`,
            sweetest_message: turn.original_text,
            coldest_message: turn.original_text,
            speaker_breakdown: {
              User: { turns_count: 1, average_love_rate: turn.love_rate },
            },
            total_turns: 1,
            turns_analysis: [turn],
            engine: "client-heuristic",
            latency_ms: Date.now() - startTime,
          };
          setResult(localRes);
        } else {
          // API Server (ONNX Backend with Edge Fallback)
          const res = await fetch("/api/love/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: trimmed }),
          });

          if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
          }

          const data = (await res.json()) as LovePredictionResult;
          setResult(data);
        }
      } catch {
        // Fallback gracefully to local client evaluation on network error
        const fallbackTurn = analyzeSingleText(trimmed, "User");
        setResult({
          overall_love_rate: fallbackTurn.love_rate,
          overall_confidence: fallbackTurn.confidence,
          relationship_vibe: fallbackTurn.vibe,
          emoji: fallbackTurn.emoji,
          summary: `Berdasarkan analisis lokal (offline-fallback), dinamika berada pada kategori '${fallbackTurn.vibe}' (${fallbackTurn.love_rate}%).`,
          sweetest_message: fallbackTurn.original_text,
          coldest_message: fallbackTurn.original_text,
          speaker_breakdown: {
            User: { turns_count: 1, average_love_rate: fallbackTurn.love_rate },
          },
          total_turns: 1,
          turns_analysis: [fallbackTurn],
          engine: "client-heuristic",
          latency_ms: Date.now() - startTime,
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Conversation mode
      const trimmed = conversationText.trim();
      if (!trimmed) {
        setError("Silakan masukkan teks percakapan terlebih dahulu.");
        return;
      }

      const turns = parseChatTurns(trimmed);
      if (turns.length === 0) {
        setError("Format percakapan tidak terdeteksi. Gunakan format 'Nama: Pesan'.");
        return;
      }

      setIsLoading(true);
      const startTime = Date.now();

      try {
        if (engineMode === "client") {
          const localRes = analyzeDialogue(turns);
          setResult({
            ...localRes,
            latency_ms: Date.now() - startTime,
          });
        } else {
          const res = await fetch("/api/love/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: turns }),
          });

          if (!res.ok) {
            throw new Error(`Server returned HTTP ${res.status}`);
          }

          const data = (await res.json()) as LovePredictionResult;
          setResult(data);
        }
      } catch {
        const localFallback = analyzeDialogue(turns);
        setResult({
          ...localFallback,
          engine: "client-heuristic",
          latency_ms: Date.now() - startTime,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      data-slot="love-view"
      className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8 sm:py-12"
    >
      {/* Header Section */}
      <div className="flex flex-col gap-3 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <span className="rounded-full border border-border/40 bg-secondary/60 px-3 py-1 text-xs font-medium text-foreground">
            IndoBERT Base Transformer
          </span>
          <span className="rounded-full border border-border/30 bg-muted/40 px-2.5 py-1 text-[11px] text-muted-foreground">
            ONNX Runtime Accelerated
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Love Rate Predictor
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
          Evaluasi tingkat afeksi, kerinduan, dan dinamika emosional percakapan
          bahasa Indonesia menggunakan pipeline NLP subword terkalibrasi.
        </p>
      </div>

      {/* Main Control Card */}
      <div className="flex flex-col gap-6 rounded-3xl border border-border/40 bg-card/70 p-6 sm:p-8 backdrop-blur-md shadow-sm">
        {/* Mode Selector & Execution Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/20 pb-5">
          {/* Tabs */}
          <div className="flex items-center rounded-2xl border border-border/40 bg-background/60 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("single");
                setError(null);
              }}
              className={`rounded-xl px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                mode === "single"
                  ? "bg-secondary text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pesan Tunggal
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("conversation");
                setError(null);
              }}
              className={`rounded-xl px-4 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                mode === "conversation"
                  ? "bg-secondary text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Percakapan (Multi-Turn)
            </button>
          </div>

          {/* Engine Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Inference:</span>
            <button
              type="button"
              onClick={() =>
                setEngineMode(engineMode === "api" ? "client" : "api")
              }
              className="rounded-full border border-border/40 bg-secondary/40 px-3 py-1 text-xs font-mono text-foreground hover:bg-secondary transition-colors"
              title="Pilih antara Server Inference API atau On-Device Client Inference"
            >
              {engineMode === "api" ? "Server API (Auto)" : "Client-Side (Local)"}
            </button>
          </div>
        </div>

        {/* Input Area */}
        {mode === "single" ? (
          <div className="flex flex-col gap-3">
            <label
              htmlFor="single-message-input"
              className="text-xs font-medium text-foreground"
            >
              Teks Pesan Chat
            </label>
            <Textarea
              id="single-message-input"
              rows={3}
              value={singleText}
              onChange={(e) => setSingleText(e.target.value)}
              placeholder="Ketik atau tempel pesan di sini... contoh: 'kangeeeennn bgt ayanggg ❤️🥺'"
            />
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-muted-foreground">Contoh Cepat:</span>
              <button
                type="button"
                onClick={() =>
                  setSingleText("makasih ya sayang udah selalu nemenin aku 🥰")
                }
                className="rounded-full border border-border/30 bg-background/50 px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Manis
              </button>
              <button
                type="button"
                onClick={() =>
                  setSingleText("terserah lu aja deh, males bgt ngomong sm lo")
                }
                className="rounded-full border border-border/30 bg-background/50 px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Konflik
              </button>
              <button
                type="button"
                onClick={() =>
                  setSingleText("wkwkwk mie ayam mulu lu, ga ada bosennya")
                }
                className="rounded-full border border-border/30 bg-background/50 px-2.5 py-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Candaan
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Presets Bar */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">
                Preset Dinamika Percakapan
              </span>
              <div className="flex flex-wrap gap-2">
                {LOVE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPreset(p.id)}
                    className="flex items-center gap-1.5 rounded-full border border-border/30 bg-background/60 px-3 py-1 text-xs text-foreground hover:bg-secondary transition-all"
                  >
                    <span>{p.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="dialogue-chat-input"
                className="text-xs font-medium text-foreground"
              >
                Log Percakapan (Format: &apos;Nama: Pesan&apos; atau Chat WhatsApp)
              </label>
              <Textarea
                id="dialogue-chat-input"
                rows={6}
                value={conversationText}
                onChange={(e) => setConversationText(e.target.value)}
                placeholder="Speaker A: halo ayang&#10;Speaker B: halo manis ❤️"
              />
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (mode === "single") setSingleText("");
              else setConversationText("");
              setResult(null);
              setError(null);
            }}
          >
            Bersihkan
          </Button>

          {isLoading ? (
            <Button disabled size="default">
              <Spinner data-icon="inline-start" />
              Menganalisis Emosi...
            </Button>
          ) : (
            <Button size="default" onClick={handleAnalyze}>
              {mode === "single"
                ? "Analisis Afeksi Pesan"
                : "Analisis Dinamika Percakapan"}
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      {result && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Hasil Analisis Dinamika
            </h2>
            <span className="text-xs text-muted-foreground">
              Total {result.total_turns} pesan
            </span>
          </div>

          <VibeGauge result={result} />
          <SpeakerStatsCard result={result} />
          <ChatTurnList turns={result.turns_analysis} />
        </div>
      )}
    </div>
  );
}
