import Link from "next/link";
import { Wordmark } from "./wordmark";

const footerLinks = [
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Wordmark />
          <p className="mt-3 text-sm leading-6 text-muted">
            Thoughtful tech for everyday life. Useful technology, thoughtfully
            selected for work, home, and travel.
          </p>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex h-10 items-center rounded text-sm text-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line px-4 py-4">
        <p className="mx-auto max-w-6xl text-center text-xs text-muted sm:px-2 md:text-left">
          © {new Date().getFullYear()} Nivora. Internship assessment project —
          not a real store.
        </p>
      </div>
    </footer>
  );
}
