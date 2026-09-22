"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Stars } from "./ui/Stars";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import {
  ArrowLeftIcon,
  CheckIcon,
  MinusIcon,
  PlusIcon,
  RefreshIcon,
  ShieldIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "@/lib/icons";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [colour, setColour] = useState(product.colors[0]?.name);
  const hasSizes = product.sizes.length > 1;
  const [size, setSize] = useState<string | null>(null);

  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === "sold_out";
  const needsSize = hasSizes && !size;
  const options = { color: colour, size: hasSizes ? (size ?? undefined) : undefined };

  const onAdd = () => {
    addItem(product, qty, options);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const onBuy = () => {
    addItem(product, qty, options);
    openCart();
  };

  return (
    <div className="animate-fade-up">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-[13px] text-faint">
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-fg">
          <ArrowLeftIcon className="size-3.5" />
          Continue shopping
        </Link>
        <span className="text-faint/70">/</span>
        <span>{product.category}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-edge bg-panel shadow-card">
            <Image
              key={product.images[active]}
              src={product.images[active]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="animate-fade object-cover"
              loading="eager"
            />
            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.isNew && <Badge tone="overlay">New</Badge>}
              {discount > 0 && <Badge tone="saleOverlay">-{discount}%</Badge>}
            </div>
            {soldOut && (
              <div className="absolute inset-0 grid place-items-center bg-bg/60 backdrop-blur-sm">
                <Badge tone="overlay">Sold out</Badge>
              </div>
            )}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "relative aspect-[4/5] overflow-hidden rounded-xl border bg-panel transition-all duration-200",
                  active === i
                    ? "border-brand/60 ring-2 ring-brand/25"
                    : "border-edge opacity-60 hover:opacity-100"
                )}
                aria-label={`View image ${i + 1}`}
              >
                {/* Eager: the gallery sits above the fold and shares its first src with the LCP image. */}
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="128px"
                  loading="eager"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">
              {product.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Stars rating={product.rating} size="md" />
              <span className="text-sm text-muted">
                {product.rating}
                <span className="text-faint"> · {product.reviewCount} reviews</span>
              </span>
            </span>
          </div>

          <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-fg sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-[15px] text-muted">{product.tagline}</p>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-semibold text-fg">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-faint line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <span className="rounded-md bg-sale/10 px-2 py-0.5 text-[12px] font-semibold text-sale">
                  Save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="mt-3 flex items-center gap-2 text-[13px]">
            {soldOut ? (
              <span className="text-sale">Currently sold out</span>
            ) : (
              <>
                <span
                  className={cn(
                    "size-2 rounded-full",
                    product.stock === "low_stock" ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
                <span className="text-muted">
                  {product.stock === "low_stock"
                    ? `Only ${product.stockCount} left in stock`
                    : "In stock — shipped in 24h"}
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-[15px] leading-relaxed text-muted">
            {product.description}
          </p>

          {/* Colour */}
          {product.colors.length > 0 && (
            <div className="mt-7">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">
                Colour <span className="ml-1 normal-case tracking-normal text-fg">{colour}</span>
              </h3>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColour(c.name)}
                    aria-label={c.name}
                    aria-pressed={colour === c.name}
                    title={c.name}
                    className={cn(
                      "size-8 rounded-full ring-1 ring-inset ring-edge-strong transition-all",
                      colour === c.name
                        ? "outline-2 outline-offset-2 outline-fg"
                        : "hover:scale-110"
                    )}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          <div className="mt-6">
            <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">
              Size
              {hasSizes && size && (
                <span className="ml-1 normal-case tracking-normal text-fg">{size}</span>
              )}
            </h3>
            {hasSizes ? (
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    disabled={soldOut}
                    className={cn(
                      "h-10 min-w-12 rounded-lg px-3 text-sm font-medium ring-1 ring-inset transition-colors disabled:opacity-50",
                      size === s
                        ? "bg-fg text-bg ring-fg"
                        : "text-fg/80 ring-edge-strong hover:ring-fg/60"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">{product.sizes[0] ?? "One size"}</p>
            )}
          </div>

          {/* Quantity + actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex h-13 shrink-0 items-center justify-between rounded-xl ring-1 ring-inset ring-edge sm:w-36">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-11 place-items-center text-faint transition-colors hover:text-fg"
                aria-label="Decrease quantity"
              >
                <MinusIcon className="size-4" />
              </button>
              <span className="w-8 text-center text-[15px] font-medium text-fg">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(product.stockCount, q + 1))}
                className="grid size-11 place-items-center text-faint transition-colors hover:text-fg"
                aria-label="Increase quantity"
              >
                <PlusIcon className="size-4" />
              </button>
            </div>

            <Button
              size="lg"
              onClick={onAdd}
              disabled={soldOut || needsSize}
              className="flex-1"
            >
              {needsSize && !soldOut ? (
                "Select a size"
              ) : added ? (
                <>
                  <CheckIcon className="size-4" /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBagIcon className="size-4" /> Add to bag
                </>
              )}
            </Button>

            <Button size="lg" variant="outline" onClick={onBuy} disabled={soldOut || needsSize}>
              Buy now
            </Button>
          </div>

          {/* Trust row */}
          <div className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {[
              { icon: <TruckIcon className="size-4" />, label: "Free shipping over $200" },
              { icon: <RefreshIcon className="size-4" />, label: "Free 30-day returns" },
              { icon: <ShieldIcon className="size-4" />, label: "Free repairs for life" },
            ].map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-2.5 rounded-xl border border-edge bg-panel px-3.5 py-3 text-[13px] text-muted"
              >
                <span className="text-brand-soft">{t.icon}</span>
                {t.label}
              </div>
            ))}
          </div>

          {/* Details, material & care */}
          <div className="mt-8 divide-y divide-edge border-y border-edge">
            <section className="py-5">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">
                Details
              </h3>
              <ul className="space-y-2">
                {product.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-fg/80">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-brand-soft" />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
            {(product.material || product.care) && (
              <dl className="grid gap-4 py-5 text-sm sm:grid-cols-2">
                {product.material && (
                  <div>
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">
                      Material
                    </dt>
                    <dd className="mt-2 text-fg/80">{product.material}</dd>
                  </div>
                )}
                {product.care && (
                  <div>
                    <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-faint">
                      Care
                    </dt>
                    <dd className="mt-2 text-fg/80">{product.care}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-soft">
              Reviews
            </p>
            <h2 className="mt-1 flex items-center gap-3 font-serif text-3xl font-medium text-fg">
              <span>{product.rating}</span>
              <Stars rating={product.rating} className="scale-110" />
              <span className="text-base font-normal text-faint">
                from {product.reviewCount} reviews
              </span>
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {product.reviews.map((r) => (
            <div
              key={r.id}
              className="glass rounded-2xl border border-edge p-5 transition-colors hover:border-edge-strong"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-brand/15 text-sm font-semibold text-brand-soft">
                    {r.author[0]}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-fg">{r.author}</p>
                    <p className="text-[12px] text-faint">
                      Verified buyer · {new Date(r.date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}
                    </p>
                  </div>
                </div>
                <Stars rating={r.rating} />
              </div>
              <h3 className="mt-4 text-[15px] font-medium text-fg">{r.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
