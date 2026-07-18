"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getFeaturedProducts } from "@/services";
import { ErrorState } from "@/components/ui/error-state";
import { ArrowRightIcon } from "@/components/ui/icons";
import { ProductGrid } from "@/components/products/product-grid";
import { ProductGridSkeleton } from "@/components/products/product-skeleton";
import type { Product } from "@/types";

interface LoadResult {
  key: number;
  products: Product[] | null;
  failed: boolean;
}

export function FeaturedProducts() {
  // Loading is derived: results tagged with an older key are stale.
  const [loadKey, setLoadKey] = useState(0);
  const [loaded, setLoaded] = useState<LoadResult>({
    key: -1,
    products: null,
    failed: false,
  });

  useEffect(() => {
    let active = true;
    getFeaturedProducts()
      .then((featured) => {
        if (active) setLoaded({ key: loadKey, products: featured, failed: false });
      })
      .catch(() => {
        if (active) setLoaded({ key: loadKey, products: null, failed: true });
      });
    return () => {
      active = false;
    };
  }, [loadKey]);

  const isCurrent = loaded.key === loadKey;
  const hasError = isCurrent && loaded.failed;
  const products = isCurrent ? loaded.products : null;
  const retry = () => setLoadKey((key) => key + 1);

  return (
    <section
      aria-labelledby="featured-heading"
      className="mx-auto max-w-6xl px-4 py-6 sm:px-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="featured-heading" className="text-2xl font-bold tracking-tight text-ink">
          Featured products
        </h2>
        <Link
          href="/products"
          className="inline-flex h-10 items-center gap-1.5 rounded text-sm font-medium text-primary transition-colors hover:text-primary-hover"
        >
          View all products
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6">
        {hasError ? (
          <ErrorState
            message="Featured products could not be loaded right now."
            onRetry={retry}
          />
        ) : products === null ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
