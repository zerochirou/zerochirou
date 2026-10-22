import { describe, it, expect } from "vitest";
import { getTarotImageFileName, getTarotImageUrl } from "@/features/tarot/lib/tarot_image";

describe("Tarot image resolver", () => {
  it("maps major arcana codes", () => {
    expect(getTarotImageFileName("ar00")).toBe("RWS_Tarot_00_Fool.jpg");
    expect(getTarotImageFileName("ar10")).toBe("RWS_Tarot_10_Wheel_of_Fortune.jpg");
    expect(getTarotImageFileName("ar21")).toBe("RWS_Tarot_21_World.jpg");
    expect(getTarotImageFileName("ar22")).toBeNull();
  });

  it("maps minor arcana numbers and court cards", () => {
    expect(getTarotImageFileName("wa01")).toBe("Wands01.jpg");
    expect(getTarotImageFileName("cu10")).toBe("Cups10.jpg");
    expect(getTarotImageFileName("pepa")).toBe("Pents11.jpg");
    expect(getTarotImageFileName("swkn")).toBe("Swords12.jpg");
    expect(getTarotImageFileName("waqu")).toBe("Wands13.jpg");
    expect(getTarotImageFileName("cuki")).toBe("Cups14.jpg");
  });

  it("rejects unknown codes and builds sized CDN URLs", () => {
    expect(getTarotImageFileName("zz99")).toBeNull();
    expect(getTarotImageFileName("wa15")).toBeNull();
    expect(getTarotImageUrl("nope")).toBeNull();
    expect(getTarotImageUrl("ar00", 320)).toBe(
      "https://commons.wikimedia.org/wiki/Special:FilePath/RWS_Tarot_00_Fool.jpg?width=320"
    );
  });
});
