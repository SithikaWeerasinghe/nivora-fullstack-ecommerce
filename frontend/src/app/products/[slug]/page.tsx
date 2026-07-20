import type { Metadata } from "next";
import { ProductDetails } from "@/components/products/product-details";
import { getProductBySlug } from "@/services";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// No paths are pre-rendered at build time; each product page renders
// on demand from the live catalogue instead (dynamicParams defaults to true).
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found" };
  }
  return {
    title: product.name,
    description: product.short_description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetails slug={slug} />;
}
