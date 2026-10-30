"use client";

import { useRef, useState } from "react";
import type { DrawnCard, SpreadType, TarotLocale } from "../types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Spinner } from "@workspace/ui/components/spinner";
import { downloadStoryImage, copyStoryImageToClipboard, shareStoryImageFile } from "../lib/export_image";
import { Download, Share2, Copy, Check } from "lucide-react";

interface StoryCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: DrawnCard[];
  spread: SpreadType;
  query?: string;
  locale?: TarotLocale;
}

export function StoryCardModal({
  open,
  onOpenChange,
  cards,
  spread,
  query,
  locale = "id",
}: StoryCardModalProps) {
  const storyRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const isId = locale === "id";

  const formattedDate = new Date().toLocaleDateString(isId ? "id-ID" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleDownload = async () => {
    if (!storyRef.current || isExporting) return;
    try {
      setIsExporting(true);
      await downloadStoryImage(storyRef.current, {
        fileName: `tarot-story-${Date.now()}.png`,
        pixelRatio: 2.5,
      });
    } catch (err) {
      console.error("Export story failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!storyRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const success = await copyStoryImageToClipboard(storyRef.current, {
        pixelRatio: 2.5,
      });
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        await handleDownload();
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleNativeShare = async () => {
    if (!storyRef.current || isExporting) return;
    try {
      setIsExporting(true);
      const shared = await shareStoryImageFile(storyRef.current, {
        pixelRatio: 2.5,
      });
      if (!shared) {
        await handleDownload();
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[92vh] overflow-y-auto p-4 sm:p-5 bg-card border-border text-card-foreground">
        <DialogHeader className="pb-1 text-center">
          <DialogTitle className="font-serif text-lg font-semibold tracking-wide text-foreground">
            {isId ? "Kartu Story Tarot (9:16)" : "Story Export (9:16)"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isId
              ? "Format vertikal siap dibagikan ke Instagram Story atau WhatsApp Status."
              : "Rendered for Instagram Stories and WhatsApp Status."}
          </DialogDescription>
        </DialogHeader>

        {/* 9:16 Archival Story Canvas */}
        <div className="w-full flex justify-center py-2">
          <div
            ref={storyRef}
            className="w-full max-w-[340px] aspect-[9/16] rounded-3xl p-5 bg-card text-card-foreground border border-border/80 shadow-2xl flex flex-col justify-between overflow-hidden relative"
          >
            {/* Fine Hairline Frame */}
            <div className="absolute inset-2.5 rounded-2xl border border-border/40 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex flex-col gap-1 border-b border-border/40 pb-2.5 mt-1">
              <div className="flex items-center justify-between text-[9px] font-mono tracking-widest text-muted-foreground uppercase">
                <span>ZEROCHIROU ARCHIVE</span>
                <span>{formattedDate}</span>
              </div>
              <h2 className="font-serif text-sm font-semibold tracking-wider uppercase text-foreground">
                {spread === "single"
                  ? (isId ? "Refleksi Harian" : "Daily Reflection")
                  : (isId ? "Trinitas Waktu" : "Trinity Spread")}
              </h2>
              {query && query.trim().length > 0 && (
                <p className="text-[10px] text-muted-foreground italic font-serif line-clamp-1">
                  &ldquo;{query.trim()}&rdquo;
                </p>
              )}
            </div>

            {/* Cards Showcase */}
            <div className="relative z-10 flex flex-col gap-2.5 my-auto py-2">
              {cards.map((drawn) => {
                const meaning = drawn.isReversed ? drawn.card.meaning_rev : drawn.card.meaning_up;
                const shortMeaning = meaning.split(".")[0] + ".";

                return (
                  <div
                    key={drawn.id}
                    className="rounded-xl border border-border/50 bg-muted/30 p-3 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono tracking-wider uppercase text-muted-foreground">
                      <span>{drawn.positionName}</span>
                      <Badge
                        variant={drawn.isReversed ? "destructive" : "secondary"}
                        className="text-[9px] px-1 py-0 font-mono tracking-widest uppercase"
                      >
                        {drawn.isReversed
                          ? (isId ? "TERBALIK" : "REV")
                          : (isId ? "TEGAK" : "UP")}
                      </Badge>
                    </div>

                    <h3 className="font-serif font-bold text-xs tracking-wide uppercase text-foreground">
                      {drawn.card.name}
                    </h3>

                    <p className="text-[10px] text-muted-foreground leading-relaxed font-sans line-clamp-2">
                      {shortMeaning}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="relative z-10 pt-2 border-t border-border/40 flex items-center justify-between text-[9px] font-mono text-muted-foreground tracking-wider">
              <span>TAROT ENGINE</span>
              <span>zerochirou.com/tarot</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/40">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyImage}
            disabled={isExporting}
            className="w-full sm:w-auto text-xs rounded-3xl"
          >
            {copied ? (
              <>
                <Check data-icon="inline-start" className="text-primary" />
                <span>{isId ? "Tersalin!" : "Copied!"}</span>
              </>
            ) : (
              <>
                <Copy data-icon="inline-start" />
                <span>{isId ? "Salin Gambar" : "Copy Image"}</span>
              </>
            )}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleNativeShare}
            disabled={isExporting}
            className="w-full sm:w-auto text-xs rounded-3xl"
          >
            <Share2 data-icon="inline-start" />
            <span>{isId ? "Bagikan" : "Share"}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full sm:w-auto text-xs rounded-3xl"
          >
            {isExporting ? (
              <>
                <Spinner data-icon="inline-start" />
                <span>{isId ? "Merender..." : "Rendering..."}</span>
              </>
            ) : (
              <>
                <Download data-icon="inline-start" />
                <span>{isId ? "Unduh PNG" : "Download PNG"}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
