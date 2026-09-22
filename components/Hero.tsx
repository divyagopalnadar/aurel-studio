import Image from "next/image";
import Link from "next/link";
import { getProductById, getProductBySlug } from "@/lib/data";
import { Button } from "./ui/Button";
import { Stars } from "./ui/Stars";
import { Badge } from "./ui/Badge";
import { discountPercent, formatPrice } from "@/lib/utils";
import { ArrowRightIcon, SparkIcon } from "@/lib/icons";

export async function Hero() {
  const featured =
    (await getProductBySlug("orbit-4k-drone")) ?? (await getProductById(1));
  if (!featured) return null;
  const discount = discountPercent(featured.price, featured.compareAtPrice);

  return (
    <section className="relative overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-10 size-[520px] rounded-full bg-brand/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 top-40 size-[420px] rounded-full bg-brand/15 blur-[130px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-32 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-24 lg:pt-40">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-edge bg-fg/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-muted backdrop-blur">
            <SparkIcon className="size-3.5 text-brand-soft" />
            The 2026 collection just landed
          </div>

          <h1 className="text-gradient mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Hardware that feels
            <br className="hidden sm:block" /> as good as it{" "}
            <span className="text-gradient-brand">performs</span>
          </h1>

          <p className="mt-6 max-w-md text-pretty text-[15px] leading-relaxed text-muted sm:text-base">
            Engineered audio, wearables, and everyday electronics. Precise,
            beautiful, and built to outlast your next upgrade.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/#coleccion">
                Shop the collection
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href={`/product/${featured.id}`}>Meet the Orbit 4K</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {[
              ["40,000+", "objects delivered"],
              ["4.8 ★", "average rating"],
              ["2-yr", "warranty included"],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="text-xl font-semibold text-fg">{stat}</p>
                <p className="text-[12px] text-faint">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured product showcase */}
        <div className="relative animate-fade-up lg:pl-6" style={{ animationDelay: "80ms" }}>
          <Link
            href={`/product/${featured.id}`}
            className="group glass block overflow-hidden rounded-3xl border border-edge shadow-lift transition-all duration-300 hover:border-edge-strong"
          >
            <div className="relative aspect-[4/3.4] overflow-hidden">
              <Image
                src={featured.images[0]}
                alt={featured.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="eager"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-2">
                <Badge tone="brand">Featured</Badge>
                {discount > 0 && <Badge tone="rose">-{discount}%</Badge>}
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/90 to-transparent p-5 pt-16">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-faint">
                      {featured.category}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold text-fg">{featured.name}</h3>
                    <p className="mt-0.5 text-[13px] text-muted">{featured.tagline}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <Stars rating={featured.rating} className="justify-end" />
                    <p className="mt-1.5 text-lg font-semibold text-fg">
                      {formatPrice(featured.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
