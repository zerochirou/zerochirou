"use client";

import { useState } from "react";
import type { DrawnCard, SpreadType } from "../types";
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
}

export function ShareActions({
  cards,
  spread,
  query,
  onReset,
  className,
}: ShareActionsProps) {
  const [storyOpen, setStoryOpen] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const handleShareWhatsApp = () => {
    const url = buildWhatsAppShareUrl({
      spread,
      query,
      cards,
    });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyMarkdown = async () => {
    const success = await copyMarkdownToClipboard({
      spread,
      query,
      cards,
    });
    if (success) {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2000);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {/* WhatsApp Share Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShareWhatsApp}
          className="rounded-3xl border-border/60"
          aria-label="Bagikan ke WhatsApp"
        >
          <Share2 data-icon="inline-start" />
          <span>WhatsApp</span>
        </Button>

        {/* Story Modal Trigger */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setStoryOpen(true)}
          className="rounded-3xl border-border/60"
          aria-label="Buka ekspor kartu Story 9:16"
        >
          <Smartphone data-icon="inline-start" />
          <span>Story 9:16</span>
        </Button>

        {/* Notion Markdown Copy Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyMarkdown}
          className="rounded-3xl border-border/60"
          aria-label="Salin catatan Notion Markdown"
        >
          {copiedMd ? (
            <>
              <Check data-icon="inline-start" className="text-primary" />
              <span>Tersalin (MD)</span>
            </>
          ) : (
            <>
              <FileText data-icon="inline-start" />
              <span>Copy Notion</span>
            </>
          )}
        </Button>

        {/* Redraw / Reset Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="rounded-3xl text-muted-foreground hover:text-foreground"
          aria-label="Tarik kartu baru"
        >
          <RotateCcw data-icon="inline-start" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Story Modal */}
      <StoryCardModal
        open={storyOpen}
        onOpenChange={setStoryOpen}
        cards={cards}
        spread={spread}
        query={query}
      />
    </div>
  );
}
