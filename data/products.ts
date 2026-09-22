import catalog from "./catalog.json";

export type Category =
  | "Outerwear"
  | "Knitwear"
  | "Shirts & Tops"
  | "Bags"
  | "Jewelry"
  | "Accessories";

export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Colour {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  rating: number;
  reviewCount: number;
  stock: StockStatus;
  stockCount: number;
  featured: boolean;
  isNew: boolean;
  /** Short "Details" bullet points. */
  features: string[];
  material: string;
  care: string;
  /** Available sizes; a single entry (e.g. "One size") means no size choice. */
  sizes: string[];
  colors: Colour[];
  /** Public image paths. `.jpg` photos are preferred; see lib/images.ts. */
  images: string[];
  reviews: Review[];
}

export const categories: Category[] = [
  "Outerwear",
  "Knitwear",
  "Shirts & Tops",
  "Bags",
  "Jewelry",
  "Accessories",
];

/**
 * The catalog document (data/catalog.json) is the single source of product
 * content. The live static build reads it directly (lib/catalog/static.ts) and
 * the database build seeds SQLite from it (prisma/seed.ts), so both show the
 * same products. Edit the JSON to change the catalog.
 */
export const products = catalog.products as Product[];
