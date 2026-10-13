"use client";

import * as React from "react";
import { type AnonymousQuestion } from "@/lib/db/schema";
import {
  adminAnswerQuestionAction,
  adminEditReplyAction,
} from "../services/admin_actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";

interface ReplyDialogProps {
  question: AnonymousQuestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updated: AnonymousQuestion) => void;
}

interface ReplyFormProps {
  question: AnonymousQuestion;
  onClose: () => void;
  onSuccess?: (updated: AnonymousQuestion) => void;
}

function ReplyForm({ question, onClose, onSuccess }: ReplyFormProps) {
  const [answerText, setAnswerText] = React.useState(question.answer || "");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const isEditing = Boolean(question.answer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = answerText.trim();
    if (!trimmed) {
      setErrorMessage("Reply content cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const action = isEditing
      ? adminEditReplyAction(question.id, trimmed)
      : adminAnswerQuestionAction(question.id, trimmed);

    const result = await action;
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.error || "Failed to process reply.");
      return;
    }

    onClose();
    if (result.data) {
      onSuccess?.(result.data as AnonymousQuestion);
    } else {
      onSuccess?.(question);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader className="gap-2">
        <DialogTitle>
          {isEditing ? "Edit Reply" : "Reply to Question"}
        </DialogTitle>
        <DialogDescription>
          <span className="italic block text-foreground/90 bg-muted/40 p-3 rounded-2xl border border-border/40">
            &ldquo;{question.question}&rdquo;
          </span>
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <FieldGroup>
          <Field data-invalid={Boolean(errorMessage)}>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="reply-text">Answer Content</FieldLabel>
              <span className="text-xs text-muted-foreground">
                {answerText.length} / 1000
              </span>
            </div>
            <Textarea
              id="reply-text"
              placeholder="Write your thoughtful reply here..."
              maxLength={1000}
              rows={4}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              disabled={isSubmitting}
              aria-invalid={Boolean(errorMessage)}
              className="mt-1.5 resize-y"
              required
            />
            {errorMessage && (
              <FieldError errors={[{ message: errorMessage }]} />
            )}
          </Field>
        </FieldGroup>
      </div>

      <DialogFooter className="gap-2 sm:gap-0">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
          className="cursor-pointer border-border/40"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !answerText.trim()}
          className="cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Spinner data-icon="inline-start" />
              Saving...
            </>
          ) : isEditing ? (
            "Update Reply"
          ) : (
            "Send Reply"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ReplyDialog({
  question,
  open,
  onOpenChange,
  onSuccess,
}: ReplyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border-border/40 bg-card">
        {open && question ? (
          <ReplyForm
            key={question.id}
            question={question}
            onClose={() => onOpenChange(false)}
            onSuccess={onSuccess}
          />
        ) : (
          <div className="sr-only">
            <DialogTitle>Reply</DialogTitle>
            <DialogDescription>Compose a reply</DialogDescription>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
