import { cn } from "@/lib/utils";

type Props = {
  role: "visitor" | "ai" | "human" | "system";
  content: string;
  isStreaming?: boolean;
};

export function ChatBubble({ role, content, isStreaming }: Props) {
  if (role === "system") {
    return (
      <div className="mx-auto max-w-[85%] px-4 py-2 text-center text-xs text-foreground-muted">
        {content}
      </div>
    );
  }

  const isVisitor = role === "visitor";

  return (
    <div className={cn("flex mb-3", isVisitor ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isVisitor
            ? "bg-gradient-to-br from-aurora-1 to-aurora-2 text-white"
            : "bg-surface-muted text-foreground",
          role === "human" && "border-l-2 border-brand",
          isStreaming && "animate-pulse",
        )}
      >
        {role === "human" && (
          <span className="block text-[10px] uppercase tracking-wider text-foreground-muted mb-1">
            Human agent
          </span>
        )}
        <div className="whitespace-pre-wrap break-words">{content}</div>
      </div>
    </div>
  );
}
