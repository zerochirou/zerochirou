import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoveView } from "@/features/love/components/love_view";

describe("LoveView Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders header and mode selector tabs", () => {
    render(<LoveView />);
    expect(
      screen.getByRole("heading", { name: /Love Rate Predictor/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Pesan Tunggal/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Percakapan \(Multi-Turn\)/i })
    ).toBeInTheDocument();
  });

  it("allows switching to Conversation mode and displays preset buttons", () => {
    render(<LoveView />);
    const convTab = screen.getByRole("button", {
      name: /Percakapan \(Multi-Turn\)/i,
    });
    fireEvent.click(convTab);
    expect(screen.getByText(/Bucin \/ Sangat Romantis/i)).toBeInTheDocument();
  });

  it("loads a preset and analyzes it successfully", async () => {
    render(<LoveView />);
    const convTab = screen.getByRole("button", {
      name: /Percakapan \(Multi-Turn\)/i,
    });
    fireEvent.click(convTab);

    const presetBtn = screen.getByRole("button", {
      name: /Bucin \/ Sangat Romantis/i,
    });
    fireEvent.click(presetBtn);

    const submitBtn = screen.getByRole("button", {
      name: /Analisis Dinamika Percakapan/i,
    });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Hasil Analisis Dinamika/i)).toBeInTheDocument();
    });
  });
});
