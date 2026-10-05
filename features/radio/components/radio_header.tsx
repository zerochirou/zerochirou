"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRadioStore } from "../store/radio_store";
import Image from "next/image";

export function RadioHeader() {
  const listenersCount = useRadioStore((s) => s.listenersCount);

  return (
    <header className="relative z-20 flex w-full items-center justify-between border-b border-white/10 bg-background/95 px-3 py-2.5 pt-[max(0.625rem,env(safe-area-inset-top))] backdrop-blur-md sm:px-6 sm:py-3 sm:pt-3">
      {/* Left: Brand Identity, Title, Listener Count & Subtitle */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Link
          href="/"
          className="group flex items-center gap-2.5 sm:gap-3 font-semibold transition-opacity hover:opacity-90"
          aria-label="Zerochirou Homepage"
        >
          <Image
            src="/favicon.ico"
            alt="Zerochirou Logo"
            width={24}
            height={24}
            className="rounded shrink-0 sm:h-7 sm:w-7"
          />
          <span className="flex flex-col items-start leading-tight">
            <span className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base font-bold tracking-tight sm:text-xl">
                Radio
              </span>
              {listenersCount > 0 ? (
                <Badge
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] sm:px-2.5 sm:py-0.5 sm:text-xs shrink-0"
                >
                  {listenersCount} listening
                </Badge>
              ) : null}
            </span>
            <span className="hidden text-xs text-muted-foreground md:inline">
              Welcome to Zero Radio, on 24/7, Happy Code.
            </span>
          </span>
        </Link>
      </div>

      {/* Right Navigation */}
      <nav className="flex shrink-0 items-center gap-3 text-xs font-medium text-muted-foreground sm:gap-5 sm:text-sm">
        <Link
          href="/"
          className="py-1 transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <Link
          href="https://blog.zerochirou.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="py-1 transition-colors hover:text-foreground"
        >
          Blog
        </Link>
        <Link
          href="https://coderadio.freecodecamp.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 py-1 transition-colors hover:text-foreground"
        >
          <span>Music Source</span>
          <ExternalLink className="size-3 opacity-60" />
        </Link>
      </nav>
    </header>
  );
}
