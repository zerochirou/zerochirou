import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/love/predict/route";

describe("POST /api/love/predict Route Handler", () => {
  it("returns 400 when body does not contain text or messages", async () => {
    const req = new Request("http://localhost:3000/api/love/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("successfully analyzes single text payload", async () => {
    const req = new Request("http://localhost:3000/api/love/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "kangen bgt ayanggg ❤️🥺" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.overall_love_rate).toBeGreaterThan(70);
    expect(data.relationship_vibe).toBeDefined();
    expect(data.turns_analysis.length).toBe(1);
  });

  it("successfully analyzes multi-turn dialogue payload", async () => {
    const req = new Request("http://localhost:3000/api/love/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { speaker: "A", text: "kangen" },
          { speaker: "B", text: "sama ayang" },
        ],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.total_turns).toBe(2);
    expect(data.speaker_breakdown).toBeDefined();
    expect(data.sweetest_message).toBeDefined();
  });
});
