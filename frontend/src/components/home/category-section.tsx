import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  ArrowRightIcon,
  GlobeIcon,
  HeadphonesIcon,
  HomeIcon,
  MonitorIcon,
  SmartphoneIcon,
} from "@/components/ui/icons";
import type { Category } from "@/types";

interface CategoryPresentation {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  description: string;
}

const categoryPresentation: Record<string, CategoryPresentation> = {
  audio: {
    icon: HeadphonesIcon,
    description: "Headphones, speakers, and earbuds for everyday listening.",
  },
  workspace: {
    icon: MonitorIcon,
    description:
      "Practical accessories for a cleaner, more comfortable setup.",
  },
  "smart-home": {
    icon: HomeIcon,
    description: "Connected essentials designed for modern living spaces.",
  },
  "mobile-accessories": {
    icon: SmartphoneIcon,
    description: "Charging and phone accessories for everyday use.",
  },
  "travel-tech": {
    icon: GlobeIcon,
    description: "Compact essentials for organised, connected journeys.",
  },
};

/**
 * Explicit column placement for the "3 first row, 2 centred second row"
 * layout at the large-tablet tier only. A 6-column track lets two span-2
 * cards centre themselves (empty track on each side) before the grid
 * switches to 5 equal columns at desktop.
 */
const largeTabletPlacement = [
  "",
  "",
  "",
  "lg:col-start-2 xl:col-start-auto",
  "lg:col-start-4 xl:col-start-auto",
];

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          id="categories-heading"
          className="text-2xl font-bold tracking-tight text-ink sm:text-3xl"
        >
          Shop by category
        </h2>
        <p className="mt-2 text-muted sm:text-lg">
          Find practical technology for work, home, mobile life, and travel.
        </p>
      </div>
      <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 xl:grid-cols-5">
        {categories.map((category, index) => {
          const presentation = categoryPresentation[category.slug];
          const IconComponent = presentation?.icon ?? GlobeIcon;
          return (
            <li
              key={category.id}
              className={cn(
                "lg:col-span-2 xl:col-span-1",
                largeTabletPlacement[index],
              )}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group flex h-full cursor-pointer flex-col rounded-2xl border border-line bg-surface p-6 text-left shadow-sm transition-[transform,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-primary/60 hover:shadow-lg focus-visible:-translate-y-1 motion-reduce:transition-colors motion-reduce:hover:translate-y-0"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:group-hover:scale-100">
                  <IconComponent className="h-6 w-6" />
                </span>
                <span className="mt-5 block font-semibold text-ink">
                  {category.name}
                </span>
                <span className="mt-2 block flex-1 text-sm leading-6 text-muted">
                  {presentation?.description ?? category.description}
                </span>
                <span className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                  Explore
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
