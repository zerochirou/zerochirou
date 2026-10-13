"use client";

import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PulseHeart } from "@/components/ui/pulse_heart";
import type { QuestionItem } from "../types";

export interface SendFeedProps {
  questions: QuestionItem[];
  onLike?: (id: number) => void;
  recipientHandle?: string;
}

export function SendFeed({
  questions,
  onLike,
  recipientHandle = "@zerochirou",
}: SendFeedProps) {
  if (questions.length === 0) {
    return (
      <div
        data-slot="send-feed-empty"
        className="flex w-full flex-col items-center justify-center gap-2 rounded-4xl border border-border/30 bg-card/40 p-8 text-center text-muted-foreground"
      >
        <MessageSquare className="size-6 text-muted-foreground/60" />
        <p className="text-sm font-medium text-foreground">
          Belum ada pertanyaan yang dijawab
        </p>
        <p className="text-xs text-muted-foreground">
          Jadilah yang pertama mengirimkan pertanyaan di atas!
        </p>
      </div>
    );
  }

  return (
    <div
      data-slot="send-feed"
      className="flex w-full flex-col gap-4"
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Q&A Terjawab ({questions.length})
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {questions.map((item) => (
          <article
            key={item.id}
            data-slot="send-feed-card"
            className="flex flex-col gap-3 rounded-3xl border border-border/40 bg-card p-4 text-card-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10 sm:p-5"
          >
            {item.prompt && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {item.prompt}
                </Badge>
              </div>
            )}

            <p className="font-heading text-base font-medium text-foreground">
              {item.question}
            </p>

            {item.answer && (
              <div className="flex flex-col gap-1.5 rounded-2xl bg-muted/40 p-3 text-sm">
                <span className="font-mono text-xs font-semibold text-primary">
                  {recipientHandle}
                </span>
                <p className="text-foreground/90 whitespace-pre-line">
                  {item.answer}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
              <span>
                {item.answeredAt
                  ? new Date(item.answeredAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
              </span>

              <PulseHeart
                count={item.likes}
                label="Suka"
                size={18}
                corner={18}
                onChange={() => onLike?.(item.id)}
                pillColor="var(--secondary)"
                idleColor="var(--muted-foreground)"
                likedColor="#f43f5e"
                textColor="var(--muted-foreground)"
                className="hover:scale-105 transition-transform"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
