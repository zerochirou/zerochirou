"use client";

import { useEffect } from "react";
import { audioService } from "../services/audio_service";
import { radioStore } from "../store/radio_store";

export function useRadioAudio() {
  useEffect(() => {
    // 1. Hydrate saved preferences from localStorage without SSR mismatch
    radioStore.initFromStorage();

    // 2. Initialize audio service callbacks
    audioService.init({
      onPlaying: () => {
        radioStore.setIsBuffering(false);
        radioStore.setIsPlaying(true);
      },
      onWaiting: () => {
        radioStore.setIsBuffering(true);
      },
      onPause: () => {
        radioStore.setIsBuffering(false);
        radioStore.setIsPlaying(false);
      },
      onError: () => {
        radioStore.setIsBuffering(false);
        radioStore.setIsPlaying(false);
      },
    });

    const handleFullscreenChange = () => {
      radioStore.setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      audioService.destroy();
    };
  }, []);
}
