"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatBubble } from "./chat-bubble";
import { ChatTyping } from "./chat-typing";

type Message = {
  id: string;
  role: "visitor" | "ai" | "human" | "system";
  content: string;
};

type Props = {
  onClose: () => void;
};

export function ChatPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content:
        "Hi! I'm TopLink's AI assistant. Ask me about our cable and harness manufacturing capabilities, or I can connect you with a human agent. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [sessionStatus, setSessionStatus] = useState<string>("AI");
  const [showHandoff, setShowHandoff] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMsgIdRef = useRef<string | null>(null);

  // Restore sessionId from localStorage
  useEffect(() => {
    sessionIdRef.current = localStorage.getItem("toplink_chat_session");
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, streamingContent]);

  // Polling for human replies
  const poll = useCallback(async () => {
    const sid = sessionIdRef.current;
    if (!sid) return;
    try {
      const afterParam = lastMsgIdRef.current
        ? `?after=${lastMsgIdRef.current}`
        : "";
      const res = await fetch(`/api/chat/${sid}/messages${afterParam}`);
      if (!res.ok) return;
      const data = (await res.json()) as {
        status: string;
        messages: Array<{
          id: string;
          role: string;
          content: string;
        }>;
      };
      setSessionStatus(data.status);
      if (data.messages.length > 0) {
        const newMsgs: Message[] = data.messages
          .filter(
            (m) =>
              m.role !== "visitor" &&
              !messages.some((existing) => existing.id === m.id),
          )
          .map((m) => ({
            id: m.id,
            role: m.role as Message["role"],
            content: m.content,
          }));
        if (newMsgs.length > 0) {
          setMessages((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            return [...prev, ...newMsgs.filter((m) => !ids.has(m.id))];
          });
          lastMsgIdRef.current =
            data.messages[data.messages.length - 1].id;
        }
      }
    } catch {
      /* ignore poll errors */
    }
  }, [messages]);

  useEffect(() => {
    pollRef.current = setInterval(poll, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [poll]);

  async function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const visitorMsg: Message = {
      id: `v-${Date.now()}`,
      role: "visitor",
      content: text,
    };
    setMessages((prev) => [...prev, visitorMsg]);
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(sessionIdRef.current
            ? { sessionId: sessionIdRef.current }
            : {}),
          message: text,
          pageUrl: window.location.pathname,
        }),
      });

      // Get sessionId from header
      const newSid = res.headers.get("X-Session-Id");
      if (newSid) {
        sessionIdRef.current = newSid;
        localStorage.setItem("toplink_chat_session", newSid);
      }

      if (!res.ok || !res.body) {
        throw new Error("Stream failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";
      let buffer = "";
      let doneMsgId = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6);

          let data: Record<string, unknown>;
          try {
            data = JSON.parse(jsonStr);
          } catch {
            continue;
          }

          if (data.delta) {
            accumulated += data.delta as string;
            setStreamingContent(accumulated);
          }

          if (data.handoff) {
            setSessionStatus("HANDOFF");
            const handoffMsg = (data.message as string) ?? "";
            accumulated = handoffMsg;
            setStreamingContent("");
            setMessages((prev) => [
              ...prev,
              {
                id: `sys-${Date.now()}`,
                role: "system",
                content: "Connecting you with a human agent...",
              },
              {
                id: `ai-${Date.now()}`,
                role: "ai",
                content: handoffMsg,
              },
            ]);
            accumulated = "";
          }

          if (data.done) {
            if (data.sessionId) {
              const sid = data.sessionId as string;
              sessionIdRef.current = sid;
              localStorage.setItem("toplink_chat_session", sid);
            }
            if (data.messageId) {
              doneMsgId = data.messageId as string;
              lastMsgIdRef.current = doneMsgId;
            }
          }

          if (data.error) {
            accumulated = data.error as string;
          }
        }
      }

      // Finalize streaming message — use real DB ID so poll dedup works
      if (accumulated) {
        setMessages((prev) => [
          ...prev,
          {
            id: doneMsgId || `ai-${Date.now()}`,
            role: "ai",
            content: accumulated,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "system",
          content: "Connection error. Please try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const isClosed = sessionStatus === "CLOSED";

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3 flex items-center justify-center">
            <span className="text-white text-xs font-bold">TL</span>
          </div>
          <div>
            <h2 className="font-display text-base font-semibold">
              TopLink AI
            </h2>
            <p className="text-[11px] text-foreground-muted">
              {sessionStatus === "AI" && "AI assistant"}
              {sessionStatus === "HANDOFF" && "Waiting for human agent..."}
              {sessionStatus === "HUMAN" && "Connected to human agent"}
              {sessionStatus === "CLOSED" && "Conversation closed"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Call Human button */}
          <button
            onClick={() => setShowHandoff(true)}
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>Human</span>
          </button>
          {/* Close button */}
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full hover:bg-surface-muted flex items-center justify-center text-foreground-muted hover:text-foreground transition-colors"
            aria-label="Close chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <ChatBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {isStreaming && streamingContent && (
          <ChatBubble role="ai" content={streamingContent} isStreaming />
        )}
        {isStreaming && !streamingContent && <ChatTyping />}
      </div>

      {/* Input */}
      {!isClosed && (
        <div className="px-4 pb-4 pt-2 border-t border-border">
          <div className="flex items-end gap-2 rounded-[var(--radius-pill)] border border-border bg-surface px-4 py-2 focus-within:border-brand transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                sessionStatus === "HANDOFF"
                  ? "A human agent will reply shortly..."
                  : "Ask about our cables..."
              }
              rows={1}
              className="flex-1 bg-transparent text-sm resize-none outline-none max-h-24 py-1"
              disabled={isStreaming}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-aurora-1 to-aurora-2 flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
              aria-label="Send message"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Handoff Modal */}
      {showHandoff && (
        <HandoffModal
          sessionId={sessionIdRef.current}
          onClose={() => setShowHandoff(false)}
          onHandoffSubmitted={() => {
            setShowHandoff(false);
            setSessionStatus("HANDOFF");
            setMessages((prev) => [
              ...prev,
              {
                id: `sys-handoff-${Date.now()}`,
                role: "system",
                content:
                  "Your request has been submitted. A human agent will contact you shortly.",
              },
            ]);
          }}
        />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Handoff Modal
// ────────────────────────────────────────────────────────────

function HandoffModal({
  sessionId,
  onClose,
  onHandoffSubmitted,
}: {
  sessionId: string | null;
  onClose: () => void;
  onHandoffSubmitted: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const form = new FormData(e.currentTarget);
    const email = form.get("email")?.toString().trim() ?? "";
    const phone = form.get("phone")?.toString().trim() ?? "";
    const note = form.get("note")?.toString().trim() ?? "";

    // Submit as chat message + trigger handoff via the chat API
    const message = `[Human agent request]\nEmail: ${email}\nPhone: ${phone}${note ? `\nNote: ${note}` : ""}`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(sessionId ? { sessionId } : {}),
          message,
          pageUrl: window.location.pathname,
        }),
      });

      const newSid = res.headers.get("X-Session-Id");
      if (newSid) {
        localStorage.setItem("toplink_chat_session", newSid);
      }

      // Consume the stream (we don't display it — AI should trigger handoff)
      if (res.body) {
        const reader = res.body.getReader();
        while (true) {
          const { done } = await reader.read();
          if (done) break;
        }
      }

      setStatus("sent");
      onHandoffSubmitted();
    } catch {
      setStatus("error");
      setError("Failed to submit. Please try again.");
    }
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-[var(--radius-card)] bg-background border border-border shadow-2xl overflow-y-auto max-h-[90%]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-display text-lg font-semibold">
            Contact a human agent
          </h3>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-full hover:bg-surface-muted flex items-center justify-center text-foreground-muted hover:text-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* Section 1: Request callback */}
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-foreground-muted font-medium mb-3">
              Request a callback
            </p>
            <p className="text-sm text-foreground-muted mb-4">
              Leave your contact info and our program manager will reach out within one business day.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-foreground-muted">
                  Email *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="your@company.com"
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted">
                  Phone (with country code) *
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground-muted">
                  Brief note (optional)
                </label>
                <input
                  name="note"
                  type="text"
                  placeholder="e.g. Need quote for automotive harness"
                  className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:border-brand focus:outline-none"
                />
              </div>
              {error && (
                <p className="text-xs text-[color:var(--danger)]">{error}</p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-full bg-foreground text-background py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {status === "sending"
                  ? "Submitting..."
                  : "Submit request"}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-foreground-muted">or contact us directly</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Section 2: Contact info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-foreground-muted">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <p className="text-xs text-foreground-muted">Phone</p>
                <p className="text-sm font-medium">
                  <a href="tel:+8676985648091" className="hover:text-brand">+86-769-85648091</a>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-muted px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-foreground-muted">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <div>
                <p className="text-xs text-foreground-muted">Email</p>
                <p className="text-sm font-medium">
                  <a href="mailto:sales@toplinkelec.com" className="hover:text-brand">sales@toplinkelec.com</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
