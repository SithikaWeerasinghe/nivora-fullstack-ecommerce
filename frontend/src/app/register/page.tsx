import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Register",
  description: "Create your Nivora account.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted">
          Register to add products to your cart and check out.
        </p>
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <LoadingSpinner label="Loading registration form" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
