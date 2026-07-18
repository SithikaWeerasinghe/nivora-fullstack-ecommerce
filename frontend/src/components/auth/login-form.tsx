"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/api-error";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { EMAIL_PATTERN, safeRedirectPath } from "./redirect";

export function LoginForm() {
  const { user, hydrated, login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect");
  const redirectTo = safeRedirectPath(redirectParam);
  const registerHref = redirectParam
    ? `/register?redirect=${encodeURIComponent(redirectParam)}`
    : "/register";

  // Already logged in — skip the form.
  useEffect(() => {
    if (hydrated && user) router.replace(redirectTo);
  }, [hydrated, user, router, redirectTo]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email.trim()))
      errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
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
      const loggedIn = await login({ email: email.trim(), password });
      showToast(`Welcome back, ${loggedIn.name}.`, "success");
      router.replace(redirectTo);
    } catch (error) {
      setFormError(getErrorMessage(error, "Login failed. Please try again."));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
      {formError ? (
        <div
          role="alert"
          className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm font-medium text-error"
        >
          {formError}
        </div>
      ) : null}

      <FormField id="login-email" label="Email" error={fieldErrors.email}>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>

      <FormField id="login-password" label="Password" error={fieldErrors.password}>
        <div className="relative">
          <Input
            id="login-password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            className="pr-12"
            value={password}
            invalid={Boolean(fieldErrors.password)}
            aria-describedby={
              fieldErrors.password ? "login-password-error" : undefined
            }
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:text-ink"
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </FormField>

      <Button type="submit" className="w-full" isLoading={submitting}>
        {submitting ? "Logging in…" : "Log in"}
      </Button>

      <p className="text-center text-sm text-muted">
        New to Nivora?{" "}
        <Link
          href={registerHref}
          className="font-medium text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>

      <div className="rounded-lg border border-line bg-canvas px-4 py-3 text-xs text-muted">
        <p className="font-semibold text-ink">Demo account (assessment only)</p>
        <p className="mt-1">
          Email: customer@nivora.test · Password: password
        </p>
      </div>
    </form>
  );
}
