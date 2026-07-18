import { findProductById } from "@/data/mock-products";
import { ApiRequestError } from "@/lib/api-error";
import { mockDelay } from "@/lib/delay";
import { centsToPrice, toCents } from "@/lib/format";
import type { CheckoutInput, Order, OrderItem } from "@/types";
import { readSession } from "./auth-service";
import { clearCartStorage, readCartSnapshot } from "./cart-service";
import { generateOrderNumber, saveOrder } from "./order-service";

/**
 * Mirrors `POST /api/checkout`. Client-side cart totals are never
 * trusted: every price is re-read from the catalogue and stock is
 * re-checked before the order is created — the same contract the
 * Laravel checkout transaction will enforce.
 */
export async function checkout(input: CheckoutInput): Promise<Order> {
  await mockDelay(750);

  const session = readSession();
  if (!session) {
    throw new ApiRequestError("Please log in to place an order.");
  }

  if (
    !input.shipping_name.trim() ||
    !input.shipping_phone.trim() ||
    !input.shipping_address.trim()
  ) {
    throw new ApiRequestError("Please complete all shipping details.");
  }

  const cart = readCartSnapshot();
  if (cart.items.length === 0) {
    throw new ApiRequestError("Your cart is empty.");
  }

  let subtotalCents = 0;
  const orderItems: OrderItem[] = cart.items.map((item, index) => {
    const product = findProductById(item.product_id);
    if (!product) {
      throw new ApiRequestError(
        `${item.product.name} is no longer available. Please review your cart.`,
      );
    }
    if (item.quantity > product.stock) {
      throw new ApiRequestError(
        `Only ${product.stock} of ${product.name} ${product.stock === 1 ? "is" : "are"} currently in stock. Please adjust your cart.`,
      );
    }
    const lineCents = toCents(product.price) * item.quantity;
    subtotalCents += lineCents;
    return {
      id: index + 1,
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
      line_total: centsToPrice(lineCents),
    };
  });

  const order: Order = {
    id: Date.now(),
    user_id: session.user.id,
    order_number: generateOrderNumber(),
    status: "confirmed",
    subtotal: centsToPrice(subtotalCents),
    total_amount: centsToPrice(subtotalCents),
    shipping_name: input.shipping_name.trim(),
    shipping_phone: input.shipping_phone.trim(),
    shipping_address: input.shipping_address.trim(),
    items: orderItems,
    created_at: new Date().toISOString(),
  };

  saveOrder(order);
  clearCartStorage();
  return order;
}
