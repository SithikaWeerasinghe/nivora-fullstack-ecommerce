import Link from "next/link";

export function Wordmark() {
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
      <span className="text-xl font-semibold tracking-tight text-primary-dark">
        Nivora
      </span>
    </Link>
  );
}
