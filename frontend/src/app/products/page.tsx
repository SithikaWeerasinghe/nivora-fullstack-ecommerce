import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPageClient } from "@/components/products/products-page-client";
import { ProductGridSkeleton } from "@/components/products/product-skeleton";
import { getCategories } from "@/services";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse the Nivora catalogue — audio, workspace, smart home, mobile accessories, and travel tech.",
};

function ProductsFallback() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Products</h1>
      <div className="mt-8">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}

export default async function ProductsPage() {
  const categories = await getCategories();

  return (
    <Suspense fallback={<ProductsFallback />}>
      <ProductsPageClient categories={categories} />
    </Suspense>
  );
}
