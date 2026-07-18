import { STORAGE_KEYS } from "@/lib/constants";
import { mockDelay } from "@/lib/delay";
import type { Order } from "@/types";
import { readJson, writeJson } from "./storage";

/** Mirrors `GET /api/orders/{orderNumber}`. Resolves null when not found. */
export async function getOrderByNumber(
  orderNumber: string,
): Promise<Order | null> {
  await mockDelay(400);
  const orders = readJson<Order[]>(STORAGE_KEYS.orders, []);
  return orders.find((order) => order.order_number === orderNumber) ?? null;
}

/** Synchronous persistence used internally by the checkout service. */
export function saveOrder(order: Order): void {
  const orders = readJson<Order[]>(STORAGE_KEYS.orders, []);
  writeJson(STORAGE_KEYS.orders, [...orders, order]);
}

/** Readable, unique order number, e.g. NIV-20260718-0001. */
export function generateOrderNumber(): string {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  const datePart = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const sequence = readJson<number>(STORAGE_KEYS.orderSequence, 0) + 1;
  writeJson(STORAGE_KEYS.orderSequence, sequence);
  return `NIV-${datePart}-${String(sequence).padStart(4, "0")}`;
}
