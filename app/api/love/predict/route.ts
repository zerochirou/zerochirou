import { NextResponse } from "next/server";
import {
  analyzeSingleText,
  analyzeDialogue,
} from "@/features/love/analyzer_engine";
import type { LovePredictionResult } from "@/features/love/types";

const EXTERNAL_API_URL =
  process.env.LOVE_API_URL || "http://127.0.0.1:8000/api/predict";

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Format request tidak valid. Harap kirimkan payload JSON yang valid.",
        },
        { status: 400 }
      );
    }

    const { text, messages } = body as {
      text?: string;
      messages?: Array<string | { speaker?: string; text?: string }>;
    };

    if (!text && (!messages || !Array.isArray(messages) || messages.length === 0)) {
      return NextResponse.json(
        {
          error:
            "Parameter tidak valid. Mohon sertakan 'text' (string) atau 'messages' (array).",
        },
        { status: 400 }
      );
    }

    // 1. Coba delegasikan ke Backend ONNX Service berkecepatan tinggi jika tersedia
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const upstreamPayload = text !== undefined ? { text } : { messages };
      const upstreamRes = await fetch(EXTERNAL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(upstreamPayload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (upstreamRes.ok) {
        const onnxData = (await upstreamRes.json()) as LovePredictionResult;
        return NextResponse.json({
          ...onnxData,
          engine: "onnx-server",
          latency_ms: Date.now() - startTime,
        });
      }
    } catch {
      // Backend eksternal tidak aktif atau timeout -> fallback transparan ke engine lokal
    }

    // 2. Fallback resilient engine (Node.js runtime / Zero-Downtime Calibrated NLP)
    let result: LovePredictionResult;

    if (typeof text === "string") {
      const turnRes = analyzeSingleText(text, "User");
      result = {
        overall_love_rate: turnRes.love_rate,
        overall_confidence: turnRes.confidence,
        relationship_vibe: turnRes.vibe,
        emoji: turnRes.emoji,
        summary: `Berdasarkan analisis pesan tunggal, dinamika berada pada kategori '${turnRes.vibe}' dengan skor ${turnRes.love_rate}% dan confidence ${turnRes.confidence}%. ${turnRes.description}`,
        sweetest_message: turnRes.original_text,
        coldest_message: turnRes.original_text,
        speaker_breakdown: {
          User: {
            turns_count: 1,
            average_love_rate: turnRes.love_rate,
          },
        },
        total_turns: 1,
        turns_analysis: [turnRes],
        engine: "edge-fallback",
        latency_ms: Date.now() - startTime,
      };
    } else {
      const dialogueTurns = (messages ?? []).map((m) => {
        if (typeof m === "string") return m;
        return {
          speaker: m.speaker || "User",
          text: m.text || "",
        };
      });

      const diagRes = analyzeDialogue(dialogueTurns);
      result = {
        ...diagRes,
        engine: "edge-fallback",
        latency_ms: Date.now() - startTime,
      };
    }

    return NextResponse.json(result);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: `Gagal memproses prediksi: ${errorMsg}` },
      { status: 500 }
    );
  }
}
