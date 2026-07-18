"use client";

import { lineTotalCents } from "@/lib/cart-math";
import type { CartTotals } from "@/lib/cart-math";
import { formatCents, formatPrice } from "@/lib/format";
import type { CartItem } from "@/types";

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  totals: CartTotals;
}

export function CheckoutOrderSummary({ items, totals }: CheckoutOrderSummaryProps) {
  return (
    <aside
      aria-label="Order summary"
      className="rounded-xl border border-line bg-surface p-5 sm:p-6 lg:sticky lg:top-24"
    >
      <h2 className="text-lg font-semibold text-ink">Order summary</h2>
      <ul className="mt-4 divide-y divide-line">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-3 py-3 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">
                {item.product.name}
              </p>
              <p className="mt-0.5 text-muted">
                {formatPrice(item.product.price)} × {item.quantity}
              </p>
            </div>
            <p className="whitespace-nowrap font-medium text-ink">
              {formatCents(lineTotalCents(item))}
            </p>
          </li>
        ))}
      </ul>
      <dl className="mt-2 space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium text-ink">
            {formatCents(totals.subtotalCents)}
          </dd>
        </div>
        <div className="flex items-center justify-between text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd>{formatCents(totals.totalCents)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted">
        No tax or shipping charges apply.
      </p>
    </aside>
  );
}
