import Link from "next/link";
import { CheckIcon } from "@/components/ui/icons";
import { FooterAuthLinks } from "./footer-auth-links";
import { Wordmark } from "./wordmark";
import type { Category } from "@/types";

const footerLinkClasses =
  "inline-flex min-h-11 items-center rounded text-sm text-white/70 transition-colors duration-300 ease-out hover:text-blue-300 focus-visible:text-blue-300";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop All" },
  { href: "/cart", label: "Cart" },
];

const whyNivoraPoints = [
  "Clear stock availability",
  "Simple product discovery",
  "Account-protected checkout",
  "Readable order confirmation",
  "Mobile-friendly shopping",
];

const columnHeadingClasses =
  "text-sm font-semibold uppercase tracking-wide text-white";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="border-t border-primary/40 bg-[#0F1E33] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-8 lg:py-14">
        <div>
          <Wordmark tone="light" />
          <p className="mt-3 text-sm font-medium text-white/90">
            Thoughtful tech for everyday life.
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-white/65">
            A curated collection of practical technology for work, home, mobile
            life, and travel.
          </p>
        </div>

        <nav aria-label="Footer quick links">
          <h2 className={columnHeadingClasses}>Quick Links</h2>
          <ul className="mt-4 space-y-1.5">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={footerLinkClasses}>
                  {link.label}
                </Link>
              </li>
            ))}
            <FooterAuthLinks linkClassName={footerLinkClasses} />
          </ul>
        </nav>

        <nav aria-label="Footer category links">
          <h2 className={columnHeadingClasses}>Shop Categories</h2>
          <ul className="mt-4 space-y-1.5">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?category=${category.slug}`}
                  className={footerLinkClasses}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className={columnHeadingClasses}>Why Nivora</h2>
          <ul className="mt-4 space-y-2.5">
            {whyNivoraPoints.map((point) => (
              <li
                key={point}
                className="flex items-start gap-2 text-sm leading-6 text-white/65"
              >
                <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-blue-300" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-5 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-1.5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs text-white/60 sm:text-sm">
            © 2026 Nivora. All rights reserved.
          </p>
          <p className="text-xs text-white/60 sm:text-sm">
            Thoughtful tech for everyday life.
          </p>
        </div>
      </div>
    </footer>
  );
}
