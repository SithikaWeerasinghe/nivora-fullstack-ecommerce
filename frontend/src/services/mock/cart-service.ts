import { findProductById } from "@/data/mock-products";
import { ApiRequestError } from "@/lib/api-error";
import { STORAGE_KEYS } from "@/lib/constants";
import { mockDelay } from "@/lib/delay";
import type { Cart } from "@/types";
import { readJson, writeJson } from "./storage";

/**
 * Mock cart persistence and rules. Mirrors the future cart endpoints:
 * duplicate additions merge into one line, and no line may ever exceed
 * the product's current stock.
 */

interface StoredCartItem {
  id: number;
  product_id: number;
  quantity: number;
}

interface StoredCart {
  id: number;
  items: StoredCartItem[];
  next_item_id: number;
}

export interface CartMutationResult {
  cart: Cart;
  /** True when the full requested change was applied. */
  ok: boolean;
  /** Units actually added (for add operations). */
  added_quantity?: number;
  /** Explanation when the request was clamped or rejected. */
  message?: string;
}

function emptyStoredCart(): StoredCart {
  return { id: 1, items: [], next_item_id: 1 };
}

function loadStoredCart(): StoredCart {
  return readJson<StoredCart>(STORAGE_KEYS.cart, emptyStoredCart());
}

function persist(stored: StoredCart): void {
  writeJson(STORAGE_KEYS.cart, stored);
}

/** Resolves stored lines against the catalogue, dropping vanished products. */
function toCart(stored: StoredCart): Cart {
  const items = stored.items.flatMap((item) => {
    const product = findProductById(item.product_id);
    return product
      ? [{ id: item.id, product_id: item.product_id, quantity: item.quantity, product }]
      : [];
  });
  return { id: stored.id, items };
}

/** Synchronous snapshot used internally by the checkout service. */
export function readCartSnapshot(): Cart {
  return toCart(loadStoredCart());
}

/** Synchronous clear used internally by the checkout service. */
export function clearCartStorage(): void {
  persist(emptyStoredCart());
}

export async function getCart(): Promise<Cart> {
  await mockDelay(250);
  return readCartSnapshot();
}

export async function addCartItem(
  productId: number,
  quantity: number,
): Promise<CartMutationResult> {
  await mockDelay(300);
  const product = findProductById(productId);
  if (!product) {
    throw new ApiRequestError("This product is no longer available.");
  }

  const stored = loadStoredCart();
  if (product.stock <= 0) {
    return {
      cart: toCart(stored),
      ok: false,
      added_quantity: 0,
      message: `${product.name} is out of stock.`,
    };
  }

  const existing = stored.items.find((item) => item.product_id === productId);
  const currentQuantity = existing?.quantity ?? 0;
  const room = product.stock - currentQuantity;
  if (room <= 0) {
    return {
      cart: toCart(stored),
      ok: false,
      added_quantity: 0,
      message: `Your cart already has the maximum available quantity of ${product.name}.`,
    };
  }

  const added = Math.min(quantity, room);
  if (existing) {
    existing.quantity += added;
  } else {
    stored.items.push({
      id: stored.next_item_id,
      product_id: productId,
      quantity: added,
    });
    stored.next_item_id += 1;
  }
  persist(stored);

  return {
    cart: toCart(stored),
    ok: added === quantity,
    added_quantity: added,
    message:
      added === quantity
        ? undefined
        : `Only ${added} more ${added === 1 ? "unit" : "units"} of ${product.name} could be added — stock limit reached.`,
  };
}

export async function updateCartItem(
  cartItemId: number,
  quantity: number,
): Promise<CartMutationResult> {
  await mockDelay(250);
  const stored = loadStoredCart();
  const item = stored.items.find((entry) => entry.id === cartItemId);
  if (!item) {
    throw new ApiRequestError("This cart item no longer exists.");
  }
  const product = findProductById(item.product_id);
  if (!product) {
    throw new ApiRequestError("This product is no longer available.");
  }

  const requested = Math.max(1, Math.floor(quantity));
  const clamped = Math.min(requested, Math.max(product.stock, 1));
  item.quantity = clamped;
  persist(stored);

  return {
    cart: toCart(stored),
    ok: clamped === requested,
    message:
      clamped === requested
        ? undefined
        : `Only ${product.stock} of ${product.name} ${product.stock === 1 ? "is" : "are"} available.`,
  };
}

export async function removeCartItem(cartItemId: number): Promise<Cart> {
  await mockDelay(250);
  const stored = loadStoredCart();
  stored.items = stored.items.filter((entry) => entry.id !== cartItemId);
  persist(stored);
  return toCart(stored);
}
