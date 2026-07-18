"use client";

import { useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/api-error";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button, type ButtonSize } from "@/components/ui/button";
import { CartIcon, CheckIcon } from "@/components/ui/icons";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
  size?: ButtonSize;
  className?: string;
  /** Called after a successful (full or partial) addition. */
  onAdded?: () => void;
}

/**
 * Add-to-cart with immediate feedback. The busy state prevents
 * double-click duplicates; merge and stock-cap rules live in the cart
 * service, and clamped requests surface as a toast.
 */
export function AddToCartButton({
  product,
  quantity = 1,
  size = "md",
  className,
  onAdded,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const outOfStock = product.stock <= 0;

  async function handleAdd() {
    if (state !== "idle" || outOfStock) return;
    setState("adding");
    try {
      const result = await addItem(product.id, quantity);
      if (result.added_quantity && result.added_quantity > 0) {
        setState("added");
        onAdded?.();
        if (result.message) showToast(result.message, "info");
        resetTimerRef.current = window.setTimeout(() => setState("idle"), 1800);
      } else {
        setState("idle");
        showToast(
          result.message ?? "This product could not be added to your cart.",
          "info",
        );
      }
    } catch (error) {
      setState("idle");
      showToast(
        getErrorMessage(error, "Could not add this product to your cart."),
        "error",
      );
    }
  }

  return (
    <Button
      size={size}
      className={className}
      onClick={handleAdd}
      disabled={outOfStock}
      isLoading={state === "adding"}
    >
      {outOfStock ? (
        "Out of stock"
      ) : state === "added" ? (
        <>
          <CheckIcon className="h-4 w-4" />
          Added
        </>
      ) : state === "adding" ? (
        "Adding…"
      ) : (
        <>
          <CartIcon className="h-4 w-4" />
          Add to cart
        </>
      )}
    </Button>
  );
}
