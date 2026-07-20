import { apiRequest } from "@/lib/api-client";
import { ApiRequestError } from "@/lib/api-error";
import { getAuthToken } from "@/lib/auth-token";
import type { Cart } from "@/types";

export interface CartMutationResult {
  cart: Cart;
  /** True when the full requested change was applied. */
  ok: boolean;
  /** Units actually added (for add operations). */
  added_quantity?: number;
  /** Explanation when the request was clamped or rejected. */
  message?: string;
}

const EMPTY_CART: Cart = { id: 0, items: [] };

function requireAuth(action: string): void {
  if (!getAuthToken()) {
    throw new ApiRequestError(`Please log in to ${action}.`);
  }
}

/** `GET /api/cart`. Signed-out visitors see an empty cart rather than an error. */
export async function getCart(): Promise<Cart> {
  if (!getAuthToken()) return EMPTY_CART;
  try {
    return await apiRequest<Cart>("/cart", { auth: true });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) return EMPTY_CART;
    throw error;
  }
}

/** `POST /api/cart/items`. */
export async function addCartItem(
  productId: number,
  quantity: number,
): Promise<CartMutationResult> {
  requireAuth("add items to your cart");
  return apiRequest<CartMutationResult>("/cart/items", {
    method: "POST",
    auth: true,
    body: { product_id: productId, quantity },
  });
}

/** `PATCH /api/cart/items/{cartItem}`. */
export async function updateCartItem(
  cartItemId: number,
  quantity: number,
): Promise<CartMutationResult> {
  requireAuth("update your cart");
  return apiRequest<CartMutationResult>(`/cart/items/${cartItemId}`, {
    method: "PATCH",
    auth: true,
    body: { quantity },
  });
}

/** `DELETE /api/cart/items/{cartItem}`. */
export async function removeCartItem(cartItemId: number): Promise<Cart> {
  requireAuth("manage your cart");
  return apiRequest<Cart>(`/cart/items/${cartItemId}`, {
    method: "DELETE",
    auth: true,
  });
}
