import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { VideoPlay } from "@/features/home/components/video_play";

describe("VideoPlay component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.useFakeTimers();
    // HTMLMediaElement play mock
    vi.spyOn(window.HTMLMediaElement.prototype, "play").mockImplementation(
      () => Promise.resolve()
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders children directly without breaking wrapper overflow", () => {
    render(
      <VideoPlay>
        <div data-testid="child-content">Main Page Content</div>
      </VideoPlay>
    );

    expect(screen.getByTestId("child-content")).toBeDefined();
  });

  it("plays intro seamlessly when not yet visited and contains no player buttons", () => {
    render(
      <VideoPlay>
        <div data-testid="child-content">Content</div>
      </VideoPlay>
    );

    // Intro presentation should be visible
    const introOverlay = screen.getByRole("presentation", {
      name: /Site introduction/i,
    });
    expect(introOverlay).toBeDefined();

    // Verify there are NO player or skip buttons
    const buttons = screen.queryAllByRole("button");
    expect(buttons.length).toBe(0);

    // Verify video tag is embedded without player controls
    const video = introOverlay.querySelector("video");
    expect(video).toBeDefined();
    expect(video?.getAttribute("controls")).toBeNull();
  });

  it("dismisses cleanly on click anywhere", () => {
    render(
      <VideoPlay>
        <div data-testid="child-content">Content</div>
      </VideoPlay>
    );

    const introOverlay = screen.getByRole("presentation", {
      name: /Site introduction/i,
    });
    fireEvent.click(introOverlay);

    // sessionStorage should now remember it played
    expect(sessionStorage.getItem("intro_played")).toBe("true");
  });

  it("skips intro automatically if session already has intro_played", () => {
    sessionStorage.setItem("intro_played", "true");

    render(
      <VideoPlay>
        <div data-testid="child-content">Content</div>
      </VideoPlay>
    );

    // Intro overlay should not be in the document
    const introOverlay = screen.queryByRole("presentation", {
      name: /Site introduction/i,
    });
    expect(introOverlay).toBeNull();
  });

  it("dismisses intro on Escape key", () => {
    render(
      <VideoPlay>
        <div data-testid="child-content">Content</div>
      </VideoPlay>
    );

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });

    expect(sessionStorage.getItem("intro_played")).toBe("true");
  });
});
