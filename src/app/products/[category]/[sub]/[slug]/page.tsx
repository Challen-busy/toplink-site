import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { getProductBySlug, parseJsonArray } from "@/lib/catalog";

type PageProps = {
  params: Promise<{ category: string; sub: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, sub, slug } = await params;
  const p = await getProductBySlug(category, sub, slug);
  if (!p) return {};
  return {
    title: p.seoTitle ?? p.nameEn,
    description: p.seoDesc ?? p.summary,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { category, sub, slug } = await params;
  const product = await getProductBySlug(category, sub, slug);
  if (!product || !product.category?.parent) notFound();

  const l1 = product.category.parent;
  const l2 = product.category;
  const specs = parseJsonArray<{ label: string; value: string }>(product.specs);
  const features = parseJsonArray<string>(product.features);
  const applications = parseJsonArray<string>(product.applications);

  return (
    <>
      <Container className="py-16 md:py-24">
        <nav className="text-sm text-foreground-muted">
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span className="mx-2">/</span>
          <Link href={`/products/${l1.slug}`} className="hover:text-foreground">
            {l1.nameEn}
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/products/${l1.slug}/${l2.slug}`}
            className="hover:text-foreground"
          >
            {l2.nameEn}
          </Link>
        </nav>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12">
          <div>
            <header>
              <p className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                {l2.nameEn}
              </p>
              <h1 className="mt-3 font-display text-3xl md:text-4xl font-semibold tracking-tight">
                {product.nameEn}
              </h1>
              <p className="mt-4 text-lg text-foreground-muted">
                {product.summary}
              </p>
            </header>

            <section className="mt-10">
              <h2 className="font-display text-xl font-semibold">Overview</h2>
              <p className="mt-3 text-foreground-muted leading-relaxed">
                {product.description}
              </p>
            </section>

            {features.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-semibold">Key features</h2>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-foreground-muted"
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-aurora-1 to-aurora-2" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {specs.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-semibold">Specifications</h2>
                <dl className="mt-4 rounded-[var(--radius-card)] border border-border bg-surface divide-y divide-border">
                  {specs.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4 px-5 py-3 text-sm"
                    >
                      <dt className="text-foreground-muted">{s.label}</dt>
                      <dd className="text-right font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {applications.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-semibold">Applications</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {applications.map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full border border-border bg-surface-muted px-3 py-1 text-xs text-foreground-muted"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky inquiry panel */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[var(--radius-card)] border border-border bg-surface p-6">
              <h2 className="font-display text-xl font-semibold">
                Request a quote
              </h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Tell us about your project. We&apos;ll respond within one business day.
              </p>
              <div className="mt-5">
                <InquiryForm
                  source="product"
                  productId={product.id}
                  productName={product.nameEn}
                  compact
                />
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
