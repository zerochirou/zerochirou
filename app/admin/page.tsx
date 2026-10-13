import { getInboxQuestions } from "@/lib/db/queries";
import { AdminQaView } from "@/features/admin";

export default async function AdminPage() {
  const questions = await getInboxQuestions({
    includeArchived: true,
    limit: 100,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Questions &amp; Answers
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage incoming anonymous inquiries, compose official responses, and moderate public submissions.
        </p>
      </div>

      <AdminQaView initialQuestions={questions} />
    </div>
  );
}
