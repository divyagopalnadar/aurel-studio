"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "./ui/Button";
import { formatPrice } from "@/lib/utils";
import {
  ArrowRightIcon,
  BoxIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@/lib/icons";

export function CartDrawer() {
  const { isOpen, closeCart, lines, subtotal, setQuantity, removeItem, count } =
    useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <>
      <div
        onClick={closeCart}
        className={cn(
          "fixed inset-0 z-[60] bg-bg/70 backdrop-blur-sm",
          isOpen ? "animate-backdrop" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-[65] flex w-full max-w-md flex-col border-l border-edge bg-panel shadow-lift",
          isOpen ? "animate-drawer" : "pointer-events-none translate-x-full opacity-0"
        )}
      >
        <header className="flex items-center justify-between border-b border-edge px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-brand/15 text-brand-soft">
              <BoxIcon className="size-4.5" />
            </span>
            <div className="leading-tight">
              <h2 className="text-[15px] font-semibold text-fg">Your bag</h2>
              <p className="text-[12px] text-faint">
                {count} {count === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="grid size-9 place-items-center rounded-lg text-faint transition-colors hover:bg-fg/[0.05] hover:text-fg"
            aria-label="Close bag"
          >
            <CloseIcon className="size-5" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <div className="grid size-16 place-items-center rounded-2xl bg-fg/[0.04] text-faint ring-1 ring-inset ring-edge">
              <BoxIcon className="size-7" />
            </div>
            <div>
              <p className="text-[15px] font-medium text-fg">Your bag is empty</p>
              <p className="mt-1 text-sm text-muted">
                Add something you love and it&apos;ll show up here.
              </p>
            </div>
            <Button onClick={closeCart} className="mt-2">
              <ArrowRightIcon className="size-4" />
              Continue shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-2 overflow-y-auto px-5 py-4">
              {lines.map((line) => (
                <div
                  key={line.productId}
                  className="flex gap-3 rounded-xl border border-edge bg-fg/[0.02] p-3 transition-colors hover:bg-fg/[0.04]"
                >
                  <Link
                    href={`/product/${line.productId}`}
                    onClick={closeCart}
                    className="relative block size-16 shrink-0 overflow-hidden rounded-lg ring-1 ring-inset ring-edge"
                  >
                    <Image
                      src={line.image}
                      alt={line.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${line.productId}`}
                        onClick={closeCart}
                        className="line-clamp-1 text-sm font-medium text-fg hover:text-fg"
                      >
                        {line.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productId)}
                        className="grid size-7 shrink-0 place-items-center rounded-md text-faint transition-colors hover:bg-rose-500/10 hover:text-rose-500 dark:hover:text-rose-300"
                        aria-label={`Remove ${line.name}`}
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center rounded-lg ring-1 ring-inset ring-edge">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity - 1)}
                          className="grid size-8 place-items-center text-faint transition-colors hover:bg-fg/[0.05] hover:text-fg"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="size-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm text-fg">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.productId, line.quantity + 1)}
                          className="grid size-8 place-items-center text-faint transition-colors hover:bg-fg/[0.05] hover:text-fg"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="size-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-fg">
                        {formatPrice(line.price * line.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-edge px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-lg font-semibold text-fg">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Button size="lg" className="w-full">
                Checkout
                <ArrowRightIcon className="size-4" />
              </Button>
              <p className="mt-2.5 text-center text-[12px] text-faint">
                Shipping & taxes calculated at checkout
              </p>
            </footer>
          </>
        )}
      </aside>
    </>
  );
}

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
