import { Hero } from "@/components/Hero";
import { ShopExplorer } from "@/components/ShopExplorer";
import { Marquee } from "@/components/Marquee";
import { FeaturedStrip } from "@/components/FeaturedStrip";
import { getProducts } from "@/lib/data";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <Hero />
      <Marquee />
      <ShopExplorer products={products} />
      <FeaturedStrip />
    </>
  );
}
