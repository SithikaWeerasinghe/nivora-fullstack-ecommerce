import type { CartItem } from "@/types";
import { toCents } from "./format";

export interface CartTotals {
  itemCount: number;
  subtotalCents: number;
  totalCents: number;
}

export function lineTotalCents(item: CartItem): number {
  return toCents(item.product.price) * item.quantity;
}

/** Single source of truth for cart arithmetic (subtotal equals total: no tax or shipping). */
export function calculateCartTotals(items: CartItem[]): CartTotals {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = items.reduce(
    (sum, item) => sum + lineTotalCents(item),
    0,
  );
  return { itemCount, subtotalCents, totalCents: subtotalCents };
}
