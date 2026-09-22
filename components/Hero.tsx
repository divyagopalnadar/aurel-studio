import Image from "next/image";
import Link from "next/link";
import { getProductById, getProductBySlug } from "@/lib/data";
import { heroImage } from "@/lib/images";
import { Button } from "./ui/Button";
import { formatPrice } from "@/lib/utils";
import { ArrowRightIcon } from "@/lib/icons";

const HIGHLIGHTS = [
  ["Natural", "fibres & leathers"],
  ["Free", "repairs for life"],
  ["30-day", "free returns"],
];

export async function Hero() {
  const featured =
    (await getProductBySlug("alder-wool-overcoat")) ?? (await getProductById(1));

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8 lg:pb-24 lg:pt-32">
        <div className="animate-fade-up">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-brand-soft">
            Autumn / Winter 2026
          </p>

          <h1 className="mt-5 text-balance font-serif text-5xl font-medium leading-[1.02] tracking-tight text-fg sm:text-6xl lg:text-7xl">
            Quiet pieces, made to be <em className="text-brand-soft">lived in</em>
          </h1>

          <p className="mt-6 max-w-md text-pretty text-[15px] leading-relaxed text-muted sm:text-base">
            Cashmere, waxed cotton, vegetable-tanned leather and recycled gold.
            Fewer, better things in colours that work together, season after
            season.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/#collection">
                Shop the collection
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            {featured && (
              <Button asChild size="lg" variant="secondary">
                <Link href={`/product/${featured.id}`}>Discover the {featured.name}</Link>
              </Button>
            )}
          </div>

          <dl className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
            {HIGHLIGHTS.map(([stat, label]) => (
              <div key={label}>
                <dt className="font-serif text-2xl font-medium text-fg">{stat}</dt>
                <dd className="text-[12px] text-faint">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Editorial image with the featured product */}
        <div
          className="relative mx-auto w-full max-w-[440px] animate-fade-up lg:mr-0"
          style={{ animationDelay: "80ms" }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-edge bg-panel shadow-lift">
            <Image
              src={heroImage()}
              alt="Aurél Studio autumn and winter collection"
              fill
              sizes="(max-width: 1024px) 90vw, 440px"
              loading="eager"
              className="object-cover"
            />
          </div>

          {featured && (
            <Link
              href={`/product/${featured.id}`}
              className="group glass-strong absolute -bottom-7 left-4 right-4 flex items-center gap-4 rounded-2xl border border-edge p-3 pr-5 shadow-lift transition-colors hover:border-edge-strong sm:-left-12 sm:right-auto sm:w-[340px]"
            >
              <span className="relative aspect-[4/5] w-14 shrink-0 overflow-hidden rounded-lg bg-panel">
                <Image
                  src={featured.images[0]}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                  Featured · {featured.category}
                </span>
                <span className="mt-0.5 block truncate font-serif text-lg font-semibold text-fg">
                  {featured.name}
                </span>
                <span className="mt-0.5 flex items-baseline gap-2 text-sm">
                  <span className="font-medium text-fg">{formatPrice(featured.price)}</span>
                  {featured.compareAtPrice && (
                    <span className="text-[12px] text-faint line-through">
                      {formatPrice(featured.compareAtPrice)}
                    </span>
                  )}
                </span>
              </span>
              <ArrowRightIcon className="size-4 shrink-0 text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-fg" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
