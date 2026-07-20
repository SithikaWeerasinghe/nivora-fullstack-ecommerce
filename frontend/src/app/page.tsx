import { CategorySection } from "@/components/home/category-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { Hero } from "@/components/home/hero";
import { OrderFlow } from "@/components/home/order-flow";
import { TrustStrip } from "@/components/home/trust-strip";
import { getCategories } from "@/services";
import type { Category } from "@/types";

export default async function HomePage() {
  // An unavailable API degrades to an empty category section rather than
  // taking down the whole page — FeaturedProducts fetches (and handles
  // its own errors) client-side regardless.
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

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
