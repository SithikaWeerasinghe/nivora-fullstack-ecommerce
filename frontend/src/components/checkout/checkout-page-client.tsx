"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartIcon } from "@/components/ui/icons";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CheckoutForm } from "./checkout-form";
import { CheckoutOrderSummary } from "./order-summary";

export function CheckoutPageClient() {
  const { user, hydrated: authHydrated } = useAuth();
  const { cart, hydrated: cartHydrated, totals } = useCart();
  const router = useRouter();

  // Checkout is protected: unauthenticated visitors go to login and
  // return here afterwards.
  useEffect(() => {
    if (authHydrated && !user) {
      router.replace("/login?redirect=/checkout");
    }
  }, [authHydrated, user, router]);

  if (!authHydrated || !cartHydrated || !user) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <LoadingSpinner
          className="h-6 w-6 text-primary"
          label="Preparing checkout"
        />
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
          title="Nothing to check out"
          message="Your cart is empty. Add a product before checking out."
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
      <h1 className="text-3xl font-bold tracking-tight text-ink">Checkout</h1>
      <p className="mt-1 text-sm text-muted">
        Confirm your delivery details to place the order.
      </p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        <CheckoutForm user={user} />
        <CheckoutOrderSummary items={items} totals={totals} />
      </div>
    </div>
  );
}
