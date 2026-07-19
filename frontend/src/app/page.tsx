import { CategorySection } from "@/components/home/category-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { OrderFlow } from "@/components/home/order-flow";
import { TrustStrip } from "@/components/home/trust-strip";
import { getCategories } from "@/services";

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <>
      <Hero />
      <CategorySection categories={categories} />
      <FeaturedProducts />
      <TrustStrip />
      <OrderFlow />
    </>
  );
}
