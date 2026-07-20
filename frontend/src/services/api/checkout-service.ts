import { apiRequest } from "@/lib/api-client";
import type { CheckoutInput, Order } from "@/types";

/**
 * `POST /api/checkout`. Prices and stock are re-verified server-side in a
 * single transaction — the client never trusts its own cart totals.
 */
export async function checkout(input: CheckoutInput): Promise<Order> {
  return apiRequest<Order>("/checkout", {
    method: "POST",
    auth: true,
    body: input,
  });
}
