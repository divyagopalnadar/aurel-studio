import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { PLACEHOLDER_IMAGE, resolveImage } from "./images";
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
    images: images.length > 0 ? images : [PLACEHOLDER_IMAGE],
    reviews: row.reviews.map(mapReview),
  };
}

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    ...withReviews,
    orderBy: [{ featured: "desc" }, { id: "asc" }],
  });
  return (rows as ProductRow[]).map(mapProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    ...withReviews,
    where: { id },
  });
  return row ? mapProduct(row as ProductRow) : null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    ...withReviews,
    where: { slug },
  });
  return row ? mapProduct(row as ProductRow) : null;
}

/** Products flagged as featured, best rated first. */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    ...withReviews,
    where: { featured: true },
    orderBy: [{ rating: "desc" }, { id: "asc" }],
    take: limit,
  });
  return (rows as ProductRow[]).map(mapProduct);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const sameCategory = await prisma.product.findMany({
    ...withReviews,
    where: { category: product.category, id: { not: product.id } },
    take: limit,
    orderBy: { rating: "desc" },
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
    orderBy: { rating: "desc" },
  });

  return [...(sameCategory as ProductRow[]), ...(others as ProductRow[])].map(
    mapProduct
  );
}

export async function getCategories(): Promise<string[]> {
  const rows = await prisma.product.findMany({ distinct: ["category"] });
  return rows.map((r) => r.category);
}

export const data = {
  products: getProducts,
  productById: getProductById,
  productBySlug: getProductBySlug,
  featuredProducts: getFeaturedProducts,
  relatedProducts: getRelatedProducts,
  categories: getCategories,
};
