import Link from "next/link";
import { db } from "@/lib/db";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-[color:var(--brand-soft)] text-brand",
  CONTACTED: "bg-amber-100 text-amber-800",
  QUOTED: "bg-blue-100 text-blue-800",
  CLOSED: "bg-emerald-100 text-emerald-800",
  SPAM: "bg-rose-100 text-rose-700",
};

type Props = { searchParams: Promise<{ status?: string }> };

export default async function AdminInquiriesListPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const where = status ? { status: status as "NEW" } : {};
  const inquiries = await db.inquiry.findMany({
    where,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: { product: { select: { nameEn: true } } },
    take: 100,
  });

  const statuses = ["", "NEW", "CONTACTED", "QUOTED", "CLOSED", "SPAM"];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Inquiries
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">
        All customer inquiries, newest first. Click a row to view details and
        change status.
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {statuses.map((s) => (
          <Link
            key={s || "all"}
            href={s ? `/admin/inquiries?status=${s}` : "/admin/inquiries"}
            className={`rounded-full border border-border px-4 py-1.5 text-xs font-medium ${
              (status ?? "") === s
                ? "bg-foreground text-background"
                : "bg-surface text-foreground-muted hover:text-foreground"
            }`}
          >
            {s || "All"}
          </Link>
        ))}
      </div>

      <div className="mt-6 rounded-[var(--radius-card)] border border-border bg-surface divide-y divide-border">
        {inquiries.length === 0 && (
          <p className="p-6 text-sm text-foreground-muted">
            No inquiries match this filter.
          </p>
        )}
        {inquiries.map((i) => (
          <Link
            key={i.id}
            href={`/admin/inquiries/${i.id}`}
            className="flex items-start gap-4 p-4 hover:bg-surface-muted"
          >
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${STATUS_STYLES[i.status] ?? ""}`}
            >
              {i.status}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {i.name}{" "}
                <span className="text-foreground-muted font-normal">
                  · {i.email}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-foreground-muted">
                {i.product?.nameEn ?? "General"} · {i.source} ·{" "}
                {i.company || "—"}
              </p>
              <p className="mt-1 text-xs text-foreground-muted line-clamp-1">
                {i.message}
              </p>
            </div>
            <div className="text-xs text-foreground-muted whitespace-nowrap">
              {new Date(i.createdAt).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
