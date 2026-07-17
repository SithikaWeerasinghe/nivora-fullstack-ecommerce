import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl text-center">
        {/* Wordmark */}
        <div className="mb-8 inline-flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white"
          >
            N
          </span>
          <span className="text-2xl font-semibold tracking-tight text-primary-dark">
            Nivora
          </span>
        </div>

        <h1 className="text-balance text-4xl font-bold tracking-tight text-ink sm:text-5xl">
          Thoughtful tech for everyday life
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-8 text-muted">
          A curated store for everyday technology and lifestyle accessories —
          audio, workspace, smart home, mobile, and travel tech. Clear prices,
          honest stock, and a simple, trustworthy checkout.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-primary px-7 text-base font-semibold text-white transition-colors duration-200 hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:w-auto"
          >
            Browse Products
          </Link>
        </div>

        <p className="mt-10 text-sm text-muted">
          Server-authoritative pricing &amp; stock · Secure checkout · No hidden
          charges
        </p>
      </div>
    </main>
  );
}
