"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getErrorMessage, isApiRequestError } from "@/lib/api-error";
import { MIN_PASSWORD_LENGTH } from "@/lib/constants";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { EMAIL_PATTERN, safeRedirectPath } from "./redirect";

export function RegisterForm() {
  const { user, hydrated, register } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectParam = searchParams.get("redirect");
  const redirectTo = safeRedirectPath(redirectParam);
  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  // Already logged in — skip the form.
  useEffect(() => {
    if (hydrated && user) router.replace(redirectTo);
  }, [hydrated, user, router, redirectTo]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    else if (!EMAIL_PATTERN.test(email.trim()))
      errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    else if (password.length < MIN_PASSWORD_LENGTH)
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (!passwordConfirmation)
      errors.password_confirmation = "Please confirm your password.";
    else if (password && passwordConfirmation !== password)
      errors.password_confirmation = "Passwords do not match.";
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
      const registered = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: passwordConfirmation,
      });
      showToast(`Welcome to Nivora, ${registered.name}.`, "success");
      router.replace(redirectTo);
    } catch (error) {
      if (isApiRequestError(error) && error.errors) {
        const mapped: Record<string, string> = {};
        for (const [field, messages] of Object.entries(error.errors)) {
          if (messages.length > 0) mapped[field] = messages[0];
        }
        setFieldErrors(mapped);
      } else {
        setFormError(
          getErrorMessage(error, "Registration failed. Please try again."),
        );
      }
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

      <FormField id="register-name" label="Name" error={fieldErrors.name}>
        <Input
          id="register-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? "register-name-error" : undefined}
          onChange={(event) => setName(event.target.value)}
        />
      </FormField>

      <FormField id="register-email" label="Email" error={fieldErrors.email}>
        <Input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          invalid={Boolean(fieldErrors.email)}
          aria-describedby={
            fieldErrors.email ? "register-email-error" : undefined
          }
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>

      <FormField
        id="register-password"
        label="Password"
        error={fieldErrors.password}
        hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
      >
        <Input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          invalid={Boolean(fieldErrors.password)}
          aria-describedby={
            fieldErrors.password
              ? "register-password-error"
              : "register-password-hint"
          }
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>

      <FormField
        id="register-password-confirmation"
        label="Confirm password"
        error={fieldErrors.password_confirmation}
      >
        <Input
          id="register-password-confirmation"
          name="password_confirmation"
          type="password"
          autoComplete="new-password"
          required
          value={passwordConfirmation}
          invalid={Boolean(fieldErrors.password_confirmation)}
          aria-describedby={
            fieldErrors.password_confirmation
              ? "register-password-confirmation-error"
              : undefined
          }
          onChange={(event) => setPasswordConfirmation(event.target.value)}
        />
      </FormField>

      <Button type="submit" className="w-full" isLoading={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={loginHref}
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
