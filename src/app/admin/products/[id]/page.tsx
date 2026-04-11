import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ProductForm } from "@/components/admin/product-form";
import {
  linesToJsonArray,
  linesToSpecsJson,
} from "@/lib/admin-helpers";

type Props = { params: Promise<{ id: string }> };

async function updateProduct(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing product id");

  const nameEn = formData.get("nameEn")?.toString().trim() ?? "";
  const slug = formData.get("slug")?.toString().trim() ?? "";
  const categoryId = formData.get("categoryId")?.toString() ?? "";
  const summary = formData.get("summary")?.toString() ?? "";
  const description = formData.get("description")?.toString() ?? "";
  const features = linesToJsonArray(formData.get("features")?.toString() ?? "");
  const applications = linesToJsonArray(
    formData.get("applications")?.toString() ?? "",
  );
  const images = linesToJsonArray(formData.get("images")?.toString() ?? "");
  const specs = linesToSpecsJson(formData.get("specs")?.toString() ?? "");
  const isHot = formData.get("isHot") === "on";
  const published = formData.get("published") === "on";

  await db.product.update({
    where: { id },
    data: {
      nameEn,
      slug,
      categoryId,
      summary,
      description,
      features,
      applications,
      images,
      specs,
      isHot,
      published,
    },
  });
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/");
}

async function deleteProduct(formData: FormData) {
  "use server";
  const id = formData.get("id")?.toString();
  if (!id) return;
  await db.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products");
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, l2Categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({
      where: { level: 2 },
      orderBy: [{ parent: { sortOrder: "asc" } }, { sortOrder: "asc" }],
      include: { parent: { select: { nameEn: true } } },
    }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← Back to products
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Edit product
        </h1>
      </div>
      <div className="mt-6">
        <ProductForm
          action={updateProduct}
          product={product}
          l2Categories={l2Categories}
          submitLabel="Save changes"
        />
      </div>

      <section className="mt-10 border-t border-border pt-6">
        <form action={deleteProduct}>
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="text-xs text-[color:var(--danger)] hover:underline"
          >
            Delete product permanently
          </button>
        </form>
      </section>
    </div>
  );
}
