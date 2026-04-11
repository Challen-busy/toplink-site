import type { Metadata } from "next";
import { Container } from "@/components/site/container";

export const metadata: Metadata = {
  title: "About",
  description:
    "TopLink Electronics is a Dongguan-based contract manufacturer specializing in custom cable assemblies and wire harnesses since 2006.",
};

const MILESTONES = [
  {
    year: "2006",
    title: "Founded in Dongguan",
    body: "TopLink Electronics opens its first facility in Chang'an Town, serving local electronics OEMs with cable and harness assembly services.",
  },
  {
    year: "2012",
    title: "US medical OEM partnership",
    body: "Facility upgrade and controlled environment assembly line for a US medical OEM program — autoclavable silicone cables built under lot traceability.",
  },
  {
    year: "2016",
    title: "Automotive 360° camera harness",
    body: "Ramped mass production of 360° panoramic camera harnesses with FAKRA terminations for Tier-1 automotive suppliers.",
  },
  {
    year: "2018",
    title: "Rail automation programs",
    body: "Entered rail transportation market with automation cable assemblies for CRRC (Zhongche Group) programs.",
  },
  {
    year: "2024",
    title: "IPC/WHMA-A-620 certified line",
    body: "Certified assembly line to IPC/WHMA-A-620 Class 2 and Class 3 acceptance criteria for cable and wire harness assemblies.",
  },
];

const VALUES = [
  {
    title: "Zero-defect mindset",
    body: "Every cable is 100% electrically tested. Medical programs run to zero-defect targets with full lot traceability.",
  },
  {
    title: "Program partnership",
    body: "Dedicated program managers stay with your project from first RFQ to mass production, bridging engineering and production.",
  },
  {
    title: "Flexibility to scale",
    body: "Low-volume prototypes and high-volume automotive programs run on the same floor — we grow with your product.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-aurora-soft pointer-events-none" />
        <Container className="relative py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.22em] text-foreground-muted">
              About
            </p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl font-semibold leading-[1.05] tracking-tight">
              20 years of making <span className="text-aurora">cables that don&apos;t fail.</span>
            </h1>
            <p className="mt-5 text-lg text-foreground-muted">
              TopLink Electronics is a contract manufacturer of cable and wire
              harness assemblies, headquartered in Dongguan, China. Since 2006
              we&apos;ve been building interconnects for automotive, medical,
              industrial, and telecom OEMs across 30+ countries.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-10">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-[var(--radius-card)] border border-border bg-surface p-6"
              >
                <h3 className="font-display text-lg font-semibold">{v.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="mt-20">
        <Container>
          <p className="text-sm uppercase tracking-[0.18em] text-foreground-muted">
            Milestones
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-semibold tracking-tight">
            The road so far.
          </h2>
          <div className="mt-10 space-y-5">
            {MILESTONES.map((m) => (
              <div
                key={m.year}
                className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-4 md:gap-8 border-l-2 border-border pl-6 md:border-l-0 md:pl-0"
              >
                <div className="font-display text-2xl md:text-3xl text-aurora font-semibold">
                  {m.year}
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-foreground-muted">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="mt-20">
        <Container>
          <div className="rounded-[var(--radius-card)] border border-border bg-surface p-8">
            <h2 className="font-display text-xl font-semibold">Capabilities snapshot</h2>
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <Capability label="Assembly standard" value="IPC/WHMA-A-620 Class 2 / 3" />
              <Capability label="Quality system" value="ISO 9001 certified" />
              <Capability label="Engineering" value="NPI · DfM · BOM · AutoCAD" />
              <Capability label="Test" value="100% electrical · hi-pot · continuity" />
              <Capability label="Markets" value="Automotive · Medical · Industrial · Telecom" />
              <Capability label="Connector partners" value="Molex · TE · JST · Yazaki · TE Deutsch" />
              <Capability label="Facilities" value="Dongguan · Wujiang" />
              <Capability label="Countries served" value="30+" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

function Capability({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-foreground-muted">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  );
}
