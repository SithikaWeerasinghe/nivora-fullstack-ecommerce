import { apiRequest } from "@/lib/api-client";
import type { Category } from "@/types";

/** `GET /api/categories`. Public — no auth required. */
export async function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories");
}
