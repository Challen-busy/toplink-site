export function ChatTyping() {
  return (
    <div className="flex justify-start mb-3">
      <div className="flex items-center gap-1.5 rounded-2xl bg-surface-muted px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-aurora-1 animate-bounce [animation-delay:0ms]" />
        <span className="h-2 w-2 rounded-full bg-aurora-2 animate-bounce [animation-delay:150ms]" />
        <span className="h-2 w-2 rounded-full bg-aurora-3 animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
