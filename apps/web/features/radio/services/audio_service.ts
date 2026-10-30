import type { SongInfo } from "../types";

export type AudioEventCallback = {
  onPlaying?: () => void;
  onWaiting?: () => void;
  onPause?: () => void;
  onError?: (error: unknown) => void;
};

class AudioService {
  private audio: HTMLAudioElement | null = null;
  private callbacks: AudioEventCallback = {};

  private getOrCreateAudio(): HTMLAudioElement | null {
    if (typeof window === "undefined") return null;
    if (!this.audio) {
      const audio = new Audio();
      audio.preload = "none";
      audio.crossOrigin = "anonymous";

      audio.addEventListener("waiting", () => this.callbacks.onWaiting?.());
      audio.addEventListener("playing", () => this.callbacks.onPlaying?.());
      audio.addEventListener("pause", () => this.callbacks.onPause?.());
      audio.addEventListener("error", (e) => this.callbacks.onError?.(e));

      this.audio = audio;
    }
    return this.audio;
  }

  public init(callbacks: AudioEventCallback, initialVolume?: number) {
    this.callbacks = callbacks;
    const audio = this.getOrCreateAudio();
    if (audio && initialVolume !== undefined) {
      audio.volume = Math.max(0, Math.min(1, initialVolume));
    }
  }

  public setSource(src: string, autoPlay = false) {
    const audio = this.getOrCreateAudio();
    if (!audio) return;

    audio.pause();
    audio.src = src;
    audio.load();

    if (autoPlay) {
      this.play();
    }
  }

  public async play(): Promise<void> {
    const audio = this.getOrCreateAudio();
    if (!audio) return;

    try {
      this.callbacks.onWaiting?.();
      await audio.play();
      this.callbacks.onPlaying?.();
    } catch (err) {
      this.callbacks.onError?.(err);
      this.callbacks.onPause?.();
    }
  }

  public pause() {
    const audio = this.getOrCreateAudio();
    if (!audio) return;

    audio.pause();
    this.callbacks.onPause?.();
  }

  public setVolume(vol: number) {
    const audio = this.getOrCreateAudio();
    if (!audio) return;

    audio.volume = Math.max(0, Math.min(1, vol));
  }

  public updateMediaSession(song: SongInfo, stationName?: string) {
    if (typeof window === "undefined" || !("mediaSession" in navigator)) return;

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album || stationName || "Code Radio",
        artwork: song.art
          ? [{ src: song.art, sizes: "512x512", type: "image/png" }]
          : [{ src: "/assets/images/radio_bg.jpg", sizes: "512x512", type: "image/jpeg" }],
      });
    } catch {
      // Ignore unsupported browser metadata
    }
  }

  public destroy() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.src = "";
    this.audio = null;
    this.callbacks = {};
  }
}

export const audioService = new AudioService();
