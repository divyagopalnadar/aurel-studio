"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Colour, Product } from "@/data/products";
import { categories } from "@/data/products";
import { Badge } from "@/components/ui/Badge";
import { Stars } from "@/components/ui/Stars";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { adminStore, type ProductInput } from "@/lib/admin-store";
import {
  BoxIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@/lib/icons";

type EditorState = { mode: "create" } | { mode: "edit"; product: Product } | null;

interface FormState {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  price: string;
  compareAtPrice: string;
  rating: string;
  reviewCount: string;
  stock: string;
  stockCount: string;
  featured: boolean;
  isNew: boolean;
  features: string;
  material: string;
  care: string;
  sizes: string;
  colors: string;
  images: string;
}

function toForm(p: Product): FormState {
  return {
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    category: p.category,
    price: String(p.price),
    compareAtPrice: p.compareAtPrice != null ? String(p.compareAtPrice) : "",
    rating: String(p.rating),
    reviewCount: String(p.reviewCount),
    stock: p.stock,
    stockCount: String(p.stockCount),
    featured: p.featured,
    isNew: p.isNew,
    features: p.features.join("\n"),
    material: p.material,
    care: p.care,
    sizes: p.sizes.join(", "),
    colors: p.colors.map((c) => `${c.name} ${c.hex}`).join("\n"),
    images: p.images.join("\n"),
  };
}

const emptyForm: FormState = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  category: "Outerwear",
  price: "",
  compareAtPrice: "",
  rating: "4.5",
  reviewCount: "0",
  stock: "in_stock",
  stockCount: "10",
  featured: false,
  isNew: true,
  features: "",
  material: "",
  care: "",
  sizes: "XS, S, M, L, XL",
  colors: "Oatmeal #d9cbb3",
  images: "",
};

const inputCls =
  "w-full rounded-lg border border-edge bg-surface px-3 py-2 text-sm text-fg placeholder:text-faint outline-none transition-colors focus:border-brand/60 focus:ring-2 focus:ring-brand/15";

const labelCls = "text-[12px] font-semibold uppercase tracking-wide text-faint";

export function AdminPanel({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initial);
  const [editor, setEditor] = useState<EditorState>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const isBrowserStore = adminStore.kind === "browser";
  // Products with a published page (the static export only has these).
  const published = useMemo(() => new Set(initial.map((p) => p.id)), [initial]);

  const refresh = useCallback(async () => {
    setProducts(await adminStore.load(initial));
  }, [initial]);

  // Static build: pick up edits previously saved in this browser.
  useEffect(() => {
    if (!isBrowserStore) return;
    let active = true;
    adminStore.load(initial).then((list) => {
      if (active) setProducts(list);
    });
    return () => {
      active = false;
    };
  }, [initial, isBrowserStore]);

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const result = await adminStore.remove(id);
    if (result.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      flash("Product deleted");
    } else {
      setError(result.error);
    }
  };

  const handleReset = () => {
    if (!window.confirm("Discard all changes made in this browser?")) return;
    adminStore.reset();
    setProducts(initial);
    flash("Catalog reset");
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-soft">
            Admin
          </p>
          <h1 className="mt-1 font-serif text-3xl font-medium tracking-tight text-fg sm:text-4xl">
            Products
          </h1>
          <p className="mt-1 text-sm text-muted">
            {products.length} in the catalog ·{" "}
            {isBrowserStore ? "saved in this browser" : "stored in local SQLite via Prisma"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isBrowserStore && (
            <Button variant="ghost" onClick={handleReset}>
              Reset
            </Button>
          )}
          <Button onClick={() => setEditor({ mode: "create" })}>
            <PlusCircleIcon className="size-4" />
            New product
          </Button>
        </div>
      </div>

      {isBrowserStore && (
        <p className="mt-4 rounded-xl border border-edge bg-fg/[0.03] px-4 py-3 text-sm text-muted">
          <span className="font-medium text-fg">Live demo:</span> changes are saved in this
          browser only (localStorage). The published storefront is static and
          isn&apos;t affected. Use Reset to restore the original catalog.
        </p>
      )}

      {error && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          {error}
          <button onClick={() => setError(null)} className="text-current">
            <CloseIcon className="size-4" />
          </button>
        </div>
      )}

      {/* List */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-edge bg-panel shadow-card">
        <div className="hidden grid-cols-[64px_1fr_1fr_88px_88px_132px] items-center gap-4 border-b border-edge px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-faint sm:grid lg:grid-cols-[64px_2fr_1fr_110px_110px_120px_132px]">
          <span />
          <span>Name</span>
          <span className="hidden lg:block">Category</span>
          <span>Price</span>
          <span className="hidden sm:block">Stock</span>
          <span className="text-right">Actions</span>
        </div>

        <ul className="divide-y divide-edge">
          {products.map((p) => (
            <li
              key={p.id}
              className="grid grid-cols-[52px_1fr_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-fg/[0.02] sm:grid-cols-[64px_1fr_1fr_88px_88px_132px] sm:gap-4 lg:grid-cols-[64px_2fr_1fr_110px_110px_120px_132px]"
            >
              <span className="relative block aspect-[4/5] w-12 overflow-hidden rounded-lg bg-panel ring-1 ring-inset ring-edge">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt="" className="size-full object-cover" />
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {published.has(p.id) || !isBrowserStore ? (
                    <Link
                      href={`/product/${p.id}`}
                      className="truncate text-sm font-medium text-fg hover:text-brand-soft"
                    >
                      {p.name}
                    </Link>
                  ) : (
                    <span className="truncate text-sm font-medium text-fg">{p.name}</span>
                  )}
                  {p.isNew && <Badge tone="brand" className="hidden md:inline-flex">New</Badge>}
                </div>
                <div className="mt-0.5 flex items-center gap-2 sm:hidden">
                  <span className="text-[12px] text-faint">{p.category}</span>
                  <Stars rating={p.rating} />
                </div>
              </div>

              <span className="hidden text-[13px] text-muted lg:block">{p.category}</span>
              <span className="text-sm font-semibold text-fg">{formatPrice(p.price)}</span>
              <span className="hidden sm:block">
                <StockBadge stock={p.stock} />
              </span>

              <div className="flex items-center justify-end gap-1">
                {(published.has(p.id) || !isBrowserStore) && (
                  <Link
                    href={`/product/${p.id}`}
                    className="hidden size-8 place-items-center rounded-lg text-faint transition-colors hover:bg-fg/[0.05] hover:text-fg md:grid"
                    title="View product page"
                    aria-label={`View ${p.name}`}
                  >
                    <BoxIcon className="size-4" />
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => setEditor({ mode: "edit", product: p })}
                  className="grid size-8 place-items-center rounded-lg text-faint transition-colors hover:bg-fg/[0.05] hover:text-fg"
                  aria-label={`Edit ${p.name}`}
                >
                  <EditIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  className="grid size-8 place-items-center rounded-lg text-faint transition-colors hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-300"
                  aria-label={`Delete ${p.name}`}
                >
                  <TrashIcon className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {products.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-8 py-16 text-center">
            <div className="grid size-14 place-items-center rounded-2xl bg-fg/[0.04] text-faint ring-1 ring-inset ring-edge">
              <BoxIcon className="size-6" />
            </div>
            <p className="text-[15px] text-fg">Catalog is empty</p>
            <Button onClick={() => setEditor({ mode: "create" })}>
              Create your first product
            </Button>
          </div>
        )}
      </div>

      {/* Editor */}
      {editor && (
        <EditorModal
          editor={editor}
          saving={saving}
          onClose={() => setEditor(null)}
          onSaved={async () => {
            await refresh();
            flash(editor.mode === "create" ? "Product created" : "Product updated");
            setEditor(null);
          }}
          setSaving={setSaving}
          setError={setError}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 animate-fade-up">
          <div className="glass-strong flex items-center gap-2.5 rounded-full border border-edge px-4 py-2.5 text-sm shadow-lift">
            <span className="grid size-5 place-items-center rounded-full bg-brand/20 text-brand-soft">
              <CheckIcon className="size-3" />
            </span>
            <span className="text-fg">{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function StockBadge({ stock }: { stock: Product["stock"] }) {
  if (stock === "low_stock") return <Badge tone="amber">Low</Badge>;
  if (stock === "sold_out") return <Badge tone="sale">Sold out</Badge>;
  return <Badge tone="green">In stock</Badge>;
}

function EditorModal({
  editor,
  saving,
  onClose,
  onSaved,
  setSaving,
  setError,
}: {
  editor: NonNullable<EditorState>;
  saving: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
  setSaving: (v: boolean) => void;
  setError: (e: string | null) => void;
}) {
  const isEdit = editor.mode === "edit";
  const [form, setForm] = useState<FormState>(() =>
    isEdit ? toForm(editor.product) : { ...emptyForm }
  );

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const previewImage = useMemo(() => {
    const lines = form.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return lines[0] ?? "";
  }, [form.images]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const price = Number(form.price);
    if (!form.name || Number.isNaN(price) || price < 0) {
      setError("Name and a valid price are required.");
      setSaving(false);
      return;
    }
    const payload: ProductInput = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      tagline: form.tagline,
      description: form.description,
      category: form.category,
      price,
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      rating: Number(form.rating) || 0,
      reviewCount: Number(form.reviewCount) || 0,
      stock: form.stock,
      stockCount: Number(form.stockCount) || 0,
      featured: form.featured,
      isNew: form.isNew,
      features: lines(form.features),
      material: form.material,
      care: form.care,
      sizes: form.sizes.split(",").map((x) => x.trim()).filter(Boolean),
      colors: parseColours(form.colors),
      images: lines(form.images),
    };

    const result = await adminStore.save(payload, isEdit ? editor.product.id : undefined);
    setSaving(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await onSaved();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto p-4 sm:p-6">
      <div
        className="fixed inset-0 animate-backdrop bg-bg/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative my-6 w-full max-w-2xl animate-pop rounded-2xl border border-edge bg-panel shadow-lift">
        <header className="sticky top-0 flex items-center justify-between border-b border-edge bg-panel px-5 py-4">
          <h2 className="text-[15px] font-semibold text-fg">
            {isEdit ? "Edit product" : "New product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-lg text-faint transition-colors hover:bg-fg/[0.05] hover:text-fg"
          >
            <CloseIcon className="size-5" />
          </button>
        </header>

        <form onSubmit={submit}>
          <div className="max-h-[62vh] space-y-5 overflow-y-auto px-5 py-5">
            {previewImage && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage}
                  alt="Preview"
                  className="aspect-[4/5] w-14 rounded-lg object-cover ring-1 ring-inset ring-edge"
                />
                <p className="text-[12px] text-faint">Primary image preview</p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name *">
                <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Alder Wool Overcoat" />
              </Field>
              <Field label="Slug">
                <input className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="alder-wool-overcoat" />
              </Field>
            </div>

            <Field label="Tagline">
              <input className={inputCls} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
            </Field>

            <Field label="Description">
              <textarea className={inputCls + " min-h-24 resize-y"} value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price ($)">
                <input type="number" min={0} className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} />
              </Field>
              <Field label="Compare-at price ($)">
                <input type="number" min={0} className={inputCls} value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} placeholder="Optional" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Category">
                <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Sizes (comma separated)">
                <input className={inputCls} value={form.sizes} onChange={(e) => set("sizes", e.target.value)} placeholder="XS, S, M, L, XL or One size" />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Rating">
                <input type="number" step="0.1" min={0} max={5} className={inputCls} value={form.rating} onChange={(e) => set("rating", e.target.value)} />
              </Field>
              <Field label="Reviews">
                <input type="number" min={0} className={inputCls} value={form.reviewCount} onChange={(e) => set("reviewCount", e.target.value)} />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Stock">
                <select className={inputCls} value={form.stock} onChange={(e) => set("stock", e.target.value)}>
                  <option value="in_stock">in_stock</option>
                  <option value="low_stock">low_stock</option>
                  <option value="sold_out">sold_out</option>
                </select>
              </Field>
              <Field label="Stock count">
                <input type="number" min={0} className={inputCls} value={form.stockCount} onChange={(e) => set("stockCount", e.target.value)} />
              </Field>
            </div>

            <div className="flex flex-wrap gap-4">
              <Checkbox label="Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
              <Checkbox label="New" checked={form.isNew} onChange={(v) => set("isNew", v)} />
            </div>

            <Field label="Details (one per line)">
              <textarea className={inputCls + " min-h-20 resize-y"} value={form.features} onChange={(e) => set("features", e.target.value)} placeholder={"Hand-finished seams\nHorn buttons"} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Material">
                <input className={inputCls} value={form.material} onChange={(e) => set("material", e.target.value)} placeholder="100% cashmere" />
              </Field>
              <Field label="Care">
                <input className={inputCls} value={form.care} onChange={(e) => set("care", e.target.value)} placeholder="Dry clean only" />
              </Field>
            </div>

            <Field label="Colours (one per line: name #hex)">
              <textarea className={inputCls + " min-h-20 resize-y"} value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder={"Camel #b8875a\nCharcoal #3b3a38"} />
            </Field>

            <Field label="Images (one path per line, first is primary)">
              <textarea className={inputCls + " min-h-20 resize-y font-mono text-[13px]"} value={form.images} onChange={(e) => set("images", e.target.value)} placeholder={"/images/products/alder-wool-overcoat-1.jpg"} />
            </Field>
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-edge px-5 py-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create product"}
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-fg/85">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={checked ? "grid size-5 place-items-center rounded-md bg-brand text-white" : "size-5 rounded-md ring-1 ring-inset ring-edge-strong"}
      >
        {checked && <CheckIcon className="size-3.5" />}
      </button>
      {label}
    </label>
  );
}

function lines(s: string): string[] {
  return s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

/** Parses "Name #hex" lines; lines without a valid hex are skipped. */
function parseColours(s: string): Colour[] {
  return lines(s).flatMap((line) => {
    const match = line.match(/^(.*?)\s*(#[0-9a-f]{3}(?:[0-9a-f]{3})?)$/i);
    if (!match) return [];
    const [, name, hex] = match;
    return [{ name: name || hex, hex }];
  });
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
