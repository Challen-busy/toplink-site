import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

async function sendReply(formData: FormData) {
  "use server";
  await requireAdminSession();
  const sessionId = formData.get("sessionId")?.toString();
  const content = formData.get("content")?.toString()?.trim();
  if (!sessionId || !content) return;

  await db.chatMessage.create({
    data: { sessionId, role: "human", content },
  });

  const session = await db.chatSession.findUnique({
    where: { id: sessionId },
  });
  if (session && (session.status === "HANDOFF" || session.status === "AI")) {
    await db.chatSession.update({
      where: { id: sessionId },
      data: { status: "HUMAN" },
    });
  }

  revalidatePath(`/admin/chats/${sessionId}`);
}

async function closeChat(formData: FormData) {
  "use server";
  await requireAdminSession();
  const sessionId = formData.get("sessionId")?.toString();
  if (!sessionId) return;

  await db.chatSession.update({
    where: { id: sessionId },
    data: { status: "CLOSED" },
  });
  await db.chatMessage.create({
    data: {
      sessionId,
      role: "system",
      content: "This conversation has been closed by an agent.",
    },
  });

  revalidatePath(`/admin/chats/${sessionId}`);
  revalidatePath("/admin/chats");
  redirect("/admin/chats");
}

const ROLE_LABELS: Record<string, { label: string; style: string }> = {
  visitor: { label: "Visitor", style: "bg-blue-100 text-blue-700" },
  ai: { label: "AI", style: "bg-purple-100 text-purple-700" },
  human: { label: "You", style: "bg-emerald-100 text-emerald-700" },
  system: { label: "System", style: "bg-zinc-100 text-zinc-600" },
};

export default async function AdminChatDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await db.chatSession.findUnique({
    where: { id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!session) notFound();

  const isClosed = session.status === "CLOSED";

  return (
    <div>
      <Link
        href="/admin/chats"
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← Back to chats
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Chat session
          </h1>
          <p className="text-sm text-foreground-muted">
            Status: <strong>{session.status}</strong> · Language:{" "}
            {session.language ?? "—"} · Page: {session.pageUrl ?? "—"}
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            Started {new Date(session.createdAt).toLocaleString()} ·{" "}
            {session.messages.length} messages
          </p>
        </div>
        {!isClosed && (
          <form action={closeChat}>
            <input type="hidden" name="sessionId" value={session.id} />
            <button
              type="submit"
              className="rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground-muted hover:text-foreground hover:border-foreground"
            >
              Close chat
            </button>
          </form>
        )}
      </div>

      {/* Message thread */}
      <section className="mt-6 space-y-3">
        {session.messages.map((m) => {
          const roleInfo = ROLE_LABELS[m.role] ?? {
            label: m.role,
            style: "bg-zinc-100 text-zinc-600",
          };
          return (
            <div
              key={m.id}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${roleInfo.style}`}
                >
                  {roleInfo.label}
                </span>
                <span className="text-[11px] text-foreground-muted">
                  {new Date(m.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              {m.toolCall && (
                <details className="mt-2 text-xs text-foreground-muted">
                  <summary className="cursor-pointer">Tool call</summary>
                  <pre className="mt-1 overflow-x-auto rounded-lg bg-surface-muted p-2 text-[11px]">
                    {m.toolCall}
                  </pre>
                </details>
              )}
            </div>
          );
        })}
      </section>

      {/* Reply form */}
      {!isClosed && (
        <section className="mt-6">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground-muted mb-2">
            Reply as human
          </h2>
          <form action={sendReply}>
            <input type="hidden" name="sessionId" value={session.id} />
            <textarea
              name="content"
              rows={4}
              required
              placeholder="Type your reply to the visitor..."
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
            />
            <div className="mt-2 flex gap-2">
              <button
                type="submit"
                className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90"
              >
                Send reply
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
