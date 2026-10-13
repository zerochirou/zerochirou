"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Film, ChevronRight, Check, Radio, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CassettePlayer } from "@/components/ui/cassette_player";
import { useRadioStore } from "../store/radio_store";
import { STATIONS, WALLPAPERS } from "../constants";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function VuMeter({ isPlaying }: { isPlaying: boolean }) {
  const bars = [40, 65, 85, 55, 90, 45, 95, 75];

  return (
    <div
      aria-hidden="true"
      className="flex h-5 items-end gap-[2px] rounded-xs bg-black/50 px-1.5 py-1 border border-white/10"
    >
      {bars.map((height, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-xs transition-all duration-150",
            i > 6 ? "bg-destructive" : i > 4 ? "bg-amber-400" : "bg-primary",
            isPlaying ? "animate-pulse" : "opacity-25",
          )}
          style={{
            height: isPlaying ? `${height}%` : "20%",
            animationDelay: `${i * 85}ms`,
            animationDuration: `${380 + (i % 3) * 160}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function RadioVisual() {
  const isPlaying = useRadioStore((s) => s.isPlaying);
  const isBuffering = useRadioStore((s) => s.isBuffering);
  const currentStationId = useRadioStore((s) => s.currentStationId);
  const currentSong = useRadioStore((s) => s.currentSong);
  const isAnimatedBg = useRadioStore((s) => s.isAnimatedBg);
  const currentWallpaperId = useRadioStore((s) => s.currentWallpaperId);

  const togglePlay = useRadioStore((s) => s.togglePlay);
  const toggleMute = useRadioStore((s) => s.toggleMute);
  const toggleAnimatedBg = useRadioStore((s) => s.toggleAnimatedBg);
  const setWallpaperId = useRadioStore((s) => s.setWallpaperId);
  const setStationId = useRadioStore((s) => s.setStationId);
  const setShortcutsOpen = useRadioStore((s) => s.setShortcutsOpen);

  const [menuOpen, setMenuOpen] = useState(false);

  const activeWallpaper = useMemo(() => {
    return WALLPAPERS.find((w) => w.id === currentWallpaperId) ?? WALLPAPERS[0];
  }, [currentWallpaperId]);

  const activeStation = useMemo(() => {
    return STATIONS.find((s) => s.id === currentStationId) ?? STATIONS[0];
  }, [currentStationId]);

  const resolvedTrackTitle = useMemo(() => {
    if (currentSong?.title && currentSong?.artist) {
      return `${currentSong.title} — ${currentSong.artist}`;
    }
    return activeStation.name;
  }, [currentSong, activeStation]);

  return (
    <div className="group relative flex w-full flex-1 flex-col items-center justify-center overflow-x-clip px-3 py-6 sm:px-6 sm:py-8">
      {/* Background Video / Artwork Layer */}
      <div className="absolute inset-0 select-none overflow-hidden">
        {isAnimatedBg ? (
          <video
            key={activeWallpaper.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={activeWallpaper.posterSrc}
            className="h-full w-full object-cover object-center"
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
            className="object-cover object-center"
          />
        )}

        {/* Ambient Dark/Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-background/70 backdrop-blur-[2px] transition-colors" />
        <div className="pointer-events-none absolute inset-0 bg-radial-[circle_at_center,transparent_30%,rgba(0,0,0,0.7)_100%]" />
      </div>

      {/* Main Retro-Modern Radio Console Chassis */}
      <div className="relative z-10 flex w-full max-w-xl flex-col rounded-3xl border border-white/10 bg-card/83 p-3.5 shadow-2xl backdrop-blur-xl sm:p-5">
        {/* Radio Tuner & Frequency Dial Header */}
        <div className="mb-3 flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-black/45 p-3 sm:p-3.5">
          {/* Top Status & Frequency Bar */}
          <div className="flex items-center justify-between gap-2 text-xs font-mono">
            {/* Frequency & Transmission Indicator */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 font-bold">
                <Radio className="size-3.5 shrink-0" />
                <span className="text-sm tracking-wider">
                  {activeStation.frequency}
                </span>
              </span>

              {/* <span className="hidden xs:inline-block rounded-xs bg-white/10 px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground sm:inline-block"> */}
              <Badge variant={"default"}>
                {activeStation.callSign}
                <div className="mx-1 h-full w-0.5 bg-card"/>
                {isPlaying && !isBuffering ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-destructive">
                    <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
                    <span>ON AIR</span>
                  </span>
                ) : isBuffering ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400">
                    <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>TUNING</span>
                  </span>
                ) : null}
              </Badge>
              {/* </span> */}
            </div>

            {/* Stereo & VU Equalizer Meters */}
            <div className="flex items-center gap-2">
              <div className="hidden xs:flex items-center gap-1 text-[10px] text-muted-foreground sm:flex">
                <Signal className="size-3 text-primary" />
                <span>STEREO</span>
              </div>
              <VuMeter isPlaying={isPlaying && !isBuffering} />
            </div>
          </div>

          {/* Tuner Band Scale & Station Presets */}
          <div className="flex flex-col gap-1.5 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between px-1 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">
              <span>88 MHz</span>
              <span>FM DIAL</span>
              <span>108 MHz</span>
            </div>

            {/* Station Preset Buttons */}
            <div
              className="grid grid-cols-2 gap-1.5 sm:grid-cols-4"
              role="radiogroup"
              aria-label="Radio Station Presets"
            >
              {STATIONS.map((station) => {
                const isActive = station.id === currentStationId;
                return (
                  <button
                    key={station.id}
                    onClick={() => setStationId(station.id)}
                    role="radio"
                    aria-checked={isActive}
                    aria-label={`Tune to ${station.name} (${station.frequency})`}
                    className={cn(
                      "flex flex-col items-start rounded-lg px-2.5 py-1.5 text-left transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border border-white/40 bg-white/15 text-white shadow-sm"
                        : "border border-card bg-card/80 text-muted-foreground hover:bg-card hover:text-foreground",
                    )}
                  >
                    <span className="text-[11px] font-bold tracking-tight font-mono">
                      {station.frequency}
                    </span>
                    <span className="truncate text-[10px] opacity-80">
                      {station.genre}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Centerpiece: Interactive Cassette Tape Bay */}
        <div className="relative overflow-hidden rounded-2xl border border-black/60 bg-black/30 p-1 shadow-inner">
          <CassettePlayer
            archiveLabel={activeStation.callSign}
            audioSrc={activeStation.streamUrl}
            catalogueNumber={activeStation.frequency}
            isBuffering={isBuffering}
            isLive={activeStation.id !== "apollo_archive"}
            isPlaying={isPlaying}
            onToggleMute={toggleMute}
            onTogglePlay={togglePlay}
            sideLabel="SIDE A"
            trackTitle={resolvedTrackTitle}
          />
        </div>

        {/* Bottom Radio Console Footer Strip */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2 text-xs">
          {/* Active Station Info */}
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <span className="size-2 rounded-full bg-primary shrink-0" />
            <p className="truncate text-xs text-muted-foreground font-mono">
              <span className="font-semibold text-foreground">
                {activeStation.name}:
              </span>{" "}
              {activeStation.description}
            </p>
          </div>

          {/* Quick Shortcuts Trigger */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShortcutsOpen(true)}
            className="h-7 gap-1 rounded-full px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <span>Shortcuts</span>
            <kbd className="rounded bg-muted px-1 text-[10px] font-mono">?</kbd>
          </Button>
        </div>
      </div>

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
              className={cn(
                "size-3 shrink-0 text-muted-foreground transition-transform duration-200",
                menuOpen && "rotate-90",
              )}
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
                        className={cn(
                          "flex min-h-5 w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition-colors",
                          isSelected
                            ? "bg-primary/15 font-medium text-primary"
                            : "text-foreground/80 hover:bg-muted/80 hover:text-foreground",
                        )}
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
            className={cn(
              "size-3.5 shrink-0",
              isAnimatedBg
                ? "text-primary fill-primary/20"
                : "text-muted-foreground",
            )}
          />
          <span className="hidden xs:inline sm:inline">
            {isAnimatedBg ? "Video" : "Static"}
          </span>
        </Button>
      </div>

      {/* Bottom-Right: App Logo Link */}
      <div className="absolute bottom-3 right-3 z-10 sm:bottom-6 sm:right-6">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Home page"
          className="flex size-9 items-center justify-center rounded-full bg-background/90 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 sm:size-11"
        >
          <Image
            src="/favicon.ico"
            alt="Zerochirou Logo"
            width={20}
            height={20}
            className="rounded sm:h-6 sm:w-6"
          />
        </Link>
      </div>
    </div>
  );
}
