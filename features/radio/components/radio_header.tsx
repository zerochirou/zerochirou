"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRadioStore } from "../store/radio_store";
import Image from "next/image";

export function RadioHeader() {
  const listenersCount = useRadioStore((s) => s.listenersCount);

  return (
    <header className="relative z-20 flex w-full flex-col items-center justify-between border-b border-white/10 bg-background/95 px-4 py-3 backdrop-blur-md sm:flex-row sm:px-6">
      {/* Left / Spacer for balance on desktop */}
      <div className="hidden w-1/4 items-center gap-2 sm:flex">
        <Link
          href="/"
          className="group flex items-center justify-center gap-3 font-semibold"
          aria-label="Zerochirou Homepage"
        >
          <Image
            src="/favicon.ico"
            alt="Zerochirou Logo"
            width={28}
            height={28}
            className="rounded"
          />
          <span className="flex flex-col items-start">
            <span className="flex flex-row items-center gap-2">
              <span className="text-lg font-bold tracking-tight sm:text-xl">
                Radio
              </span>
              {listenersCount > 0 ? (
                <Badge variant="secondary">
                  {listenersCount} listening
                </Badge>
              ) : null}
            </span>
            <span className="text-xs text-muted-foreground">
              Welcome to Zero Radio, on 24/7, Happy Code.
            </span>
          </span>
        </Link>
      </div>

      {/* Right Navigation */}
      <nav className="mt-2 flex w-full items-center justify-center gap-4 text-sm font-medium text-muted-foreground sm:mt-0 sm:w-1/4 sm:justify-end sm:gap-5">
        <Link
          href="/"
          className="transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <Link
          href="https://blog.zerochirou.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-foreground"
        >
          Blog
        </Link>
        <Link
          href="https://coderadio.freecodecamp.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
          <span>Music Source</span>
          <ExternalLink className="size-3 opacity-60" />
        </Link>
      </nav>
    </header>
  );
}
