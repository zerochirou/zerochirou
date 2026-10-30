const MAJOR_ARCANA_FILES = [
  "Fool",
  "Magician",
  "High_Priestess",
  "Empress",
  "Emperor",
  "Hierophant",
  "Lovers",
  "Chariot",
  "Strength",
  "Hermit",
  "Wheel_of_Fortune",
  "Justice",
  "Hanged_Man",
  "Death",
  "Temperance",
  "Devil",
  "Tower",
  "Star",
  "Moon",
  "Sun",
  "Judgement",
  "World",
] as const;

/** Wikimedia Commons file prefix for each tarotapi.dev suit code. */
const MINOR_SUIT_PREFIX: Record<string, string> = {
  wa: "Wands",
  cu: "Cups",
  sw: "Swords",
  pe: "Pents",
};

/** Court cards in tarotapi.dev (`pa`, `kn`, `qu`, `ki`) map to Commons ranks 11-14. */
const COURT_RANK: Record<string, number> = {
  pa: 11,
  kn: 12,
  qu: 13,
  ki: 14,
};

const COMMONS_FILE_PATH = "https://commons.wikimedia.org/wiki/Special:FilePath";

/**
 * Resolves the Commons file name of the public-domain 1909 Rider-Waite-Smith
 * scan for a card's `name_short` (e.g. `ar00`, `cu01`, `wapa`).
 * Returns null when the code is not a recognised card.
 */
export function getTarotImageFileName(nameShort: string): string | null {
  const code = nameShort.toLowerCase();

  const major = /^ar(\d{2})$/.exec(code);
  if (major) {
    const index = Number(major[1]);
    const label = MAJOR_ARCANA_FILES[index];
    if (!label) return null;
    return `RWS_Tarot_${String(index).padStart(2, "0")}_${label}.jpg`;
  }

  const minor = /^(wa|cu|sw|pe)(\d{2}|pa|kn|qu|ki)$/.exec(code);
  if (minor) {
    const [, suit, rank] = minor;
    const value = COURT_RANK[rank] ?? Number(rank);
    if (!Number.isInteger(value) || value < 1 || value > 14) return null;
    return `${MINOR_SUIT_PREFIX[suit]}${String(value).padStart(2, "0")}.jpg`;
  }

  return null;
}

/**
 * Builds a CDN URL (Wikimedia Commons, served with `access-control-allow-origin: *`)
 * for the card artwork at the requested pixel width.
 */
export function getTarotImageUrl(nameShort: string, width = 480): string | null {
  const fileName = getTarotImageFileName(nameShort);
  if (!fileName) return null;
  return `${COMMONS_FILE_PATH}/${fileName}?width=${width}`;
}
