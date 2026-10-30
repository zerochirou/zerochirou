"use client";

import { Slider } from "@base-ui/react/slider";
import {
  RotateCcw,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  type ComponentPropsWithRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@workspace/ui/lib/utils";

// Audio courtesy of NASA: https://www.nasa.gov/historical-sounds/
const DEFAULT_AUDIO_SOURCE = "/experiments/cassette-player/one-small-step.mp3";
const DEFAULT_CAPTION_TRACKS = [
  {
    default: true,
    label: "English",
    src: "/experiments/cassette-player/one-small-step.vtt",
    srcLang: "en",
  },
] as const;
const DEFAULT_TRACK_TITLE = "One Small Step";
const DEFAULT_VOLUME = 0.78;
const REEL_SPOKES = [0, 60, 120, 180, 240, 300] as const;
const TAPE_WINDOW_DIVIDERS = [0, 1, 2, 3, 4] as const;
const MIN_REWIND_DURATION = 220;
const MAX_REWIND_DURATION = 1000;
const CASSETTE_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const BUTTON_CLASSES =
  "grid aspect-square cursor-pointer place-items-center rounded-full border text-foreground transition-[background-color,opacity,transform] duration-150 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 motion-reduce:duration-[0.01ms]";

export type CassetteCaptionTrack = {
  default?: boolean;
  label: string;
  src: string;
  srcLang: string;
};

export type CassettePlayerProps = Omit<
  ComponentPropsWithRef<"section">,
  "children"
> & {
  archiveLabel?: string;
  audioSrc?: string;
  captionTracks?: readonly CassetteCaptionTrack[];
  catalogueNumber?: string;
  initialVolume?: number;
  isBuffering?: boolean;
  isLive?: boolean;
  isPlaying?: boolean;
  loop?: boolean;
  onPlaybackChange?: (isPlaying: boolean) => void;
  onPlaybackError?: (error: unknown) => void;
  onRestart?: () => void;
  onToggleMute?: () => void;
  onTogglePlay?: () => void;
  preload?: "auto" | "metadata" | "none";
  sideLabel?: string;
  trackTitle?: string;
};

function easeInOutCubic(progress: number) {
  return progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "PT0S";
  }

  return `PT${Math.floor(seconds)}S`;
}

function normalizeVolume(volume: number) {
  return Number.isFinite(volume)
    ? Math.min(Math.max(volume, 0), 1)
    : DEFAULT_VOLUME;
}

type ReelProps = {
  className: string;
};

function Reel({ className }: ReelProps) {
  return (
    <div
      className={cn(
        "absolute top-1/2 z-3 aspect-square w-[78cqh] -translate-x-1/2 -translate-y-1/2",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 origin-center rotate-[var(--reel-rotation)] rounded-full will-change-transform motion-reduce:!rotate-0"
        viewBox="0 0 100 100"
      >
        <circle className="fill-[#1b1a18]" cx="50" cy="50" r="48" />
        {REEL_SPOKES.map((spokeRotation) => (
          <path
            className="fill-[var(--reel-teeth)] stroke-[var(--reel-tooth-stroke)] [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.32))] [stroke-linejoin:round] [stroke-width:1.25]"
            d="M46 3h8v9a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z"
            key={spokeRotation}
            transform={`rotate(${spokeRotation} 50 50)`}
          />
        ))}
        <circle
          className="fill-none stroke-[var(--reel-window-color)] [stroke-width:3]"
          cx="50"
          cy="50"
          r="48"
        />
      </svg>
    </div>
  );
}

type ScrewProps = {
  className: string;
};

function Screw({ className }: ScrewProps) {
  const slotClasses =
    "absolute top-1/2 right-[18%] left-[18%] h-[14%] -translate-y-1/2 rounded-full bg-[#1d1d1b] shadow-[inset_0_1px_1px_rgba(0,0,0,0.82),0_1px_rgba(255,255,255,0.1)]";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute z-3 aspect-square w-[3.3%] rounded-full border border-[#060606] bg-[radial-gradient(circle_at_36%_30%,#5f5f5c,#30302e_48%,#171716_78%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.26),0_1px_1px_rgba(0,0,0,0.38)]",
        className,
      )}
    >
      <span className={cn(slotClasses, "rotate-45")} />
      <span className={cn(slotClasses, "-rotate-45")} />
    </div>
  );
}

export function CassettePlayer({
  archiveLabel = "Archive 11",
  audioSrc = DEFAULT_AUDIO_SOURCE,
  captionTracks,
  catalogueNumber = "200769",
  className,
  initialVolume = DEFAULT_VOLUME,
  isBuffering = false,
  isLive = false,
  isPlaying: propIsPlaying,
  loop = true,
  onPlaybackChange,
  onPlaybackError,
  onRestart,
  onToggleMute,
  onTogglePlay,
  preload = "metadata",
  ref,
  sideLabel = "Side A",
  trackTitle,
  ...sectionProps
}: CassettePlayerProps) {
  const isControlledPlayback = typeof propIsPlaying === "boolean";
  const resolvedCaptionTracks =
    captionTracks ??
    (audioSrc === DEFAULT_AUDIO_SOURCE ? DEFAULT_CAPTION_TRACKS : []);
  const resolvedTrackTitle =
    trackTitle ??
    (audioSrc === DEFAULT_AUDIO_SOURCE
      ? DEFAULT_TRACK_TITLE
      : "Untitled track");
  const audioRef = useRef<HTMLAudioElement>(null);
  const cassetteRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef(0);
  const isPlayingRef = useRef(false);
  const previousSourceRef = useRef(audioSrc);
  const rewindAnimationRef = useRef<number | null>(null);
  const resumeAfterRewindRef = useRef(false);
  const resumeAfterScrubRef = useRef(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [volume, setVolume] = useState(() => normalizeVolume(initialVolume));
  const [previousVolume, setPreviousVolume] = useState(() =>
    normalizeVolume(initialVolume),
  );

  const currentIsPlaying = isControlledPlayback
    ? propIsPlaying
    : internalIsPlaying;

  const updatePlaybackVisuals = useCallback((time: number) => {
    const cassette = cassetteRef.current;

    if (!cassette) {
      return;
    }

    const mediaDuration = durationRef.current;
    const progress =
      mediaDuration > 0 ? Math.min(Math.max(time / mediaDuration, 0), 1) : 0;

    cassette.style.setProperty("--reel-rotation", `${(time * 300) % 360}deg`);
    cassette.style.setProperty("--left-tape-scale", `${1 - progress * 0.4}`);
    cassette.style.setProperty("--right-tape-scale", `${0.6 + progress * 0.4}`);
  }, []);

  const reportPlaybackError = useCallback(
    (error: unknown, message: string) => {
      setPlaybackError(message);
      onPlaybackError?.(error);
    },
    [onPlaybackError],
  );

  const updatePlaybackState = useCallback(
    (nextIsPlaying: boolean) => {
      if (isPlayingRef.current === nextIsPlaying) {
        return;
      }

      isPlayingRef.current = nextIsPlaying;
      setInternalIsPlaying(nextIsPlaying);
      onPlaybackChange?.(nextIsPlaying);
    },
    [onPlaybackChange],
  );

  const updateMediaDuration = useCallback(
    (audio: HTMLAudioElement) => {
      const nextDuration = Number.isFinite(audio.duration) ? audio.duration : 0;
      durationRef.current = nextDuration;
      setDuration(nextDuration);
      updatePlaybackVisuals(audio.currentTime);
    },
    [updatePlaybackVisuals],
  );

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio && audio.readyState >= 1) {
      updateMediaDuration(audio);
    }
  }, [updateMediaDuration]);

  useEffect(() => {
    if (previousSourceRef.current === audioSrc) {
      return;
    }

    previousSourceRef.current = audioSrc;

    if (rewindAnimationRef.current !== null) {
      window.cancelAnimationFrame(rewindAnimationRef.current);
      rewindAnimationRef.current = null;
    }

    const audio = audioRef.current;
    audio?.pause();
    audio?.load();
    durationRef.current = 0;
    resumeAfterRewindRef.current = false;
    resumeAfterScrubRef.current = false;
    setCurrentTime(0);
    setDuration(0);
    updatePlaybackState(false);
    setPlaybackError(null);
    updatePlaybackVisuals(0);
  }, [audioSrc, updatePlaybackState, updatePlaybackVisuals]);

  // Sync animation loop for reel rotation
  useEffect(() => {
    if (!currentIsPlaying) {
      return;
    }

    let animationFrameId = 0;
    let lastTime = performance.now();

    function syncPlaybackFrame(now: number) {
      const audio = audioRef.current;

      if (audio && !audio.paused && !isControlledPlayback) {
        updatePlaybackVisuals(audio.currentTime);
        setCurrentTime(audio.currentTime);
      } else {
        const deltaSeconds = (now - lastTime) / 1000;
        setCurrentTime((prev) => {
          const next = prev + deltaSeconds;
          updatePlaybackVisuals(next);
          return next;
        });
      }

      lastTime = now;
      animationFrameId = window.requestAnimationFrame(syncPlaybackFrame);
    }

    animationFrameId = window.requestAnimationFrame(syncPlaybackFrame);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [currentIsPlaying, isControlledPlayback, updatePlaybackVisuals]);

  useEffect(
    () => () => {
      if (rewindAnimationRef.current !== null) {
        window.cancelAnimationFrame(rewindAnimationRef.current);
      }
    },
    [],
  );

  function cancelRewind() {
    if (rewindAnimationRef.current === null) {
      return;
    }

    window.cancelAnimationFrame(rewindAnimationRef.current);
    rewindAnimationRef.current = null;
    resumeAfterRewindRef.current = false;

    const audio = audioRef.current;

    if (audio) {
      audio.currentTime = currentTime;
      updatePlaybackVisuals(currentTime);
    }
  }

  async function togglePlayback() {
    if (onTogglePlay) {
      onTogglePlay();
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    cancelRewind();

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        updatePlaybackState(false);
        reportPlaybackError(
          error,
          "Playback could not start. Check the audio source and try again.",
        );
      }
    } else {
      audio.pause();
    }
  }

  function restart() {
    if (onRestart) {
      onRestart();
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const audioElement = audio;

    if (rewindAnimationRef.current !== null) {
      window.cancelAnimationFrame(rewindAnimationRef.current);
    }

    resumeAfterRewindRef.current =
      resumeAfterRewindRef.current || !audioElement.paused;

    if (!audioElement.paused) {
      audioElement.pause();
    }

    const rewindFrom = currentTime;
    const shouldReduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function finishRewind() {
      rewindAnimationRef.current = null;
      audioElement.currentTime = 0;
      setCurrentTime(0);
      updatePlaybackVisuals(0);

      const shouldResume = resumeAfterRewindRef.current;
      resumeAfterRewindRef.current = false;

      if (shouldResume) {
        audioElement.play().catch((error) => {
          updatePlaybackState(false);
          reportPlaybackError(
            error,
            "Playback could not resume after restarting the track.",
          );
        });
      }
    }

    if (rewindFrom <= 0 || shouldReduceMotion) {
      finishRewind();
      return;
    }

    const rewindDistance =
      duration > 0 ? Math.min(Math.max(rewindFrom / duration, 0), 1) : 1;
    const rewindDuration =
      MIN_REWIND_DURATION +
      (MAX_REWIND_DURATION - MIN_REWIND_DURATION) * rewindDistance;
    const startedAt = performance.now();

    function animateRewind(now: number) {
      const linearProgress = Math.min((now - startedAt) / rewindDuration, 1);
      const easedProgress = easeInOutCubic(linearProgress);
      const nextTime = rewindFrom * (1 - easedProgress);

      updatePlaybackVisuals(nextTime);
      setCurrentTime(nextTime);

      if (linearProgress < 1) {
        rewindAnimationRef.current =
          window.requestAnimationFrame(animateRewind);
        return;
      }

      finishRewind();
    }

    rewindAnimationRef.current = window.requestAnimationFrame(animateRewind);
  }

  function seek(nextTime: number) {
    if (isLive) return;

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    cancelRewind();
    const maximumTime = durationRef.current;
    const clampedTime = Math.min(Math.max(nextTime, 0), maximumTime);
    audio.currentTime = clampedTime;
    setCurrentTime(clampedTime);
    updatePlaybackVisuals(clampedTime);
  }

  function startScrubbing() {
    if (isLive) return;

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    cancelRewind();
    resumeAfterScrubRef.current = !audio.paused;

    if (!audio.paused) {
      audio.pause();
    }
  }

  async function finishScrubbing() {
    if (isLive) return;

    const audio = audioRef.current;
    const shouldResume = resumeAfterScrubRef.current;
    resumeAfterScrubRef.current = false;

    if (!audio || !shouldResume) {
      return;
    }

    try {
      await audio.play();
    } catch (error) {
      updatePlaybackState(false);
      reportPlaybackError(
        error,
        "Playback could not resume after seeking the track.",
      );
    }
  }

  function changeVolume(nextVolume: number) {
    const normalizedVolume = normalizeVolume(nextVolume);
    const audio = audioRef.current;

    if (audio) {
      audio.volume = normalizedVolume;
    }

    setVolume(normalizedVolume);

    if (normalizedVolume > 0) {
      setPreviousVolume(normalizedVolume);
    }
  }

  function toggleMute() {
    if (onToggleMute) {
      onToggleMute();
      return;
    }
    changeVolume(volume === 0 ? previousVolume || DEFAULT_VOLUME : 0);
  }

  return (
    <section
      aria-label={`${resolvedTrackTitle} audio player`}
      {...sectionProps}
      className={cn(
        "grid w-full place-items-center overflow-hidden rounded-2xl p-2 sm:p-4 text-foreground [--label-bg:oklch(0.92_0.01_80)] [--label-border:oklch(0.85_0.01_80)] [--label-catalogue:oklch(0.4_0_0)] [--label-ink:oklch(0.18_0_0)] [--label-kicker:oklch(0.35_0_0)] [--label-stripe-one:oklch(0.65_0.18_145)] [--label-stripe-three:oklch(0.6_0.18_250)] [--label-stripe-two:oklch(0.68_0.14_190)] [--progress-thumb-border:oklch(0.95_0_0)] [--reel-teeth-stroke:#11100f] [--reel-teeth:#1b1a18] [container-type:inline-size] dark:[--label-bg:oklch(0.24_0.01_80)] dark:[--label-border:oklch(0.35_0_0)] dark:[--label-catalogue:oklch(0.7_0_0)] dark:[--label-ink:oklch(0.96_0_0)] dark:[--label-kicker:oklch(0.75_0_0)] dark:[--label-stripe-one:oklch(0.7_0.15_145)] dark:[--label-stripe-three:oklch(0.7_0.15_250)] dark:[--label-stripe-two:oklch(0.75_0.12_190)] dark:[--progress-thumb-border:oklch(0.9_0_0)] dark:[--reel-teeth-stroke:oklch(0.3_0_0)] dark:[--reel-teeth:oklch(0.2_0_0)]",
        className,
      )}
      ref={ref}
    >
      {/* Dynamic Caption Tracks */}
      <audio
        loop={loop}
        onDurationChange={(event) => updateMediaDuration(event.currentTarget)}
        onEnded={() => {
          updatePlaybackState(false);
        }}
        onError={(event) => {
          reportPlaybackError(
            event.currentTarget.error,
            "This audio track could not be loaded.",
          );
        }}
        onLoadedMetadata={(event) => {
          updateMediaDuration(event.currentTarget);
          setPlaybackError(null);
        }}
        onPause={() => {
          updatePlaybackState(false);
        }}
        onPlay={() => {
          updatePlaybackState(true);
          setPlaybackError(null);
        }}
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
          updatePlaybackVisuals(event.currentTarget.currentTime);
        }}
        preload={preload}
        ref={audioRef}
        src={audioSrc}
      >
        {resolvedCaptionTracks.map((captionTrack) => (
          <track
            default={captionTrack.default}
            key={`${captionTrack.srcLang}-${captionTrack.src}`}
            kind="captions"
            label={captionTrack.label}
            src={captionTrack.src}
            srcLang={captionTrack.srcLang}
          />
        ))}
      </audio>

      <div className="w-full max-w-[530px]">
        <div
          className="relative aspect-[1.58] w-full overflow-hidden rounded-[18px] border border-black/80 bg-[linear-gradient(165deg,#373735_0%,#20201f_52%,#0e0e0d_100%)] shadow-[0_28px_48px_rgba(0,0,0,0.4),0_8px_16px_rgba(0,0,0,0.3),inset_0_2px_1px_rgba(255,255,255,0.2),inset_0_-3px_3px_rgba(0,0,0,0.8)] [--left-tape-scale:1] [--reel-rotation:0deg] [--right-tape-scale:0.6] max-[560px]:rounded-xl"
          ref={cassetteRef}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-1.5 rounded-[13px] border border-white/[0.12] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.62)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-100 mix-blend-multiply"
            style={{ backgroundImage: CASSETTE_TEXTURE }}
          />
          <Screw className="top-[4%] left-[2.53%]" />
          <Screw className="top-[4%] right-[2.53%]" />
          <Screw className="bottom-[4%] left-[2.53%]" />
          <Screw className="right-[2.53%] bottom-[4%]" />

          <div className="absolute top-[9.5%] right-[8.5%] bottom-[24%] left-[8.5%] z-1 overflow-clip rounded-[9px] border-4 border-transparent bg-[var(--label-bg)] text-[var(--label-ink)] shadow-[inset_0_0_12px_rgba(92,74,49,0.12)] [container-type:inline-size] [overflow-clip-margin:border-box] max-[560px]:rounded-md">
            <div className="relative z-2 mx-4 mt-3 sm:mt-4 flex items-stretch justify-between">
              <div className="grid min-w-0 content-between gap-y-1.5 sm:gap-y-2">
                <span className="relative z-2 flex items-baseline gap-2 font-bold text-[clamp(8px,2.5cqw,11px)] text-[var(--label-kicker)] uppercase leading-none tracking-[0.12em]">
                  <span>{archiveLabel}</span>
                  {isLive && (
                    <span className="inline-flex items-center gap-1 text-destructive">
                      <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
                      <span>ON AIR</span>
                    </span>
                  )}
                </span>
                <span className="relative font-newsreader z-2 block truncate font-semibold text-[clamp(12px,4.6cqw,20px)] leading-none tracking-[-0.04em]">
                  {resolvedTrackTitle}
                </span>
              </div>

              <div className="ml-2 grid shrink-0 content-between justify-items-end gap-y-1.5 sm:gap-y-2 font-bold font-mono uppercase leading-none">
                <span className="rounded-full border border-[var(--label-ink)] bg-[var(--label-ink)] px-[7px] py-1 text-[clamp(8px,2.5cqw,11px)] text-[var(--label-bg)] tracking-[0.08em]">
                  {sideLabel}
                </span>
                <span className="font-mono text-[clamp(7px,2.2cqw,10px)] text-[var(--label-catalogue)] tracking-[0.08em]">
                  {catalogueNumber}
                </span>
              </div>
            </div>

            <div className="relative mt-3 sm:mt-4 h-[34%] max-[560px]:h-[31%]">
              <div
                aria-hidden="true"
                className="absolute -inset-x-1 top-1/2 grid h-[58%] -translate-y-1/2 grid-rows-3 gap-y-1"
              >
                <span className="bg-[var(--label-stripe-one)]" />
                <span className="bg-[var(--label-stripe-two)]" />
                <span className="bg-[var(--label-stripe-three)]" />
              </div>

              <div className="absolute inset-y-0 inset-x-[17.5%] z-3 overflow-hidden rounded-full bg-[#1b1a18] bg-[linear-gradient(rgba(255,255,255,0.13),transparent_45%)] shadow-[0_0_0_4px_var(--label-border),inset_0_3px_8px_rgba(0,0,0,0.58)] [--reel-window-color:#1b1a18] [container-type:size]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply"
                  style={{ backgroundImage: CASSETTE_TEXTURE }}
                />
                <div
                  aria-hidden="true"
                  className="absolute top-[12%] right-[28%] bottom-[12%] left-[28%] z-2 flex items-center justify-evenly overflow-hidden rounded-[3px] border-2 border-[#11100f] bg-[#393631] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1),transparent_42%)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.72),0_0_0_2px_rgba(255,255,255,0.08)]"
                >
                  <span className="absolute top-1/2 left-[calc(50cqh-28cqw)] aspect-square h-[360%] -translate-x-1/2 -translate-y-1/2 scale-[var(--left-tape-scale)] rounded-full border border-[#0d0a08] bg-[repeating-radial-gradient(circle,#050505_0_2px,#171717_2px_4px)] shadow-[inset_0_0_5px_rgba(0,0,0,0.7),0_1px_2px_rgba(0,0,0,0.5)] will-change-transform" />
                  <span className="absolute top-1/2 left-[calc(72cqw-50cqh)] aspect-square h-[360%] -translate-x-1/2 -translate-y-1/2 scale-[var(--right-tape-scale)] rounded-full border border-[#0d0a08] bg-[repeating-radial-gradient(circle,#050505_0_2px,#171717_2px_4px)] shadow-[inset_0_0_5px_rgba(0,0,0,0.7),0_1px_2px_rgba(0,0,0,0.5)] will-change-transform" />
                  {TAPE_WINDOW_DIVIDERS.map((divider) => (
                    <span
                      className="relative z-1 h-[42%] w-0.5 bg-[rgba(224,215,195,0.28)]"
                      key={divider}
                    />
                  ))}
                </div>
                <Reel className="left-[50cqh]" />
                <Reel className="left-[calc(100%-50cqh)]" />
              </div>
            </div>

            <div className="absolute right-4 bottom-3 sm:bottom-4 left-4 z-5 grid gap-y-1 sm:gap-y-1.5">
              <Slider.Root
                disabled={isLive || duration <= 0}
                largeStep={Math.min(Math.max(duration / 10, 1), 10)}
                max={Math.max(duration, 0.01)}
                min={0}
                onValueCommitted={finishScrubbing}
                onValueChange={seek}
                step={0.01}
                thumbAlignment="edge"
                value={Math.min(currentTime, Math.max(duration, 0.01))}
              >
                <Slider.Control
                  className="flex h-5 sm:h-6 w-full cursor-pointer touch-none items-center data-disabled:cursor-default"
                  onPointerCancel={finishScrubbing}
                  onPointerDown={startScrubbing}
                >
                  <Slider.Track className="relative h-[3px] w-full translate-y-0.5 rounded-full bg-[color-mix(in_srgb,var(--label-ink)_28%,transparent)]">
                    <Slider.Indicator className="h-full rounded-full bg-[var(--label-ink)]" />
                    {!isLive && (
                      <Slider.Thumb
                        getAriaLabel={() => `Seek through ${resolvedTrackTitle}`}
                        getAriaValueText={(_formattedValue, value) =>
                          `${formatTime(value)} of ${formatTime(duration)}`
                        }
                        className="size-[13px] rounded-full border-2 border-[var(--progress-thumb-border)] bg-white shadow-[0_1px_4px_rgba(37,33,29,0.38)] outline-none has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring"
                      />
                    )}
                  </Slider.Track>
                </Slider.Control>
              </Slider.Root>

              <div className="relative z-2 flex items-baseline justify-between font-normal font-sans text-xs leading-4 tabular-nums">
                {isLive ? (
                  <>
                    <span className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-destructive uppercase">
                      <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
                      Live Stream
                    </span>
                    <span className="font-mono text-[11px] text-[var(--label-catalogue)]">
                      {formatTime(currentTime)} elapsed
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      <span className="sr-only">Elapsed time </span>
                      <time dateTime={formatDuration(currentTime)}>
                        {formatTime(currentTime)}
                      </time>
                    </span>
                    <span>
                      <span className="sr-only">Total time </span>
                      <time dateTime={formatDuration(duration)}>
                        {formatTime(duration)}
                      </time>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-1 z-10 rounded-[inherit] border-4 border-[var(--label-border)]"
            />
          </div>

          <div className="absolute right-[27%] bottom-[3.5%] left-[27%] z-4 grid h-[16%] grid-cols-[1fr_auto_1fr] place-items-center gap-x-[clamp(6px,1.5cqw,10px)] bg-[color-mix(in_srgb,#63635e_20%,transparent)] px-[12%] shadow-[inset_0_3px_8px_rgba(0,0,0,0.5)] [clip-path:polygon(13%_0,87%_0,100%_100%,0_100%)]">
            <button
              aria-label="Restart track"
              className={cn(
                BUTTON_CLASSES,
                "w-[clamp(24px,6.5cqw,32px)] border-[#82827c] bg-[#63635e] shadow-[0_2px_5px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#7c7b74]",
              )}
              disabled={currentTime <= 0 && !currentIsPlaying}
              onClick={restart}
              type="button"
            >
              <RotateCcw aria-hidden className="size-3.5" />
            </button>

            <button
              aria-label={
                currentIsPlaying
                  ? `Pause ${resolvedTrackTitle}`
                  : `Play ${resolvedTrackTitle}`
              }
              className={cn(
                BUTTON_CLASSES,
                "w-[clamp(30px,8.2cqw,43px)] border-[#bcbbb5]/50 bg-[#8d8d86] shadow-[0_3px_8px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-[#82827c]",
              )}
              disabled={isBuffering && !currentIsPlaying}
              onClick={togglePlayback}
              type="button"
            >
              {currentIsPlaying ? (
                <Pause aria-hidden className="size-4 fill-current" />
              ) : (
                <Play aria-hidden className="size-4 translate-x-0.5 fill-current" />
              )}
            </button>

            <button
              aria-label={volume === 0 ? "Unmute" : "Mute"}
              className={cn(
                BUTTON_CLASSES,
                "w-[clamp(24px,6.5cqw,32px)] border-[#82827c] bg-[#63635e] shadow-[0_2px_5px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-[#7c7b74]",
              )}
              onClick={toggleMute}
              type="button"
            >
              {volume === 0 ? (
                <VolumeX aria-hidden className="size-3.5" />
              ) : (
                <Volume2 aria-hidden className="size-3.5" />
              )}
            </button>
          </div>
        </div>

        {playbackError ? (
          <p
            className="mt-3 text-center text-destructive text-sm font-medium"
            role="alert"
          >
            {playbackError}
          </p>
        ) : null}
      </div>
    </section>
  );
}
