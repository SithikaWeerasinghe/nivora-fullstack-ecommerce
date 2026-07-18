"use client";

import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";
import type { PaginationMeta } from "@/types";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(current: number, last: number): PageItem[] {
  if (last <= 7) {
    return Array.from({ length: last }, (_, index) => index + 1);
  }
  const items: PageItem[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);
  if (start > 2) items.push("ellipsis-start");
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < last - 1) items.push("ellipsis-end");
  items.push(last);
  return items;
}

const pageButtonClasses =
  "flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40";

export function Pagination({ meta, onPageChange }: PaginationProps) {
  const { current_page: current, last_page: last } = meta;
  if (last <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(current - 1)}
        disabled={current <= 1}
        aria-label="Previous page"
        className={cn(pageButtonClasses, "border-line bg-surface text-ink hover:border-primary")}
      >
        <ChevronLeftIcon className="h-4 w-4" />
        <span className="hidden pr-1 sm:inline">Previous</span>
      </button>

      {getPageItems(current, last).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === current ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              pageButtonClasses,
              item === current
                ? "border-primary bg-primary text-white"
                : "border-line bg-surface text-ink hover:border-primary",
            )}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden="true" className="px-1.5 text-muted">
            …
          </span>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(current + 1)}
        disabled={current >= last}
        aria-label="Next page"
        className={cn(pageButtonClasses, "border-line bg-surface text-ink hover:border-primary")}
      >
        <span className="hidden pl-1 sm:inline">Next</span>
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  );
}
