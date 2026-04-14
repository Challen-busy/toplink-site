"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChatPanel } from "./chat-panel";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Hide on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      {/* FAB button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3 shadow-lg shadow-aurora-1/25 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform"
          aria-label="Open chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
        </button>
      )}

      {/* Overlay + sidebar */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/40 transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden
          />

          {/* Sidebar: 420px on desktop, full screen on mobile */}
          <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[420px] border-l border-border shadow-2xl animate-slide-in-right">
            <ChatPanel onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
