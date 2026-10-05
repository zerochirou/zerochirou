"use client";

import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Loader2,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRadioStore } from "../store/radio_store";
import WakeSlider from "@/components/ui/wake_silinder";
import Image from "next/image";

export function RadioControls() {
  const isPlaying = useRadioStore((s) => s.isPlaying);
  const isBuffering = useRadioStore((s) => s.isBuffering);
  const currentSong = useRadioStore((s) => s.currentSong);
  const volume = useRadioStore((s) => s.volume);
  const isMuted = useRadioStore((s) => s.isMuted);
  const isFullscreen = useRadioStore((s) => s.isFullscreen);

  const togglePlay = useRadioStore((s) => s.togglePlay);
  const toggleMute = useRadioStore((s) => s.toggleMute);
  const setVolume = useRadioStore((s) => s.setVolume);
  const toggleFullscreen = useRadioStore((s) => s.toggleFullscreen);
  const setHistoryOpen = useRadioStore((s) => s.setHistoryOpen);

  const effectiveVolume = isMuted ? 0 : volume;

  const renderVolumeIcon = () => {
    if (effectiveVolume === 0)
      return <VolumeX className="size-4 text-muted-foreground" />;
    if (effectiveVolume < 0.5)
      return <Volume1 className="size-4 text-foreground/80" />;
    return <Volume2 className="size-4 text-foreground" />;
  };

  return (
    <div className="relative z-20 flex w-full flex-col justify-between border-t border-b border-card/10 bg-card/40 px-3.5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:px-6 sm:py-3 sm:pb-3">
      {/* Left Section: Current Track Info & History */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 sm:justify-start sm:gap-3.5">
        <div className="flex min-w-0 items-center gap-3">
          {/* History Button (Artwork thumbnail) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setHistoryOpen(true)}
            className="size-10 shrink-0 p-0 hover:bg-transparent"
            aria-label="View Recently Played History"
            title="Recently Played Song History (H)"
          >
            <Image
              src={currentSong.art || "/assets/images/radio_bg.jpg"}
              width={260}
              height={260}
              alt={currentSong.title || "Code Radio Track"}
              unoptimized
              className="size-10 rounded-sm border border-card object-cover grayscale-100 transition-opacity hover:opacity-80"
            />
          </Button>

          {/* Track Title, Artist, & Live Equalizer Visualizer */}
          <div className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">
              <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
                {currentSong.title || "Code Radio Stream"}
              </p>

              {/* Mini Equalizer Bar Animation when Playing */}
              {isPlaying && !isBuffering ? (
                <div className="flex h-3 shrink-0 items-end gap-[2px]">
                  <span className="h-full w-[3px] rounded-full bg-primary animate-[bounce_0.8s_ease-in-out_infinite]" />
                  <span className="h-2/3 w-[3px] rounded-full bg-primary animate-[bounce_0.6s_ease-in-out_0.2s_infinite]" />
                  <span className="h-4/5 w-[3px] rounded-full bg-primary animate-[bounce_0.7s_ease-in-out_0.4s_infinite]" />
                </div>
              ) : null}
            </div>

            <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
              {currentSong.artist || "24/7 music designed for coding"}
            </p>
          </div>
        </div>

        {/* Mobile Quick Song History Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setHistoryOpen(true)}
          className="size-8 shrink-0 text-muted-foreground hover:text-foreground sm:hidden"
          aria-label="Open Song History"
          title="Song History"
        >
          <History className="size-4" />
        </Button>
      </div>

      {/* Right Section: Play/Pause, Volume Slider, Fullscreen */}
      <div className="mt-2.5 flex items-center justify-between gap-3 sm:mt-0 sm:justify-end sm:gap-4">
        {/* Play / Pause Main Trigger */}
        <Button
          onClick={togglePlay}
          disabled={isBuffering && !isPlaying}
          size="icon"
          className="size-11 shrink-0 rounded-full bg-foreground text-background shadow-lg transition-transform hover:scale-105 hover:bg-foreground/90 active:scale-95 sm:size-12"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isBuffering ? (
            <Loader2 className="size-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 translate-x-0.5 fill-current" />
          )}
        </Button>

        {/* Volume Controls with WakeSlider */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:flex-initial sm:gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="size-8 shrink-0 text-foreground/80 hover:text-foreground"
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {renderVolumeIcon()}
          </Button>

          <div className="w-full min-w-0 max-w-full sm:w-28 sm:flex-none">
            <WakeSlider
              value={Math.round(effectiveVolume * 100)}
              defaultValue={Math.round(effectiveVolume * 100)}
              min={0}
              max={100}
              step={1}
              bars={16}
              height={26}
              restHeight={8}
              gap={2.5}
              fillColor="var(--primary, #f5f5f5)"
              trackColor="rgba(255, 255, 255, 0.15)"
              sensitivity={1}
              reach={4}
              skew={0.6}
              glide={0.3}
              smoothing={100}
              showValue={false}
              onChange={(val: number) => setVolume(val / 100)}
              ariaLabel="Volume Slider"
            />
          </div>
        </div>

        {/* Fullscreen Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="hidden size-8 text-muted-foreground hover:text-foreground sm:inline-flex"
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
        >
          {isFullscreen ? (
            <Minimize className="size-4" />
          ) : (
            <Maximize className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
