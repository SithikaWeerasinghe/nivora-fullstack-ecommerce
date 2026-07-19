"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/providers/toast-provider";
import { CartIcon, CloseIcon, MenuIcon } from "@/components/ui/icons";
import { AccountMenu } from "./account-menu";
import { CategoriesDropdown } from "./categories-dropdown";
import { MobileMenu } from "./mobile-menu";
import { NavSearch } from "./nav-search";
import { Wordmark } from "./wordmark";
import type { Category } from "@/types";

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** Lightweight scroll flag: re-renders only when the boolean flips. */
function useScrolled(): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );
}

function CartLink({ onNavigate }: { onNavigate?: () => void }) {
  const { totals, hydrated } = useCart();
  const count = totals.itemCount;
  return (
    <Link
      href="/cart"
      onClick={onNavigate}
      aria-label={
        hydrated && count > 0
          ? `Cart, ${count} ${count === 1 ? "item" : "items"}`
          : "Cart"
      }
      className="relative flex h-11 w-11 items-center justify-center rounded-lg text-ink transition-colors hover:bg-canvas"
    >
      <CartIcon className="h-6 w-6" />
      {hydrated && count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

export function Navbar({ categories }: { categories: Category[] }) {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  // The pathname travels with the open flag so a route change (e.g.
  // browser back/forward, which doesn't fire a Link onClick) implicitly
  // closes the menu on the next render — a derived comparison instead of
  // a setState-in-effect.
  const [menuRequest, setMenuRequest] = useState<{
    open: boolean;
    pathname: string;
  }>({ open: false, pathname });
  const menuOpen = menuRequest.open && menuRequest.pathname === pathname;
  const scrolled = useScrolled();
  // Stable identity: MobileMenu depends on this in an effect, and an
  // unstable callback there would re-run the effect (and steal focus
  // back to the first link) on every unrelated Navbar re-render.
  const closeMenu = useCallback(
    () => setMenuRequest((state) => ({ ...state, open: false })),
    [],
  );
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  async function handleLogout() {
    await logout();
    showToast("You have been logged out.", "info");
    router.push("/");
  }

  const homeActive = pathname === "/";
  const shopActive = pathname.startsWith("/products");

  const navLinkClasses = (active: boolean) =>
    cn(
      "flex h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors duration-200",
      active ? "bg-primary/10 text-primary" : "text-ink hover:bg-canvas",
    );

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-200",
        scrolled
          ? "border-line bg-surface/95 shadow-sm"
          : "border-line/70 bg-surface/80",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Wordmark />

        <nav
          aria-label="Main navigation"
          className="mx-auto hidden items-center gap-1 md:flex"
        >
          <Link href="/" className={navLinkClasses(homeActive)}>
            Home
          </Link>
          <Link href="/products" className={navLinkClasses(shopActive)}>
            Shop All
          </Link>
          <CategoriesDropdown categories={categories} />
        </nav>

        <div className="ml-auto flex items-center gap-0.5 md:ml-0 md:gap-1">
          <div className="hidden md:block">
            <NavSearch />
          </div>
          <div className="hidden md:block">
            <AccountMenu onLogout={handleLogout} />
          </div>
          <CartLink onNavigate={closeMenu} />

          {/* Mobile menu trigger */}
          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setMenuRequest({ open: !menuOpen, pathname })}
            aria-expanded={menuOpen}
            aria-controls={menuOpen ? "mobile-menu" : undefined}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-ink transition-colors hover:bg-canvas md:hidden"
          >
            {menuOpen ? (
              <CloseIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        onLogout={handleLogout}
        categories={categories}
        triggerRef={menuTriggerRef}
      />
    </header>
  );
}
