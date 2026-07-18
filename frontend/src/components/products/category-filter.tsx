"use client";

import { cn } from "@/lib/cn";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  /** Active category slug, or null for "All Products". */
  activeSlug: string | null;
  onChange: (slug: string | null) => void;
}

export function CategoryFilter({
  categories,
  activeSlug,
  onChange,
}: CategoryFilterProps) {
  const options: Array<{ slug: string | null; name: string }> = [
    { slug: null, name: "All Products" },
    ...categories.map((category) => ({
      slug: category.slug,
      name: category.name,
    })),
  ];

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div
        role="group"
        aria-label="Filter by category"
        className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap"
      >
        {options.map((option) => {
          const active = option.slug === activeSlug;
          return (
            <button
              key={option.name}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.slug)}
              className={cn(
                "h-11 cursor-pointer whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors duration-200",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-line bg-surface text-muted hover:border-primary hover:text-primary",
              )}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
