"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "@/services";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icons";
import { CategoryFilter } from "./category-filter";
import { Pagination } from "./pagination";
import { ProductGrid } from "./product-grid";
import { ProductGridSkeleton } from "./product-skeleton";
import { ProductSearch } from "./product-search";
import type { Category, ProductListResponse } from "@/types";

interface ProductsPageClientProps {
  categories: Category[];
}

function buildResultsText(
  response: ProductListResponse,
  search: string,
  categoryName: string | null,
): string {
  const { meta } = response;
  const noun = meta.total === 1 ? "product" : "products";
  let text =
    meta.from !== null && meta.to !== null
      ? `Showing ${meta.from}–${meta.to} of ${meta.total} ${noun}`
      : `Showing ${meta.total} ${noun}`;
  if (search) text += ` matching “${search}”`;
  if (categoryName) text += ` in ${categoryName}`;
  return text;
}

export function ProductsPageClient({ categories }: ProductsPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const parsedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const [reloadKey, setReloadKey] = useState(0);
  // Loading is derived: a stored result tagged with a different query key
  // means the current query is still in flight.
  const queryKey = `${search}|${category}|${page}|${reloadKey}`;
  const [loaded, setLoaded] = useState<{
    key: string;
    response: ProductListResponse | null;
    failed: boolean;
  }>({ key: "", response: null, failed: false });
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getProducts({
      search: search || undefined,
      category: category || undefined,
      page,
    })
      .then((result) => {
        if (active) setLoaded({ key: queryKey, response: result, failed: false });
      })
      .catch(() => {
        if (active) setLoaded({ key: queryKey, response: null, failed: true });
      });
    return () => {
      active = false;
    };
  }, [search, category, page, queryKey]);

  const isCurrent = loaded.key === queryKey;
  const hasError = isCurrent && loaded.failed;
  const response = isCurrent ? loaded.response : null;

  const updateParams = useCallback(
    (updates: { search?: string; category?: string | null; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.search !== undefined) {
        if (updates.search) params.set("search", updates.search);
        else params.delete("search");
        params.delete("page");
      }
      if (updates.category !== undefined) {
        if (updates.category) params.set("category", updates.category);
        else params.delete("category");
        params.delete("page");
      }
      if (updates.page !== undefined) {
        if (updates.page > 1) params.set("page", String(updates.page));
        else params.delete("page");
      }
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [router, pathname, searchParams],
  );

  const handleSearchChange = useCallback(
    (value: string) => updateParams({ search: value }),
    [updateParams],
  );

  const handleCategoryChange = useCallback(
    (slug: string | null) => updateParams({ category: slug }),
    [updateParams],
  );

  const handlePageChange = useCallback(
    (nextPage: number) => {
      updateParams({ page: nextPage });
      // Bring the results back into view and move focus for keyboard users.
      resultsRef.current?.scrollIntoView({ block: "start" });
      resultsRef.current?.focus({ preventScroll: true });
    },
    [updateParams],
  );

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  const activeCategory =
    categories.find((entry) => entry.slug === category) ?? null;
  const hasFilters = Boolean(search || category);

  let content: React.ReactNode;
  if (hasError) {
    content = (
      <ErrorState
        message="Products could not be loaded right now. Please try again."
        onRetry={() => setReloadKey((key) => key + 1)}
      />
    );
  } else if (response === null) {
    content = <ProductGridSkeleton />;
  } else if (response.data.length === 0) {
    content = (
      <EmptyState
        icon={<SearchIcon className="h-7 w-7" />}
        title="No products found"
        message={
          search
            ? `Nothing matched “${search}”${activeCategory ? ` in ${activeCategory.name}` : ""}. Try a different search term.`
            : "There are no products in this category yet."
        }
      >
        {hasFilters ? (
          <Button variant="outline" onClick={clearFilters}>
            Clear filters
          </Button>
        ) : null}
      </EmptyState>
    );
  } else {
    content = (
      <>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="text-sm text-muted">
            {buildResultsText(response, search, activeCategory?.name ?? null)}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="cursor-pointer rounded text-sm font-medium text-primary transition-colors hover:text-primary-hover hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
        <div className="mt-4">
          <ProductGrid products={response.data} />
        </div>
        <Pagination meta={response.meta} onPageChange={handlePageChange} />
      </>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-ink">Products</h1>
        <p className="mt-1 text-muted">
          Browse the full Nivora catalogue of everyday technology.
        </p>
      </header>

      <div className="mt-6 space-y-4">
        <div className="max-w-md">
          <ProductSearch
            initialValue={search}
            onSearchChange={handleSearchChange}
          />
        </div>
        <CategoryFilter
          categories={categories}
          activeSlug={category || null}
          onChange={handleCategoryChange}
        />
      </div>

      <div ref={resultsRef} tabIndex={-1} className="mt-6 scroll-mt-24 outline-none">
        {content}
      </div>
    </div>
  );
}
