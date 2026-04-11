import type { Product, Category } from "@prisma/client";

type L2Option = Pick<Category, "id" | "nameEn"> & {
  parent: Pick<Category, "nameEn"> | null;
};

type Props = {
  action: (formData: FormData) => Promise<void>;
  product?: Product;
  l2Categories: L2Option[];
  submitLabel: string;
};

export function ProductForm({
  action,
  product,
  l2Categories,
  submitLabel,
}: Props) {
  return (
    <form action={action} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-foreground-muted">
            Name *
          </label>
          <input
            name="nameEn"
            required
            defaultValue={product?.nameEn ?? ""}
            className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground-muted">
            Slug *
          </label>
          <input
            name="slug"
            required
            defaultValue={product?.slug ?? ""}
            className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground-muted">
          Category (L2) *
        </label>
        <select
          name="categoryId"
          required
          defaultValue={product?.categoryId ?? ""}
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
        >
          <option value="" disabled>
            — choose a subcategory —
          </option>
          {l2Categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.parent?.nameEn} / {c.nameEn}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground-muted">
          Summary (one-liner for cards) *
        </label>
        <input
          name="summary"
          required
          defaultValue={product?.summary ?? ""}
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground-muted">
          Description (markdown / plain text)
        </label>
        <textarea
          name="description"
          rows={6}
          defaultValue={product?.description ?? ""}
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-foreground-muted">
            Features (one per line)
          </label>
          <textarea
            name="features"
            rows={6}
            defaultValue={
              product ? parseJsonArrayToLines(product.features) : ""
            }
            className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-foreground-muted">
            Applications (one per line)
          </label>
          <textarea
            name="applications"
            rows={6}
            defaultValue={
              product ? parseJsonArrayToLines(product.applications) : ""
            }
            className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-mono"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground-muted">
          Specifications — one per line, format <code>Label: Value</code>
        </label>
        <textarea
          name="specs"
          rows={8}
          defaultValue={product ? parseSpecsToLines(product.specs) : ""}
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-mono"
          placeholder={"Conductor: 24 AWG tinned copper\nInsulation: PVC"}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-foreground-muted">
          Image URLs (one per line)
        </label>
        <textarea
          name="images"
          rows={3}
          defaultValue={product ? parseJsonArrayToLines(product.images) : ""}
          className="mt-1 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-mono"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="isHot"
            defaultChecked={product?.isHot ?? false}
          />
          Mark as hot (featured on home)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product?.published ?? true}
          />
          Published
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <button
          type="submit"
          className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function parseJsonArrayToLines(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return "";
    return arr.map((x) => String(x)).join("\n");
  } catch {
    return "";
  }
}

function parseSpecsToLines(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    const arr = JSON.parse(raw) as Array<{ label: string; value: string }>;
    if (!Array.isArray(arr)) return "";
    return arr.map((s) => `${s.label}: ${s.value}`).join("\n");
  } catch {
    return "";
  }
}
