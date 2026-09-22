"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "./ui/Badge";
import { Stars } from "./ui/Stars";
import { useCart } from "@/context/CartContext";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { PlusIcon } from "@/lib/icons";

const actionClass =
  "relative z-10 flex h-11 items-center justify-center gap-2 border-t border-edge/60 text-sm font-medium transition-all duration-200";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === "sold_out";
  // Items with a size choice are added from the product page.
  const needsSize = product.sizes.length > 1;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-panel shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-edge-strong hover:bg-surface hover:shadow-lift">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/5] overflow-hidden bg-panel"
        aria-label={product.name}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-2">
          {product.isNew && <Badge tone="overlay">New</Badge>}
          {discount > 0 && <Badge tone="saleOverlay">-{discount}%</Badge>}
        </div>

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-bg/70 backdrop-blur-sm">
            <Badge tone="overlay">Sold out</Badge>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
            {product.category}
          </span>
          <Stars rating={product.rating} />
        </div>

        <div className="flex flex-1 flex-col gap-1">
          <Link
            href={`/product/${product.id}`}
            className="line-clamp-1 font-serif text-lg font-semibold leading-snug text-fg transition-colors hover:text-brand-soft"
          >
            {product.name}
          </Link>
          <p className="line-clamp-1 text-[13px] text-muted">{product.tagline}</p>
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-edge/60 pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold text-fg">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[12px] text-faint line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          <span
            className="flex items-center gap-1.5"
            aria-label={`${product.colors.length} ${product.colors.length === 1 ? "colour" : "colours"}`}
          >
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="size-3.5 rounded-full ring-1 ring-inset ring-edge-strong"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </span>
        </div>
      </div>

      {needsSize && !soldOut ? (
        <Link
          href={`/product/${product.id}`}
          className={cn(actionClass, "bg-fg/[0.03] text-muted hover:bg-brand hover:text-white")}
        >
          Choose size
          <span className="text-[12px] font-normal opacity-70">
            {product.sizes[0]}–{product.sizes[product.sizes.length - 1]}
          </span>
        </Link>
      ) : (
        <button
          type="button"
          disabled={soldOut}
          onClick={() =>
            !soldOut && addItem(product, 1, { color: product.colors[0]?.name })
          }
          className={cn(
            actionClass,
            soldOut
              ? "cursor-not-allowed bg-fg/[0.02] text-faint"
              : "bg-fg/[0.03] text-muted hover:bg-brand hover:text-white"
          )}
        >
          {soldOut ? (
            "Not available"
          ) : (
            <>
              <PlusIcon className="size-3.5" />
              Add to bag
              {product.stock === "low_stock" && (
                <span className="ml-1 text-[11px] font-medium text-amber-700 dark:text-amber-300">
                  · low stock
                </span>
              )}
            </>
          )}
        </button>
      )}
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-edge bg-panel">
      <div className="aspect-[4/5] bg-fg/[0.04]" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded bg-fg/[0.06]" />
        <div className="h-4 w-4/5 rounded bg-fg/[0.07]" />
        <div className="h-3 w-3/5 rounded bg-fg/[0.05]" />
      </div>
    </div>
  );
}
