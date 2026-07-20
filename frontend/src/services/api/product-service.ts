import { apiRequest } from "@/lib/api-client";
import { ApiRequestError } from "@/lib/api-error";
import { PRODUCTS_PER_PAGE } from "@/lib/constants";
import type { Product, ProductListResponse } from "@/types";

export interface ProductQuery {
  search?: string;
  category?: string;
  page?: number;
  per_page?: number;
}

/** `GET /api/products?search=&category=&page=`. Public — no auth required. */
export async function getProducts(
  query: ProductQuery = {},
): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  if (query.category) params.set("category", query.category);
  if (query.page) params.set("page", String(query.page));
  params.set("per_page", String(query.per_page ?? PRODUCTS_PER_PAGE));

  return apiRequest<ProductListResponse>(`/products?${params.toString()}`);
}

/** `GET /api/products/{slug}`. Resolves null when not found. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await apiRequest<Product>(`/products/${encodeURIComponent(slug)}`);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) return null;
    throw error;
  }
}

/** Featured subset used by the home page. */
export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await apiRequest<ProductListResponse>(
    "/products?featured=true&per_page=100",
  );
  return response.data;
}
