"use client";

import Link from "next/link";
import { useState } from "react";
import { getErrorMessage } from "@/lib/api-error";
import { lineTotalCents } from "@/lib/cart-math";
import { formatCents, formatPrice } from "@/lib/format";
import { getStockLevel } from "@/lib/stock";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/providers/toast-provider";
import { TrashIcon } from "@/components/ui/icons";
import { ProductImage } from "@/components/products/product-image";
import { QuantitySelector } from "@/components/products/quantity-selector";
import { StockBadge } from "@/components/products/stock-badge";
import type { CartItem } from "@/types";

export function CartItemRow({ item }: { item: CartItem }) {
  const { updateItem, removeItem } = useCart();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  const detailsHref = `/products/${item.product.slug}`;
  const showStockNote = getStockLevel(item.product.stock) !== "in_stock";

  async function handleQuantityChange(quantity: number) {
    if (pending || quantity === item.quantity) return;
    setPending(true);
    try {
      const result = await updateItem(item.id, quantity);
      if (!result.ok && result.message) {
        showToast(result.message, "info");
      }
    } catch (error) {
      showToast(
        getErrorMessage(error, "Could not update the quantity."),
        "error",
      );
    } finally {
      setPending(false);
    }
  }

  async function handleRemove() {
    if (pending) return;
    setPending(true);
    try {
      await removeItem(item.id);
      showToast(`Removed ${item.product.name} from your cart.`, "info");
    } catch (error) {
      setPending(false);
      showToast(
        getErrorMessage(error, "Could not remove this item."),
        "error",
      );
    }
  }

  return (
    <li className="flex gap-4 py-5">
      <Link href={detailsHref} className="shrink-0" tabIndex={-1} aria-hidden="true">
        <ProductImage
          product={item.product}
          sizes="112px"
          className="w-24 rounded-lg border border-line sm:w-28"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium leading-snug text-ink">
              <Link
                href={detailsHref}
                className="rounded transition-colors hover:text-primary"
              >
                {item.product.name}
              </Link>
            </p>
            <p className="mt-0.5 text-sm text-muted">
              {formatPrice(item.product.price)} each
            </p>
            {showStockNote ? (
              <div className="mt-1.5">
                <StockBadge stock={item.product.stock} />
              </div>
            ) : null}
          </div>
          <p className="whitespace-nowrap font-semibold text-ink">
            {formatCents(lineTotalCents(item))}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector
            value={item.quantity}
            max={item.product.stock}
            onChange={handleQuantityChange}
            disabled={pending}
            label={`Quantity for ${item.product.name}`}
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={pending}
            aria-label={`Remove ${item.product.name} from cart`}
            className="inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-sm font-medium text-muted transition-colors hover:bg-error/5 hover:text-error disabled:cursor-not-allowed disabled:opacity-50"
          >
            <TrashIcon className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
