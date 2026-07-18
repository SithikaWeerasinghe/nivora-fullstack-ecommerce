"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { UserIcon } from "@/components/ui/icons";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const linkClasses =
  "flex h-12 items-center justify-between rounded-lg px-3 text-base font-medium text-ink transition-colors hover:bg-canvas";

export function MobileMenu({ open, onClose, onLogout }: MobileMenuProps) {
  const { user, hydrated } = useAuth();
  const { totals, hydrated: cartHydrated } = useCart();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Escape closes the menu; background scroll is locked while open.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const count = totals.itemCount;

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-30 md:hidden">
      <div
        className="absolute inset-0 bg-ink/30"
        aria-hidden="true"
        onClick={onClose}
      />
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        className="relative border-b border-line bg-surface px-4 py-4 shadow-lg"
      >
        <ul className="space-y-1">
          <li>
            <Link
              ref={firstLinkRef}
              href="/products"
              onClick={onClose}
              className={linkClasses}
            >
              Products
            </Link>
          </li>
          <li>
            <Link href="/cart" onClick={onClose} className={linkClasses}>
              Cart
              {cartHydrated && count > 0 ? (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </Link>
          </li>
        </ul>

        <div className="mt-3 border-t border-line pt-3">
          {hydrated && user ? (
            <>
              <p className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted">
                <UserIcon className="h-4 w-4" />
                {user.name}
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex h-12 w-full cursor-pointer items-center rounded-lg px-3 text-base font-medium text-ink transition-colors hover:bg-canvas"
              >
                Log out
              </button>
            </>
          ) : (
            <ul className="space-y-1">
              <li>
                <Link href="/login" onClick={onClose} className={linkClasses}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" onClick={onClose} className={linkClasses}>
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
