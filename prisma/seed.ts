import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { CATALOG_SEED } from "../src/lib/catalog-seed";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Put your Neon Postgres URL in .env before seeding.",
  );
}
const adapter = new PrismaNeon({ connectionString });
const db = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding TopLink database...");

  // 1. Site settings (single row)
  await db.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });
  console.log("  ✓ Site settings");

  // 2. Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@toplinkelec.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "changeme-strong-password";
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  await db.adminUser.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Default Admin",
      role: "ADMIN",
    },
    update: { passwordHash },
  });
  console.log(`  ✓ Admin user: ${adminEmail}`);

  // 3. Wipe existing categories and products to keep seed idempotent
  await db.inquiry.deleteMany({});
  await db.product.deleteMany({});
  await db.category.deleteMany({});
  console.log("  ✓ Cleared previous catalog");

  // 4. Categories + stub products
  let l1Order = 0;
  let productCount = 0;
  for (const l1 of CATALOG_SEED) {
    const l1Row = await db.category.create({
      data: {
        slug: l1.slug,
        nameEn: l1.nameEn,
        tagline: l1.tagline,
        description: l1.description,
        level: 1,
        icon: l1.icon,
        sortOrder: l1Order++,
        seoTitle: `${l1.nameEn} — TopLink Electronics`,
        seoDesc: l1.tagline,
      },
    });

    let l2Order = 0;
    for (const l2 of l1.subs) {
      const l2Row = await db.category.create({
        data: {
          slug: l2.slug,
          nameEn: l2.nameEn,
          tagline: l2.tagline,
          level: 2,
          parentId: l1Row.id,
          sortOrder: l2Order++,
          seoTitle: `${l2.nameEn} — ${l1.nameEn} · TopLink`,
          seoDesc: l2.tagline,
        },
      });

      const p = l2.stubProduct;
      await db.product.create({
        data: {
          slug: p.slug,
          nameEn: p.nameEn,
          categoryId: l2Row.id,
          summary: p.summary,
          description: p.description,
          specs: JSON.stringify(p.specs),
          features: JSON.stringify(p.features),
          applications: JSON.stringify(p.applications),
          images: JSON.stringify([]),
          isHot: productCount < 6, // mark first 6 as hot so home page has content
          published: true,
          sortOrder: 0,
          seoTitle: `${p.nameEn} — TopLink Electronics`,
          seoDesc: p.summary,
        },
      });
      productCount++;
    }
  }
  console.log(
    `  ✓ Seeded ${CATALOG_SEED.length} L1 + ${CATALOG_SEED.reduce((s, c) => s + c.subs.length, 0)} L2 categories, ${productCount} stub products`
  );

  // 5. Success cases
  await db.successCase.deleteMany({});
  const cases = [
    {
      industry: "Automotive ADAS",
      customer: "Tier-1 supplier",
      title: "360° panoramic camera harness",
      story:
        "TopLink has mass-produced 360° panoramic camera harnesses since 2016, with FAKRA coax terminations and full VSWR verification. Stable volumes through the vehicle program lifecycle.",
      metric: "500k+ units / year",
      sortOrder: 0,
    },
    {
      industry: "Medical Devices",
      customer: "US medical OEM",
      title: "Autoclavable silicone cable program",
      story:
        "Platinum-cured silicone cables built in a controlled environment with full lot traceability, sterilized via autoclave and EtO. Served since 2012 with zero-defect targets.",
      metric: "10+ years partnership",
      sortOrder: 1,
    },
    {
      industry: "Rail Transportation",
      customer: "CRRC (Zhongche Group)",
      title: "Rail automation cable assemblies",
      story:
        "Automation cable assemblies for rail control and signaling, delivered into CRRC programs starting 2018. Built with flame-retardant, low-smoke halogen-free materials.",
      metric: "Multi-year program",
      sortOrder: 2,
    },
  ];
  for (const c of cases) {
    await db.successCase.create({ data: c });
  }
  console.log(`  ✓ Seeded ${cases.length} success cases`);

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
