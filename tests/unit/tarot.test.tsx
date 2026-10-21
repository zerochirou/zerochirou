import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  fetchTarotSpread,
  TAROT_DECK,
  SPREAD_OPTIONS,
  generateNotionMarkdown,
  buildWhatsAppShareUrl,
  TarotCard,
  ReadingSummary,
} from "@/features/tarot";
import type { DrawnCard } from "@/features/tarot/types";

describe("Tarot Feature Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("Tarot Dataset & Fetcher", () => {
    it("provides a rich offline dataset with Major and Minor Arcana cards", () => {
      expect(TAROT_DECK.length).toBeGreaterThanOrEqual(15);
      TAROT_DECK.forEach((card) => {
        expect(card.name).toBeTruthy();
        expect(card.meaning_up).toBeTruthy();
        expect(card.meaning_rev).toBeTruthy();
        expect(card.desc).toBeTruthy();
      });
    });

    it("provides predefined spread options including single and three_card", () => {
      expect(SPREAD_OPTIONS.single).toBeDefined();
      expect(SPREAD_OPTIONS.three_card).toBeDefined();
      expect(SPREAD_OPTIONS.single.cardCount).toBe(1);
      expect(SPREAD_OPTIONS.three_card.cardCount).toBe(3);
    });

    it("fetches single card spread correctly using fallback or api", async () => {
      const result = await fetchTarotSpread("single");
      expect(result.cards).toHaveLength(1);
      expect(result.cards[0].positionName).toBe("Refleksi & Arah Energi");
      expect(typeof result.cards[0].isReversed).toBe("boolean");
      expect(result.cards[0].isFlipped).toBe(false);
    });

    it("fetches 3-card trinity spread with Past, Present, and Future positions", async () => {
      const result = await fetchTarotSpread("three_card");
      expect(result.cards).toHaveLength(3);
      expect(result.cards[0].positionName).toContain("Masa Lalu");
      expect(result.cards[1].positionName).toContain("Masa Kini");
      expect(result.cards[2].positionName).toContain("Potensi Esok");
    });
  });

  describe("Export Utilities", () => {
    const mockCards: DrawnCard[] = [
      {
        id: "ar00-0",
        card: TAROT_DECK[0],
        isReversed: false,
        positionName: "Masa Kini",
        positionSubtitle: "Realitas Saat Ini",
        isFlipped: true,
        drawnAt: new Date().toISOString(),
      },
    ];

    it("generates structured markdown for Notion / Obsidian", () => {
      const md = generateNotionMarkdown({
        spread: "single",
        query: "Bagaimana melangkah hari ini?",
        cards: mockCards,
      });

      expect(md).toContain("# 🔮 Catatan Tarot Reading: Daily Spark (1 Kartu)");
      expect(md).toContain('**Fokus / Niat:** "Bagaimana melangkah hari ini?"');
      expect(md).toContain(mockCards[0].card.name);
      expect(md).toContain("Tegak (Upright)");
      expect(md).toContain("💡 Sintesis & Langkah Tindakan");
    });

    it("builds a formatted WhatsApp share URL", () => {
      const url = buildWhatsAppShareUrl({
        spread: "single",
        query: "Karier ke depan",
        cards: mockCards,
      });

      expect(url).toContain("https://api.whatsapp.com/send?text=");
      expect(decodeURIComponent(url)).toContain("TAROT READING");
      expect(decodeURIComponent(url)).toContain(mockCards[0].card.name);
    });
  });

  describe("UI Components", () => {
    const mockCard: DrawnCard = {
      id: "test-card-1",
      card: TAROT_DECK[0],
      isReversed: false,
      positionName: "Kartu Harian",
      positionSubtitle: "Fokus Hari Ini",
      isFlipped: false,
      drawnAt: new Date().toISOString(),
    };

    it("renders card back when unflipped and triggers onFlip when clicked", () => {
      const onFlipMock = vi.fn();
      render(<TarotCard card={mockCard} index={0} onFlip={onFlipMock} />);

      const cardBtn = screen.getByRole("button", {
        name: /Kartu Harian: The Fool/i,
      });
      expect(cardBtn).toBeInTheDocument();

      fireEvent.click(cardBtn);
      expect(onFlipMock).toHaveBeenCalledWith("test-card-1");
    });

    it("renders reading summary properly", () => {
      render(
        <ReadingSummary
          cards={[mockCard]}
          spread="single"
          query="Pertanyaan Refleksi"
        />
      );

      expect(screen.getByText("Kartu Harian")).toBeInTheDocument();
      expect(screen.getByText(/Pertanyaan Refleksi/i)).toBeInTheDocument();
      expect(screen.getByText("The Fool")).toBeInTheDocument();
    });
  });
});
