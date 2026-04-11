import Link from "next/link";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [
    totalInquiries,
    newInquiries,
    productCount,
    l1Count,
    l2Count,
    hotCount,
    recentInquiries,
  ] = await Promise.all([
    db.inquiry.count(),
    db.inquiry.count({ where: { status: "NEW" } }),
    db.product.count(),
    db.category.count({ where: { level: 1 } }),
    db.category.count({ where: { level: 2 } }),
    db.product.count({ where: { isHot: true } }),
    db.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { product: { select: { nameEn: true } } },
    }),
  ]);

  const stats = [
    { label: "New inquiries", value: newInquiries, accent: true },
    { label: "Total inquiries", value: totalInquiries },
    { label: "Products", value: productCount },
    { label: "Hot products", value: hotCount },
    { label: "L1 categories", value: l1Count },
    { label: "L2 subcategories", value: l2Count },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Dashboard
      </h1>
      <p className="mt-2 text-foreground-muted text-sm">
        Snapshot of inquiries and catalog health.
      </p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`rounded-[var(--radius-card)] border border-border p-5 ${s.accent ? "bg-gradient-to-br from-[color:var(--brand-soft)] to-surface" : "bg-surface"}`}
          >
            <p className="text-xs uppercase tracking-wide text-foreground-muted">
              {s.label}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">
            Recent inquiries
          </h2>
          <Link href="/admin/inquiries" className="text-sm text-brand font-medium">
            View all →
          </Link>
        </div>
        <div className="mt-4 rounded-[var(--radius-card)] border border-border bg-surface divide-y divide-border">
          {recentInquiries.length === 0 && (
            <p className="p-6 text-sm text-foreground-muted">
              No inquiries yet.
            </p>
          )}
          {recentInquiries.map((i) => (
            <Link
              key={i.id}
              href={`/admin/inquiries/${i.id}`}
              className="flex items-start justify-between gap-4 p-4 hover:bg-surface-muted"
            >
              <div>
                <p className="text-sm font-medium">
                  {i.name}{" "}
                  <span className="text-foreground-muted font-normal">
                    · {i.email}
                  </span>
                </p>
                <p className="text-xs text-foreground-muted mt-0.5">
                  {i.product?.nameEn ?? "General inquiry"} · {i.source}
                </p>
              </div>
              <div className="text-xs text-foreground-muted whitespace-nowrap">
                {new Date(i.createdAt).toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
