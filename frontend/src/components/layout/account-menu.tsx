"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { useDismissableMenu } from "@/lib/use-dismissable-menu";
import { useAuth } from "@/components/providers/auth-provider";
import { ChevronDownIcon, UserIcon } from "@/components/ui/icons";

const itemClasses =
  "flex h-11 w-full items-center rounded-lg px-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-canvas hover:text-primary";

export function AccountMenu({ onLogout }: { onLogout: () => void }) {
  const { user, hydrated } = useAuth();
  const { open, close, toggle, containerRef, triggerRef } = useDismissableMenu<
    HTMLDivElement,
    HTMLButtonElement
  >();

  if (!hydrated) {
    return <span className="block h-11 w-11" aria-hidden="true" />;
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? "account-menu" : undefined}
        aria-label={user ? `Account: ${user.name}` : "Account"}
        className={cn(
          "flex h-11 cursor-pointer items-center gap-1.5 rounded-lg px-2.5 transition-colors duration-200",
          open ? "bg-canvas text-primary" : "text-ink hover:bg-canvas",
        )}
      >
        <UserIcon className="h-6 w-6" />
        {user ? (
          <span className="hidden max-w-28 truncate text-sm font-medium lg:block">
            {user.name}
          </span>
        ) : null}
        <ChevronDownIcon
          className={cn(
            "hidden h-4 w-4 text-muted transition-transform duration-200 lg:block",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id="account-menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-line bg-surface p-2 shadow-lg"
        >
          {user ? (
            <>
              <p className="border-b border-line px-3 pb-2.5 pt-1.5">
                <span className="block truncate text-sm font-semibold text-ink">
                  {user.name}
                </span>
                <span className="block text-xs text-muted">Signed in</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  close();
                  onLogout();
                }}
                className={cn(itemClasses, "mt-1 cursor-pointer text-left")}
              >
                Log out
              </button>
            </>
          ) : (
            <ul>
              <li>
                <Link href="/login" onClick={close} className={itemClasses}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" onClick={close} className={itemClasses}>
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
