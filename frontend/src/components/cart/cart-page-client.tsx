"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/cart-provider";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartIcon } from "@/components/ui/icons";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CartItemRow } from "./cart-item";
import { CartSummary } from "./cart-summary";

export function CartPageClient() {
  const { cart, hydrated, totals } = useCart();

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <LoadingSpinner className="h-6 w-6 text-primary" label="Loading your cart" />
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <EmptyState
          as="h1"
          icon={<CartIcon className="h-7 w-7" />}
          title="Your cart is empty"
          message="Products you add will appear here, ready for checkout."
        >
          <Link href="/products" className={buttonClasses("primary")}>
            Browse Products
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Your cart</h1>
      <p className="mt-1 text-sm text-muted">
        {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} in your
        cart
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
        <ul className="divide-y divide-line rounded-xl border border-line bg-surface px-4 sm:px-5">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </ul>
        <CartSummary />
      </div>
    </div>
  );
}
