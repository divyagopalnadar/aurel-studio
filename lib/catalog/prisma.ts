/**
 * ============================================================================
 * DATABASE DATA SOURCE (NEXT_PUBLIC_DATA_SOURCE=prisma, the default)
 * ----------------------------------------------------------------------------
 * Used by the full local/server build: `npm run dev`, `npm run build`, the CI
 * workflow. Reads the catalog from SQLite through Prisma; the admin panel
 * writes through the REST routes in app/api/products/**\/route.prisma.ts.
 * Not used by the GitHub Pages build, which reads lib/catalog/static.ts.
 * ============================================================================
 */
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PLACEHOLDER_IMAGE, resolveImage } from "@/lib/images";
import type { CatalogSource } from "./types";
import type {
  Category,
  Colour,
  Product,
  Review,
  StockStatus,
} from "@/data/products";

type ProductRow = Prisma.ProductGetPayload<{ include: { reviews: true } }>;
type ReviewRow = Prisma.ReviewGetPayload<Record<string, never>>;

const withReviews = {
  include: { reviews: { orderBy: { date: "desc" as const } } },
} satisfies Prisma.ProductFindManyArgs;

function mapReview(r: ReviewRow): Review {
  return {
    id: r.id,
    author: r.author,
    rating: r.rating,
    date: new Date(r.date).toISOString(),
    title: r.title,
    body: r.body,
  };
}

function parseList<T>(json: string): T[] {
  try {
    const value: unknown = JSON.parse(json);
    return Array.isArray(value) ? (value as T[]) : [];
  } catch {
    return [];
  }
}

/** Accepts `{ name, hex }` objects and, for older rows, bare hex strings. */
function parseColours(json: string): Colour[] {
  return parseList<Colour | string>(json).map((c) =>
    typeof c === "string" ? { name: c, hex: c } : c
  );
}

export function mapProduct(row: ProductRow): Product {
  const images = parseList<string>(row.images).filter(Boolean).map(resolveImage);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    price: row.price,
    compareAtPrice: row.compareAtPrice ?? undefined,
    category: row.category as Category,
    rating: row.rating,
    reviewCount: row.reviewCount,
    stock: row.stock as StockStatus,
    stockCount: row.stockCount,
    featured: row.featured,
    isNew: row.isNew,
    features: parseList<string>(row.features),
    material: row.material,
    care: row.care,
    sizes: parseList<string>(row.sizes),
    colors: parseColours(row.colors),
    images: images.length > 0 ? images : [resolveImage(PLACEHOLDER_IMAGE)],
    reviews: row.reviews.map(mapReview),
  };
}

async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    ...withReviews,
    orderBy: [{ featured: "desc" }, { id: "asc" }],
  });
  return (rows as ProductRow[]).map(mapProduct);
}

async function getProductById(id: number): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    ...withReviews,
    where: { id },
  });
  return row ? mapProduct(row as ProductRow) : null;
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    ...withReviews,
    where: { slug },
  });
  return row ? mapProduct(row as ProductRow) : null;
}

async function getFeaturedProducts(limit: number): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    ...withReviews,
    where: { featured: true },
    orderBy: [{ rating: "desc" }, { id: "asc" }],
    take: limit,
  });
  return (rows as ProductRow[]).map(mapProduct);
}

async function getRelatedProducts(
  product: Product,
  limit: number
): Promise<Product[]> {
  const sameCategory = await prisma.product.findMany({
    ...withReviews,
    where: { category: product.category, id: { not: product.id } },
    take: limit,
    orderBy: [{ rating: "desc" }, { id: "asc" }],
  });

  if (sameCategory.length >= limit) {
    return (sameCategory as ProductRow[]).map(mapProduct);
  }

  const others = await prisma.product.findMany({
    ...withReviews,
    where: {
      category: { not: product.category },
      id: { notIn: [product.id, ...sameCategory.map((s) => s.id)] },
    },
    take: limit - sameCategory.length,
    orderBy: [{ rating: "desc" }, { id: "asc" }],
  });

  return [...(sameCategory as ProductRow[]), ...(others as ProductRow[])].map(
    mapProduct
  );
}

export const prismaCatalog: CatalogSource = {
  getProducts,
  getProductById,
  getProductBySlug,
  getFeaturedProducts,
  getRelatedProducts,
};
