"use client";

import { useSyncExternalStore } from "react";
import type { RadioStore, RadioState, SongInfo, RadioMetadataResult } from "../types";
import {
  CODE_RADIO_STREAM_URL,
  DEFAULT_SONG,
  DEFAULT_WALLPAPER_ID,
  VOLUME_STORAGE_KEY,
  WALLPAPER_STORAGE_KEY,
  WALLPAPERS,
} from "../constants";
import { audioService } from "../services/audio_service";

type Listener = () => void;

class RadioStoreInstance {
  private state: RadioStore;
  private listeners = new Set<Listener>();

  constructor() {
    this.state = {
      // Deterministic initial state for SSR
      currentStationId: "coderadio",
      isPlaying: false,
      isBuffering: false,
      volume: 0.8,
      isMuted: false,
      isFullscreen: false,
      isAnimatedBg: true,
      currentWallpaperId: DEFAULT_WALLPAPER_ID,
      currentSong: DEFAULT_SONG,
      songHistory: [],
      listenersCount: 0,
      historyOpen: false,
      shortcutsOpen: false,

      // Actions bound to this instance
      setStationId: this.setStationId,
      setIsPlaying: this.setIsPlaying,
      setIsBuffering: this.setIsBuffering,
      setVolume: this.setVolume,
      toggleMute: this.toggleMute,
      togglePlay: this.togglePlay,
      toggleFullscreen: this.toggleFullscreen,
      setIsFullscreen: this.setIsFullscreen,
      toggleAnimatedBg: this.toggleAnimatedBg,
      setWallpaperId: this.setWallpaperId,
      cycleWallpaper: this.cycleWallpaper,
      setCurrentSong: this.setCurrentSong,
      setSongHistory: this.setSongHistory,
      setListenersCount: this.setListenersCount,
      setHistoryOpen: this.setHistoryOpen,
      setShortcutsOpen: this.setShortcutsOpen,
      updateFromMetadata: this.updateFromMetadata,
    };
  }

  public getState = (): RadioStore => this.state;

  public setState = (
    partial: Partial<RadioState> | ((prev: RadioState) => Partial<RadioState>),
  ): void => {
    const nextPartial =
      typeof partial === "function" ? partial(this.state) : partial;
    this.state = { ...this.state, ...nextPartial };
    this.notify();
  };

  public subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // Hydrate persistent settings after client mount
  public initFromStorage = (): void => {
    if (typeof window === "undefined") return;

    try {
      const savedVolume = localStorage.getItem(VOLUME_STORAGE_KEY);
      if (savedVolume !== null) {
        const val = parseFloat(savedVolume);
        if (!isNaN(val) && val >= 0 && val <= 1) {
          this.setState({
            volume: val,
            isMuted: val === 0,
          });
          audioService.setVolume(val);
        }
      }

      const savedWallpaper = localStorage.getItem(WALLPAPER_STORAGE_KEY);
      if (savedWallpaper && WALLPAPERS.some((w) => w.id === savedWallpaper)) {
        this.setState({ currentWallpaperId: savedWallpaper });
      }
    } catch {
      // Ignore storage read errors
    }
  };

  // --- Actions ---

  public setStationId = (stationId: string): void => {
    this.setState({ currentStationId: stationId });
  };

  public setIsPlaying = (isPlaying: boolean): void => {
    this.setState({ isPlaying, isBuffering: false });
  };

  public setIsBuffering = (isBuffering: boolean): void => {
    this.setState({ isBuffering });
  };

  public setVolume = (volume: number): void => {
    const clamped = Math.max(0, Math.min(1, volume));
    this.setState({
      volume: clamped,
      isMuted: clamped === 0,
    });
    audioService.setVolume(clamped === 0 ? 0 : clamped);

    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, clamped.toString());
    } catch {
      // Ignore
    }
  };

  public toggleMute = (): void => {
    const nextMuted = !this.state.isMuted;
    this.setState({ isMuted: nextMuted });
    audioService.setVolume(nextMuted ? 0 : this.state.volume);
  };

  public togglePlay = (): void => {
    if (this.state.isPlaying) {
      audioService.pause();
    } else {
      audioService.setSource(CODE_RADIO_STREAM_URL);
      audioService.play();
    }
  };

  public toggleFullscreen = (): void => {
    if (typeof document === "undefined") return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  public setIsFullscreen = (isFullscreen: boolean): void => {
    this.setState({ isFullscreen });
  };

  public toggleAnimatedBg = (): void => {
    this.setState((prev) => ({ isAnimatedBg: !prev.isAnimatedBg }));
  };

  public setWallpaperId = (wallpaperId: string): void => {
    this.setState({ currentWallpaperId: wallpaperId });
    try {
      localStorage.setItem(WALLPAPER_STORAGE_KEY, wallpaperId);
    } catch {
      // Ignore
    }
  };

  public cycleWallpaper = (): void => {
    const currentIndex = WALLPAPERS.findIndex(
      (w) => w.id === this.state.currentWallpaperId,
    );
    const nextIndex = (currentIndex + 1) % WALLPAPERS.length;
    const nextId = WALLPAPERS[nextIndex].id;
    this.setWallpaperId(nextId);
  };

  public setCurrentSong = (song: SongInfo): void => {
    this.setState({ currentSong: song });
    audioService.updateMediaSession(song, "freeCodeCamp Code Radio");
  };

  public setSongHistory = (songHistory: SongInfo[]): void => {
    this.setState({ songHistory });
  };

  public setListenersCount = (listenersCount: number): void => {
    this.setState({ listenersCount });
  };

  public setHistoryOpen = (historyOpen: boolean): void => {
    this.setState({ historyOpen });
  };

  public setShortcutsOpen = (shortcutsOpen: boolean): void => {
    this.setState({ shortcutsOpen });
  };

  public updateFromMetadata = (data: RadioMetadataResult): void => {
    this.setCurrentSong(data.currentSong);
    this.setListenersCount(data.listenersCount);
    this.setSongHistory(data.history);
  };
}

export const radioStore = new RadioStoreInstance();

/**
 * Custom React Hook for selective subscriptions to the Radio Store.
 */
export function useRadioStore<T>(selector: (store: RadioStore) => T): T {
  return useSyncExternalStore(
    radioStore.subscribe,
    () => selector(radioStore.getState()),
    () => selector(radioStore.getState()),
  );
}
