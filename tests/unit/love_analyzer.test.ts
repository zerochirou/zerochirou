import { describe, it, expect } from "vitest";
import {
  getRelationshipVibe,
  analyzeSingleText,
  analyzeDialogue,
} from "@/features/love/analyzer_engine";

describe("Love Feature - Analyzer Engine", () => {
  it("classifies love rate ranges correctly according to model_config.json", () => {
    expect(getRelationshipVibe(90).label).toBe("Bucin / Sangat Romantis");
    expect(getRelationshipVibe(90).emoji).toBe("🥰❤️");

    expect(getRelationshipVibe(70).label).toBe("Manis & Penuh Perhatian");
    expect(getRelationshipVibe(70).emoji).toBe("✨💖");

    expect(getRelationshipVibe(55).label).toBe("Santai & Candaan Akrab");
    expect(getRelationshipVibe(55).emoji).toBe("😄💬");

    expect(getRelationshipVibe(35).label).toBe("Dingin / Kurang Antusias");
    expect(getRelationshipVibe(35).emoji).toBe("😐❄️");

    expect(getRelationshipVibe(15).label).toBe("Konflik / Kesal / Jengkel");
    expect(getRelationshipVibe(15).emoji).toBe("😤💔");
  });

  it("handles empty or whitespace text gracefully", () => {
    const res = analyzeSingleText("   ");
    expect(res.love_rate).toBe(50.0);
    expect(res.confidence).toBe(50.0);
    expect(res.cleaned_text).toBe("");
  });

  it("analyzes single affectionate message with high love rate", () => {
    const res = analyzeSingleText("kangeeeennn bgt ayanggg ❤️🥺 pengen meluk kamu");
    expect(res.love_rate).toBeGreaterThanOrEqual(80.0);
    expect(res.vibe).toBe("Bucin / Sangat Romantis");
    expect(res.confidence).toBeGreaterThanOrEqual(75.0);
    expect(res.cleaned_text).toContain("sayang");
  });

  it("analyzes conflict/cold message with low love rate", () => {
    const res = analyzeSingleText("terserah lu aja deh, males bgt ngomong sm lo");
    expect(res.love_rate).toBeLessThan(45.0);
    expect(res.emoji).toBeDefined();
  });

  it("analyzes multi-turn dialogue with sweetest and coldest message extraction", () => {
    const dialogue = [
      { speaker: "Alice", text: "kamu di mana? kangen banget pengen ketemu ❤️" },
      { speaker: "Bob", text: "otw sayangku, jangan cemberut ya gemes bgt 🥰" },
      { speaker: "Alice", text: "terserah" },
    ];

    const result = analyzeDialogue(dialogue);
    expect(result.total_turns).toBe(3);
    expect(result.speaker_breakdown["Alice"]).toBeDefined();
    expect(result.speaker_breakdown["Bob"]).toBeDefined();
    expect(result.sweetest_message).toBeDefined();
    expect(result.coldest_message).toContain("terserah");
    expect(result.summary).toContain("dinamika");
  });
});
