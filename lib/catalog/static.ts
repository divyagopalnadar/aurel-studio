/**
 * ============================================================================
 * STATIC DATA SOURCE (NEXT_PUBLIC_DATA_SOURCE=static)
 * ----------------------------------------------------------------------------
 * Used by the live GitHub Pages build (`npm run build:static`, workflow
 * .github/workflows/pages.yml). Reads the catalog document data/catalog.json
 * at build time; there is no database or server at runtime. Mirrors the
 * ordering rules of the Prisma implementation (lib/catalog/prisma.ts) so both
 * builds render the same pages.
 * ============================================================================
 */
import { products as catalog, type Product } from "@/data/products";
import { PLACEHOLDER_IMAGE, resolveImage } from "@/lib/images";
import type { CatalogSource } from "./types";

const byRatingThenId = (a: Product, b: Product) => b.rating - a.rating || a.id - b.id;

const products: Product[] = catalog.map((p) => {
  const images = p.images.filter(Boolean).map(resolveImage);
  return {
    ...p,
    images: images.length > 0 ? images : [resolveImage(PLACEHOLDER_IMAGE)],
    reviews: [...p.reviews].sort((a, b) => b.date.localeCompare(a.date)),
  };
});

export const staticCatalog: CatalogSource = {
  async getProducts() {
    return [...products].sort(
      (a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id
    );
  },

  async getProductById(id) {
    return products.find((p) => p.id === id) ?? null;
  },

  async getProductBySlug(slug) {
    return products.find((p) => p.slug === slug) ?? null;
  },

  async getFeaturedProducts(limit) {
    return products.filter((p) => p.featured).sort(byRatingThenId).slice(0, limit);
  },

  async getRelatedProducts(product, limit) {
    const others = products.filter((p) => p.id !== product.id).sort(byRatingThenId);
    const same = others.filter((p) => p.category === product.category);
    const rest = others.filter((p) => p.category !== product.category);
    return [...same, ...rest].slice(0, limit);
  },
};
