import type { Colour, Product, StockStatus } from "@/data/products";
import { IS_STATIC, withBasePath } from "./config";
import { PLACEHOLDER_IMAGE } from "./placeholder";

/** Product fields editable in the admin panel. */
export interface ProductInput {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: string;
  stockCount: number;
  featured: boolean;
  isNew: boolean;
  features: string[];
  material: string;
  care: string;
  sizes: string[];
  colors: Colour[];
  images: string[];
}

export type StoreResult = { ok: true } | { ok: false; error: string };

/**
 * Where the admin panel reads and writes products.
 *  - "server":  REST API backed by the database (NEXT_PUBLIC_DATA_SOURCE=prisma)
 *  - "browser": a copy of the catalog in localStorage (static GitHub Pages build)
 */
export interface AdminStore {
  kind: "server" | "browser";
  load(initial: Product[]): Promise<Product[]>;
  save(input: ProductInput, id?: number): Promise<StoreResult>;
  remove(id: number): Promise<StoreResult>;
  /** Discards browser-local edits. No-op for the server store. */
  reset(): void;
}

// ---------------------------------------------------------------------------
// Database build: REST API (app/api/products/**/route.prisma.ts)
// ---------------------------------------------------------------------------
async function errorFrom(res: Response, fallback: string): Promise<StoreResult> {
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  return { ok: false, error: data?.error ?? fallback };
}

const apiStore: AdminStore = {
  kind: "server",
  async load(initial) {
    const res = await fetch("/api/products");
    return res.ok ? ((await res.json()) as Product[]) : initial;
  },
  async save(input, id) {
    const res = await fetch(id == null ? "/api/products" : `/api/products/${id}`, {
      method: id == null ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    return res.ok ? { ok: true } : errorFrom(res, "Something went wrong.");
  },
  async remove(id) {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    return res.ok ? { ok: true } : errorFrom(res, "Could not delete product");
  },
  reset() {},
};

// ---------------------------------------------------------------------------
// Static build: browser-local copy of the catalog document
// ---------------------------------------------------------------------------
const STORAGE_KEY = "aurel-admin-catalog-v1";
const STOCK: StockStatus[] = ["in_stock", "low_stock", "sold_out"];

function createBrowserStore(): AdminStore {
  let baseline: Product[] = [];

  const read = (): Product[] | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Product[]) : null;
    } catch {
      return null;
    }
  };

  const write = (products: Product[]): StoreResult => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
      return { ok: true };
    } catch {
      return { ok: false, error: "Couldn't save: browser storage is unavailable." };
    }
  };

  const current = () => read() ?? baseline;

  return {
    kind: "browser",
    async load(initial) {
      baseline = initial;
      return current();
    },
    async save(input, id) {
      const products = current();
      const slug = input.slug.trim();
      if (!input.name.trim() || !slug || !Number.isFinite(input.price) || input.price < 0) {
        return { ok: false, error: "Name, slug and a valid price are required." };
      }
      if (products.some((p) => p.slug === slug && p.id !== id)) {
        return { ok: false, error: `A product with slug "${slug}" already exists` };
      }

      const existing = id == null ? undefined : products.find((p) => p.id === id);
      if (id != null && !existing) return { ok: false, error: "Not found" };

      const product: Product = {
        id: existing?.id ?? Math.max(0, ...products.map((p) => p.id)) + 1,
        reviews: existing?.reviews ?? [],
        ...input,
        slug,
        category: input.category as Product["category"],
        stock: STOCK.includes(input.stock as StockStatus)
          ? (input.stock as StockStatus)
          : "in_stock",
        sizes: input.sizes.length > 0 ? input.sizes : ["One size"],
        images: (input.images.length > 0 ? input.images : [PLACEHOLDER_IMAGE]).map(
          withBasePath
        ),
      };

      return write(
        existing
          ? products.map((p) => (p.id === product.id ? product : p))
          : [...products, product]
      );
    },
    async remove(id) {
      return write(current().filter((p) => p.id !== id));
    },
    reset() {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* storage unavailable: nothing to reset */
      }
    },
  };
}

export const adminStore: AdminStore = IS_STATIC ? createBrowserStore() : apiStore;
