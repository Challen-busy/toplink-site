import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { getL2BySlugWithinL1 } from "@/lib/catalog";

type PageProps = { params: Promise<{ category: string; sub: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, sub } = await params;
  const result = await getL2BySlugWithinL1(category, sub);
  if (!result) return {};
  return {
    title: result.l2.seoTitle ?? result.l2.nameEn,
    description: result.l2.seoDesc ?? result.l2.tagline ?? undefined,
  };
}

export default async function L2CategoryPage({ params }: PageProps) {
  const { category, sub } = await params;
  const result = await getL2BySlugWithinL1(category, sub);
  if (!result) notFound();
  const { l1, l2 } = result;

  return (
    <Container className="py-16 md:py-24">
      <nav className="text-sm text-foreground-muted">
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/products/${l1.slug}`} className="hover:text-foreground">
          {l1.nameEn}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{l2.nameEn}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">
          {l2.nameEn}
        </h1>
        {l2.tagline && (
          <p className="mt-4 text-lg text-foreground-muted">{l2.tagline}</p>
        )}
      </header>

      <section className="mt-12">
        {l2.products.length === 0 ? (
          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface-muted p-10 text-center">
            <p className="text-foreground-muted">
              No published SKUs yet in this subcategory. We still build to spec —{" "}
              <Link href="/contact" className="text-brand font-medium">
                send us an inquiry
              </Link>{" "}
              and we&apos;ll quote your build.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {l2.products.map((p) => (
              <Link
                key={p.id}
                href={`/products/${l1.slug}/${l2.slug}/${p.slug}`}
                className="card-hover-border group relative block rounded-[var(--radius-card)] bg-surface p-6 border border-border"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {p.nameEn}
                </h3>
                <p className="mt-2 text-sm text-foreground-muted line-clamp-3">
                  {p.summary}
                </p>
                <span className="mt-4 inline-block text-sm text-brand font-medium">
                  View details →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}
