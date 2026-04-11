import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { db } from "@/lib/db";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to TopLink Electronics about your cable or wire harness project. We respond to every inquiry within one business day.",
};

export default async function ContactPage() {
  const settings = await db.siteSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.22em] text-foreground-muted">
          Contact
        </p>
        <h1 className="mt-4 font-display text-4xl md:text-5xl font-semibold tracking-tight">
          Let&apos;s build something together.
        </h1>
        <p className="mt-4 text-lg text-foreground-muted">
          Share your project — a drawing, a spec sheet, or just a description —
          and a program manager will come back with a quote and lead time
          within one business day.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
        <div className="rounded-[var(--radius-card)] border border-border bg-surface p-7">
          <h2 className="font-display text-xl font-semibold">Start an inquiry</h2>
          <div className="mt-5">
            <InquiryForm source="contact" />
          </div>
        </div>

        <aside className="space-y-6 text-sm">
          <InfoBlock title="Email">
            <a href={`mailto:${settings?.email1}`} className="hover:text-brand">
              {settings?.email1}
            </a>
            <br />
            <a href={`mailto:${settings?.email2}`} className="hover:text-brand">
              {settings?.email2}
            </a>
          </InfoBlock>
          <InfoBlock title="Phone">
            {settings?.phone}
            <br />
            {settings?.phone2}
          </InfoBlock>
          <InfoBlock title="Address">{settings?.address}</InfoBlock>
          <InfoBlock title="Response time">
            We aim to respond to every inquiry within 24 hours on business days.
          </InfoBlock>
        </aside>
      </div>
    </Container>
  );
}

function InfoBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <p className="text-xs uppercase tracking-wide text-foreground-muted">
        {title}
      </p>
      <p className="mt-2 text-foreground">{children}</p>
    </div>
  );
}
