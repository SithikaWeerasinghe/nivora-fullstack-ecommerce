import { mockCategories } from "@/data/mock-categories";
import { mockDelay } from "@/lib/delay";
import type { Category } from "@/types";

/** Mirrors `GET /api/categories`. */
export async function getCategories(): Promise<Category[]> {
  await mockDelay(200);
  return [...mockCategories];
}
