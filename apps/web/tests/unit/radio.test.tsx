import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { RadioHeader } from "@/features/radio/components/radio_header";
import { RadioControls } from "@/features/radio/components/radio_controls";
import { RadioVisual } from "@/features/radio/components/radio_visual";
import { radioStore } from "@/features/radio/store/radio_store";

describe("Radio Store and Components", () => {
  beforeEach(() => {
    act(() => {
      radioStore.setState({
        currentStationId: "coderadio",
        isPlaying: false,
        isBuffering: false,
        volume: 0.8,
        isMuted: false,
        listenersCount: 42,
        currentSong: {
          title: "Lo-Fi Coding Beats",
          artist: "Trebles and Blues",
        },
      });
    });
  });

  it("renders RadioHeader with store data properly", () => {
    render(<RadioHeader />);

    expect(screen.getByText("Radio")).toBeInTheDocument();
    expect(
      screen.getByText(/Welcome to Zero Radio/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/42 listening/i)).toBeInTheDocument();
  });

  it("renders RadioControls with mobile-friendly controls and action triggers", () => {
    render(<RadioControls />);

    expect(screen.getByText("Lo-Fi Coding Beats")).toBeInTheDocument();
    expect(screen.getByText("Trebles and Blues")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /play music/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open song history/i })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: /volume slider/i })).toBeInTheDocument();
  });

  it("updates store state when actions are called", () => {
    act(() => {
      radioStore.setVolume(0.5);
    });
    expect(radioStore.getState().volume).toBe(0.5);

    act(() => {
      radioStore.setListenersCount(120);
    });
    expect(radioStore.getState().listenersCount).toBe(120);
  });

  it("renders RadioVisual with cassette deck and radio frequency tuner", () => {
    render(<RadioVisual />);

    // Radio tuner frequency readout and cassette catalogue
    const freqElements = screen.getAllByText("88.5 FM");
    expect(freqElements.length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("CODE-FM").length).toBeGreaterThanOrEqual(2);

    // Station presets
    expect(screen.getByRole("radio", { name: /Tune to Code Radio 24\/7/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /Tune to Synthwave Nightdrive/i })).toBeInTheDocument();

    // Cassette Player details integrated
    expect(screen.getByText("SIDE A")).toBeInTheDocument();
    expect(screen.getByText(/Lo-Fi Coding Beats — Trebles and Blues/i)).toBeInTheDocument();
  });


});
