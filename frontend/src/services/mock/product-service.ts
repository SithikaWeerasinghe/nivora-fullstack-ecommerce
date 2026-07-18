import { mockProducts } from "@/data/mock-products";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import { mockDelay } from "@/lib/delay";
import type { Product, ProductListResponse } from "@/types";

export interface ProductQuery {
  search?: string;
  category?: string;
  page?: number;
  per_page?: number;
}

/**
 * Mirrors `GET /api/products?search=&category=&page=` — filtering and
 * pagination happen inside the service (server-side later), never in
 * components.
 */
export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductListResponse> {
  await mockDelay(450);

  const search = query.search?.trim().toLowerCase() ?? "";
  const category = query.category?.trim() ?? "";
  const perPage = query.per_page ?? PRODUCTS_PER_PAGE;

  let results = mockProducts;
  if (category) {
    results = results.filter((product) => product.category.slug === category);
  }
  if (search) {
    results = results.filter((product) =>
      [product.name, product.short_description, product.category.name].some(
        (value) => value.toLowerCase().includes(search),
      ),
    );
  }

  const total = results.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(1, query.page ?? 1), lastPage);
  const start = (currentPage - 1) * perPage;
  const data = results.slice(start, start + perPage);

  return {
    data,
    meta: {
      current_page: currentPage,
      last_page: lastPage,
      per_page: perPage,
      total,
      from: data.length > 0 ? start + 1 : null,
      to: data.length > 0 ? start + data.length : null,
    },
  };
}

/** Mirrors `GET /api/products/{slug}`. Resolves null when not found. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  await mockDelay(400);
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

/** Featured subset used by the home page. */
export async function getFeaturedProducts(): Promise<Product[]> {
  await mockDelay(450);
  return mockProducts.filter((product) => product.is_featured);
}
