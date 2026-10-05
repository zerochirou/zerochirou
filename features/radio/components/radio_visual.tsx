"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Pause,
  Film,
  ChevronRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRadioStore } from "../store/radio_store";
import { WALLPAPERS } from "../constants";

export function RadioVisual() {
  const isPlaying = useRadioStore((s) => s.isPlaying);
  const isAnimatedBg = useRadioStore((s) => s.isAnimatedBg);
  const currentWallpaperId = useRadioStore((s) => s.currentWallpaperId);
  const togglePlay = useRadioStore((s) => s.togglePlay);
  const toggleAnimatedBg = useRadioStore((s) => s.toggleAnimatedBg);
  const setWallpaperId = useRadioStore((s) => s.setWallpaperId);
  const setShortcutsOpen = useRadioStore((s) => s.setShortcutsOpen);

  const [menuOpen, setMenuOpen] = useState(false);

  const activeWallpaper = useMemo(() => {
    return (
      WALLPAPERS.find((w) => w.id === currentWallpaperId) ?? WALLPAPERS[0]
    );
  }, [currentWallpaperId]);

  return (
    <div className="group relative flex w-full flex-1 items-center justify-center overflow-hidden bg-background">
      {/* Background Video / Artwork Layer */}
      <div className="relative h-full w-full select-none">
        {isAnimatedBg ? (
          <video
            key={activeWallpaper.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={activeWallpaper.posterSrc}
            className="h-full w-full object-contain object-center sm:object-cover"
          >
            <source src={activeWallpaper.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={activeWallpaper.posterSrc}
            alt={activeWallpaper.name}
            fill
            priority
            sizes="100vw"
            className="object-contain object-center sm:object-cover"
          />
        )}

        {/* Ambient Dark/Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%]" />

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
        className="pointer-events-auto absolute flex size-14 items-center justify-center rounded-full border border-white/20 bg-background/60 text-foreground opacity-0 shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:opacity-100 active:scale-95 sm:size-16"
        aria-label={isPlaying ? "Pause stream" : "Play stream"}
      >
        {isPlaying ? (
          <Pause className="size-6 fill-current sm:size-7" />
        ) : (
          <Play className="size-6 translate-x-0.5 fill-current sm:size-7" />
        )}
      </button>

      {/* Top-Right: Wallpaper Selector & Mode Switcher */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 sm:top-4 sm:right-4 sm:gap-2">
        {/* Scene Selection Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-8 gap-1.5 rounded-full border border-white/10 bg-background/50 px-2.5 text-xs font-medium text-foreground/90 shadow-lg backdrop-blur-md transition-all hover:border-white/20 hover:bg-background/80 sm:px-3"
            title="Choose video wallpaper scene"
          >
            <Film className="size-3.5 shrink-0 text-primary" />
            <span className="max-w-[100px] truncate sm:max-w-none">
              {activeWallpaper.name}
            </span>
            <ChevronRight
              className={`size-3 shrink-0 text-muted-foreground transition-transform duration-200 ${
                menuOpen ? "rotate-90" : ""
              }`}
            />
          </Button>

          {/* Wallpaper Selection Dropdown */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-10 z-40 w-56 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/15 bg-background/95 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 sm:w-64">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Atmospheric Scenes
                </div>
                <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
                  {WALLPAPERS.map((wp) => {
                    const isSelected = wp.id === activeWallpaper.id;
                    return (
                      <button
                        key={wp.id}
                        onClick={() => {
                          setWallpaperId(wp.id);
                          setMenuOpen(false);
                        }}
                        className={`flex min-h-10 w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                          isSelected
                            ? "bg-primary/15 font-medium text-primary"
                            : "text-foreground/80 hover:bg-muted/80 hover:text-foreground"
                        }`}
                      >
                        <span className="truncate">{wp.name}</span>
                        {isSelected && <Check className="size-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Static / Animated Mode Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAnimatedBg}
          className="h-8 gap-1 rounded-full border border-white/10 bg-background/50 px-2 text-xs text-foreground/90 shadow-lg backdrop-blur-md hover:bg-background/80 sm:px-2.5"
          title={
            isAnimatedBg
              ? "Switch to static poster image"
              : "Switch to video animated wallpaper"
          }
        >
          <Film
            className={`size-3.5 shrink-0 ${
              isAnimatedBg
                ? "text-primary fill-primary/20"
                : "text-muted-foreground"
            }`}
          />
          <span className="hidden xs:inline sm:inline">
            {isAnimatedBg ? "Video" : "Static"}
          </span>
        </Button>
      </div>

      {/* Bottom-Left: Keyboard Controls Pill */}
      <div className="absolute bottom-3 left-3 z-10 sm:bottom-6 sm:left-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShortcutsOpen(true)}
          className="h-7 sm:h-8 gap-1.5 rounded-full border border-white/10 bg-background/40 px-2.5 sm:px-3 text-[11px] sm:text-xs font-medium text-foreground/80 shadow-lg backdrop-blur-md transition-all hover:border-white/20 hover:bg-background/80 hover:text-foreground"
        >
          <span className="text-[10px] text-primary">▶</span>
          <span className="hidden xs:inline">Keyboard </span>
          <span>Controls</span>
        </Button>
      </div>

      {/* Bottom-Right: App Logo Link */}
      <div className="absolute bottom-3 right-3 z-10 sm:bottom-6 sm:right-6">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Home page"
          className="flex size-9 items-center justify-center rounded-full bg-background shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 sm:size-12"
        >
          <Image
            src="/favicon.ico"
            alt="Zerochirou Logo"
            width={20}
            height={20}
            className="rounded sm:h-7 sm:w-7"
          />
        </Link>
      </div>
    </div>
  );
}

