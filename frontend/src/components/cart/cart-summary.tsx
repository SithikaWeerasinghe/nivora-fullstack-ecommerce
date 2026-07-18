"use client";

import Link from "next/link";
import { formatCents } from "@/lib/format";
import { useCart } from "@/components/providers/cart-provider";
import { buttonClasses } from "@/components/ui/button";

export function CartSummary() {
  const { totals } = useCart();

  return (
    <aside
      aria-label="Order summary"
      className="rounded-xl border border-line bg-surface p-5 sm:p-6 lg:sticky lg:top-24"
    >
      <h2 className="text-lg font-semibold text-ink">Order summary</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Items</dt>
          <dd className="font-medium text-ink">{totals.itemCount}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-medium text-ink">
            {formatCents(totals.subtotalCents)}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-3 text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd>{formatCents(totals.totalCents)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted">
        No tax or shipping charges apply.
      </p>
      <div className="mt-5 space-y-3">
        <Link
          href="/checkout"
          className={buttonClasses("primary", "md", "w-full")}
        >
          Proceed to Checkout
        </Link>
        <Link
          href="/products"
          className={buttonClasses("outline", "md", "w-full")}
        >
          Continue Shopping
        </Link>
      </div>
    </aside>
  );
}
