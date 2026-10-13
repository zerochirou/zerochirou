"use client";

import { useState, useEffect, useRef } from "react";
import { Dices, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { SlideCommit } from "@/components/ui/slide_commit";
import {
  ReceiptPrinter,
  type ReceiptPrinterStage,
} from "@/components/ui/receipt_printer";
import {
  MAX_QUESTION_LENGTH,
  DEFAULT_PROMPT,
  PROMPT_PRESETS,
} from "../constants";
import type { SendQuestionInput, SendResult } from "../types";

export interface SendCardProps {
  onSubmit?: (data: SendQuestionInput) => Promise<SendResult | void> | void;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  onReset?: () => void;
  recipientHandle?: string;
}

export function SendCard({
  onSubmit,
  isSubmitting = false,
  isSuccess = false,
  onReset,
  recipientHandle = "@zerochirou",
}: SendCardProps) {
  const [question, setQuestion] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    question: string;
    prompt: string;
    timestamp: string;
  } | null>(null);

  const [prevIsSuccess, setPrevIsSuccess] = useState(isSuccess);
  const [printerStage, setPrinterStage] =
    useState<ReceiptPrinterStage>("printing");

  if (isSuccess && !prevIsSuccess) {
    setPrevIsSuccess(true);
    setPrinterStage("printing");
  } else if (!isSuccess && prevIsSuccess) {
    setPrevIsSuccess(false);
  }

  useEffect(() => {
    if (isSuccess && printerStage === "printing") {
      const timer = setTimeout(() => {
        setPrinterStage("complete");
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, printerStage]);

  const [sliderWidth, setSliderWidth] = useState(320);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sliderContainerRef.current) return;
    const updateWidth = () => {
      if (sliderContainerRef.current) {
        const w = sliderContainerRef.current.clientWidth;
        if (w > 0) setSliderWidth(w);
      }
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(sliderContainerRef.current);
    return () => ro.disconnect();
  }, []);

  const currentPrompt = PROMPT_PRESETS[promptIndex] ?? DEFAULT_PROMPT;

  const handleShuffle = () => {
    setPromptIndex((prev) => (prev + 1) % PROMPT_PRESETS.length);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(e.target.value.slice(0, MAX_QUESTION_LENGTH));
    if (error) {
      setError(null);
    }
  };

  const handleCommit = async () => {
    const trimmed = question.trim();

    if (!trimmed) {
      setError("Pesan tidak boleh kosong.");
      throw new Error("Pesan tidak boleh kosong.");
    }

    setError(null);
    const result = await onSubmit?.({
      question: trimmed,
      prompt: currentPrompt,
    });

    if (result && !result.success && result.error) {
      setError(result.error);
      throw new Error(result.error);
    } else {
      setSubmittedData({
        question: trimmed,
        prompt: currentPrompt,
        timestamp: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  };

  if (isSuccess) {
    return (
      <div
        data-slot="send-card-success"
        className="flex w-full flex-col items-center justify-center gap-4"
      >
        <ReceiptPrinter.Root
          stage={printerStage}
          feedMotion="stepped"
          className="w-full"
        >
          <ReceiptPrinter.Machine>
            <ReceiptPrinter.Header>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-heading text-xs font-semibold tracking-wider uppercase text-foreground">
                  Zerochirou Terminal
                </span>
              </div>
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-mono border-border/40"
              >
                {recipientHandle}
              </Badge>
            </ReceiptPrinter.Header>

            <ReceiptPrinter.Screen>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-semibold text-foreground">
                    Pesan Terkirim!
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">
                    TX-OK
                  </span>
                </div>
                <ReceiptPrinter.Status />
              </div>
            </ReceiptPrinter.Screen>
          </ReceiptPrinter.Machine>

          <ReceiptPrinter.Output>
            <ReceiptPrinter.Paper>
              <div className="flex flex-col gap-3 text-xs">
                {/* Receipt Header */}
                <div className="border-b border-dashed border-border/60 pb-3 text-center">
                  <p className="font-bold tracking-widest uppercase">
                    === BUKTI PENGIRIMAN ===
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    ANONYMOUS INBOX
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    TO: {recipientHandle}
                  </p>
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1 py-1">
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>DATE:</span>
                    <span>
                      {submittedData?.timestamp ||
                        new Date().toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground">
                    <span>STATUS:</span>
                    <span className="font-semibold text-emerald-500">
                      DELIVERED
                    </span>
                  </div>
                </div>

                {/* Prompt & Message */}
                <div className="border-t border-dashed border-border/60 pt-2">
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                    PROMPT:
                  </span>
                  <p className="font-sans font-medium text-foreground text-xs mt-0.5">
                    {submittedData?.prompt || currentPrompt}
                  </p>
                </div>

                <div className="border-t border-dashed border-border/60 pt-2">
                  <span className="text-[10px] uppercase text-muted-foreground font-semibold">
                    PESAN ANONIM:
                  </span>
                  <p className="font-sans text-xs text-foreground/90 mt-1 whitespace-pre-wrap rounded-md bg-muted/40 p-2.5 border border-border/30">
                    &ldquo;
                    {submittedData?.question ||
                      question ||
                      "Pesan anonim terkirim!"}
                    &rdquo;
                  </p>
                </div>

                {/* Footer Barcode look */}
                <div className="border-t border-dashed border-border/60 pt-3 text-center">
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground select-none">
                    ||||| | |||| || |||||| | |||
                  </p>
                  <p className="text-[9px] text-muted-foreground mt-1">
                    TERIMA KASIH TELAH MENGIRIM PESAN, SILAHKAN <b>SS</b> INI
                  </p>
                </div>
              </div>
            </ReceiptPrinter.Paper>
          </ReceiptPrinter.Output>
        </ReceiptPrinter.Root>

        <Button
          variant="default"
          size="sm"
          onClick={() => {
            setQuestion("");
            setSubmittedData(null);
            onReset?.();
          }}
          className="mt-2 cursor-pointer border-border/40"
        >
          Kirim Pesan Lain
        </Button>
      </div>
    );
  }

  return (
    <div
      data-slot="send-card"
      className="flex w-full flex-col gap-4 rounded-4xl border border-border/40 bg-card p-5 text-card-foreground shadow-sm ring-1 ring-foreground/5 dark:ring-foreground/10 sm:p-6"
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/30 pb-3">
        <Badge variant="default" className="text-xs">
          {recipientHandle}
        </Badge>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-muted-foreground" />
          Anonim
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">
            Prompt
          </span>
          <p className="font-heading text-base font-semibold text-foreground sm:text-lg">
            {currentPrompt}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Ganti prompt"
          onClick={handleShuffle}
          className="shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Dices className="size-4" />
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommit();
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-1.5">
          <Textarea
            value={question}
            onChange={handleTextChange}
            placeholder="Tulis pesan anonim kamu di sini..."
            disabled={isSubmitting}
            aria-invalid={Boolean(error)}
            className="min-h-32 rounded-2xl bg-muted/40 p-3 text-base text-foreground placeholder:text-muted-foreground sm:text-sm"
          />
          <div className="flex items-center justify-between px-1 text-xs">
            {error ? (
              <span className="text-destructive font-medium">{error}</span>
            ) : (
              <span className="text-muted-foreground/80">
                Penerima tidak bisa melihat identitasmu
              </span>
            )}
            <span
              className={
                question.length >= MAX_QUESTION_LENGTH
                  ? "text-destructive font-medium"
                  : "text-muted-foreground"
              }
            >
              {question.length}/{MAX_QUESTION_LENGTH}
            </span>
          </div>
        </div>

        <div ref={sliderContainerRef} className="w-full flex justify-center pt-1">
          <SlideCommit
            width={sliderWidth}
            height={50}
            radius={25}
            label={isSubmitting ? "Mengirim..." : "Kirim Pesan Anonim"}
            doneLabel="Terkirim!"
            errorLabel="Gagal mengirim"
            loading={isSubmitting}
            disabled={isSubmitting}
            onConfirm={handleCommit}
            trackColor="var(--secondary)"
            handleColor="var(--primary)"
            successColor="var(--primary)"
            dangerColor="var(--destructive)"
            className="w-full shadow-xs"
          />
        </div>
      </form>
    </div>
  );
}
