import Link from "next/link";
import { getProductById, getRelatedProducts } from "@/lib/data";
import { ProductCard } from "./ProductCard";
import { ArrowRightIcon } from "@/lib/icons";

export async function FeaturedStrip() {
  const anchor = (await getProductById(1))!;
  const featured = (await getRelatedProducts(anchor, 4)).slice(0, 4);

  return (
    <section id="featured" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-soft">
            Hand-picked
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            You&apos;ll love these too
          </h2>
        </div>
        <Link
          href="/#coleccion"
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
