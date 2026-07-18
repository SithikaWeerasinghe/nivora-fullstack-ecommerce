import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/cart-page-client";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review and update the products in your Nivora cart.",
};

export default function CartPage() {
  return <CartPageClient />;
}
