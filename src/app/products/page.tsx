import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { getL1Categories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore TopLink's full catalog: custom cable assemblies, wire harnesses, overmolded cables, RF coax, data/network, automotive, medical, industrial, and specialty cables.",
};

export default async function ProductsIndexPage() {
  const l1Cats = await getL1Categories();

  return (
    <Container className="py-16 md:py-24">
      <header className="max-w-3xl">
        <p className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
          Catalog
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold tracking-tight">
          Every interconnect you need,{" "}
          <span className="text-aurora">built to your spec.</span>
        </h1>
        <p className="mt-5 text-lg text-foreground-muted">
          Browse our product categories below. Every L2 subcategory opens into a
          request-for-quote flow — tell us what you need and we&apos;ll come
          back within one business day.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {l1Cats.map((cat) => (
          <Link
            key={cat.id}
            href={`/products/${cat.slug}`}
            className="card-hover-border group relative block rounded-[var(--radius-card)] bg-surface p-7 border border-border transition-shadow hover:shadow-[0_20px_60px_-30px_rgba(139,111,245,0.35)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold tracking-tight">
                  {cat.nameEn}
                </h2>
                <p className="mt-2 text-sm text-foreground-muted">
                  {cat.tagline}
                </p>
              </div>
              <span className="shrink-0 text-xs text-foreground-muted">
                {cat.children.length} subcategories
              </span>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {cat.children.slice(0, 4).map((sub) => (
                <span
                  key={sub.id}
                  className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-foreground-muted"
                >
                  {sub.nameEn}
                </span>
              ))}
              {cat.children.length > 4 && (
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs text-foreground-muted">
                  +{cat.children.length - 4} more
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
