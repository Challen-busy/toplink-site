import Link from "next/link";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function toggleHot(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  const next = formData.get("next") === "true";
  if (!id) return;
  await db.product.update({ where: { id }, data: { isHot: next } });
  revalidatePath("/admin/products");
  revalidatePath("/");
}

async function togglePublished(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  const next = formData.get("next") === "true";
  if (!id) return;
  await db.product.update({ where: { id }, data: { published: next } });
  revalidatePath("/admin/products");
}

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: [{ updatedAt: "desc" }],
    include: { category: { include: { parent: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Products
          </h1>
          <p className="mt-1 text-sm text-foreground-muted">
            {products.length} product{products.length === 1 ? "" : "s"} across{" "}
            {new Set(products.map((p) => p.categoryId)).size} L2 categories.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90"
        >
          New product
        </Link>
      </div>

      <div className="mt-6 rounded-[var(--radius-card)] border border-border bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-foreground-muted">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Hot</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-medium hover:text-brand"
                  >
                    {p.nameEn}
                  </Link>
                  <p className="text-xs text-foreground-muted line-clamp-1">
                    {p.summary}
                  </p>
                </td>
                <td className="px-4 py-3 text-xs text-foreground-muted">
                  {p.category?.parent?.nameEn} /{" "}
                  <span className="text-foreground">{p.category?.nameEn}</span>
                </td>
                <td className="px-4 py-3">
                  <form action={toggleHot}>
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={(!p.isHot).toString()}
                    />
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs font-medium ${p.isHot ? "bg-gradient-to-r from-aurora-1 to-aurora-2 text-white" : "border border-border text-foreground-muted"}`}
                    >
                      {p.isHot ? "★ Hot" : "Mark hot"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <form action={togglePublished}>
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="next"
                      value={(!p.published).toString()}
                    />
                    <button
                      type="submit"
                      className={`rounded-full px-3 py-1 text-xs font-medium ${p.published ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs text-brand font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
