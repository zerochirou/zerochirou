import type { Metadata, Viewport } from "next";
import { ZeromindView } from "@/features/zeromind";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Interactive Whiteboard | Zerochirou",
  description:
    "Interactive visual thinking and collaborative diagramming whiteboard. Turn Mermaid code into editable sketches, system architectures, and flows.",
  openGraph: {
    title: "Interactive Whiteboard & Diagram Canvas",
    description:
      "Interactive visual thinking and collaborative diagramming whiteboard powered by Excalidraw and Mermaid.",
    type: "website",
    url: "https://zerochirou.com/zeromind",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Whiteboard",
    description: "Turn ideas into interactive diagrams.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0f11",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ZeromindPage() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background">
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
                  Zeromind
                </span>

                <Badge
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] sm:px-2.5 sm:py-0.5 sm:text-xs shrink-0"
                >
                  Experimental
                </Badge>
              </span>
              <span className="hidden text-xs text-muted-foreground md:inline">
                Turn ideas into interactive diagrams
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
            href="/radio"
            target="_blank"
            rel="noopener noreferrer"
            className="py-1 transition-colors hover:text-foreground"
          >
            Radio
          </Link>
          <Link
            href="https://excalidraw.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 py-1 transition-colors hover:text-foreground"
          >
            <span>Source</span>
            <ExternalLink className="size-3 opacity-60" />
          </Link>
        </nav>
      </header>
      <div className="relative flex-1 w-full overflow-hidden">
        <ZeromindView />
      </div>
    </div>
  );
}
