export type TarotSuit = "major" | "wands" | "cups" | "swords" | "pentacles";

export type TarotType = "major" | "minor";

export type TarotLocale = "id" | "en";

export interface TarotCardData {
  name: string;
  name_short: string;
  value: string;
  value_int: number;
  suit: TarotSuit;
  type: TarotType;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
  archetype?: string;
  element?: string;
  keywords?: string[];
}

export type SpreadType = "single" | "three_card" | "celtic_cross";

export interface SpreadPosition {
  name: string;
  subtitle: string;
}

export interface SpreadOption {
  title: string;
  cardCount: number;
  description: string;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  id: string;
  card: TarotCardData;
  isReversed: boolean;
  positionName: string;
  positionSubtitle: string;
  isFlipped: boolean;
  drawnAt: string;
}

export type ReadingStatus =
  | "idle"
  | "shuffling"
  | "revealed"
  | "error"
  | "complete";
