"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { BoxIcon, CloseIcon, MenuIcon, ShoppingBagIcon } from "@/lib/icons";

const NAV = [
  { href: "/", label: "Shop" },
  { href: "/#coleccion", label: "Collection" },
  { href: "/#featured", label: "Featured" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled || menuOpen
            ? "glass-strong border-b border-edge shadow-card"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand/15 text-brand-soft ring-1 ring-inset ring-brand/30 transition-colors group-hover:bg-brand/25">
              <BoxIcon className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[15px] font-semibold tracking-tight text-fg">
                Aurél
              </span>
              <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-faint">
                Studio
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm text-muted transition-colors hover:bg-fg/[0.05] hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Button
              variant="secondary"
              size="md"
              onClick={openCart}
              className="relative px-3.5 md:px-4"
              aria-label={`Open bag (${count} items)`}
            >
              <ShoppingBagIcon className="size-[18px]" />
              <span className="hidden sm:inline">Bag</span>
              {count > 0 && (
                <span
                  key={count}
                  className="animate-scale-in absolute -right-1.5 -top-1.5 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-semibold text-white ring-2 ring-bg"
                >
                  {count}
                </span>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-10 place-items-center rounded-xl text-fg/70 transition-colors hover:bg-fg/[0.05] hover:text-fg md:hidden"
              aria-label="Toggle menu"
            >
              {menuOpen ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-x-0 top-16 z-40 origin-top border-b border-edge bg-bg/95 backdrop-blur-xl transition-all duration-300 md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="space-y-1 px-4 py-4">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-[15px] text-fg/80 transition-colors hover:bg-fg/[0.05]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
