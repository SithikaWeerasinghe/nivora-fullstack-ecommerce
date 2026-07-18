import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your Nivora account.",
};

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
      <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted">Log in to continue shopping.</p>
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <LoadingSpinner label="Loading login form" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
