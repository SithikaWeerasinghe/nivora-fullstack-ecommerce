import type { Category } from "@/types";

export const mockCategories: Category[] = [
  {
    id: 1,
    name: "Audio",
    slug: "audio",
    description: "Headphones, earbuds, and speakers for focused listening.",
  },
  {
    id: 2,
    name: "Workspace",
    slug: "workspace",
    description:
      "Keyboards, lighting, and desk accessories for productive setups.",
  },
  {
    id: 3,
    name: "Smart Home",
    slug: "smart-home",
    description:
      "Simple connected devices that make everyday routines easier.",
  },
  {
    id: 4,
    name: "Mobile Accessories",
    slug: "mobile-accessories",
    description: "Chargers, stands, and cables for phones and tablets.",
  },
  {
    id: 5,
    name: "Travel Tech",
    slug: "travel-tech",
    description:
      "Compact gear that keeps devices organised and powered on the move.",
  },
];

export function findCategoryBySlug(slug: string): Category | undefined {
  return mockCategories.find((category) => category.slug === slug);
}
