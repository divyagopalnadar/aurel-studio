import type { Product } from "@/data/products";

/**
 * Read access to the product catalog. Implemented by the Prisma database
 * (lib/catalog/prisma.ts) and by the static catalog document
 * (lib/catalog/static.ts); lib/data.ts picks one via NEXT_PUBLIC_DATA_SOURCE.
 */
export interface CatalogSource {
  /** All products, featured first, then by id. */
  getProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | null>;
  getProductBySlug(slug: string): Promise<Product | null>;
  /** Products flagged as featured, best rated first. */
  getFeaturedProducts(limit: number): Promise<Product[]>;
  /** Same-category products first, topped up with the best rated others. */
  getRelatedProducts(product: Product, limit: number): Promise<Product[]>;
}
