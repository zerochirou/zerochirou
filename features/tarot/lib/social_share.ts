import type { DrawnCard, SpreadType, TarotLocale } from "../types";

export interface SocialShareParams {
  spread: SpreadType;
  query?: string;
  cards: DrawnCard[];
  pageUrl?: string;
  locale?: TarotLocale;
}

export function buildWhatsAppShareUrl({
  spread,
  query,
  cards,
  pageUrl = typeof window !== "undefined" ? window.location.href : "https://zerochirou.com/tarot",
  locale = "en",
}: SocialShareParams): string {
  const isId = locale === "id";
  const spreadLabel = isId
    ? spread === "single" ? "Refleksi Harian (1 Kartu)" : "Trinitas Waktu (Masa Lalu, Kini, Depan)"
    : spread === "single" ? "Daily Reflection" : "Trinity Spread (Past, Present, Future)";

  const lines: string[] = [
    `✨ *${isId ? "PEMBACAAN TAROT — ZEROCHIROU ENGINE" : "TAROT READING — ZEROCHIROU ENGINE"}* ✨`,
    `📖 *${isId ? "Sebaran" : "Spread"}:* ${spreadLabel}`,
  ];

  if (query && query.trim().length > 0) {
    lines.push(`🎯 *${isId ? "Fokus / Niat" : "Focus / Intention"}:* "${query.trim()}"`);
  }

  lines.push("");
  lines.push(`🔮 *${isId ? "Kartu yang Ditarik:" : "Drawn Cards:"}*`);

  cards.forEach((drawn, i) => {
    const orientation = drawn.isReversed
      ? (isId ? "🔄 Terbalik" : "🔄 Reversed")
      : (isId ? "⬆️ Tegak" : "⬆️ Upright");
    const shortMeaning = (drawn.isReversed ? drawn.card.meaning_rev : drawn.card.meaning_up)
      .slice(0, 110)
      .concat("...");

    lines.push(`*${i + 1}. ${drawn.card.name}* [${drawn.positionName}]`);
    lines.push(`   ${isId ? "Status" : "Status"}: ${orientation}`);
    lines.push(`   "${shortMeaning}"`);
  });

  lines.push("");
  lines.push(`🌐 ${isId ? "Tarik kartu refleksi Anda di" : "Draw your cards at"}: ${pageUrl}`);

  const fullText = lines.join("\n");
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
}

export async function triggerWebShare({
  spread,
  query,
  cards,
  pageUrl = typeof window !== "undefined" ? window.location.href : "https://zerochirou.com/tarot",
}: SocialShareParams): Promise<"shared" | "copied" | "unsupported"> {
  const spreadLabel = spread === "single" ? "Daily Reflection" : "Trinity Spread";
  const title = `Tarot Reading: ${spreadLabel}`;
  const textSummary = cards
    .map((c) => `${c.positionName}: ${c.card.name} (${c.isReversed ? "Reversed" : "Upright"})`)
    .join(" | ");

  const shareData: ShareData = {
    title,
    text: `Tarot Reading (${spreadLabel}): ${textSummary}${query ? ` — Focus: "${query}"` : ""}`,
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
