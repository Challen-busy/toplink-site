import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession, logoutAdmin } from "@/lib/auth";
import { Container } from "@/components/site/container";

async function logoutAction() {
  "use server";
  await logoutAdmin();
  redirect("/admin/login");
}

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  // Login page is public; it's the only admin page rendered with no session.
  // We detect it by looking for session absence AND rendering just children.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
        <aside>
          <div className="font-display text-xl font-semibold mb-6">Admin</div>
          <nav className="space-y-1 text-sm">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="block rounded-xl px-3 py-2 text-foreground-muted hover:bg-surface-muted hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <form action={logoutAction} className="mt-6">
            <button
              type="submit"
              className="w-full rounded-xl border border-border px-3 py-2 text-xs text-foreground-muted hover:text-foreground hover:border-foreground"
            >
              Sign out ({session.email})
            </button>
          </form>
        </aside>
        <section className="min-w-0">{children}</section>
      </div>
    </Container>
  );
}
