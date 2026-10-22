import type { DrawnCard, SpreadType, TarotLocale } from "../types";

export interface MarkdownReadingParams {
  spread: SpreadType;
  query?: string;
  cards: DrawnCard[];
  dateStr?: string;
  locale?: TarotLocale;
}

export function generateNotionMarkdown({
  spread,
  query,
  cards,
  dateStr,
  locale = "en",
}: MarkdownReadingParams): string {
  const isId = locale === "id";
  const dateFormatted = dateStr || (isId
    ? new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }));

  const spreadTitle = isId
    ? spread === "single" ? "Refleksi Harian (1 Kartu)" : "Trinitas Waktu (Masa Lalu · Masa Kini · Masa Depan)"
    : spread === "single" ? "Daily Reflection (1 Card)" : "Trinity Spread (Past · Present · Future)";

  const lines: string[] = [
    `# 🔮 ${isId ? "Catatan Refleksi Tarot" : "Tarot Reading Reflection"}: ${spreadTitle}`,
    "",
    `> **${isId ? "Tanggal" : "Date"}:** ${dateFormatted}  `,
    `> **${isId ? "Fokus / Niat" : "Focus / Intention"}:** ${query && query.trim().length > 0 ? `"${query.trim()}"` : (isId ? "Refleksi Batin Harian" : "Daily Self-Reflection")}  `,
    `> **Engine:** Zerochirou Tarot Engine (zerochirou.com/tarot)`,
    "",
    "---",
    "",
    `## 🃏 ${isId ? "Kartu yang Ditarik" : "Drawn Cards"}`,
    "",
  ];

  cards.forEach((drawn, index) => {
    const orientation = drawn.isReversed
      ? (isId ? "Terbalik" : "Reversed")
      : (isId ? "Tegak" : "Upright");
    const meaning = drawn.isReversed ? drawn.card.meaning_rev : drawn.card.meaning_up;

    lines.push(`### ${index + 1}. ${drawn.card.name} — *${orientation}*`);
    lines.push(`- **${isId ? "Posisi" : "Position"}:** ${drawn.positionName} (${drawn.positionSubtitle})`);
    lines.push(`- **${isId ? "Arkana / Elemen" : "Arcana / Element"}:** ${drawn.card.type.toUpperCase()}${drawn.card.element ? ` · ${drawn.card.element}` : ""}`);
    if (drawn.card.keywords && drawn.card.keywords.length > 0) {
      lines.push(`- **${isId ? "Kata Kunci" : "Keywords"}:** ${drawn.card.keywords.join(", ")}`);
    }
    lines.push("");
    lines.push(`**${isId ? "Hikmah & Bimbingan Batin" : "Wisdom & Guidance"}:**`);
    lines.push(`> ${meaning}`);
    lines.push("");
    if (drawn.card.desc) {
      lines.push(`*${isId ? "Simbolisme Visual" : "Visual Symbolism"}:* ${drawn.card.desc}`);
      lines.push("");
    }
  });

  lines.push("---");
  lines.push(`## 💡 ${isId ? "Sintesis & Langkah Tindakan" : "Synthesis & Action Steps"}`);
  if (isId) {
    lines.push("- [ ] Luangkan 5 menit merenungkan pesan kartu ini dalam catatan jurnal harian Anda.");
    lines.push("- [ ] Rumuskan satu langkah nyata hari ini yang selaras dengan wawasan refleksi ini.");
  } else {
    lines.push("- [ ] Spend 5 minutes contemplating the card's guidance in your personal journal.");
    lines.push("- [ ] Identify one concrete action today aligned with this insight.");
  }
  lines.push("");
  lines.push("---");
  lines.push(`*${isId ? "Disimpan dari" : "Saved from"} [Zerochirou Tarot](https://zerochirou.com/tarot)*`);

  return lines.join("\n");
}

export async function copyMarkdownToClipboard(params: MarkdownReadingParams): Promise<boolean> {
  const markdown = generateNotionMarkdown(params);
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(markdown);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
