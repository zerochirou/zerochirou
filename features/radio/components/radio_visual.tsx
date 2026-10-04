"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Pause, Sparkles, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRadioStore } from "../store/radio_store";

export function RadioVisual() {
  const isPlaying = useRadioStore((s) => s.isPlaying);
  const isAnimatedBg = useRadioStore((s) => s.isAnimatedBg);
  const togglePlay = useRadioStore((s) => s.togglePlay);
  const toggleAnimatedBg = useRadioStore((s) => s.toggleAnimatedBg);
  const setShortcutsOpen = useRadioStore((s) => s.setShortcutsOpen);

  return (
    <div className="group relative flex w-full flex-1 items-center justify-center overflow-hidden bg-background">
      {/* Background Artwork Layer */}
      <div className="relative h-full w-full select-none">
        <Image
          src={
            isAnimatedBg
              ? "/assets/images/radio_animated.gif"
              : "/assets/images/radio_bg.jpg"
          }
          alt="Lofi Coder Room - Code Radio"
          fill
          priority
          sizes="100vw"
          className="object-contain object-center sm:object-cover"
          unoptimized={isAnimatedBg}
        />

        {/* Ambient Dark/Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_center,transparent_50%,rgba(0,0,0,0.5)_100%]" />

        {/* Click-to-play full backdrop hotspot */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          className="absolute inset-0 cursor-pointer opacity-0 focus:opacity-100 focus:outline-none"
        />
      </div>

      {/* Center play state indicator on hover */}
      <button
        onClick={togglePlay}
        className="pointer-events-auto absolute flex size-16 items-center justify-center rounded-full border border-white/20 bg-background/60 text-foreground opacity-0 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 active:scale-95"
        aria-label={isPlaying ? "Pause stream" : "Play stream"}
      >
        {isPlaying ? (
          <Pause className="size-7 fill-current" />
        ) : (
          <Play className="size-7 translate-x-0.5 fill-current" />
        )}
      </button>

      {/* Bottom-Left: Keyboard Controls Pill (Exact position as in screenshot) */}
      <div className="absolute bottom-4 left-4 z-10 sm:bottom-6 sm:left-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShortcutsOpen(true)}
          className="h-8 gap-1.5 rounded-full border border-white/10 bg-background/40 px-3 text-xs font-medium text-foreground/80 shadow-lg backdrop-blur-md transition-all hover:border-white/20 hover:bg-background/80 hover:text-foreground"
        >
          <span className="text-[10px] text-primary">▶</span>
          <span>Keyboard Controls</span>
        </Button>
      </div>

      {/* Top-Right Visual Toggle: Static / Animated Wallpaper */}
      <div className="absolute top-4 right-4 z-10 opacity-60 transition-opacity hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAnimatedBg}
          className="h-7 gap-1 rounded-full border border-white/10 bg-background/40 px-2.5 text-[11px] text-foreground/90 backdrop-blur-md hover:bg-background/80"
          title={
            isAnimatedBg
              ? "Switch to static wallpaper"
              : "Switch to animated wallpaper"
          }
        >
          {isAnimatedBg ? (
            <>
              <ImageIcon className="size-3" />
              <span className="hidden sm:inline">Animated</span>
            </>
          ) : (
            <>
              <ImageIcon className="size-3 text-muted-foreground" />
              <span className="hidden sm:inline">Static</span>
            </>
          )}
        </Button>
      </div>

      {/* Bottom-Right: Discord Community Icon (Exact match as in screenshot) */}
      <div className="absolute bottom-4 right-4 z-10 sm:bottom-6 sm:right-6">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join Discord Community"
          className="flex size-11 items-center justify-center rounded-full bg-background shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 sm:size-12"
        >
          <Image
            src="/favicon.ico"
            alt="Zerochirou Logo"
            width={28}
            height={28}
            className="rounded"
          />
        </Link>
      </div>
    </div>
  );
}
