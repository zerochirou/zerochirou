"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Archive,
  ArchiveRestore,
  Heart,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { type AnonymousQuestion } from "@/lib/db/schema";
import {
  adminDeleteQuestionAction,
  adminDeleteReplyAction,
  adminToggleArchiveAction,
} from "../services/admin_actions";
import { ReplyDialog } from "./reply_dialog";
import { DeleteDialog } from "./delete_dialog";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Input } from "@workspace/ui/components/input";

interface AdminQaViewProps {
  initialQuestions: AnonymousQuestion[];
}

type TabFilter = "all" | "unanswered" | "answered" | "archived";

export function AdminQaView({ initialQuestions }: AdminQaViewProps) {
  const router = useRouter();
  const [questions, setQuestions] = React.useState<AnonymousQuestion[]>(initialQuestions);
  const [prevInitialQuestions, setPrevInitialQuestions] =
    React.useState(initialQuestions);
  const [activeTab, setActiveTab] = React.useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  if (initialQuestions !== prevInitialQuestions) {
    setPrevInitialQuestions(initialQuestions);
    setQuestions(initialQuestions);
  }

  const [replyTarget, setReplyTarget] = React.useState<AnonymousQuestion | null>(null);
  const [isReplyOpen, setIsReplyOpen] = React.useState(false);

  const [deleteQuestionTarget, setDeleteQuestionTarget] =
    React.useState<AnonymousQuestion | null>(null);
  const [deleteReplyTarget, setDeleteReplyTarget] =
    React.useState<AnonymousQuestion | null>(null);

  const stats = React.useMemo(() => {
    const total = questions.length;
    const answered = questions.filter((q) => Boolean(q.answer)).length;
    const unanswered = questions.filter((q) => !q.answer && !q.isArchived).length;
    const archived = questions.filter((q) => q.isArchived).length;
    const totalLikes = questions.reduce((acc, q) => acc + (q.likes || 0), 0);
    return { total, answered, unanswered, archived, totalLikes };
  }, [questions]);

  const filteredQuestions = React.useMemo(() => {
    return questions.filter((q) => {
      if (activeTab === "unanswered") {
        if (q.answer || q.isArchived) return false;
      } else if (activeTab === "answered") {
        if (!q.answer) return false;
      } else if (activeTab === "archived") {
        if (!q.isArchived) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesAnswer = q.answer?.toLowerCase().includes(query) ?? false;
        const matchesPrompt = q.prompt?.toLowerCase().includes(query) ?? false;
        return matchesQuestion || matchesAnswer || matchesPrompt;
      }

      return true;
    });
  }, [questions, activeTab, searchQuery]);

  const handleOpenReply = (q: AnonymousQuestion) => {
    setReplyTarget(q);
    setIsReplyOpen(true);
  };

  const handleReplySuccess = (updated: AnonymousQuestion) => {
    setQuestions((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item)),
    );
    router.refresh();
  };

  const handleToggleArchive = async (q: AnonymousQuestion) => {
    const nextArchived = !q.isArchived;
    const result = await adminToggleArchiveAction(q.id, nextArchived);
    if (result.success) {
      setQuestions((prev) =>
        prev.map((item) =>
          item.id === q.id ? { ...item, isArchived: nextArchived } : item,
        ),
      );
      router.refresh();
    }
  };

  const handleDeleteQuestionConfirm = async () => {
    if (!deleteQuestionTarget) return;
    const id = deleteQuestionTarget.id;
    const result = await adminDeleteQuestionAction(id);
    if (result.success) {
      setQuestions((prev) => prev.filter((item) => item.id !== id));
      setDeleteQuestionTarget(null);
      router.refresh();
    }
  };

  const handleDeleteReplyConfirm = async () => {
    if (!deleteReplyTarget) return;
    const id = deleteReplyTarget.id;
    const result = await adminDeleteReplyAction(id);
    if (result.success) {
      setQuestions((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, answer: null, answeredAt: null } : item,
        ),
      );
      setDeleteReplyTarget(null);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Real Statistics Overview Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <Card className="border-border/40 bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">
            Total Inquiries
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {stats.total}
          </div>
        </Card>
        <Card className="border-border/40 bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">
            Awaiting Reply
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-amber-500">
            {stats.unanswered}
          </div>
        </Card>
        <Card className="border-border/40 bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">
            Answered
          </span>
          <div className="mt-1 text-2xl font-bold tracking-tight text-primary">
            {stats.answered}
          </div>
        </Card>
        <Card className="border-border/40 bg-card p-4">
          <span className="text-xs font-medium text-muted-foreground">
            Community Likes
          </span>
          <div className="mt-1 flex items-center gap-1.5 text-2xl font-bold tracking-tight text-rose-500">
            <Heart className="size-5 fill-rose-500/20 text-rose-500" />
            <span>{stats.totalLikes}</span>
          </div>
        </Card>
      </div>

      {/* Control Bar: Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5 rounded-2xl border border-border/40 bg-card/60 p-1">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("all")}
            className="min-h-[36px] cursor-pointer text-xs"
          >
            All ({stats.total})
          </Button>
          <Button
            variant={activeTab === "unanswered" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("unanswered")}
            className="min-h-[36px] cursor-pointer text-xs"
          >
            Unanswered ({stats.unanswered})
          </Button>
          <Button
            variant={activeTab === "answered" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("answered")}
            className="min-h-[36px] cursor-pointer text-xs"
          >
            Answered ({stats.answered})
          </Button>
          <Button
            variant={activeTab === "archived" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("archived")}
            className="min-h-[36px] cursor-pointer text-xs"
          >
            Archived ({stats.archived})
          </Button>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 min-h-[40px] text-xs"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
      </div>

      {/* Question Cards Feed */}
      {filteredQuestions.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed border-border/40 p-12 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <MessageSquare className="size-6" />
          </div>
          <CardTitle className="text-base font-semibold">
            No inquiries found
          </CardTitle>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {searchQuery
              ? "No questions match your current search query. Try clearing the filter."
              : "No questions in this section yet."}
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredQuestions.map((q) => {
            const isAnswered = Boolean(q.answer);
            const formattedDate = new Date(q.createdAt).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <Card
                key={q.id}
                className="overflow-hidden border-border/40 bg-card transition-colors hover:border-border"
              >
                <CardHeader className="gap-2 pb-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant={isAnswered ? "default" : "secondary"}
                        className="text-[11px] font-normal"
                      >
                        {isAnswered ? "Answered" : "Awaiting Reply"}
                      </Badge>
                      {q.isArchived && (
                        <Badge
                          variant="outline"
                          className="text-[11px] font-normal text-muted-foreground"
                        >
                          Archived
                        </Badge>
                      )}
                      {q.prompt && (
                        <Badge
                          variant="outline"
                          className="text-[11px] font-normal text-muted-foreground"
                        >
                          Prompt: {q.prompt}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formattedDate}
                    </span>
                  </div>

                  <p className="font-heading text-base font-medium leading-relaxed text-foreground">
                    {q.question}
                  </p>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 pt-0">
                  {/* Answer Section */}
                  {isAnswered && (
                    <div className="rounded-2xl border border-border/30 bg-muted/30 p-4">
                      <div className="flex items-center justify-between gap-2 pb-2">
                        <span className="text-xs font-semibold text-primary">
                          Admin Reply
                        </span>
                        {q.answeredAt && (
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(q.answeredAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                        {q.answer}
                      </p>

                      {/* Reply Actions */}
                      <div className="mt-3 flex items-center gap-2 border-t border-border/20 pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReply(q)}
                          className="min-h-[32px] cursor-pointer gap-1.5 text-xs border-border/40"
                        >
                          <Pencil className="size-3.5" />
                          <span>Edit Reply</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteReplyTarget(q)}
                          className="min-h-[32px] cursor-pointer gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-3.5" />
                          <span>Delete Reply</span>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Question Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/20 pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Heart className="size-4 text-rose-500 fill-rose-500/20" />
                      <span>{q.likes} likes</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!isAnswered && (
                        <Button
                          size="sm"
                          onClick={() => handleOpenReply(q)}
                          className="min-h-[36px] cursor-pointer gap-1.5 text-xs"
                        >
                          <Plus className="size-3.5" />
                          <span>Reply</span>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleArchive(q)}
                        aria-label={q.isArchived ? "Unarchive question" : "Archive question"}
                        className="min-h-[36px] cursor-pointer gap-1.5 text-xs border-border/40"
                      >
                        {q.isArchived ? (
                          <>
                            <ArchiveRestore className="size-3.5" />
                            <span>Unarchive</span>
                          </>
                        ) : (
                          <>
                            <Archive className="size-3.5" />
                            <span>Archive</span>
                          </>
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteQuestionTarget(q)}
                        aria-label="Delete question"
                        className="min-h-[36px] cursor-pointer gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" />
                        <span>Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Reply / Edit Modal Dialog */}
      <ReplyDialog
        question={replyTarget}
        open={isReplyOpen}
        onOpenChange={setIsReplyOpen}
        onSuccess={handleReplySuccess}
      />

      {/* Delete Question Confirmation Dialog */}
      <DeleteDialog
        open={Boolean(deleteQuestionTarget)}
        onOpenChange={(open) => !open && setDeleteQuestionTarget(null)}
        title="Delete Question"
        description="Are you sure you want to permanently delete this question? This action cannot be undone."
        confirmLabel="Delete Question"
        onConfirm={handleDeleteQuestionConfirm}
      />

      {/* Delete Reply Confirmation Dialog */}
      <DeleteDialog
        open={Boolean(deleteReplyTarget)}
        onOpenChange={(open) => !open && setDeleteReplyTarget(null)}
        title="Delete Reply"
        description="Are you sure you want to delete this reply? The question will return to awaiting reply status."
        confirmLabel="Delete Reply"
        onConfirm={handleDeleteReplyConfirm}
      />
    </div>
  );
}
