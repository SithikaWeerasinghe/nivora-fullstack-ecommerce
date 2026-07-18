"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrderByNumber } from "@/services";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { ReceiptIcon } from "@/components/ui/icons";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { OrderConfirmationCard } from "./order-confirmation-card";
import type { Order } from "@/types";

export function OrderConfirmation({ orderNumber }: { orderNumber: string }) {
  const [reloadKey, setReloadKey] = useState(0);
  // Loading is derived: a stored result tagged with another key is stale.
  const loadKey = `${orderNumber}|${reloadKey}`;
  const [loaded, setLoaded] = useState<{
    key: string;
    order: Order | null;
    failed: boolean;
  }>({ key: "", order: null, failed: false });

  useEffect(() => {
    let active = true;
    getOrderByNumber(orderNumber)
      .then((result) => {
        if (active) setLoaded({ key: loadKey, order: result, failed: false });
      })
      .catch(() => {
        if (active) setLoaded({ key: loadKey, order: null, failed: true });
      });
    return () => {
      active = false;
    };
  }, [orderNumber, loadKey]);

  const isCurrent = loaded.key === loadKey;
  const hasError = isCurrent && loaded.failed;
  // undefined = loading, null = not found
  const order: Order | null | undefined = isCurrent ? loaded.order : undefined;

  if (hasError) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <ErrorState
          message="Your order could not be retrieved right now."
          onRetry={() => setReloadKey((key) => key + 1)}
        />
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center py-24">
        <LoadingSpinner
          className="h-6 w-6 text-primary"
          label="Retrieving your order"
        />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <EmptyState
          as="h1"
          icon={<ReceiptIcon className="h-7 w-7" />}
          title="Order not found"
          message={`We could not find an order with the number ${orderNumber}.`}
        >
          <Link href="/products" className={buttonClasses("primary")}>
            Browse Products
          </Link>
        </EmptyState>
      </div>
    );
  }

  return <OrderConfirmationCard order={order} />;
}
