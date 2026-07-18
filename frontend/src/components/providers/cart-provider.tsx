"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { calculateCartTotals, type CartTotals } from "@/lib/cart-math";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartItem,
  type CartMutationResult,
} from "@/services";
import type { Cart } from "@/types";

/**
 * Client cart state backed by the cart service. Persistence and stock
 * rules live in the service; this provider only holds the current cart
 * and exposes actions, so it survives the switch to the Laravel API.
 */

interface CartContextValue {
  cart: Cart | null;
  /** False until the persisted cart has been read on the client. */
  hydrated: boolean;
  totals: CartTotals;
  addItem: (productId: number, quantity: number) => Promise<CartMutationResult>;
  updateItem: (
    cartItemId: number,
    quantity: number,
  ) => Promise<CartMutationResult>;
  removeItem: (cartItemId: number) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    getCart().then((initialCart) => {
      if (active) {
        setCart(initialCart);
        setHydrated(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const addItem = useCallback(async (productId: number, quantity: number) => {
    const result = await addCartItem(productId, quantity);
    setCart(result.cart);
    return result;
  }, []);

  const updateItem = useCallback(
    async (cartItemId: number, quantity: number) => {
      const result = await updateCartItem(cartItemId, quantity);
      setCart(result.cart);
      return result;
    },
    [],
  );

  const removeItem = useCallback(async (cartItemId: number) => {
    const nextCart = await removeCartItem(cartItemId);
    setCart(nextCart);
  }, []);

  const refresh = useCallback(async () => {
    setCart(await getCart());
  }, []);

  const totals = useMemo(
    () => calculateCartTotals(cart?.items ?? []),
    [cart],
  );

  return (
    <CartContext.Provider
      value={{ cart, hydrated, totals, addItem, updateItem, removeItem, refresh }}
    >
      {children}
    </CartContext.Provider>
  );
}
