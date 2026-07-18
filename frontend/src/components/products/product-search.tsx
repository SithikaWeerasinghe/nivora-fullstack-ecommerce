"use client";

import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";

interface ProductSearchProps {
  /** Current value from the URL — the source of truth. */
  initialValue: string;
  onSearchChange: (value: string) => void;
}

/**
 * Debounced product search synced with the URL query state. The input is
 * uncontrolled; external URL changes (back/forward, clear filters) are
 * written to the DOM only while the field is not being edited.
 */
export function ProductSearch({ initialValue, onSearchChange }: ProductSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<number | null>(null);
  const onSearchChangeRef = useRef(onSearchChange);

  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  // Follow external URL changes without disturbing active typing.
  useEffect(() => {
    const input = inputRef.current;
    if (
      input &&
      input.value.trim() !== initialValue &&
      document.activeElement !== input
    ) {
      input.value = initialValue;
    }
  }, [initialValue]);

  // Clear any pending debounce on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  function scheduleSearch(next: string) {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      onSearchChangeRef.current(next.trim());
    }, 400);
  }

  function flushSearch() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    onSearchChangeRef.current(inputRef.current?.value.trim() ?? "");
  }

  function clearSearch() {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    const input = inputRef.current;
    if (input) {
      input.value = "";
      input.focus();
    }
    onSearchChangeRef.current("");
  }

  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-muted" />
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <Input
        ref={inputRef}
        id="product-search"
        type="search"
        placeholder="Search products…"
        autoComplete="off"
        className="peer pl-11 pr-11"
        defaultValue={initialValue}
        onChange={(event) => scheduleSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            flushSearch();
          }
        }}
      />
      <button
        type="button"
        aria-label="Clear search"
        onClick={clearSearch}
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-md text-muted transition-colors hover:text-ink peer-placeholder-shown:hidden"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
