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

          if (data.thinking) {
            // Show tool activity — optional visual feedback
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
                content:
                  "Connecting you with a human agent...",
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
            // Use real DB message ID so polling won't re-add this message
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
    <div className="flex flex-col h-full bg-background">
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
    </div>
  );
}
