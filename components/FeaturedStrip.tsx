import Link from "next/link";
import { getFeaturedProducts } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { ArrowRightIcon } from "@/lib/icons";

export async function FeaturedStrip() {
  const featured = await getFeaturedProducts(4);
  if (featured.length === 0) return null;

  return (
    <section id="featured" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-soft">
            The Edit
          </p>
          <h2 className="mt-1 font-serif text-3xl font-medium tracking-tight text-fg sm:text-4xl">
            Pieces to live in this season
          </h2>
        </div>
        <Link
          href="/#collection"
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-soft transition-colors hover:text-fg"
        >
          View all
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
