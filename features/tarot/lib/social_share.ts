import type { DrawnCard, SpreadType } from "../types";

export interface SocialShareParams {
  spread: SpreadType;
  query?: string;
  cards: DrawnCard[];
  pageUrl?: string;
}

export function buildWhatsAppShareUrl({
  spread,
  query,
  cards,
  pageUrl = typeof window !== "undefined" ? window.location.href : "https://zerochirou.com/tarot",
}: SocialShareParams): string {
  const spreadLabel = spread === "single" ? "Daily Spark Reading" : "Trinity Spread (Past, Present, Future)";

  const lines: string[] = [
    `✨ *TAROT READING — ZEROCHIROU ENGINE* ✨`,
    `📖 *Spread:* ${spreadLabel}`,
  ];

  if (query && query.trim().length > 0) {
    lines.push(`🎯 *Pertanyaan/Niat:* "${query.trim()}"`);
  }

  lines.push("");
  lines.push("🔮 *Kartu Terbuka:*");

  cards.forEach((drawn, i) => {
    const orientation = drawn.isReversed ? "🔄 Terbalik (Reversed)" : "⬆️ Tegak (Upright)";
    const shortMeaning = (drawn.isReversed ? drawn.card.meaning_rev : drawn.card.meaning_up)
      .slice(0, 110)
      .concat("...");

    lines.push(`*${i + 1}. ${drawn.card.name}* [${drawn.positionName}]`);
    lines.push(`   Status: ${orientation}`);
    lines.push(`   "${shortMeaning}"`);
  });

  lines.push("");
  lines.push(`🌐 Tarik kartumu sendiri di: ${pageUrl}`);

  const fullText = lines.join("\n");
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
}

export async function triggerWebShare({
  spread,
  query,
  cards,
  pageUrl = typeof window !== "undefined" ? window.location.href : "https://zerochirou.com/tarot",
}: SocialShareParams): Promise<"shared" | "copied" | "unsupported"> {
  const spreadLabel = spread === "single" ? "Daily Spark" : "Three-Card Trinity";
  const title = `Hasil Tarot Reading: ${spreadLabel}`;
  const textSummary = cards
    .map((c) => `${c.positionName}: ${c.card.name} (${c.isReversed ? "Reversed" : "Upright"})`)
    .join(" | ");

  const shareData: ShareData = {
    title,
    text: `Tarot Reading (${spreadLabel}): ${textSummary}${query ? ` — Niat: "${query}"` : ""}`,
    url: pageUrl,
  };

  if (typeof navigator !== "undefined" && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return "shared";
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return "copied";
      }
    }
  }

  // Fallback: Copy URL or WhatsApp link
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(pageUrl);
      return "copied";
    }
  } catch {
    // ignore
  }

  return "unsupported";
}
