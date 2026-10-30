"use client";

import { useState } from "react";
import { Share2, Check, MessageCircleQuestion, MessagesSquare } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { SendCard } from "./send_card";
import { SendFeed } from "./send_feed";
import {
  submitQuestionAction,
  likeQuestionAction,
  fetchPublicQuestionsAction,
} from "../services/send_actions";
import type { QuestionItem, SendQuestionInput, SendResult } from "../types";
import { DiaTextReveal } from "@/components/ui/dia_text_reveal";

export interface SendViewProps {
  initialQuestions?: QuestionItem[];
  recipientHandle?: string;
}

export function SendView({
  initialQuestions = [],
  recipientHandle = "@zerochirou",
}: SendViewProps) {
  const [activeTab, setActiveTab] = useState<"send" | "feed">("send");
  const [questions, setQuestions] = useState<QuestionItem[]>(initialQuestions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (input: SendQuestionInput): Promise<SendResult> => {
    setIsSubmitting(true);
    try {
      const res = await submitQuestionAction(input);
      if (res.success) {
        setIsSuccess(true);
      }
      return res;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: number) => {
    // Optimistic like count increment
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, likes: q.likes + 1 } : q)),
    );

    const res = await likeQuestionAction(id);
    if (res.success && typeof res.likes === "number") {
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, likes: res.likes! } : q)),
      );
    } else {
      // Rollback optimistic update on failure
      setQuestions((prev) =>
        prev.map((q) => (q.id === id ? { ...q, likes: Math.max(0, q.likes - 1) } : q)),
      );
    }
  };

  const handleTabChange = async (tab: "send" | "feed") => {
    setActiveTab(tab);
    if (tab === "feed") {
      try {
        const fresh = await fetchPublicQuestionsAction({
          answeredOnly: true,
          limit: 30,
        });
        if (fresh && fresh.length > 0) {
          setQuestions(fresh);
        }
      } catch {
        // Retain existing questions state if network fails
      }
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://zerochirou.com/send";
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-8 sm:py-12">
      <header className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-5xl font-newsreader sm:text-5xl md:text-6xl lg:text-7xl flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-4 gap-y-2 tracking-tight font-normal">
          <span className="sr-only">Tanya Anonim</span>
          <span aria-hidden="true" className="contents">
            <DiaTextReveal
              repeat
              repeatDelay={2}
              text={["Tanya", "Curhat", "Cerita", "Spilll"]}
              colors={["#FFED29", "#0095fe"]}
            />
            <span className="inline-flex items-center gap-2 sm:gap-3 italic">
              <span>Anonim</span>
            </span>
          </span>
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Kirim pesan, pertanyaan, atau tanggapan tanpa identitas langsung ke
          inbox{" "}
          <span className="font-medium text-foreground">{recipientHandle}</span>
          .
        </p>

        <div className="mt-2 flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            {isCopied ? (
              <>
                <Check className="size-3.5 text-primary" />
                Tautan Tersalin!
              </>
            ) : (
              <>
                <Share2 className="size-3.5" />
                Bagikan Tautan
              </>
            )}
          </Button>
        </div>
      </header>

      <nav
        aria-label="Navigasi Q&A"
        className="flex w-full rounded-2xl bg-muted/30 p-1"
      >
        <button
          type="button"
          onClick={() => handleTabChange("send")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium transition-all ${
            activeTab === "send"
              ? "bg-card text-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageCircleQuestion className="size-3.5" />
          Kirim Pesan
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("feed")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium transition-all ${
            activeTab === "feed"
              ? "bg-card text-foreground shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessagesSquare className="size-3.5" />
          Q&A Terjawab ({questions.length})
        </button>
      </nav>

      <main className="w-full">
        {activeTab === "send" ? (
          <SendCard
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSuccess={isSuccess}
            onReset={() => setIsSuccess(false)}
            recipientHandle={recipientHandle}
          />
        ) : (
          <SendFeed
            questions={questions}
            onLike={handleLike}
            recipientHandle={recipientHandle}
          />
        )}
      </main>
    </div>
  );
}
