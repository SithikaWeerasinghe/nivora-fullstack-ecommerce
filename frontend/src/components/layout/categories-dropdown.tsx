"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { useDismissableMenu } from "@/lib/use-dismissable-menu";
import { ChevronDownIcon } from "@/components/ui/icons";
import type { Category } from "@/types";

export function CategoriesDropdown({ categories }: { categories: Category[] }) {
  const { open, close, toggle, containerRef, triggerRef } = useDismissableMenu<
    HTMLDivElement,
    HTMLButtonElement
  >();

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={open ? "categories-menu" : undefined}
        className={cn(
          "flex h-11 cursor-pointer items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-colors duration-200",
          open ? "bg-canvas text-primary" : "text-ink hover:bg-canvas",
        )}
      >
        Categories
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      {open ? (
        <div
          id="categories-menu"
          className="absolute left-1/2 top-full z-50 mt-2 w-64 -translate-x-1/2 rounded-xl border border-line bg-surface p-2 shadow-lg"
        >
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?category=${category.slug}`}
                  onClick={close}
                  className="flex h-11 items-center rounded-lg px-3 text-sm font-medium text-ink transition-colors duration-200 hover:bg-canvas hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
