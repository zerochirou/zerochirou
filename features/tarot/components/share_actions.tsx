"use client";

import { useState } from "react";
import type { DrawnCard, SpreadType, TarotLocale } from "../types";
import { Button } from "@/components/ui/button";
import { buildWhatsAppShareUrl } from "../lib/social_share";
import { copyMarkdownToClipboard } from "../lib/markdown_export";
import { StoryCardModal } from "./story_card_modal";
import {
  Share2,
  FileText,
  Smartphone,
  RotateCcw,
  Check,
} from "lucide-react";

interface ShareActionsProps {
  cards: DrawnCard[];
  spread: SpreadType;
  query?: string;
  onReset: () => void;
  className?: string;
  locale?: TarotLocale;
}

export function ShareActions({
  cards,
  spread,
  query,
  onReset,
  className,
  locale = "id",
}: ShareActionsProps) {
  const [storyOpen, setStoryOpen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const handleShareWhatsApp = () => {
    const url = buildWhatsAppShareUrl({
      spread,
      query,
      cards,
      locale,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyMarkdown = async () => {
    const success = await copyMarkdownToClipboard({
      spread,
      query,
      cards,
      locale,
    });
    if (success) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
        {/* WhatsApp Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareWhatsApp}
          className="rounded-3xl border-border/60 min-h-9 px-3 sm:px-4 text-xs sm:text-sm cursor-pointer"
          aria-label={locale === "id" ? "Bagikan ke WhatsApp" : "Share to WhatsApp"}
        >
          <Share2 data-icon="inline-start" />
          <span>WhatsApp</span>
        </Button>

        {/* Story Modal Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStoryOpen(true)}
          className="rounded-3xl border-border/60 min-h-9 px-3 sm:px-4 text-xs sm:text-sm cursor-pointer"
          aria-label={locale === "id" ? "Buka ekspor Story 9:16" : "Open 9:16 Story export"}
        >
          <Smartphone data-icon="inline-start" />
          <span>Story 9:16</span>
        </Button>

        {/* Notion Markdown Copy Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyMarkdown}
          className="rounded-3xl border-border/60 min-h-9 px-3 sm:px-4 text-xs sm:text-sm cursor-pointer"
          aria-label={locale === "id" ? "Salin catatan Markdown Notion" : "Copy Notion Markdown notes"}
        >
          {copiedMd ? (
            <>
              <Check data-icon="inline-start" className="text-primary" />
              <span>{locale === "id" ? "Tersalin (MD)" : "Copied (MD)"}</span>
            </>
          ) : (
            <>
              <FileText data-icon="inline-start" />
              <span>{locale === "id" ? "Salin Notion" : "Copy Notion"}</span>
            </>
          )}
        </Button>

        {/* Redraw / Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="rounded-3xl text-muted-foreground hover:text-foreground min-h-9 px-3 sm:px-4 text-xs sm:text-sm cursor-pointer"
          aria-label={locale === "id" ? "Mulai ulang pembacaan" : "Reset reading"}
        >
          <RotateCcw data-icon="inline-start" />
          <span>{locale === "id" ? "Mulai Ulang" : "Reset"}</span>
        </Button>
      </div>

      {/* Story Modal */}
      <StoryCardModal
        open={storyOpen}
        onOpenChange={setStoryOpen}
        cards={cards}
        spread={spread}
        query={query}
        locale={locale}
      />
    </div>
  );
}
