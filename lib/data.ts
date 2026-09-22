import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import type {
  Category,
  Glyph,
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
    id: String(r.author) + r.title,
    author: r.author,
    rating: r.rating,
    date: new Date(r.date).toISOString(),
    title: r.title,
    body: r.body,
  };
}

export function mapProduct(row: ProductRow): Product {
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
    features: JSON.parse(row.features) as string[],
    colors: JSON.parse(row.colors) as string[],
    images: JSON.parse(row.images) as string[],
    hue: row.hue,
    glyph: row.glyph as Glyph,
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
  relatedProducts: getRelatedProducts,
  categories: getCategories,
};
