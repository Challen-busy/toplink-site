# TopLink 询盘独立站

Inquiry-driven independent site for TopLink Electronics — custom cable and wire harness contract manufacturer. Upgrades the old www.toplinkelec.com portal to a Gemini-inspired light-themed site with a product catalog, product-level inquiry capture, and an admin backend for catalog + inquiry management.

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **Tailwind CSS 4** (CSS-first theme tokens in `src/app/globals.css`)
- **Prisma 7** + **SQLite** (local dev) — swap to Postgres in prod by changing the provider and `DATABASE_URL`
- **jose** JWT session cookies for admin auth
- **Resend** for inquiry email notifications (falls back to DB-only if `RESEND_API_KEY` is unset)
- **Zod** for server-side form validation

## Quick start

```bash
# 1. Install deps
npm install

# 2. Copy env and adjust if needed
cp .env.example .env

# 3. Create the SQLite database and seed the catalog + admin user
npx prisma generate
npx prisma db push
npm run db:seed

# 4. Run dev
npm run dev
# → http://localhost:3000
```

Default admin credentials come from `.env`:
- `ADMIN_EMAIL=admin@toplinkelec.com`
- `ADMIN_PASSWORD=changeme-strong-password`

Change these in `.env` before running `npm run db:seed` (the seed upserts the admin user).

## Scripts

- `npm run dev` — dev server (Turbopack)
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run db:generate` — regenerate Prisma client after schema changes
- `npm run db:push` — push schema to DB (no migrations)
- `npm run db:seed` — reseed catalog + admin + success cases
- `npm run db:studio` — Prisma Studio UI

## Layout

```
src/
├── app/
│   ├── page.tsx               # Home (Gemini hero + hot products + catalog + cases + CTA)
│   ├── about/                 # About us
│   ├── contact/               # Contact + inquiry form
│   ├── careers/               # Careers
│   ├── products/              # L1 overview
│   │   └── [category]/        # L1 detail
│   │       └── [sub]/         # L2 subcategory product list
│   │           └── [slug]/    # L3 product detail + inquiry form
│   ├── admin/                 # Admin shell (protected by src/proxy.ts)
│   │   ├── login/             # public
│   │   ├── page.tsx           # dashboard
│   │   ├── inquiries/         # list + detail + status flow
│   │   ├── products/          # list + new + edit + delete, isHot + publish toggles
│   │   ├── categories/        # L1/L2 tree, add/delete
│   │   └── settings/          # site settings editor
│   └── api/inquiries/         # POST /api/inquiries (public)
├── components/
│   ├── site/                  # SiteHeader, SiteFooter, Container
│   ├── forms/inquiry-form.tsx # Client inquiry form used on product + contact pages
│   └── admin/product-form.tsx
├── lib/
│   ├── db.ts                  # Prisma client singleton with better-sqlite3 adapter
│   ├── auth.ts                # JWT + cookie helpers
│   ├── catalog.ts             # Read helpers for categories/products
│   ├── catalog-seed.ts        # 10 L1 × 41 L2 seed tree with stub products
│   ├── email.ts               # Resend inquiry notification
│   ├── validators.ts          # Zod schemas
│   └── admin-helpers.ts       # Form parsers
├── proxy.ts                   # Next.js 16 "proxy" (replaces middleware) — guards /admin/*
└── app/globals.css            # Gemini theme tokens & utility classes
```

## Design system

- Light theme: near-white `#FAFAFC` background, deep mid-gray text `#1F1F23`
- "Aurora" gradient accent (violet → cyan → peach) used for hero glow, card hover borders, and gradient text via `.text-aurora`
- Generous rounding (`--radius-card: 1.75rem`), pill buttons, lightweight CSS animations (`.animate-rise`)
- `Inter` body + `Space Grotesk` display fonts, loaded via `next/font`

## Product catalog

Ten L1 main categories × 41 L2 subcategories, organized by **product form / craft** (not by industry) so a single product can serve multiple industries:

1. Custom Cable Assemblies
2. Wire Harness Assemblies
3. Overmolded Cable Assemblies
4. RF & Coaxial Assemblies
5. Data & Network Cables
6. Automotive Harness
7. Medical Device Cables
8. Industrial & Automation
9. Power & Appliance Cords
10. Specialty & Harsh-Environment

Each L2 ships with one stub product so the front-end never looks empty. Replace / extend these in the admin backend.

## Inquiry flow

1. Visitor submits the inquiry form (either product-level or contact page).
2. `POST /api/inquiries` validates with Zod, writes to SQLite, fires Resend notification (non-blocking).
3. Admin sees the lead at `/admin/inquiries`, can change status (`NEW → CONTACTED → QUOTED → CLOSED / SPAM`), add internal notes, reply by email via `mailto:`.
4. The admin dashboard shows recent inquiries and a new-count chip.

## Notes & future work

- **i18n** is not yet wired. Pages are English-only. Add `next-intl` and wrap in `[locale]` later.
- **Image uploads** for products are not implemented — admins paste external URLs into a textarea. Add an uploader + S3/R2 bucket when needed.
- **Excel / CSV export** of inquiries not implemented (out of scope for v1).
- **Success cases** are seeded via `prisma/seed.ts`; an admin UI for editing them is not built yet.
- To move to Postgres: change `provider` in `prisma/schema.prisma` to `postgresql`, set `DATABASE_URL`, then `npx prisma db push`. Replace `@prisma/adapter-better-sqlite3` with the Postgres adapter (or drop the adapter entirely and use the default driver).
- **`src/proxy.ts`** is the Next.js 16 replacement for `middleware.ts`. Runtime is always Node.js.
