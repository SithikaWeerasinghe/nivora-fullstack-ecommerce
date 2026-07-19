"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";

/**
 * Auth-aware quick links for the footer. There is no account page,
 * so the signed-in state offers a real log-out action instead of a
 * placeholder link.
 */
export function FooterAuthLinks({ linkClassName }: { linkClassName: string }) {
  const { user, hydrated, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    showToast("You have been logged out.", "info");
    router.push("/");
  }

  if (hydrated && user) {
    return (
      <li>
        <button
          type="button"
          onClick={handleLogout}
          className={`${linkClassName} cursor-pointer`}
        >
          Log out
        </button>
      </li>
    );
  }

  return (
    <>
      <li>
        <Link href="/login" className={linkClassName}>
          Login
        </Link>
      </li>
      <li>
        <Link href="/register" className={linkClassName}>
          Register
        </Link>
      </li>
    </>
  );
}
