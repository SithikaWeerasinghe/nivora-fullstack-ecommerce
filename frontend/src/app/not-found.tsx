import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
        Page not found
      </h1>
      <p className="mt-3 text-muted">
        The page you are looking for does not exist or may have moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonClasses("outline")}>
          Return Home
        </Link>
        <Link href="/products" className={buttonClasses("primary")}>
          Browse Products
        </Link>
      </div>
    </div>
  );
}
