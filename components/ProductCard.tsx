"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { Badge } from "./ui/Badge";
import { Stars } from "./ui/Stars";
import { useCart } from "@/context/CartContext";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { PlusIcon } from "@/lib/icons";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === "sold_out";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-edge bg-panel shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-edge-strong hover:bg-surface hover:shadow-lift">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden"
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
          {product.isNew && <Badge tone="brand">New</Badge>}
          {discount > 0 && <Badge tone="rose">-{discount}%</Badge>}
        </div>

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-bg/70 backdrop-blur-sm">
            <Badge tone="neutral">Sold out</Badge>
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
            className="line-clamp-1 text-[15px] font-medium text-fg transition-colors hover:text-fg"
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
          {product.rating > 0 && (
            <span className="text-[12px] text-faint">
              {product.rating}
              <span className="text-faint/70"> / 5</span>
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        disabled={soldOut}
        onClick={() => !soldOut && addItem(product)}
        className={cn(
          "relative z-10 flex h-11 items-center justify-center gap-2 border-t border-edge/60 text-sm font-medium transition-all duration-200",
          soldOut
            ? "cursor-not-allowed bg-fg/[0.02] text-faint"
            : "bg-fg/[0.03] text-muted hover:bg-brand hover:text-white"
        )}
      >
        {soldOut ? (
          "Not available"
        ) : (
          <>
            <span className="grid size-5 place-items-center rounded-full bg-brand/15 text-brand-soft transition-colors group-hover:bg-white/15 group-hover:text-white">
              <PlusIcon className="size-3" />
            </span>
            Add to bag
            {product.stock === "low_stock" && (
              <span className="ml-1 text-[11px] font-medium text-amber-600 dark:text-amber-300">
                · low stock
              </span>
            )}
          </>
        )}
      </button>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-edge bg-panel">
      <div className="aspect-square bg-fg/[0.04]" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded bg-fg/[0.06]" />
        <div className="h-4 w-4/5 rounded bg-fg/[0.07]" />
        <div className="h-3 w-3/5 rounded bg-fg/[0.05]" />
      </div>
    </div>
  );
}
