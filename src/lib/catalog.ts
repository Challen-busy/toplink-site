import { db } from "./db";

export async function getL1Categories() {
  return db.category.findMany({
    where: { level: 1 },
    orderBy: { sortOrder: "asc" },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      },
    },
  });
}

export async function getL1BySlug(slug: string) {
  return db.category.findFirst({
    where: { slug, level: 1 },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
        include: { _count: { select: { products: true } } },
      },
    },
  });
}

export async function getL2BySlugWithinL1(l1Slug: string, l2Slug: string) {
  const l1 = await db.category.findFirst({ where: { slug: l1Slug, level: 1 } });
  if (!l1) return null;
  const l2 = await db.category.findFirst({
    where: { slug: l2Slug, level: 2, parentId: l1.id },
    include: {
      parent: true,
      products: {
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { nameEn: "asc" }],
      },
    },
  });
  return l2 ? { l1, l2 } : null;
}

export async function getProductBySlug(
  l1Slug: string,
  l2Slug: string,
  productSlug: string,
) {
  const product = await db.product.findFirst({
    where: { slug: productSlug, published: true },
    include: {
      category: { include: { parent: true } },
    },
  });
  if (!product || !product.category) return null;
  if (product.category.slug !== l2Slug) return null;
  if (product.category.parent?.slug !== l1Slug) return null;
  return product;
}

export async function getHotProducts(limit = 6) {
  return db.product.findMany({
    where: { isHot: true, published: true },
    take: limit,
    orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    include: { category: { include: { parent: true } } },
  });
}

export function parseJsonArray<T = unknown>(raw: string | null | undefined): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
