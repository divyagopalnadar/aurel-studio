import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts, getProducts } from "@/lib/data";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";

// Every catalog product is prerendered. In the database build, products added
// later through the admin are rendered on demand (dynamicParams defaults to
// true); the static export only contains the prerendered ones.
export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) return { title: "Product not found — Aurél Studio" };
  return {
    title: `${product.name} — Aurél Studio`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = Number.isInteger(productId)
    ? await getProductById(productId)
    : null;

  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <ProductDetail product={product} />

      <section className="mt-24">
        <div className="mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-brand-soft">
            Continue exploring
          </p>
          <h2 className="mt-1 font-serif text-3xl font-medium tracking-tight text-fg">
            You may also like
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <p className="mt-10 text-right font-mono text-[12px] text-faint">
        {formatPrice(product.price)} · SKU AUR-{String(product.id).padStart(3, "0")}
      </p>
    </div>
  );
}
