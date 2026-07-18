import Link from "next/link";
import {
  GlobeIcon,
  HeadphonesIcon,
  HomeIcon,
  MonitorIcon,
  SmartphoneIcon,
} from "@/components/ui/icons";
import type { Category } from "@/types";

const categoryIcons: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  audio: HeadphonesIcon,
  workspace: MonitorIcon,
  "smart-home": HomeIcon,
  "mobile-accessories": SmartphoneIcon,
  "travel-tech": GlobeIcon,
};

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6"
    >
      <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-ink">
        Shop by category
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.slug] ?? GlobeIcon;
          return (
            <li key={category.id}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group flex min-h-24 flex-col items-start gap-3 rounded-xl border border-line bg-surface p-4 transition-colors duration-200 hover:border-primary"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <IconComponent className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-ink transition-colors group-hover:text-primary">
                  {category.name}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
