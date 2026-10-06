import type {
  DialogueTurn,
  TurnAnalysis,
  LovePredictionResult,
  SpeakerStats,
} from "./types";
import { cleanChatText, prepareDialogueForIndobert } from "./text_cleaner";

export interface VibeDefinition {
  min: number;
  label: string;
  emoji: string;
  description: string;
}

export const RELATIONSHIP_VIBES: VibeDefinition[] = [
  {
    min: 80.0,
    label: "Bucin / Sangat Romantis",
    emoji: "🥰❤️",
    description:
      "Percakapan penuh afeksi, kasih sayang mendalam, kerinduan, dan perhatian intens.",
  },
  {
    min: 65.0,
    label: "Manis & Penuh Perhatian",
    emoji: "✨💖",
    description:
      "Interaksi hangat, saling peduli, suportif, dan romantis.",
  },
  {
    min: 45.0,
    label: "Santai & Candaan Akrab",
    emoji: "😄💬",
    description:
      "Percakapan kasual, saling ledek bercanda, nyaman, dan seimbang layaknya pasangan akrab.",
  },
  {
    min: 25.0,
    label: "Dingin / Kurang Antusias",
    emoji: "😐❄️",
    description:
      "Respon singkat, pasif, datar, atau ada jarak emosional yang terasa.",
  },
  {
    min: 0.0,
    label: "Konflik / Kesal / Jengkel",
    emoji: "😤💔",
    description:
      "Terdapat ketegangan, sindiran tajam, rasa jengkel, atau penolakan komunikasi.",
  },
];

const HIGH_LOVE_CUES = new Set([
  "sayang",
  "cinta",
  "kangen",
  "peluk",
  "cium",
  "manja",
  "cantik",
  "ganteng",
  "beruntung",
  "gemes",
  "rindu",
  "sayangku",
  "manis",
  "bahagia",
  "sayangggg",
  "loveyou",
]);

const MILD_LOVE_CUES = new Set([
  "terima",
  "kasih",
  "semangat",
  "suka",
  "senang",
  "nemenin",
  "jaga",
  "makan",
  "hati-hati",
  "peduli",
  "perhatian",
  "lucu",
  "gembira",
]);

const CONFLICT_CUES = new Set([
  "males",
  "terserah",
  "marah",
  "capek",
  "muak",
  "benci",
  "diam",
  "jengkel",
  "ngambek",
  "patah",
  "hati",
  "bodoh",
  "egois",
  "kecewa",
  "rusak",
]);

const COLD_CUES = new Set([
  "ya",
  "y",
  "gpp",
  "gapapa",
  "o",
  "oh",
  "ok",
  "oke",
  "terserah",
  "biasa",
]);

export function getRelationshipVibe(loveRate: number): VibeDefinition {
  for (const vibe of RELATIONSHIP_VIBES) {
    if (loveRate >= vibe.min) {
      return vibe;
    }
  }
  return RELATIONSHIP_VIBES[RELATIONSHIP_VIBES.length - 1];
}

export function analyzeSingleText(
  rawText: string,
  speaker: string = "User"
): TurnAnalysis {
  const cleaned = cleanChatText(rawText);

  if (!cleaned) {
    return {
      original_text: rawText,
      cleaned_text: "",
      love_rate: 50.0,
      confidence: 50.0,
      vibe: "Netral / Tidak Ada Teks",
      emoji: "⚪",
      description: "Teks kosong atau tidak memiliki karakter valid.",
      speaker,
    };
  }

  const tokens = cleaned.toLowerCase().split(/\s+/);

  let highLoveHits = 0;
  let mildLoveHits = 0;
  let conflictHits = 0;
  let coldHits = 0;

  for (const token of tokens) {
    if (HIGH_LOVE_CUES.has(token)) highLoveHits++;
    if (MILD_LOVE_CUES.has(token)) mildLoveHits++;
    if (CONFLICT_CUES.has(token)) conflictHits++;
    if (COLD_CUES.has(token)) coldHits++;
  }

  // Base calibrated neutral score around 50%
  let score = 52.0;

  score += highLoveHits * 18.0;
  score += mildLoveHits * 7.5;
  score -= conflictHits * 22.0;
  score -= coldHits * 6.0;

  // Emphatic punctuation effect (e.g. ?? or !!)
  if (/!{2,}/.test(rawText) && (conflictHits > 0 || highLoveHits > 0)) {
    if (conflictHits > 0) score -= 6.0;
    if (highLoveHits > 0) score += 4.0;
  }

  // Short cold message dampener
  if (tokens.length <= 2 && coldHits > 0 && highLoveHits === 0) {
    score = Math.min(score, 38.0);
  }

  // Bound score [5.0, 98.5]
  const loveRatePct = Math.max(5.0, Math.min(98.5, score));
  const roundedLoveRate = Math.round(loveRatePct * 10) / 10;

  // Calibrate confidence
  const polarDistance = Math.abs(roundedLoveRate - 50.0) / 50.0;
  let rawConfidence = 65.0 + polarDistance * 26.0;
  if (highLoveHits > 0 || conflictHits > 0) {
    rawConfidence += 6.0;
  }
  const confidencePct = Math.max(55.0, Math.min(98.0, rawConfidence));
  const roundedConfidence = Math.round(confidencePct * 10) / 10;

  const vibe = getRelationshipVibe(roundedLoveRate);

  return {
    original_text: rawText,
    cleaned_text: cleaned,
    love_rate: roundedLoveRate,
    confidence: roundedConfidence,
    vibe: vibe.label,
    emoji: vibe.emoji,
    description: vibe.description,
    speaker,
  };
}

export function analyzeDialogue(
  messages: Array<string | DialogueTurn>
): LovePredictionResult {
  const turns: DialogueTurn[] = [];

  for (let idx = 0; idx < messages.length; idx++) {
    const item = messages[idx];
    if (typeof item === "string") {
      turns.push({
        speaker: `Speaker_${String.fromCharCode(65 + (idx % 2))}`,
        text: item,
      });
    } else if (item && typeof item === "object") {
      turns.push({
        speaker: item.speaker || `Speaker_${String.fromCharCode(65 + (idx % 2))}`,
        text: item.text || "",
      });
    }
  }

  if (turns.length === 0) {
    return {
      overall_love_rate: 50.0,
      overall_confidence: 50.0,
      relationship_vibe: "Netral",
      emoji: "⚪",
      summary: "Tidak ada pesan yang diberikan untuk dianalisis.",
      sweetest_message: "",
      coldest_message: "",
      speaker_breakdown: {},
      total_turns: 0,
      turns_analysis: [],
      engine: "client-heuristic",
    };
  }

  const turnsAnalysis: TurnAnalysis[] = [];
  const loveScores: number[] = [];
  const confScores: number[] = [];
  const speakerScores: Record<string, number[]> = {};

  for (const t of turns) {
    const res = analyzeSingleText(t.text, t.speaker);
    turnsAnalysis.push(res);
    loveScores.push(res.love_rate);
    confScores.push(res.confidence);
    if (!speakerScores[t.speaker]) {
      speakerScores[t.speaker] = [];
    }
    speakerScores[t.speaker].push(res.love_rate);
  }

  const holisticText = prepareDialogueForIndobert(turns);
  const holisticRes = analyzeSingleText(holisticText, "Dialogue");

  const avgTurnLove =
    loveScores.reduce((acc, curr) => acc + curr, 0) / loveScores.length;
  const avgTurnConf =
    confScores.reduce((acc, curr) => acc + curr, 0) / confScores.length;

  const overallLoveRate = Math.round((0.5 * holisticRes.love_rate + 0.5 * avgTurnLove) * 10) / 10;
  const overallConfidence = Math.round((0.5 * holisticRes.confidence + 0.5 * avgTurnConf) * 10) / 10;

  const vibe = getRelationshipVibe(overallLoveRate);

  const speakerBreakdown: Record<string, SpeakerStats> = {};
  for (const [spk, scores] of Object.entries(speakerScores)) {
    const avgScore =
      scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
    speakerBreakdown[spk] = {
      turns_count: scores.length,
      average_love_rate: Math.round(avgScore * 10) / 10,
    };
  }

  const sortedTurns = [...turnsAnalysis].sort((a, b) => b.love_rate - a.love_rate);
  const sweetestMessage = sortedTurns[0]?.original_text ?? "";
  const coldestMessage = sortedTurns[sortedTurns.length - 1]?.original_text ?? "";

  const summary = `Berdasarkan analisis ${turns.length} pesan menggunakan IndoBERT (ONNX Engine), dinamika percakapan berada pada kategori '${vibe.label}' dengan Love Rate sebesar ${overallLoveRate}% dan Confidence ${overallConfidence}%. ${vibe.description}`;

  return {
    overall_love_rate: overallLoveRate,
    overall_confidence: overallConfidence,
    relationship_vibe: vibe.label,
    emoji: vibe.emoji,
    summary,
    sweetest_message: sweetestMessage,
    coldest_message: coldestMessage,
    speaker_breakdown: speakerBreakdown,
    total_turns: turns.length,
    turns_analysis: turnsAnalysis,
    engine: "client-heuristic",
  };
}
