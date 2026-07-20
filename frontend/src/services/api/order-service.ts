import { apiRequest } from "@/lib/api-client";
import { ApiRequestError } from "@/lib/api-error";
import { getAuthToken } from "@/lib/auth-token";
import type { Order } from "@/types";

/** `GET /api/orders/{orderNumber}`. Resolves null when not found or signed out. */
export async function getOrderByNumber(
  orderNumber: string,
): Promise<Order | null> {
  if (!getAuthToken()) return null;
  try {
    return await apiRequest<Order>(
      `/orders/${encodeURIComponent(orderNumber)}`,
      { auth: true },
    );
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}
