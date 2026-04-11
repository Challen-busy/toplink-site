import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { slugFromName } from "@/lib/admin-helpers";

async function createCategory(formData: FormData) {
  "use server";
  const level = Number(formData.get("level")?.toString() ?? "1");
  const nameEn = formData.get("nameEn")?.toString().trim() ?? "";
  const slug =
    formData.get("slug")?.toString().trim() || slugFromName(nameEn);
  const parentId = formData.get("parentId")?.toString() || null;
  const tagline = formData.get("tagline")?.toString() ?? "";
  if (!nameEn || !slug) return;
  if (level === 2 && !parentId) return;
  await db.category.create({
    data: {
      nameEn,
      slug,
      tagline,
      level,
      parentId: level === 2 ? parentId : null,
      sortOrder: 999,
    },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/products");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  if (!id) return;
  // Guard: cannot delete an L1 with L2 children, or an L2 with products
  const cat = await db.category.findUnique({
    where: { id },
    include: {
      _count: { select: { children: true, products: true } },
    },
  });
  if (!cat) return;
  if (cat._count.children > 0 || cat._count.products > 0) return;
  await db.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}

export default async function AdminCategoriesPage() {
  const l1s = await db.category.findMany({
    where: { level: 1 },
    orderBy: { sortOrder: "asc" },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        Categories
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Two-level tree: 10 L1 main categories, each with 3–5 L2 subcategories.
        Products are attached to L2 subcategories.
      </p>

      <section className="mt-6 space-y-6">
        {l1s.map((l1) => (
          <div
            key={l1.id}
            className="rounded-[var(--radius-card)] border border-border bg-surface p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-semibold">
                  {l1.nameEn}
                </h2>
                <p className="text-xs text-foreground-muted">
                  /{l1.slug} · {l1.children.length} subcategories
                </p>
              </div>
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={l1.id} />
                <button
                  type="submit"
                  className="text-xs text-foreground-muted hover:text-[color:var(--danger)]"
                  title="Can only delete empty L1"
                >
                  Delete (if empty)
                </button>
              </form>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {l1.children.map((l2) => (
                <li
                  key={l2.id}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{l2.nameEn}</span>
                    <span className="ml-2 text-foreground-muted">
                      /{l2.slug}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-foreground-muted">
                      {l2._count.products} product
                      {l2._count.products === 1 ? "" : "s"}
                    </span>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={l2.id} />
                      <button
                        type="submit"
                        className="text-xs text-foreground-muted hover:text-[color:var(--danger)]"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
            <form
              action={createCategory}
              className="mt-4 flex items-end gap-2 text-sm border-t border-border pt-4"
            >
              <input type="hidden" name="level" value="2" />
              <input type="hidden" name="parentId" value={l1.id} />
              <div className="flex-1">
                <label className="block text-xs text-foreground-muted">
                  Add L2 subcategory
                </label>
                <input
                  name="nameEn"
                  placeholder="Name (English)"
                  required
                  className="mt-1 w-full rounded-full border border-border bg-surface px-4 py-2 text-sm"
                />
              </div>
              <div className="w-48">
                <label className="block text-xs text-foreground-muted">
                  Slug (auto)
                </label>
                <input
                  name="slug"
                  placeholder="slug-auto"
                  className="mt-1 w-full rounded-full border border-border bg-surface px-4 py-2 text-sm"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90"
              >
                Add
              </button>
            </form>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-[var(--radius-card)] border border-dashed border-border p-5">
        <h2 className="font-display text-lg font-semibold">
          Create new L1 main category
        </h2>
        <form
          action={createCategory}
          className="mt-3 grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr_auto] gap-2"
        >
          <input type="hidden" name="level" value="1" />
          <input
            name="nameEn"
            placeholder="Name"
            required
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm"
          />
          <input
            name="slug"
            placeholder="slug (optional)"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm"
          />
          <input
            name="tagline"
            placeholder="Short tagline"
            className="rounded-full border border-border bg-surface px-4 py-2 text-sm"
          />
          <button
            type="submit"
            className="rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90"
          >
            Create
          </button>
        </form>
      </section>
    </div>
  );
}
