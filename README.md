# Aurél Studio

A storefront for a fictional "quiet luxury" clothing and accessories label, built with the Next.js App Router, React 19, TypeScript, Tailwind CSS v4 and Prisma. It covers the usual shop flow: a searchable, filterable catalog; product pages with a gallery, colour and size selection, materials, care and reviews; a persistent cart drawer; and a small admin panel backed by a REST API. The data comes from a real database, most of the UI is server-rendered, and product photography can be dropped in later without touching code. Until then, every image slot shows a generated placeholder in the brand palette.

![Aurél Studio home page](docs/screenshot-home.png)

![Product page](docs/screenshot-product.png)

## Features

- **Catalog.** 18 products in six categories (Outerwear, Knitwear, Shirts & Tops, Bags, Jewelry, Accessories). Search by name, tagline, category or material; filter by category and price band; sort by featured, newest, price or rating.
- **Product pages.** Statically generated per product, with a 4:5 image gallery, named colour swatches, a size picker (hidden for one-size items), details, material and care, reviews, related products and per-page metadata.
- **Cart.** A slide-over drawer driven by React context. Each line is keyed by product, size and colour; quantities are capped at available stock; the cart is saved to `localStorage`.
- **Admin panel** (`/admin`). List, create, edit and delete products (including sizes, colours, material and care) through a modal form. Changes go through the REST API and revalidate the prerendered storefront pages.
- **REST API.** `GET/POST /api/products` and `GET/PATCH/DELETE /api/products/:id`, with input validation and appropriate status codes (400/404/409).
- **Photo-ready imagery.** Photos are picked up automatically when present, with generated placeholders in the meantime. An import script crops and optimises photos, and [`docs/image-prompts.md`](docs/image-prompts.md) has a ready-made prompt for each image.
- **Light and dark themes.** A warm ivory/charcoal palette with a deep olive accent. The theme follows the system preference, remembers the user's choice and is applied before first paint.

## Tech stack

| Area      | Choice                                                            |
| --------- | ----------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack), React 19                      |
| Language  | TypeScript (strict)                                               |
| Styling   | Tailwind CSS v4 with CSS-variable design tokens; Geist + Cormorant Garamond via `next/font` |
| Data      | Prisma ORM 6, SQLite for local development                        |
| Images    | `next/image`, `sharp` for the import script                       |
| Tooling   | ESLint (`eslint-config-next`), `tsx` for scripts                  |
| CI        | GitHub Actions: lint, typecheck, production build                 |

## Architecture

- **App Router, server-first.** Pages under `app/` are React Server Components that read from the database through `lib/data.ts`; there is no client-side fetching for storefront data. The home page and product pages are prerendered at build time. `/admin` renders on each request.
- **Client components only where needed.** Interactive pieces (`ShopExplorer`, `ProductCard`, `ProductDetail`, `CartDrawer`, `ThemeToggle`, `AdminPanel`) are marked `"use client"` and receive plain, serialisable `Product` objects.
- **Data layer (`lib/`).** `lib/db.ts` exports a single `PrismaClient`. `lib/data.ts` holds the queries and maps rows to the `Product` type in `data/products.ts`. SQLite has no array columns, so details, sizes, colours (`{ name, hex }`) and image paths are stored as JSON strings and parsed at this boundary. `lib/product-input.ts` validates API payloads.
- **Image resolution (`lib/images.ts`).** The database stores canonical photo paths (`/images/products/<slug>-1.jpg`). On the server, `resolveImage()` returns the first file that exists: the `.jpg` photo, then the `.svg` placeholder with the same name, then a generic placeholder. Adding photos therefore needs no database or code changes.
- **API routes.** Route handlers in `app/api/products` serve the admin panel. After a successful write they call `revalidatePath("/", "layout")`, so prerendered pages pick up the change on their next request.
- **Cart state.** `context/CartContext.tsx` holds lines, totals, drawer state and the "added" toast. It loads from `localStorage` after mount, so server and client markup match during hydration.

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env        # DATABASE_URL="file:./dev.db"
npm run db:migrate          # create the SQLite database and apply migrations
npm run db:seed             # load the 18-product sample catalog
npm run dev                 # http://localhost:3000
```

Running `npm run db:seed` again resets the catalog. It upserts the sample products (replacing their reviews) and removes any product whose slug isn't in `data/products.ts`.

## Adding product photos

The store looks finished without photos, but it's built for them. Each product has two image slots and the home page has one:

| Slot | File | Content |
| --- | --- | --- |
| Packshot | `public/images/products/<slug>-1.jpg` | The item alone on a studio background |
| Styled / detail | `public/images/products/<slug>-2.jpg` | Close-up, hands or a partial model, no face |
| Hero | `public/images/hero.jpg` | Editorial campaign image |

1. Generate images with the prompts in [`docs/image-prompts.md`](docs/image-prompts.md). The file has one shared style block for consistency and a prompt labelled with each file name.
2. Save them to `incoming-images/` (gitignored) as `<slug>-1.png|jpg|webp`, `<slug>-2.…` and `hero.…`.
3. Run `npm run images:import`. It centre-crops each image to 4:5, resizes it to 1600 × 2000, writes optimised JPEGs (quality 82) into `public/images/`, lists which photos are still missing, and exits non-zero if any file name isn't recognised.

Photos appear immediately in development. Production pages are prerendered, so rebuild after adding photos. `npm run images:placeholders` regenerates the placeholder SVGs from the catalog if you add or rename products.

## Scripts

| Script                       | What it does                                              |
| ---------------------------- | --------------------------------------------------------- |
| `npm run dev`                | Start the development server                              |
| `npm run build`              | Create a production build                                 |
| `npm run start`              | Serve the production build                                |
| `npm run lint`               | Run ESLint                                                |
| `npm run typecheck`          | Type-check with `tsc --noEmit`                            |
| `npm run db:generate`        | Generate the Prisma client                                |
| `npm run db:migrate`         | Apply migrations in development (`prisma migrate dev`)    |
| `npm run db:seed`            | Seed the database from `data/products.ts`                 |
| `npm run images:import`      | Import photos from `incoming-images/`                     |
| `npm run images:placeholders`| Regenerate placeholder SVGs from the catalog              |

## Project structure

```
app/
  layout.tsx              Root layout: fonts, theme script, cart provider, header/footer
  page.tsx                Home: hero, marquee, catalog explorer, "The Edit"
  product/[id]/           Product detail page (SSG) and its not-found state
  admin/                  Admin page (dynamic)
  api/products/           REST route handlers (collection + [id])
components/               UI components; components/ui holds primitives, components/admin the admin panel
context/CartContext.tsx   Cart state and localStorage persistence
data/products.ts          Domain types and seed catalog
lib/                      Prisma client, data access, image resolution, API input validation, utilities
prisma/                   Schema, migrations, seed script
public/images/            Placeholders now, photos later
scripts/                  Photo import and placeholder generator
docs/                     Screenshots and image-generation prompts
.github/workflows/ci.yml  CI pipeline
```

## Deployment notes

- **SQLite is for local development only.** The database is a file on disk, and serverless platforms such as Vercel have no persistent writable filesystem, so admin writes would not persist there. To deploy, switch the Prisma `datasource` provider to `postgresql` (Neon, Supabase, Vercel Postgres, etc.), set `DATABASE_URL`, regenerate the migrations and run `prisma migrate deploy` before building.
- **The build reads the database.** Home and product pages are prerendered, so `next build` needs a migrated, seeded database. CI uses a throwaway `file:./ci.db`.
- **Images.** Photos are resolved on the server when a page renders, so a deploy includes whatever is in `public/images` at build time.

## Demo limitations

This is a portfolio demo, not a production shop:

- **No authentication.** `/admin` and the write API routes (`POST`, `PATCH`, `DELETE` under `/api/products`) are open to anyone who can reach the app. Put them behind authentication (for example Auth.js plus a role check in the route handlers) before exposing this publicly.
- **No checkout or payments.** The cart lives only on the client.
- The brand, products and reviews are fictional.
