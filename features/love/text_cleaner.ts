import type { DialogueTurn } from "./types";

export const SLANG_DICT: Record<string, string> = {
  aq: "aku",
  gw: "aku",
  gua: "aku",
  gue: "aku",
  lu: "kamu",
  loe: "kamu",
  elo: "kamu",
  km: "kamu",
  kmu: "kamu",
  kamuu: "kamu",
  sy: "saya",
  syg: "sayang",
  syang: "sayang",
  ayang: "sayang",
  ayg: "sayang",
  ay: "sayang",
  beb: "sayang",
  baby: "sayang",
  babe: "sayang",
  hubby: "sayang",
  kgn: "kangen",
  bgt: "banget",
  bngt: "banget",
  ga: "tidak",
  gak: "tidak",
  gk: "tidak",
  ngga: "tidak",
  nggak: "tidak",
  nda: "tidak",
  blm: "belum",
  blom: "belum",
  belom: "belum",
  udh: "sudah",
  udah: "sudah",
  uda: "sudah",
  dah: "sudah",
  tp: "tapi",
  tpi: "tapi",
  krn: "karena",
  karna: "karena",
  dgn: "dengan",
  dg: "dengan",
  dl: "dulu",
  dlu: "dulu",
  lg: "lagi",
  lgi: "lagi",
  brp: "berapa",
  jgn: "jangan",
  knp: "kenapa",
  kpn: "kapan",
  dmn: "dimana",
  dimna: "dimana",
  bs: "bisa",
  trs: "terus",
  trus: "terus",
  org: "orang",
  bkn: "bukan",
  jd: "jadi",
  jdi: "jadi",
  sm: "sama",
  sma: "sama",
  makasi: "terima kasih",
  makasih: "terima kasih",
  mksh: "terima kasih",
  thx: "terima kasih",
  thanks: "terima kasih",
  tq: "terima kasih",
  pdhl: "padahal",
  emg: "memang",
  emang: "memang",
  bnr: "benar",
  bener: "benar",
  beneran: "benar",
  gpp: "tidak apa-apa",
  gapapa: "tidak apa-apa",
  otw: "sedang di jalan",
  y: "iya",
  ya: "iya",
  iy: "iya",
  oke: "oke",
  okee: "oke",
  okey: "oke",
  okay: "oke",
  klo: "kalau",
  kalo: "kalau",
  klau: "kalau",
  pgn: "ingin",
  pengen: "ingin",
  mauk: "mau",
  tau: "tahu",
  gatau: "tidak tahu",
  gt: "gitu",
  gitu: "begitu",
  kek: "seperti",
  kayak: "seperti",
  kyk: "seperti",
  aj: "saja",
  aja: "saja",
  plis: "tolong",
  please: "tolong",
  bucin: "sangat cinta",
  mager: "malas",
  capek: "lelah",
  cape: "lelah",
  bete: "kesal",
  ngambek: "ngambek",
  jg: "juga",
};

export const EMOJI_SENTIMENT_MAP: Record<string, string> = {
  "❤️": " cinta ",
  "💖": " cinta ",
  "💕": " cinta ",
  "💓": " cinta ",
  "💗": " cinta ",
  "💘": " cinta ",
  "🥰": " sayang ",
  "😍": " terpesona ",
  "😘": " cium ",
  "😙": " cium ",
  "😚": " sayang ",
  "🥺": " manja ",
  "🫂": " peluk ",
  "😊": " senang ",
  "☺️": " senang ",
  "😁": " gembira ",
  "😂": " tertawa ",
  "🤣": " tertawa ",
  "😆": " tertawa ",
  "😭": " menangis ",
  "😢": " sedih ",
  "😔": " kecewa ",
  "💔": " patah hati ",
  "😡": " marah ",
  "🤬": " marah ",
  "😤": " kesal ",
  "😒": " cuek ",
  "🙄": " bosan ",
  "🥱": " bosan ",
  "😴": " tidur ",
  "🤮": " jijik ",
  "🤢": " jijik ",
};

export function normalizeEmojis(text: string): string {
  let result = text;
  for (const [emo, word] of Object.entries(EMOJI_SENTIMENT_MAP)) {
    result = result.split(emo).join(` ${word} `);
  }
  // Remove remaining emojis using Unicode emoji ranges
  result = result.replace(
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}]/gu,
    ""
  );
  return result;
}

export function normalizeRepeatedChars(text: string): string {
  const words = text.split(/\s+/);
  const normalized = words.map((w) => {
    if (/^(wk|ha|he|hi)+$/i.test(w)) {
      return w;
    }
    // Reduce duplicate consecutive letters (e.g. kangeeeennn -> kangen)
    return w.replace(/(.)\1+/g, "$1");
  });
  return normalized.join(" ");
}

export function normalizeLaughter(text: string): string {
  return text.replace(
    /\b(w+k+[wk]*|h+a+[ha]*|h+e+[he]*|h+i+[hi]*)\b/gi,
    " tertawa "
  );
}

export function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function cleanChatText(text: string): string {
  if (!text || typeof text !== "string") {
    return "";
  }

  let cleaned = unescapeHtml(text);

  // 1. Remove URLs and social handles
  cleaned = cleaned.replace(/https?:\/\/\S+|www\.\S+/g, "");
  cleaned = cleaned.replace(/@\w+/g, "");

  // 2. Remove timestamps & checkmarks
  cleaned = cleaned.replace(
    /[\s,]*(?:\d{1,2}[:.,]\d{2})(?:\s*(?:\/\/|✓|✓✓|-|[VJ/]|ti\)))*\s*$/gi,
    ""
  );

  // 3. Normalize Emojis
  cleaned = normalizeEmojis(cleaned);

  // 4. Normalize Laughter
  cleaned = normalizeLaughter(cleaned);

  // 5. Normalize repeated characters
  cleaned = normalizeRepeatedChars(cleaned);

  // 6. Normalize punctuation
  cleaned = cleaned.replace(/([!?.,])\1+/g, "$1$1");

  // 7. Normalize Slang / Singkatan
  const tokens = cleaned.split(/\s+/);
  const normalizedTokens = tokens.map((token) => {
    const match = token.match(/^([^\w]*)([\w]+)([^\w]*)$/);
    if (match) {
      const prefix = match[1];
      const core = match[2].toLowerCase();
      const suffix = match[3];
      const expanded = SLANG_DICT[core] ?? core;
      return `${prefix}${expanded}${suffix}`;
    }
    return token;
  });

  cleaned = normalizedTokens.join(" ");

  // 8. Collapse spaces
  return cleaned.replace(/\s+/g, " ").trim();
}

export function prepareDialogueForIndobert(
  turns: Array<string | DialogueTurn>
): string {
  if (typeof turns === "string") {
    return cleanChatText(turns);
  }

  const formattedTurns: string[] = [];
  for (const item of turns) {
    if (typeof item === "string") {
      const cleaned = cleanChatText(item);
      if (cleaned) {
        formattedTurns.push(cleaned);
      }
    } else if (item && typeof item === "object") {
      const speaker = item.speaker || "User";
      const cleaned = cleanChatText(item.text);
      if (cleaned) {
        formattedTurns.push(`${speaker}: ${cleaned}`);
      }
    }
  }

  return formattedTurns.join(" [SEP] ");
}

export function parseChatTurns(rawChat: string): DialogueTurn[] {
  if (!rawChat || typeof rawChat !== "string") {
    return [];
  }

  const lines = rawChat
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const turns: DialogueTurn[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Pattern 1: [10:15, 12/10/2026] Speaker: message OR [10:15] Speaker: message
    const timestampSpeakerMatch = line.match(
      /^\[.*?\d{1,2}[:.]\d{2}.*?\]\s*([^:]+):\s*(.+)$/i
    );
    if (timestampSpeakerMatch) {
      turns.push({
        speaker: timestampSpeakerMatch[1].trim(),
        text: timestampSpeakerMatch[2].trim(),
      });
      continue;
    }

    // Pattern 2: Speaker: message
    const speakerMatch = line.match(/^([A-Za-z0-9_\s-]{1,24}):\s*(.+)$/);
    if (speakerMatch) {
      turns.push({
        speaker: speakerMatch[1].trim(),
        text: speakerMatch[2].trim(),
      });
      continue;
    }

    // Pattern 3: Fallback alternating Speaker A / Speaker B
    const fallbackSpeaker = `Speaker_${String.fromCharCode(65 + (idx % 2))}`;
    turns.push({
      speaker: fallbackSpeaker,
      text: line,
    });
  }

  return turns;
}
