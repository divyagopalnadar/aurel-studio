"use client";

import { useMemo, useEffect, useRef, useState } from "react";
import type { Category, Product } from "@/data/products";
import { categories } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { cn, formatPrice } from "@/lib/utils";
import {
  BoxIcon,
  CheckIcon,
  ChevronDownIcon,
  CloseIcon,
  SearchIcon,
  SlidersIcon,
} from "@/lib/icons";

type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

const SORTS: { id: SortKey; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

const PRICE_BANDS = ["Any", "Under $150", "$150 – $399", "$400+"];

export function ShopExplorer({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<SortKey>("featured");
  const [priceBand, setPriceBand] = useState<string>("Any");
  const [sortOpen, setSortOpen] = useState(false);
  const [bandOpen, setBandOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const bandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        !sortRef.current?.contains(e.target as Node) &&
        !bandRef.current?.contains(e.target as Node)
      ) {
        setSortOpen(false);
        setBandOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q);
      const matchPrice =
        priceBand === "Any" ||
        (priceBand === "Under $150" && p.price < 150) ||
        (priceBand === "$150 – $399" && p.price >= 150 && p.price <= 399) ||
        (priceBand === "$400+" && p.price > 399);
      return matchCat && matchQ && matchPrice;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "newest":
          return b.id - a.id;
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating || b.reviewCount - a.reviewCount;
        case "featured":
        default:
          return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
      }
    });
    return list;
  }, [products, query, category, sort, priceBand]);

  const hasFilters =
    query !== "" || category !== "All" || priceBand !== "Any" || sort !== "featured";

  const maxPrice = Math.max(...products.map((p) => p.price));

  return (
    <section id="coleccion" className="mx-auto max-w-7xl scroll-mt-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6">
        {/* Heading */}
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-soft">
            The collection
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Everything we make
              <span className="ml-2 align-middle text-faint">({products.length})</span>
            </h2>
            <p className="text-sm text-muted">Curated objects, one standard.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search headphones, wearables, tech…"
            className="glass h-12 w-full rounded-xl border border-edge pl-11 pr-10 text-[15px] text-fg placeholder:text-faint transition-all duration-200 focus:border-brand/50 focus:outline-none focus:ring-4 focus:ring-brand/15"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-md text-faint transition-colors hover:bg-fg/[0.05] hover:text-fg"
              aria-label="Clear search"
            >
              <CloseIcon className="size-4" />
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Category chips */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {(["All", ...categories] as (Category | "All")[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200",
                  category === c
                    ? "bg-brand text-white shadow-glow"
                    : "bg-fg/[0.05] text-muted ring-1 ring-inset ring-edge hover:bg-fg/[0.09] hover:text-fg"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filters toggle */}
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors lg:hidden",
                filtersOpen
                  ? "bg-fg/[0.1] text-fg"
                  : "bg-fg/[0.05] text-muted ring-1 ring-inset ring-edge hover:text-fg"
              )}
            >
              <SlidersIcon className="size-4" />
              Filter
            </button>

            {/* Price band dropdown */}
            <Dropdown
              anchorRef={bandRef}
              open={bandOpen}
              onToggle={() => {
                setBandOpen((v) => !v);
                setSortOpen(false);
              }}
              label={priceBand}
              triggerClass="hidden sm:inline-flex"
            >
              <div className="p-1.5">
                {PRICE_BANDS.map((band) => (
                  <Option
                    key={band}
                    active={priceBand === band}
                    onClick={() => {
                      setPriceBand(band);
                      setBandOpen(false);
                    }}
                  >
                    {band}
                  </Option>
                ))}
              </div>
            </Dropdown>

            {/* Sort dropdown */}
            <Dropdown
              anchorRef={sortRef}
              open={sortOpen}
              onToggle={() => {
                setSortOpen((v) => !v);
                setBandOpen(false);
              }}
              label={SORTS.find((s) => s.id === sort)!.label}
              align="right"
            >
              <div className="p-1.5">
                {SORTS.map((s) => (
                  <Option
                    key={s.id}
                    active={sort === s.id}
                    onClick={() => {
                      setSort(s.id);
                      setSortOpen(false);
                    }}
                  >
                    {s.label}
                  </Option>
                ))}
              </div>
            </Dropdown>
          </div>
        </div>

        {/* Mobile price filter */}
        {filtersOpen && (
          <div className="animate-fade flex flex-wrap gap-2 lg:hidden">
            {PRICE_BANDS.map((band) => (
              <button
                key={band}
                type="button"
                onClick={() => setPriceBand(band)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[13px] transition-colors",
                  priceBand === band
                    ? "bg-brand text-white"
                    : "bg-fg/[0.05] text-muted ring-1 ring-inset ring-edge"
                )}
              >
                {band}
              </button>
            ))}
          </div>
        )}

        {/* Results meta */}
        <div className="flex items-center justify-between text-[13px] text-faint">
          <span>
            {filtered.length} {filtered.length === 1 ? "result" : "results"}
            {hasFilters && (
              <>
                {" "}
                for{" "}
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                    setPriceBand("Any");
                    setSort("featured");
                  }}
                  className="inline-flex items-center gap-1 text-brand-soft transition-colors hover:text-fg"
                >
                  <CloseIcon className="size-3" /> clear
                </button>
              </>
            )}
          </span>
          <span className="hidden font-mono text-faint/70 sm:block">
            up to {formatPrice(maxPrice)}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <EmptyState
            query={query}
            onReset={() => {
              setQuery("");
              setCategory("All");
              setPriceBand("Any");
              setSort("featured");
            }}
          />
        )}
      </div>
    </section>
  );
}

function EmptyState({ query, onReset }: { query: string; onReset: () => void }) {
  return (
    <div className="animate-scale-in flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-edge bg-fg/[0.015] px-8 py-20 text-center">
      <div className="grid size-16 place-items-center rounded-2xl bg-fg/[0.04] text-faint ring-1 ring-inset ring-edge">
        <BoxIcon className="size-7" />
      </div>
      <div className="max-w-sm">
        <h3 className="text-lg font-semibold text-fg">
          {query ? "Nothing matches that" : "No products here"}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {query
            ? "We couldn't find anything for that search. Try a different term or browse the whole collection."
            : "Try expanding your filters to see more of the collection."}
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-soft"
      >
        Reset filters
      </button>
    </div>
  );
}

function Option({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
        active ? "bg-brand/15 text-brand-soft" : "text-fg/70 hover:bg-fg/[0.05] hover:text-fg"
      )}
    >
      {children}
      {active && <CheckIcon className="size-4" />}
    </button>
  );
}

const Dropdown = ({
  anchorRef,
  open,
  onToggle,
  label,
  align = "left",
  triggerClass,
  children,
}: {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  open: boolean;
  onToggle: () => void;
  label: string;
  align?: "left" | "right";
  triggerClass?: string;
  children: React.ReactNode;
}) => {
  return (
    <div ref={anchorRef} className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-xl bg-fg/[0.05] px-3.5 text-[13px] font-medium text-muted ring-1 ring-inset ring-edge transition-colors hover:text-fg",
          open && "bg-fg/[0.1] text-fg",
          triggerClass
        )}
      >
        <span className="max-w-[140px] truncate sm:max-w-none">{label}</span>
        <ChevronDownIcon
          className={cn("size-3.5 text-faint transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          className={cn(
            "z-30 absolute top-12 mt-1 min-w-48 animate-scale-in rounded-xl border border-edge bg-panel p-1.5 shadow-lift",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};
