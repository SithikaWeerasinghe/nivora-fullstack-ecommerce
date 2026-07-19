"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDismissableMenu } from "@/lib/use-dismissable-menu";
import { buttonClasses } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icons";

export function NavSearch() {
  const router = useRouter();
  const { open, close, toggle, containerRef, triggerRef } = useDismissableMenu<
    HTMLDivElement,
    HTMLButtonElement
  >();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = inputRef.current?.value.trim() ?? "";
    close();
    router.push(
      query ? `/products?search=${encodeURIComponent(query)}` : "/products",
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? "nav-search-panel" : undefined}
        aria-label={open ? "Close search" : "Search products"}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg text-ink transition-colors duration-200 hover:bg-canvas"
      >
        <SearchIcon className="h-6 w-6" />
      </button>
      {open ? (
        <div
          id="nav-search-panel"
          className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface p-3 shadow-lg"
        >
          <form role="search" aria-label="Product search" onSubmit={handleSubmit}>
            <label htmlFor="nav-search-input" className="sr-only">
              Search products
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id="nav-search-input"
                type="search"
                placeholder="Search products…"
                autoComplete="off"
                enterKeyHint="search"
                className="h-11 w-full min-w-0 rounded-lg border border-line bg-surface px-3 text-base text-ink placeholder:text-muted focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className={buttonClasses("primary", "md", "shrink-0 px-4")}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
