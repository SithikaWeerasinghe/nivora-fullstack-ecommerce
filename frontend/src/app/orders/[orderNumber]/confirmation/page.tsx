import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/orders/order-confirmation-client";

interface ConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
}

export const metadata: Metadata = {
  title: "Order confirmation",
  description: "Your Nivora order summary.",
};

export default async function OrderConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { orderNumber } = await params;
  return <OrderConfirmation orderNumber={decodeURIComponent(orderNumber)} />;
}
