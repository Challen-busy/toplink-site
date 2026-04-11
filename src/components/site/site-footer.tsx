import Link from "next/link";
import { db } from "@/lib/db";
import { Container } from "./container";

export async function SiteFooter() {
  const [settings, l1Cats] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: "default" } }),
    db.category.findMany({
      where: { level: 1 },
      orderBy: { sortOrder: "asc" },
      select: { slug: true, nameEn: true },
    }),
  ]);

  return (
    <footer className="mt-24 border-t border-border bg-surface-muted">
      <Container className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-semibold">
              <span className="inline-block h-7 w-7 rounded-full bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3" />
              <span>{settings?.companyName ?? "TopLink Electronics"}</span>
            </div>
            <p className="mt-4 max-w-md text-sm text-foreground-muted">
              {settings?.tagline}
            </p>
            <div className="mt-5 space-y-1 text-sm text-foreground-muted">
              <p>{settings?.address}</p>
              <p>
                <a href={`mailto:${settings?.email1}`} className="hover:text-foreground">
                  {settings?.email1}
                </a>
                {" · "}
                <a href={`mailto:${settings?.email2}`} className="hover:text-foreground">
                  {settings?.email2}
                </a>
              </p>
              <p>
                {settings?.phone} · {settings?.phone2}
              </p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              {l1Cats.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products/${c.slug}`} className="hover:text-foreground">
                    {c.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-foreground-muted">
              <li><Link href="/about" className="hover:text-foreground">About us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between text-xs text-foreground-muted">
          <p>© {new Date().getFullYear()} TopLink Electronics. All rights reserved.</p>
          <p>Custom cable & wire harness manufacturer · Dongguan, China</p>
        </div>
      </Container>
    </footer>
  );
}
