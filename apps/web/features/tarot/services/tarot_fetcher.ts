import type { DrawnCard, SpreadType, TarotCardData, TarotSuit, TarotLocale } from "../types";
import { getRandomLocalCards, getSpreadOptions } from "../constants";

interface RemoteCardResponse {
  nhits?: number;
  cards?: Array<{
    name: string;
    name_short: string;
    value: string;
    value_int: number;
    suit?: string;
    type: "major" | "minor";
    meaning_up: string;
    meaning_rev: string;
    desc: string;
  }>;
}

function normalizeRemoteCard(raw: NonNullable<RemoteCardResponse["cards"]>[number]): TarotCardData {
  const suitMap: Record<string, TarotSuit> = {
    major: "major",
    wands: "wands",
    cups: "cups",
    swords: "swords",
    pentacles: "pentacles",
  };

  const suit = raw.suit ? suitMap[raw.suit.toLowerCase()] || "major" : (raw.type === "major" ? "major" : "major");

  return {
    name: raw.name,
    name_short: raw.name_short,
    value: raw.value,
    value_int: raw.value_int,
    suit,
    type: raw.type,
    meaning_up: raw.meaning_up,
    meaning_rev: raw.meaning_rev,
    desc: raw.desc,
  };
}

export async function fetchTarotSpread(
  spread: SpreadType,
  locale: TarotLocale = "en"
): Promise<{
  cards: DrawnCard[];
  source: "api" | "fallback";
}> {
  const spreadConfig = getSpreadOptions(locale)[spread] || getSpreadOptions(locale).single;
  const count = spreadConfig.cardCount;

  let rawCards: TarotCardData[] = [];
  let source: "api" | "fallback" = "api";

  if (locale === "id") {
    // For Indonesian readings, use the rich handcrafted Indonesian tarot arcana dataset
    source = "fallback";
    rawCards = getRandomLocalCards(count, "id");
  } else {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(`https://tarotapi.dev/api/v1/cards/random?n=${count}`, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Tarot API responded with status ${res.status}`);
      }

      const data: RemoteCardResponse = await res.json();
      if (data.cards && data.cards.length >= count) {
        rawCards = data.cards.slice(0, count).map(normalizeRemoteCard);
      } else {
        throw new Error("Tarot API returned empty or insufficient cards");
      }
    } catch {
      source = "fallback";
      rawCards = getRandomLocalCards(count, "en");
    }
  }

  const drawnAt = new Date().toISOString();

  const cards: DrawnCard[] = rawCards.map((card, index) => {
    // Standard ~25% chance of card reversal for authentic reading
    const isReversed = Math.random() < 0.25;
    const position = spreadConfig.positions[index] || {
      name: locale === "id" ? `Posisi ${index + 1}` : `Position ${index + 1}`,
      subtitle: locale === "id" ? "Refleksi" : "Reflection",
    };

    return {
      id: `${card.name_short}-${index}-${Date.now()}`,
      card,
      isReversed,
      positionName: position.name,
      positionSubtitle: position.subtitle,
      isFlipped: false,
      drawnAt,
    };
  });

  return { cards, source };
}
