"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { PackageIcon } from "@/components/ui/icons";
import type { Product } from "@/types";

interface ProductImageProps {
  product: Product;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Consistent 4:3 product image with a graceful fallback when the
 * product has no image or the image fails to load.
 */
export function ProductImage({
  product,
  sizes,
  priority,
  className,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = failed || !product.image_url;

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden bg-[#EEF2F7]",
        className,
      )}
    >
      {showFallback ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
          <PackageIcon className="h-10 w-10" />
          <span className="text-xs">No image available</span>
          <span className="sr-only">{product.name}</span>
        </div>
      ) : (
        <Image
          src={product.image_url as string}
          alt={product.name}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
