import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { ProductForm } from "@/components/admin/product-form";
import {
  linesToJsonArray,
  linesToSpecsJson,
  slugFromName,
} from "@/lib/admin-helpers";

async function createProduct(formData: FormData) {
  "use server";
  const nameEn = formData.get("nameEn")?.toString().trim() ?? "";
  const slug =
    formData.get("slug")?.toString().trim() || slugFromName(nameEn);
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

  if (!nameEn || !slug || !categoryId || !summary) {
    throw new Error("Missing required fields");
  }

  const product = await db.product.create({
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
  revalidatePath("/");
  redirect(`/admin/products/${product.id}`);
}

export default async function NewProductPage() {
  const l2Categories = await db.category.findMany({
    where: { level: 2 },
    orderBy: [{ parent: { sortOrder: "asc" } }, { sortOrder: "asc" }],
    include: { parent: { select: { nameEn: true } } },
  });

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm text-foreground-muted hover:text-foreground"
      >
        ← Back to products
      </Link>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">
        New product
      </h1>
      <div className="mt-6">
        <ProductForm
          action={createProduct}
          l2Categories={l2Categories}
          submitLabel="Create product"
        />
      </div>
    </div>
  );
}
