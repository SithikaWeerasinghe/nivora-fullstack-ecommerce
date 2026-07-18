import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import { buttonClasses } from "@/components/ui/button";
import { CheckCircleIcon } from "@/components/ui/icons";
import type { Order } from "@/types";

export function OrderConfirmationCard({ order }: { order: Order }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircleIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-ink">
            Thank you — your order is confirmed
          </h1>
          <p className="mt-1 text-sm text-muted">
            Placed on {formatDate(order.created_at)}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm">
            <p className="max-w-full">
              <span className="text-muted">Order number: </span>
              <span className="break-all font-semibold text-ink">
                {order.order_number}
              </span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-muted">Status:</span>
              <span className="inline-flex rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium capitalize text-success">
                {order.status}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            Items
          </h2>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium text-ink">{item.product_name}</p>
                  <p className="mt-0.5 text-muted">
                    {formatPrice(item.unit_price)} × {item.quantity}
                  </p>
                </div>
                <p className="whitespace-nowrap font-medium text-ink">
                  {formatPrice(item.line_total)}
                </p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-medium text-ink">
                {formatPrice(order.subtotal)}
              </dd>
            </div>
            <div className="flex items-center justify-between text-base font-semibold text-ink">
              <dt>Total</dt>
              <dd>{formatPrice(order.total_amount)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 rounded-lg bg-canvas p-4 text-sm">
          <h2 className="font-semibold text-ink">Delivery details</h2>
          <p className="mt-1.5 text-ink">{order.shipping_name}</p>
          <p className="text-muted">{order.shipping_phone}</p>
          <p className="whitespace-pre-line text-muted">
            {order.shipping_address}
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href="/products" className={buttonClasses("primary", "lg")}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
