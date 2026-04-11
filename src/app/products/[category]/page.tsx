import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { getL1BySlug } from "@/lib/catalog";

type PageProps = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const l1 = await getL1BySlug(category);
  if (!l1) return {};
  return {
    title: l1.seoTitle ?? l1.nameEn,
    description: l1.seoDesc ?? l1.tagline ?? undefined,
  };
}

export default async function L1CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const l1 = await getL1BySlug(category);
  if (!l1) notFound();

  return (
    <Container className="py-16 md:py-24">
      <nav className="text-sm text-foreground-muted">
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{l1.nameEn}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
          {l1.nameEn}
        </h1>
        {l1.tagline && (
          <p className="mt-4 text-lg text-foreground-muted">{l1.tagline}</p>
        )}
        {l1.description && (
          <p className="mt-4 text-base text-foreground-muted">
            {l1.description}
          </p>
        )}
      </header>

      <section className="mt-14">
        <h2 className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
          Subcategories
        </h2>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {l1.children.map((sub) => (
            <Link
              key={sub.id}
              href={`/products/${l1.slug}/${sub.slug}`}
              className="card-hover-border group relative block rounded-[var(--radius-card)] bg-surface p-6 border border-border"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {sub.nameEn}
                </h3>
                <span className="shrink-0 text-xs text-foreground-muted">
                  {sub._count.products} SKU{sub._count.products === 1 ? "" : "s"}
                </span>
              </div>
              {sub.tagline && (
                <p className="mt-2 text-sm text-foreground-muted">
                  {sub.tagline}
                </p>
              )}
              <span className="mt-4 inline-block text-sm text-brand font-medium">
                Browse →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </Container>
  );
}
