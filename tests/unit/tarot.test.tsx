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
  TarotReader,
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
      expect(result.cards[0].positionName).toBe("Daily Insight");
      expect(typeof result.cards[0].isReversed).toBe("boolean");
      expect(result.cards[0].isFlipped).toBe(false);
    });

    it("fetches 3-card trinity spread with Past, Present, and Future positions", async () => {
      const result = await fetchTarotSpread("three_card");
      expect(result.cards).toHaveLength(3);
      expect(result.cards[0].positionName).toBe("Past");
      expect(result.cards[1].positionName).toBe("Present");
      expect(result.cards[2].positionName).toBe("Future");
    });

    it("fetches Indonesian spread with Masa Lalu, Masa Kini, and Masa Depan positions", async () => {
      const result = await fetchTarotSpread("three_card", "id");
      expect(result.cards).toHaveLength(3);
      expect(result.cards[0].positionName).toBe("Masa Lalu");
      expect(result.cards[1].positionName).toBe("Masa Kini");
      expect(result.cards[2].positionName).toBe("Masa Depan");
      expect(result.cards[0].card.name).toContain("(");
    });
  });

  describe("Export Utilities", () => {
    const mockCards: DrawnCard[] = [
      {
        id: "ar00-0",
        card: TAROT_DECK[0],
        isReversed: false,
        positionName: "Present",
        positionSubtitle: "Current Dynamics",
        isFlipped: true,
        drawnAt: new Date().toISOString(),
      },
    ];

    it("generates structured markdown for Notion / Obsidian", () => {
      const md = generateNotionMarkdown({
        spread: "single",
        query: "How to move forward today?",
        cards: mockCards,
      });

      expect(md).toContain("# 🔮 Tarot Reading Reflection: Daily Reflection (1 Card)");
      expect(md).toContain('**Focus / Intention:** "How to move forward today?"');
      expect(md).toContain(mockCards[0].card.name);
      expect(md).toContain("Upright");
      expect(md).toContain("💡 Synthesis & Action Steps");
    });

    it("generates structured markdown for Notion / Obsidian in Indonesian", () => {
      const md = generateNotionMarkdown({
        spread: "single",
        query: "Bagaimana melangkah hari ini?",
        cards: mockCards,
        locale: "id",
      });

      expect(md).toContain("# 🔮 Catatan Refleksi Tarot: Refleksi Harian (1 Kartu)");
      expect(md).toContain('**Fokus / Niat:** "Bagaimana melangkah hari ini?"');
      expect(md).toContain(mockCards[0].card.name);
      expect(md).toContain("Tegak");
      expect(md).toContain("💡 Sintesis & Langkah Tindakan");
    });

    it("builds a formatted WhatsApp share URL in Indonesian", () => {
      const url = buildWhatsAppShareUrl({
        spread: "single",
        query: "Arah karier",
        cards: mockCards,
        locale: "id",
      });

      expect(url).toContain("https://api.whatsapp.com/send?text=");
      expect(decodeURIComponent(url)).toContain("PEMBACAAN TAROT");
      expect(decodeURIComponent(url)).toContain(mockCards[0].card.name);
    });

    it("builds a formatted WhatsApp share URL", () => {
      const url = buildWhatsAppShareUrl({
        spread: "single",
        query: "Career trajectory",
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
      positionName: "Daily Insight",
      positionSubtitle: "Core energy & direction for today",
      isFlipped: false,
      drawnAt: new Date().toISOString(),
    };

    it("renders card back when unflipped and triggers onFlip when clicked", () => {
      const onFlipMock = vi.fn();
      render(<TarotCard card={mockCard} index={0} onFlip={onFlipMock} />);

      const cardBtn = screen.getByRole("button", {
        name: /Daily Insight: The Fool/i,
      });
      expect(cardBtn).toBeInTheDocument();

      fireEvent.click(cardBtn);
      expect(onFlipMock).toHaveBeenCalledWith("test-card-1");
    });

    it("renders reading summary properly", () => {
      render(
        <ReadingSummary
          cards={[mockCard]}
          query="Inquiry focus"
        />
      );

      expect(screen.getByText("Daily Insight")).toBeInTheDocument();
      expect(screen.getByText(/Inquiry focus/i)).toBeInTheDocument();
      expect(screen.getByText("The Fool")).toBeInTheDocument();
    });

    it("renders TarotReader with textarea and slide commit button", () => {
      render(<TarotReader />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName.toLowerCase()).toBe("textarea");
      expect(screen.getByText(/Geser untuk Tarik Kartu/i)).toBeInTheDocument();
    });
  });
});
