"use client";

import {
  ReactNode,
  useState,
  useRef,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import { motion, AnimatePresence } from "motion/react";

interface VideoPlayProps {
  children: ReactNode;
}

function subscribeToSession(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getClientSnapshot(): boolean {
  try {
    return sessionStorage.getItem("intro_played") === "true";
  } catch {
    return true;
  }
}

function getServerSnapshot(): boolean {
  return true;
}

export function VideoPlay({ children }: VideoPlayProps) {
  const hasPlayedSession = useSyncExternalStore(
    subscribeToSession,
    getClientSnapshot,
    getServerSnapshot
  );

  const [isDismissed, setIsDismissed] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const [exitDuration, setExitDuration] = useState(2.2);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasFinishedRef = useRef(false);

  const isPlaying = !hasPlayedSession && !isDismissed;

  const handleFinish = useCallback((isManual = false) => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    try {
      sessionStorage.setItem("intro_played", "true");
    } catch {
      // Ignore private browsing restrictions
    }
    // Slower, dreamy cloud evaporation (2.2s) when finishing naturally; faster (0.7s) when manually skipped
    setExitDuration(isManual ? 0.7 : 2.2);
    setShowSkipHint(false);
    setIsDismissed(true);
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    // Lock body scroll during intro presentation without breaking descendant sticky positioning
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.debug("Autoplay prevented or interrupted:", err);
          handleFinish(false);
        });
      }
    }

    // Subtle ambient hint after 2.5s delay
    const hintTimer = setTimeout(() => {
      setShowSkipHint(true);
    }, 2500);

    // Failsafe timer so user is never stuck
    const fallbackTimer = setTimeout(() => {
      handleFinish(false);
    }, 9500);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleFinish(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(hintTimer);
      clearTimeout(fallbackTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, handleFinish]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    // In the final seconds (~5.8s onwards), the cloud sequence begins.
    // We initiate a slow, dissolving fade-out like clouds evaporating into the page.
    if (video.currentTime >= 5.8 && !hasFinishedRef.current) {
      handleFinish(false);
    }
  };

  return (
    <>
      {children}

      <AnimatePresence>
        {isPlaying && (
          <motion.div
            role="presentation"
            aria-label="Site introduction"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              filter: "blur(22px)",
              scale: 1.08,
            }}
            transition={{
              duration: exitDuration,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onClick={() => handleFinish(true)}
            onContextMenu={(e) => e.preventDefault()}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer select-none overflow-hidden touch-none"
          >
            {/* Seamless motion intro video: no player controls, buttons, or indicators */}
            <video
              ref={videoRef}
              src="/mFZ0nmwy.mp4"
              autoPlay
              muted
              playsInline
              controls={false}
              disablePictureInPicture
              disableRemotePlayback
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => handleFinish(false)}
              onError={() => handleFinish(false)}
              onPlaying={() => setIsVideoLoaded(true)}
              className={`w-full h-full object-cover pointer-events-none transition-opacity duration-700 ease-out scale-105 sm:scale-110 ${
                isVideoLoaded ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Ultra-subtle, non-player ambient hint */}
            <AnimatePresence>
              {showSkipHint && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.45, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-white/70 font-mono"
                >
                  <span>Tap anywhere or press ESC to skip</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
