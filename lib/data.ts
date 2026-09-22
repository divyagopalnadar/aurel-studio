import type { Product } from "@/data/products";
import { IS_STATIC } from "./config";
import type { CatalogSource } from "./catalog/types";

/**
 * Catalog access for server components. The implementation is chosen at build
 * time by NEXT_PUBLIC_DATA_SOURCE (see lib/config.ts):
 *
 *   static -> lib/catalog/static.ts  (data/catalog.json, GitHub Pages build)
 *   prisma -> lib/catalog/prisma.ts  (SQLite via Prisma, default)
 *
 * The imports are dynamic so the static build never loads Prisma.
 */
async function source(): Promise<CatalogSource> {
  if (IS_STATIC) return (await import("./catalog/static")).staticCatalog;
  return (await import("./catalog/prisma")).prismaCatalog;
}

export async function getProducts(): Promise<Product[]> {
  return (await source()).getProducts();
}

export async function getProductById(id: number): Promise<Product | null> {
  return (await source()).getProductById(id);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return (await source()).getProductBySlug(slug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return (await source()).getFeaturedProducts(limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return (await source()).getRelatedProducts(product, limit);
}
