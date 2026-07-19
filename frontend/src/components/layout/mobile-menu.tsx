"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { SearchIcon, UserIcon } from "@/components/ui/icons";
import type { Category } from "@/types";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
  categories: Category[];
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled])';

const linkClasses =
  "flex h-12 items-center justify-between rounded-lg px-3 text-base font-medium text-ink transition-colors hover:bg-canvas";

export function MobileMenu({
  open,
  onClose,
  onLogout,
  categories,
  triggerRef,
}: MobileMenuProps) {
  const { user, hydrated } = useAuth();
  const { totals, hydrated: cartHydrated } = useCart();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Escape closes the menu and returns focus to the trigger; Tab is
  // trapped inside the panel so focus never lands on obscured page
  // content behind the scrim. Background scroll is locked while open.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
        return;
      }
      if (event.key === "Tab" && navRef.current) {
        const focusable = navRef.current.querySelectorAll<HTMLElement>(
          FOCUSABLE_SELECTOR,
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  const count = totals.itemCount;

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchInputRef.current?.value.trim() ?? "";
    onClose();
    router.push(
      query ? `/products?search=${encodeURIComponent(query)}` : "/products",
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-16 z-30 md:hidden">
      <div
        className="absolute inset-0 bg-ink/30"
        aria-hidden="true"
        onClick={onClose}
      />
      <nav
        ref={navRef}
        id="mobile-menu"
        aria-label="Mobile navigation"
        className="relative max-h-full overflow-y-auto overscroll-contain border-b border-line bg-surface px-4 pt-4 shadow-lg [padding-bottom:max(1rem,env(safe-area-inset-bottom))]"
      >
        <form
          role="search"
          aria-label="Search products"
          onSubmit={handleSearchSubmit}
          className="flex gap-2"
        >
          <label htmlFor="mobile-search-input" className="sr-only">
            Search products
          </label>
          <input
            ref={searchInputRef}
            id="mobile-search-input"
            type="search"
            placeholder="Search products…"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full min-w-0 rounded-lg border border-line bg-canvas px-3.5 text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Search"
            className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary-hover"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </form>

        <ul className="mt-3 space-y-1">
          <li>
            <Link
              ref={firstLinkRef}
              href="/"
              onClick={onClose}
              className={linkClasses}
            >
              Home
            </Link>
          </li>
          <li>
            <Link href="/products" onClick={onClose} className={linkClasses}>
              Shop All
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

        <p className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-muted">
          Categories
        </p>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/products?category=${category.slug}`}
                onClick={onClose}
                className={linkClasses}
              >
                {category.name}
              </Link>
            </li>
          ))}
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
                  triggerRef.current?.focus();
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
