export interface DialogueTurn {
  speaker: string;
  text: string;
}

export interface SingleTextRequest {
  text: string;
}

export interface DialogueRequest {
  messages: Array<string | DialogueTurn>;
}

export interface TurnAnalysis {
  original_text: string;
  cleaned_text: string;
  love_rate: number;
  confidence: number;
  vibe: string;
  emoji: string;
  description: string;
  speaker: string;
}

export interface SpeakerStats {
  turns_count: number;
  average_love_rate: number;
}

export interface LovePredictionResult {
  overall_love_rate: number;
  overall_confidence: number;
  relationship_vibe: string;
  emoji: string;
  summary: string;
  sweetest_message: string;
  coldest_message: string;
  speaker_breakdown: Record<string, SpeakerStats>;
  total_turns: number;
  turns_analysis: TurnAnalysis[];
  engine?: "onnx-server" | "client-heuristic" | "edge-fallback";
  latency_ms?: number;
}
