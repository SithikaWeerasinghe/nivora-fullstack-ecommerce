"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { getProductBySlug } from "@/services";
import { useCart } from "@/components/providers/cart-provider";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ChevronLeftIcon, PackageIcon } from "@/components/ui/icons";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductImage } from "./product-image";
import { QuantitySelector } from "./quantity-selector";
import { StockBadge } from "./stock-badge";
import type { Product } from "@/types";

function DetailsSkeleton() {
  return (
    <div role="status" className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <span className="sr-only">Loading product…</span>
      <div aria-hidden="true">
        <div className="h-5 w-36 animate-pulse rounded bg-line/60" />
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="aspect-[4/3] animate-pulse rounded-xl bg-line/50" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-line/60" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-line/60" />
            <div className="h-6 w-32 animate-pulse rounded bg-line/60" />
            <div className="h-4 w-full animate-pulse rounded bg-line/50" />
            <div className="h-4 w-full animate-pulse rounded bg-line/50" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-line/50" />
            <div className="h-12 w-full animate-pulse rounded-lg bg-line/50" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetails({ slug }: { slug: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  // Loading is derived: a stored result tagged with another key is stale.
  const loadKey = `${slug}|${reloadKey}`;
  const [loaded, setLoaded] = useState<{
    key: string;
    product: Product | null;
    failed: boolean;
  }>({ key: "", product: null, failed: false });
  const [quantity, setQuantity] = useState(1);
  const { cart } = useCart();

  useEffect(() => {
    let active = true;
    getProductBySlug(slug)
      .then((result) => {
        if (active) setLoaded({ key: loadKey, product: result, failed: false });
      })
      .catch(() => {
        if (active) setLoaded({ key: loadKey, product: null, failed: true });
      });
    return () => {
      active = false;
    };
  }, [slug, loadKey]);

  const isCurrent = loaded.key === loadKey;
  const hasError = isCurrent && loaded.failed;
  // undefined = loading, null = not found
  const product: Product | null | undefined = isCurrent
    ? loaded.product
    : undefined;

  const inCartQuantity =
    (product &&
      cart?.items.find((item) => item.product_id === product.id)?.quantity) ||
    0;
  const remaining = product ? Math.max(product.stock - inCartQuantity, 0) : 0;

  // The selected quantity is clamped to what can still be added, without
  // writing state when stock or cart contents change underneath it.
  const selectedQuantity =
    remaining > 0 ? Math.min(quantity, remaining) : 1;

  if (hasError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <ErrorState
          message="This product could not be loaded right now."
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      </div>
    );
  }

  if (product === undefined) {
    return <DetailsSkeleton />;
  }

  if (product === null) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <EmptyState
          as="h1"
          icon={<PackageIcon className="h-7 w-7" />}
          title="Product not found"
          message="This product does not exist or may have been removed."
        >
          <Link href="/products" className={buttonClasses("primary")}>
            Back to products
          </Link>
        </EmptyState>
      </div>
    );
  }

  const outOfStock = product.stock <= 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <Link
        href="/products"
        className="inline-flex h-10 items-center gap-1 rounded text-sm font-medium text-muted transition-colors hover:text-primary"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to products
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductImage
          product={product}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="rounded-xl border border-line"
        />

        <div>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {product.category.name}
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-semibold text-ink">
              {formatPrice(product.price)}
            </span>
            <StockBadge stock={product.stock} />
          </div>

          <p className="mt-5 leading-7 text-muted">{product.description}</p>

          <div className="mt-8 border-t border-line pt-6">
            {outOfStock ? (
              <p className="text-sm font-medium text-error">
                This product is currently out of stock. Please check back later.
              </p>
            ) : remaining <= 0 ? (
              <p className="text-sm font-medium text-warning">
                Your cart already has the maximum available quantity of this
                product.
              </p>
            ) : (
              <>
                {inCartQuantity > 0 ? (
                  <p className="mb-3 text-sm text-muted">
                    Already in your cart: {inCartQuantity} · you can add up to{" "}
                    {remaining} more
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-3">
                  <QuantitySelector
                    value={selectedQuantity}
                    max={remaining}
                    onChange={setQuantity}
                  />
                  <AddToCartButton
                    product={product}
                    quantity={selectedQuantity}
                    size="lg"
                    className="min-w-44 flex-1 sm:flex-none"
                    onAdded={() => setQuantity(1)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
