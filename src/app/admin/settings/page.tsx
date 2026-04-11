import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function saveSettings(formData: FormData) {
  "use server";
  const data: Record<string, string> = {};
  const keys = [
    "companyName",
    "tagline",
    "phone",
    "phone2",
    "email1",
    "email2",
    "address",
    "hotline1Title",
    "hotline1Body",
    "hotline2Title",
    "hotline2Body",
    "hotline3Title",
    "hotline3Body",
    "heroEyebrow",
    "heroTitle",
    "heroSubtitle",
  ];
  for (const k of keys) {
    data[k] = formData.get(k)?.toString() ?? "";
  }
  await db.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage() {
  const s =
    (await db.siteSettings.findUnique({ where: { id: "default" } })) ?? {
      companyName: "",
      tagline: "",
      phone: "",
      phone2: "",
      email1: "",
      email2: "",
      address: "",
      hotline1Title: "",
      hotline1Body: "",
      hotline2Title: "",
      hotline2Body: "",
      hotline3Title: "",
      hotline3Body: "",
      heroEyebrow: "",
      heroTitle: "",
      heroSubtitle: "",
    };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Site settings
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Edit company information, home page hero, and service hotline strip.
      </p>

      <form action={saveSettings} className="mt-6 space-y-8">
        <Section title="Company">
          <Field name="companyName" label="Company name" value={s.companyName} />
          <Field name="tagline" label="Tagline" value={s.tagline} />
          <Field name="phone" label="Phone 1" value={s.phone} />
          <Field name="phone2" label="Phone 2" value={s.phone2} />
          <Field name="email1" label="Email 1" value={s.email1} />
          <Field name="email2" label="Email 2" value={s.email2} />
          <Field name="address" label="Address" value={s.address} span />
        </Section>

        <Section title="Home page hero">
          <Field name="heroEyebrow" label="Eyebrow" value={s.heroEyebrow} span />
          <Field name="heroTitle" label="Title" value={s.heroTitle} span />
          <Field name="heroSubtitle" label="Subtitle" value={s.heroSubtitle} span textarea />
        </Section>

        <Section title="Service hotline strip">
          <Field name="hotline1Title" label="Hotline 1 title" value={s.hotline1Title} />
          <Field name="hotline1Body" label="Hotline 1 body" value={s.hotline1Body} textarea />
          <Field name="hotline2Title" label="Hotline 2 title" value={s.hotline2Title} />
          <Field name="hotline2Body" label="Hotline 2 body" value={s.hotline2Body} textarea />
          <Field name="hotline3Title" label="Hotline 3 title" value={s.hotline3Title} />
          <Field name="hotline3Body" label="Hotline 3 body" value={s.hotline3Body} textarea />
        </Section>

        <div className="border-t border-border pt-5">
          <button
            type="submit"
            className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90"
          >
            Save settings
          </button>
        </div>
      </form>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground-muted">
        {title}
      </h2>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </section>
  );
}

function Field({
  name,
  label,
  value,
  span,
  textarea,
}: {
  name: string;
  label: string;
  value: string;
  span?: boolean;
  textarea?: boolean;
}) {
  return (
    <div className={span ? "md:col-span-2" : ""}>
      <label className="block text-xs font-medium text-foreground-muted">
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          defaultValue={value}
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
        />
      ) : (
        <input
          name={name}
          type="text"
          defaultValue={value}
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
        />
      )}
    </div>
  );
}
