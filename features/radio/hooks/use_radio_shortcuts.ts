"use client";

import { useEffect } from "react";
import { radioStore } from "../store/radio_store";

export function useRadioShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case " ":
        case "k":
        case "K":
          e.preventDefault();
          radioStore.togglePlay();
          break;
        case "m":
        case "M":
          e.preventDefault();
          radioStore.toggleMute();
          break;
        case "ArrowUp":
          e.preventDefault();
          radioStore.setVolume(radioStore.getState().volume + 0.05);
          break;
        case "ArrowDown":
          e.preventDefault();
          radioStore.setVolume(radioStore.getState().volume - 0.05);
          break;
        case "h":
        case "H":
          e.preventDefault();
          radioStore.setHistoryOpen(!radioStore.getState().historyOpen);
          break;
        case "f":
        case "F":
          e.preventDefault();
          radioStore.toggleFullscreen();
          break;
        case "a":
        case "A":
          e.preventDefault();
          radioStore.toggleAnimatedBg();
          break;
        case "?":
        case "c":
        case "C":
          e.preventDefault();
          radioStore.setShortcutsOpen(!radioStore.getState().shortcutsOpen);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

