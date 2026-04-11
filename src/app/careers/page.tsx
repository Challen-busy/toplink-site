import type { Metadata } from "next";
import { Container } from "@/components/site/container";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join TopLink Electronics — a 20-year-old cable and harness manufacturer in Dongguan, China, with a people-first culture.",
};

const BENEFITS = [
  {
    title: "Long-tenure culture",
    body: "Many of our team members have been with us since day one. We invest in long-term growth, not turnover.",
  },
  {
    title: "Hands-on engineering",
    body: "Engineers and program managers work directly with customers from NPI to mass production — never stuck behind a screen.",
  },
  {
    title: "Global customer exposure",
    body: "Serve customers across automotive, medical, industrial, and telecom — and across 30+ countries.",
  },
  {
    title: "Continuous training",
    body: "IPC/WHMA-A-620 certification, ISO 9001, and ongoing technical training are paid for by the company.",
  },
];

export default function CareersPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-aurora-soft pointer-events-none" />
        <Container className="relative py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-foreground-muted">
              Careers
            </p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              Build your career <span className="text-aurora">one cable at a time.</span>
            </h1>
            <p className="mt-5 text-lg text-foreground-muted">
              Top-Link Electronics employees are our greatest resource. Having
              been in business for more than 20 years, many employees have been
              with us since the beginning. We provide every means to help
              people reach their full potential through career growth
              opportunities and a rewarding, healthy work environment.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-12">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
              >
                <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="mt-20">
        <Container>
          <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-surface p-10 text-center">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              No open positions listed right now.
            </h2>
            <p className="mt-3 text-foreground-muted max-w-xl mx-auto">
              We hire continuously for assembly technicians, quality inspectors,
              and program managers. If you&apos;d like to introduce yourself,
              send your résumé to{" "}
              <a href="mailto:ken@toplinkelec.com" className="text-brand font-medium">
                ken@toplinkelec.com
              </a>{" "}
              — we keep every submission on file.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
