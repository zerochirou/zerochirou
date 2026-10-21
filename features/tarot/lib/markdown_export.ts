import type { DrawnCard, SpreadType } from "../types";

export interface MarkdownReadingParams {
  spread: SpreadType;
  query?: string;
  cards: DrawnCard[];
  dateStr?: string;
}

export function generateNotionMarkdown({
  spread,
  query,
  cards,
  dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
}: MarkdownReadingParams): string {
  const spreadTitle = spread === "single" ? "Daily Spark (1 Kartu)" : "Trinity Spread (Masa Lalu, Kini, Esok)";

  const lines: string[] = [
    `# 🔮 Catatan Tarot Reading: ${spreadTitle}`,
    "",
    `> **Tanggal:** ${dateStr}  `,
    `> **Fokus / Niat:** ${query && query.trim().length > 0 ? `"${query.trim()}"` : "Refleksi Diri Harian"}  `,
    `> **Engine:** Zerochirou Tarot & Prediction Engine (zerochirou.com/tarot)`,
    "",
    "---",
    "",
    "## 🃏 Hasil Penarikan Kartu",
    "",
  ];

  cards.forEach((drawn, index) => {
    const orientation = drawn.isReversed ? "Terbalik (Reversed)" : "Tegak (Upright)";
    const meaning = drawn.isReversed ? drawn.card.meaning_rev : drawn.card.meaning_up;

    lines.push(`### ${index + 1}. ${drawn.card.name} — *${orientation}*`);
    lines.push(`- **Posisi:** ${drawn.positionName} (${drawn.positionSubtitle})`);
    lines.push(`- **Arkanum / Elemen:** ${drawn.card.type.toUpperCase()}${drawn.card.element ? ` · ${drawn.card.element}` : ""}`);
    if (drawn.card.keywords && drawn.card.keywords.length > 0) {
      lines.push(`- **Kata Kunci:** ${drawn.card.keywords.join(", ")}`);
    }
    lines.push("");
    lines.push(`**Pesan Kebijaksanaan:**`);
    lines.push(`> ${meaning}`);
    lines.push("");
    if (drawn.card.desc) {
      lines.push(`*Simbolisme Visual:* ${drawn.card.desc}`);
      lines.push("");
    }
  });

  lines.push("---");
  lines.push("## 💡 Sintesis & Langkah Tindakan");
  lines.push("- [ ] Luangkan 5 menit untuk mengendapkan pesan di atas dalam jurnal pribadi.");
  lines.push("- [ ] Identifikasi 1 tindakan nyata hari ini yang selaras dengan panduan kartu.");
  lines.push("");
  lines.push("---");
  lines.push("*Disimpan dari [Zerochirou Tarot](https://zerochirou.com/tarot)*");

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
