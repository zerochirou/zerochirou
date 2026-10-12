import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CassettePlayer } from "@/components/ui/cassette_player";

describe("CassettePlayer Component", () => {
  beforeEach(() => {
    // Mock HTMLMediaElement methods in jsdom
    window.HTMLMediaElement.prototype.play = vi.fn().mockImplementation(() => Promise.resolve());
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.HTMLMediaElement.prototype.load = vi.fn();
  });

  it("renders with default props and cassette details", () => {
    render(<CassettePlayer />);

    expect(
      screen.getByRole("region", { name: /One Small Step audio player/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Archive 11")).toBeInTheDocument();
    expect(screen.getByText("One Small Step")).toBeInTheDocument();
    expect(screen.getByText("Side A")).toBeInTheDocument();
    expect(screen.getByText("200769")).toBeInTheDocument();
  });

  it("renders custom archive label, side label, and track title", () => {
    render(
      <CassettePlayer
        archiveLabel="ZERO RADIO"
        sideLabel="SIDE B"
        trackTitle="Synthwave Resonance"
        catalogueNumber="FM-88.5"
      />,
    );

    expect(screen.getByText("ZERO RADIO")).toBeInTheDocument();
    expect(screen.getByText("SIDE B")).toBeInTheDocument();
    expect(screen.getByText("Synthwave Resonance")).toBeInTheDocument();
    expect(screen.getByText("FM-88.5")).toBeInTheDocument();
  });

  it("renders transport controls (restart, play/pause, mute/unmute)", () => {
    render(<CassettePlayer trackTitle="Midnight Lofi" />);

    expect(screen.getByRole("button", { name: /Restart track/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Play Midnight Lofi/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mute/i })).toBeInTheDocument();
  });

  it("toggles play/pause when the play button is clicked", async () => {
    const onPlaybackChange = vi.fn();
    render(<CassettePlayer trackTitle="Deep Focus" onPlaybackChange={onPlaybackChange} />);

    const playBtn = screen.getByRole("button", { name: /Play Deep Focus/i });
    await act(async () => {
      fireEvent.click(playBtn);
    });

    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("toggles mute when mute button is clicked", () => {
    render(<CassettePlayer />);

    const muteBtn = screen.getByRole("button", { name: /Mute/i });
    fireEvent.click(muteBtn);

    expect(screen.getByRole("button", { name: /Unmute/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Unmute/i }));
    expect(screen.getByRole("button", { name: /Mute/i })).toBeInTheDocument();
  });

  it("renders caption tracks when passed", () => {
    const { container } = render(
      <CassettePlayer
        audioSrc="/test.mp3"
        captionTracks={[
          {
            default: true,
            label: "Indonesian",
            src: "/test-id.vtt",
            srcLang: "id",
          },
        ]}
      />,
    );

    const track = container.querySelector("track");
    expect(track).toBeInTheDocument();
    expect(track?.getAttribute("label")).toBe("Indonesian");
    expect(track?.getAttribute("srclang")).toBe("id");
  });

  it("renders live stream indicator when isLive is true", () => {
    render(
      <CassettePlayer
        isLive={true}
        trackTitle="Live Lo-Fi Radio"
        archiveLabel="ZERO FM"
      />,
    );

    expect(screen.getByText("ON AIR")).toBeInTheDocument();
    expect(screen.getByText("Live Stream")).toBeInTheDocument();
  });

  it("delegates playback toggle to onTogglePlay when provided", () => {
    const onTogglePlay = vi.fn();
    render(
      <CassettePlayer
        isPlaying={false}
        onTogglePlay={onTogglePlay}
        trackTitle="Controlled Track"
      />,
    );

    const playBtn = screen.getByRole("button", { name: /Play Controlled Track/i });
    fireEvent.click(playBtn);
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });
});

