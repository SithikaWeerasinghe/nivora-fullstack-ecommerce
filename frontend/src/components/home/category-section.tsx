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

export function CategorySection({ categories }: { categories: Category[] }) {
  return (
    <section
      id="categories"
      aria-labelledby="categories-heading"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="max-w-2xl">
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
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {categories.map((category, index) => {
          const presentation = categoryPresentation[category.slug];
          const IconComponent = presentation?.icon ?? GlobeIcon;
          const spansFullRow =
            index === categories.length - 1 && categories.length % 2 === 1;
          return (
            <li key={category.id} className={cn(spansFullRow && "md:col-span-2")}>
              <Link
                href={`/products?category=${category.slug}`}
                className="group flex min-h-24 items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-[border-color,box-shadow,translate] duration-500 ease-out hover:-translate-y-1 hover:border-primary/60 hover:shadow-md focus-visible:-translate-y-1 motion-reduce:translate-none sm:gap-5 sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 scale-100 items-center justify-center rounded-xl bg-primary/10 text-primary transition-[background-color,color,scale] duration-500 ease-out group-hover:scale-[1.03] group-hover:bg-primary group-hover:text-white motion-reduce:scale-100">
                  <IconComponent className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-ink transition-colors duration-500 ease-out group-hover:text-primary">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted">
                    {presentation?.description ?? category.description}
                  </span>
                </span>
                <ArrowRightIcon className="h-5 w-5 shrink-0 text-muted transition-[color,translate] duration-500 ease-out group-hover:translate-x-1 group-hover:text-primary motion-reduce:translate-none" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
