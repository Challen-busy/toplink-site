import Link from "next/link";
import { Container } from "./container";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/careers", label: "Careers" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="inline-block h-7 w-7 rounded-full bg-gradient-to-br from-aurora-1 via-aurora-2 to-aurora-3" />
          <span>TopLink</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-foreground-muted">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="hover:text-foreground transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="hidden md:inline-flex items-center rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Request a Quote
        </Link>
      </Container>
    </header>
  );
}
