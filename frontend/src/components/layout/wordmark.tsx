import Link from "next/link";
import { cn } from "@/lib/cn";

export function Wordmark({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link
      href="/"
      aria-label="Nivora — home"
      className="inline-flex items-center gap-2.5 rounded-lg py-2"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-base font-bold text-white"
      >
        N
      </span>
      <span
        className={cn(
          "text-xl font-semibold tracking-tight",
          tone === "light" ? "text-white" : "text-primary-dark",
        )}
      >
        Nivora
      </span>
    </Link>
  );
}
