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

/** Minimal active/hover indicator: a growing underline instead of a filled block. */
function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-11 items-center px-1 text-sm font-medium transition-colors duration-300 ease-out",
        active ? "text-primary" : "text-ink hover:text-primary",
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-primary transition-transform duration-300 ease-out motion-reduce:transition-none",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
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
  // Transparent glass only makes sense while the homepage hero is showing
  // behind it; every other route (and the homepage once scrolled) gets the
  // solid surface so text always has a guaranteed-light background.
  const overHero = homeActive && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300",
        overHero
          ? "border-white/25 bg-white/15 shadow-none"
          : "border-line bg-surface/95 shadow-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Wordmark />

        <nav
          aria-label="Main navigation"
          className="mx-auto hidden items-center gap-6 md:flex"
        >
          <NavLink href="/" active={homeActive}>
            Home
          </NavLink>
          <NavLink href="/products" active={shopActive}>
            Shop All
          </NavLink>
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
