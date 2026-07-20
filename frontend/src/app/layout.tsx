import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Providers } from "@/components/providers/providers";
import { getCategories } from "@/services";
import type { Category } from "@/types";
import "./globals.css";

// The root layout runs for every route (including the build-time /_not-found
// prerender) and depends on live category data from the API — it can never
// be safely snapshotted once at build time, so it always renders per-request.
export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nivora — Thoughtful tech for everyday life",
    template: "%s · Nivora",
  },
  description:
    "Nivora is a curated store for everyday technology and lifestyle accessories: audio, workspace, smart home, mobile accessories, and travel tech.",
  applicationName: "Nivora",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A failed/unavailable API must never take down every page on the site —
  // the nav and footer simply render without categories until it recovers.
  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch {
    categories = [];
  }

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-canvas font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:outline-2 focus:outline-primary"
        >
          Skip to content
        </a>
        <Providers>
          <Navbar categories={categories} />
          {/* The navbar is fixed (so it can sit transparently over the
              homepage hero) and no longer reserves flow space; compensate
              here. The hero cancels this out for itself with -mt-16. */}
          <main id="main-content" className="flex flex-1 flex-col pt-16">
            {children}
          </main>
          <Footer categories={categories} />
        </Providers>
      </body>
    </html>
  );
}
