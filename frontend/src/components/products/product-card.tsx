"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";
import { buttonClasses } from "@/components/ui/button";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductImage } from "./product-image";
import { StockBadge } from "./stock-badge";
import type { Product } from "@/types";

const cardImageSizes =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw";

export function ProductCard({ product }: { product: Product }) {
  const detailsHref = `/products/${product.slug}`;
  const outOfStock = product.stock <= 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-shadow duration-200 hover:shadow-md">
      <Link href={detailsHref} tabIndex={-1} aria-hidden="true">
        <ProductImage
          product={product}
          sizes={cardImageSizes}
          className={cn(outOfStock && "opacity-60")}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold leading-snug text-ink">
          <Link
            href={detailsHref}
            className="rounded transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-muted">
          {product.short_description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-semibold text-ink">
            {formatPrice(product.price)}
          </span>
          <StockBadge stock={product.stock} />
        </div>
        <div className="grid grid-cols-1 gap-2 pt-1.5">
          <Link
            href={detailsHref}
            className={buttonClasses("outline", "md", "w-full")}
          >
            Details
          </Link>
          <AddToCartButton product={product} className="w-full" />
        </div>
      </div>
    </article>
  );
}
