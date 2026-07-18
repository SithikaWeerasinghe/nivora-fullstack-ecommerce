"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getErrorMessage } from "@/lib/api-error";
import { checkout } from "@/services";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input, Textarea } from "@/components/ui/input";
import type { User } from "@/types";

const PHONE_PATTERN = /^[0-9+()\-\s]{7,20}$/;

export function CheckoutForm({ user }: { user: User }) {
  const { refresh } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const [shippingName, setShippingName] = useState(user.name);
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!shippingName.trim() || shippingName.trim().length < 2)
      errors.shipping_name = "Please enter the recipient's full name.";
    if (!shippingPhone.trim())
      errors.shipping_phone = "Phone number is required.";
    else if (!PHONE_PATTERN.test(shippingPhone.trim()))
      errors.shipping_phone = "Enter a valid phone number.";
    if (!shippingAddress.trim() || shippingAddress.trim().length < 10)
      errors.shipping_address = "Please enter your full delivery address.";
    return errors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    const errors = validate();
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const order = await checkout({
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_address: shippingAddress,
      });
      await refresh();
      showToast("Your order has been placed.", "success");
      router.replace(`/orders/${order.order_number}/confirmation`);
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          "We could not place your order. Please try again.",
        ),
      );
      await refresh();
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-line bg-surface p-5 sm:p-6"
    >
      <h2 className="text-lg font-semibold text-ink">Shipping details</h2>

      <div className="mt-4 space-y-4">
        {formError ? (
          <div
            role="alert"
            className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm font-medium text-error"
          >
            {formError}
          </div>
        ) : null}

        <FormField
          id="shipping-name"
          label="Full name"
          error={fieldErrors.shipping_name}
        >
          <Input
            id="shipping-name"
            name="shipping_name"
            type="text"
            autoComplete="name"
            required
            value={shippingName}
            invalid={Boolean(fieldErrors.shipping_name)}
            aria-describedby={
              fieldErrors.shipping_name ? "shipping-name-error" : undefined
            }
            onChange={(event) => setShippingName(event.target.value)}
          />
        </FormField>

        <FormField
          id="shipping-phone"
          label="Phone"
          error={fieldErrors.shipping_phone}
        >
          <Input
            id="shipping-phone"
            name="shipping_phone"
            type="tel"
            autoComplete="tel"
            required
            value={shippingPhone}
            invalid={Boolean(fieldErrors.shipping_phone)}
            aria-describedby={
              fieldErrors.shipping_phone ? "shipping-phone-error" : undefined
            }
            onChange={(event) => setShippingPhone(event.target.value)}
          />
        </FormField>

        <FormField
          id="shipping-address"
          label="Delivery address"
          error={fieldErrors.shipping_address}
        >
          <Textarea
            id="shipping-address"
            name="shipping_address"
            rows={3}
            autoComplete="street-address"
            required
            value={shippingAddress}
            invalid={Boolean(fieldErrors.shipping_address)}
            aria-describedby={
              fieldErrors.shipping_address
                ? "shipping-address-error"
                : undefined
            }
            onChange={(event) => setShippingAddress(event.target.value)}
          />
        </FormField>

        <Button type="submit" className="w-full" isLoading={submitting}>
          {submitting ? "Placing order…" : "Place Order"}
        </Button>
        <p className="text-center text-xs text-muted">
          Prices and stock are confirmed again when your order is placed.
        </p>
      </div>
    </form>
  );
}
