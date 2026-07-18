import Image from "next/image";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

const heroImages = [
  { src: "/images/products/aurora-wireless-headphones.svg", alt: "Aurora Wireless Headphones" },
  { src: "/images/products/keystone-mechanical-keyboard.svg", alt: "Keystone Mechanical Keyboard" },
  { src: "/images/products/sentinel-indoor-camera.svg", alt: "Sentinel Indoor Camera" },
  { src: "/images/products/portal-usb-c-hub.svg", alt: "Portal USB-C Hub" },
];

export function Hero() {
  return (
    <section className="border-b border-line bg-surface">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Curated everyday tech
          </p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            Thoughtful tech for everyday life
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-lg leading-8 text-muted">
            Useful technology, thoughtfully selected — everyday essentials for
            work, home, and travel, with clear prices and honest stock.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/products"
              className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
            >
              Browse Products
            </Link>
            <a
              href="#categories"
              className={buttonClasses("outline", "lg", "w-full sm:w-auto")}
            >
              Shop by category
            </a>
          </div>
        </div>

        <div className="hidden grid-cols-2 gap-4 lg:grid" aria-hidden="true">
          <div className="space-y-4">
            {heroImages.slice(0, 2).map((image) => (
              <div
                key={image.src}
                className="overflow-hidden rounded-xl border border-line"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={image.src} alt="" fill sizes="280px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 pt-10">
            {heroImages.slice(2).map((image) => (
              <div
                key={image.src}
                className="overflow-hidden rounded-xl border border-line"
              >
                <div className="relative aspect-[4/3]">
                  <Image src={image.src} alt="" fill sizes="280px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
