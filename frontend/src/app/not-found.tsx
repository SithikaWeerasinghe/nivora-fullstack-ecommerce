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
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center">
        <Link href="/" className={buttonClasses("outline", "md", "w-full sm:w-auto")}>
          Return Home
        </Link>
        <Link
          href="/products"
          className={buttonClasses("primary", "md", "w-full sm:w-auto")}
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
}
