import { describe, it, expect } from "vitest";
import {
  cleanChatText,
  normalizeEmojis,
  normalizeRepeatedChars,
  normalizeLaughter,
  prepareDialogueForIndobert,
  parseChatTurns,
} from "@/features/love/text_cleaner";

describe("Love Feature - Text Cleaner & Preprocessor", () => {
  it("normalizes slang and abbreviations to formal Indonesian for IndoBERT", () => {
    const raw = "aq syg bgt sm kmu, kgn bgt";
    const cleaned = cleanChatText(raw);
    expect(cleaned).toContain("aku");
    expect(cleaned).toContain("sayang");
    expect(cleaned).toContain("banget");
    expect(cleaned).toContain("sama");
    expect(cleaned).toContain("kamu");
    expect(cleaned).toContain("kangen");
  });

  it("normalizes romantic and emotional emojis into semantic Indonesian words", () => {
    const textWithEmoji = "kangen ayang ❤️🥺";
    const normalized = normalizeEmojis(textWithEmoji);
    expect(normalized).toContain("cinta");
    expect(normalized).toContain("manja");
  });

  it("reduces excessively repeated letters while preserving root words", () => {
    const repeated = "kangeeeennn sayannnggg";
    const reduced = normalizeRepeatedChars(repeated);
    expect(reduced).toBe("kangen sayang");
  });

  it("normalizes laughter expressions (wkwk, haha, hihi)", () => {
    const laughter = "wkwkwk kocak banget hahaha";
    const normalized = normalizeLaughter(laughter);
    expect(normalized).toContain("tertawa");
  });

  it("removes URLs and social handles cleanly", () => {
    const withLinks = "cek ini https://example.com/test @ayangku lucu kan";
    const cleaned = cleanChatText(withLinks);
    expect(cleaned).not.toContain("https://");
    expect(cleaned).not.toContain("@ayangku");
  });

  it("formats multi-turn dialogue into [SEP] separated tokens", () => {
    const turns = [
      { speaker: "Speaker_A", text: "kangen deh" },
      { speaker: "Speaker_B", text: "lah sama gw jg kangen" },
    ];
    const dialogue = prepareDialogueForIndobert(turns);
    expect(dialogue).toBe(
      "Speaker_A: kangen deh [SEP] Speaker_B: lah sama aku juga kangen"
    );
  });

  it("parses raw chat text with speaker prefixes or timestamps into structured turns", () => {
    const rawChat = `Alice: kangen kamu ayang
Bob: aku juga kangen banget ❤️
[10:15] Alice: nanti ketemu ya`;

    const parsed = parseChatTurns(rawChat);
    expect(parsed.length).toBe(3);
    expect(parsed[0].speaker).toBe("Alice");
    expect(parsed[0].text).toContain("kangen kamu ayang");
    expect(parsed[1].speaker).toBe("Bob");
  });
});
