import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { RadioHeader } from "@/features/radio/components/radio_header";
import { RadioControls } from "@/features/radio/components/radio_controls";
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

  it("renders RadioControls with store data correctly", () => {
    render(<RadioControls />);

    expect(screen.getByText("Lo-Fi Coding Beats")).toBeInTheDocument();
    expect(screen.getByText("Trebles and Blues")).toBeInTheDocument();
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
});
