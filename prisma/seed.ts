import { PrismaClient, type Prisma } from "@prisma/client";
import { products, type Product } from "../data/products";

const prisma = new PrismaClient();

function fields(p: Product) {
  return {
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    price: p.price,
    compareAtPrice: p.compareAtPrice ?? null,
    category: p.category,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock as Prisma.ProductCreateInput["stock"],
    stockCount: p.stockCount,
    featured: p.featured,
    isNew: p.isNew,
    features: JSON.stringify(p.features),
    material: p.material,
    care: p.care,
    sizes: JSON.stringify(p.sizes),
    colors: JSON.stringify(p.colors),
    images: JSON.stringify(p.images),
  } satisfies Prisma.ProductCreateInput;
}

function reviews(p: Product) {
  return p.reviews.map((r) => ({
    author: r.author,
    rating: r.rating,
    title: r.title,
    body: r.body,
    date: new Date(r.date),
  }));
}

async function main() {
  console.log(`Seeding ${products.length} products…`);

  // Keep the DB in sync: remove products that no longer exist in the seed
  // first, so seed ids are free to reuse.
  const slugs = products.map((p) => p.slug);
  const deleted = await prisma.product.deleteMany({
    where: { slug: { notIn: slugs } },
  });

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      // Replace reviews instead of appending duplicates on every re-seed.
      update: { ...fields(p), reviews: { deleteMany: {}, create: reviews(p) } },
      create: { id: p.id, ...fields(p), reviews: { create: reviews(p) } },
    });
  }

  const total = await prisma.product.count();
  console.log(`Done. ${total} products in DB (${deleted.count} removed).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
