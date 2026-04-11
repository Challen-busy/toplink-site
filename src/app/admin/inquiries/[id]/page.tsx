import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { InquiryStatus } from "@prisma/client";

type Props = { params: Promise<{ id: string }> };

const STATUS_OPTIONS: InquiryStatus[] = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CLOSED",
  "SPAM",
];

async function updateStatus(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  const status = formData.get("status")?.toString() as InquiryStatus | undefined;
  if (!id || !status) return;
  await db.inquiry.update({ where: { id }, data: { status } });
  revalidatePath(`/admin/inquiries/${id}`);
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin");
}

async function updateNote(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  const note = formData.get("note")?.toString() ?? "";
  if (!id) return;
  await db.inquiry.update({ where: { id }, data: { note } });
  revalidatePath(`/admin/inquiries/${id}`);
}

async function deleteInquiry(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  if (!id) return;
  await db.inquiry.delete({ where: { id } });
  revalidatePath("/admin/inquiries");
  redirect("/admin/inquiries");
}

export default async function AdminInquiryDetailPage({ params }: Props) {
  const { id } = await params;
  const inquiry = await db.inquiry.findUnique({
    where: { id },
    include: { product: { include: { category: { include: { parent: true } } } } },
  });
  if (!inquiry) notFound();

  const product = inquiry.product;
  const l1 = product?.category?.parent;
  const l2 = product?.category;

  return (
    <div>
      <Link
        href="/admin/inquiries"
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← Back to inquiries
      </Link>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {inquiry.name}
          </h1>
          <p className="text-sm text-foreground-muted">
            {inquiry.email} · {inquiry.company || "—"} · {inquiry.country || "—"}
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            Received {new Date(inquiry.createdAt).toLocaleString()} · Source:{" "}
            {inquiry.source}
          </p>
        </div>
        <a
          href={`mailto:${inquiry.email}?subject=Re: Your inquiry${product ? " — " + product.nameEn : ""}`}
          className="inline-flex items-center rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90"
        >
          Reply by email
        </a>
      </div>

      {product && l1 && l2 && (
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-foreground-muted">
            Referenced product
          </p>
          <Link
            href={`/products/${l1.slug}/${l2.slug}/${product.slug}`}
            className="mt-1 block font-medium hover:text-brand"
            target="_blank"
          >
            {product.nameEn}
          </Link>
          <p className="text-xs text-foreground-muted">
            {l1.nameEn} / {l2.nameEn}
          </p>
        </div>
      )}

      <section className="mt-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground-muted">
          Message
        </h2>
        <div className="mt-2 rounded-2xl border border-border bg-surface p-5 whitespace-pre-wrap text-sm">
          {inquiry.message}
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <Field label="Phone" value={inquiry.phone} />
        <Field label="Target quantity" value={inquiry.quantity} />
        <Field label="Country" value={inquiry.country} />
      </section>

      <section className="mt-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground-muted">
          Status
        </h2>
        <form action={updateStatus} className="mt-2 flex items-center gap-2">
          <input type="hidden" name="id" value={inquiry.id} />
          <select
            name="status"
            defaultValue={inquiry.status}
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90"
          >
            Update
          </button>
        </form>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-foreground-muted">
          Internal note
        </h2>
        <form action={updateNote} className="mt-2">
          <input type="hidden" name="id" value={inquiry.id} />
          <textarea
            name="note"
            rows={4}
            defaultValue={inquiry.note ?? ""}
            className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
            placeholder="Visible to admins only"
          />
          <button
            type="submit"
            className="mt-2 rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-surface-muted"
          >
            Save note
          </button>
        </form>
      </section>

      <section className="mt-10 border-t border-border pt-6">
        <form action={deleteInquiry}>
          <input type="hidden" name="id" value={inquiry.id} />
          <button
            type="submit"
            className="text-xs text-[color:var(--danger)] hover:underline"
          >
            Delete inquiry permanently
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-3">
      <p className="text-xs uppercase tracking-wide text-foreground-muted">
        {label}
      </p>
      <p className="mt-1">{value || "—"}</p>
    </div>
  );
}
