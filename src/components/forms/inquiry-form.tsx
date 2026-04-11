"use client";

import { useState } from "react";

type Props = {
  productId?: string;
  productName?: string;
  source?: "product" | "contact" | "home-cta";
  compact?: boolean;
};

export function InquiryForm({
  productId,
  productName,
  source = "contact",
  compact = false,
}: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);
    const form = new FormData(e.currentTarget);
    const payload = {
      source,
      productId,
      name: form.get("name")?.toString() ?? "",
      company: form.get("company")?.toString() ?? "",
      email: form.get("email")?.toString() ?? "",
      phone: form.get("phone")?.toString() ?? "",
      country: form.get("country")?.toString() ?? "",
      quantity: form.get("quantity")?.toString() ?? "",
      message: form.get("message")?.toString() ?? "",
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Submission failed");
      }
      setStatus("sent");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Submission failed",
      );
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-[var(--radius-card)] border border-border bg-surface p-8 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3 text-white text-2xl">
          ✓
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold">Thanks!</h3>
        <p className="mt-2 text-sm text-foreground-muted">
          Your inquiry is in. Our program manager will reply within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-brand font-medium"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className={
        compact
          ? "grid grid-cols-1 gap-4"
          : "grid grid-cols-1 md:grid-cols-2 gap-4"
      }
    >
      {productName && (
        <input type="hidden" name="productName" value={productName} />
      )}
      <div className={compact ? "" : "md:col-span-1"}>
        <label className="block text-xs font-medium text-foreground-muted">Name *</label>
        <input
          required
          name="name"
          type="text"
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className={compact ? "" : "md:col-span-1"}>
        <label className="block text-xs font-medium text-foreground-muted">Company</label>
        <input
          name="company"
          type="text"
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className={compact ? "" : "md:col-span-1"}>
        <label className="block text-xs font-medium text-foreground-muted">Work email *</label>
        <input
          required
          name="email"
          type="email"
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className={compact ? "" : "md:col-span-1"}>
        <label className="block text-xs font-medium text-foreground-muted">Phone</label>
        <input
          name="phone"
          type="tel"
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className={compact ? "" : "md:col-span-1"}>
        <label className="block text-xs font-medium text-foreground-muted">Country</label>
        <input
          name="country"
          type="text"
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className={compact ? "" : "md:col-span-1"}>
        <label className="block text-xs font-medium text-foreground-muted">Target quantity</label>
        <input
          name="quantity"
          type="text"
          placeholder="e.g. 500 / month"
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className={compact ? "" : "md:col-span-2"}>
        <label className="block text-xs font-medium text-foreground-muted">
          Project details *
        </label>
        <textarea
          required
          name="message"
          rows={5}
          placeholder={
            productName
              ? `Requirements for ${productName}: specifications, quantities, timeline…`
              : "Tell us about your project: cable type, quantities, timeline…"
          }
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm focus:border-brand focus:outline-none"
        />
      </div>
      <div className={compact ? "" : "md:col-span-2 flex items-center justify-between gap-4"}>
        {errorMessage && (
          <p className="text-sm text-[color:var(--danger)]">{errorMessage}</p>
        )}
        <button
          type="submit"
          disabled={status === "sending"}
          className="ml-auto inline-flex items-center rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Request a Quote"}
        </button>
      </div>
    </form>
  );
}
