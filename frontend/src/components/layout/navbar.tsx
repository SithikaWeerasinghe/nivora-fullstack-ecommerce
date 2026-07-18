"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useAuth } from "@/components/providers/auth-provider";
import { useCart } from "@/components/providers/cart-provider";
import { useToast } from "@/components/providers/toast-provider";
import { buttonClasses } from "@/components/ui/button";
import { CartIcon, CloseIcon, MenuIcon, UserIcon } from "@/components/ui/icons";
import { MobileMenu } from "./mobile-menu";
import { Wordmark } from "./wordmark";

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

export function Navbar() {
  const { user, hydrated, logout } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  async function handleLogout() {
    await logout();
    showToast("You have been logged out.", "info");
    router.push("/");
  }

  const productsActive = pathname.startsWith("/products");

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Wordmark />

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          <Link
            href="/products"
            className={cn(
              "flex h-11 items-center rounded-lg px-4 text-sm font-medium transition-colors",
              productsActive
                ? "bg-primary/10 text-primary"
                : "text-ink hover:bg-canvas",
            )}
          >
            Products
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <CartLink onNavigate={closeMenu} />

          {/* Desktop auth cluster */}
          <div className="hidden items-center gap-1.5 md:flex">
            {hydrated ? (
              user ? (
                <>
                  <span className="flex max-w-40 items-center gap-1.5 px-2 text-sm font-medium text-ink">
                    <UserIcon className="h-4 w-4 shrink-0 text-muted" />
                    <span className="truncate">{user.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={buttonClasses("ghost", "sm")}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={buttonClasses("ghost", "sm")}>
                    Login
                  </Link>
                  <Link href="/register" className={buttonClasses("primary", "sm")}>
                    Register
                  </Link>
                </>
              )
            ) : (
              <span className="h-9 w-36" aria-hidden="true" />
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
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

      <MobileMenu open={menuOpen} onClose={closeMenu} onLogout={handleLogout} />
    </header>
  );
}
