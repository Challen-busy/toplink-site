import Link from "next/link";
import { db } from "@/lib/db";

const STATUS_STYLES: Record<string, string> = {
  AI: "bg-blue-100 text-blue-800",
  HANDOFF: "bg-amber-100 text-amber-800",
  HUMAN: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-zinc-100 text-zinc-600",
};

export default async function AdminChatsPage() {
  const sessions = await db.chatSession.findMany({
    orderBy: { updatedAt: "desc" },
    take: 100,
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: { content: true, role: true },
      },
      _count: { select: { messages: true } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Live Chats
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">
        {sessions.length} conversation{sessions.length === 1 ? "" : "s"}.
        Sessions marked HANDOFF need your attention.
      </p>

      <div className="mt-6 rounded-[var(--radius-card)] border border-border bg-surface divide-y divide-border">
        {sessions.length === 0 && (
          <p className="p-6 text-sm text-foreground-muted">
            No chat sessions yet.
          </p>
        )}
        {sessions.map((s) => {
          const lastMsg = s.messages[0];
          return (
            <Link
              key={s.id}
              href={`/admin/chats/${s.id}`}
              className="flex items-start gap-4 p-4 hover:bg-surface-muted"
            >
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${STATUS_STYLES[s.status] ?? ""}`}
              >
                {s.status}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {s.summary || "New conversation"}
                  {s.language && (
                    <span className="ml-2 text-foreground-muted font-normal">
                      · {s.language}
                    </span>
                  )}
                </p>
                {lastMsg && (
                  <p className="mt-0.5 text-xs text-foreground-muted line-clamp-1">
                    {lastMsg.role === "visitor" ? "Visitor: " : ""}
                    {lastMsg.content}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-foreground-muted">
                  {new Date(s.updatedAt).toLocaleString()}
                </p>
                <p className="text-xs text-foreground-muted mt-0.5">
                  {s._count.messages} msg{s._count.messages === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
