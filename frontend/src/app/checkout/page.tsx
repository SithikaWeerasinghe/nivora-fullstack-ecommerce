import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/checkout/checkout-page-client";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Nivora order.",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
