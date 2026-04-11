import { Container } from "@/components/site/container";
import { getL1Categories, getHotProducts } from "@/lib/catalog";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function HomePage() {
  const [settings, l1Cats, hotProducts, cases] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: "default" } }),
    getL1Categories(),
    getHotProducts(6),
    db.successCase.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: 3,
    }),
  ]);

  return (
    <>
      {/* ------------------------------------------------ Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-aurora-soft pointer-events-none" />
        <div
          aria-hidden
          className="absolute left-1/2 top-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl opacity-50 bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3"
        />
        <Container className="relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center animate-rise">
            <p className="text-sm uppercase tracking-[0.22em] text-foreground-muted">
              {settings?.heroEyebrow}
            </p>
            <h1 className="mt-5 font-display text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight">
              {settings?.heroTitle?.split(",")[0] ?? "Interconnect solutions"},{" "}
              <span className="text-aurora">
                {settings?.heroTitle?.split(",").slice(1).join(",").trim() ??
                  "crafted with care."}
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-foreground-muted">
              {settings?.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Request a Quote
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center rounded-full border border-border bg-surface px-7 py-3 text-sm font-medium hover:border-foreground transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ Hotline strip */}
      <section className="relative">
        <Container className="pb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: settings?.hotline1Title, body: settings?.hotline1Body },
              { title: settings?.hotline2Title, body: settings?.hotline2Body },
              { title: settings?.hotline3Title, body: settings?.hotline3Body },
            ].map((h, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
              >
                <h3 className="font-display text-lg font-semibold">{h.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{h.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ Hot products */}
      {hotProducts.length > 0 && (
        <section className="mt-20">
          <Container>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                  Hot products
                </p>
                <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
                  Featured this month
                </h2>
              </div>
              <Link href="/products" className="text-sm text-brand font-medium hidden md:inline-flex">
                View all →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotProducts.map((p) => {
                const l1 = p.category?.parent;
                const l2 = p.category;
                if (!l1 || !l2) return null;
                return (
                  <Link
                    key={p.id}
                    href={`/products/${l1.slug}/${l2.slug}/${p.slug}`}
                    className="card-hover-border group relative block rounded-[var(--radius-card)] bg-surface p-6 border border-border"
                  >
                    <p className="text-xs uppercase tracking-wider text-foreground-muted">
                      {l1.nameEn}
                    </p>
                    <h3 className="mt-2 font-display text-lg font-semibold tracking-tight">
                      {p.nameEn}
                    </h3>
                    <p className="mt-2 text-sm text-foreground-muted line-clamp-3">
                      {p.summary}
                    </p>
                  </Link>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------ Catalog preview */}
      <section className="mt-24">
        <Container>
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
              Catalog
            </p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
              If it&apos;s a cable or harness, we build it.
            </h2>
            <p className="mt-3 text-foreground-muted">
              Ten product families, 40+ subcategories, from low-voltage signal
              cables to high-voltage EV harnesses.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">
            {l1Cats.map((cat) => (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                className="card-hover-border group relative block rounded-[var(--radius-card)] bg-surface p-5 border border-border text-center"
              >
                <div className="mx-auto h-10 w-10 rounded-full bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3 opacity-80 group-hover:opacity-100 transition-opacity" />
                <h3 className="mt-4 font-display text-sm font-semibold leading-tight">
                  {cat.nameEn}
                </h3>
                <p className="mt-1 text-xs text-foreground-muted">
                  {cat.children.length} subs
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------ Success cases */}
      {cases.length > 0 && (
        <section className="mt-24">
          <Container>
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
                Success stories
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
                Programs we&apos;re proud of.
              </h2>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
              {cases.map((c) => (
                <div
                  key={c.id}
                  className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
                >
                  <p className="text-xs uppercase tracking-wider text-foreground-muted">
                    {c.industry}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                    {c.title}
                  </h3>
                  <p className="mt-3 text-sm text-foreground-muted">{c.story}</p>
                  {c.metric && (
                    <p className="mt-4 inline-block rounded-full border border-border px-3 py-1 text-xs font-medium">
                      {c.metric}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ------------------------------------------------ CTA band */}
      <section className="mt-24">
        <Container>
          <div className="relative overflow-hidden rounded-[calc(var(--radius-card)+0.5rem)] border border-border bg-surface p-10 md:p-14">
            <div
              aria-hidden
              className="absolute -right-20 -top-20 h-96 w-96 rounded-full blur-3xl opacity-60 bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3"
            />
            <div className="relative max-w-2xl">
              <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                Tell us your project.{" "}
                <span className="text-aurora">Get a quote in 24h.</span>
              </h2>
              <p className="mt-4 text-foreground-muted">
                Share your drawing, BOM, or just a description — our program
                managers will come back with a quote and lead time within one
                business day.
              </p>
              <div className="mt-7 flex gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-full bg-foreground text-background px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Start an inquiry
                </Link>
                <a
                  href={`mailto:${settings?.email2 ?? "sales@toplinkelec.com"}`}
                  className="inline-flex items-center rounded-full border border-border bg-surface px-7 py-3 text-sm font-medium hover:border-foreground transition-colors"
                >
                  Email sales
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
