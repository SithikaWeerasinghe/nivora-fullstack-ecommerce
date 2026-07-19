export interface HeroSlide {
  id: string;
  eyebrow: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  image: string;
  imageAlt: string;
  /** Horizontal placement of the text block within the shared container. */
  align: "left" | "center";
}

export const heroSlides: HeroSlide[] = [
  {
    id: "new-arrivals",
    eyebrow: "NEW AT NIVORA",
    headline: "Fresh technology for everyday routines.",
    description:
      "Discover thoughtfully selected essentials for work, home, and life on the move.",
    ctaLabel: "Browse New Arrivals",
    ctaHref: "/products",
    secondaryCtaLabel: "Shop by category",
    secondaryCtaHref: "#categories",
    image: "/images/banners/new-arrivals.png",
    imageAlt:
      "Headphones, earbuds, and charging accessories arranged in a bright studio setting",
    align: "center",
  },
  {
    id: "smart-home",
    eyebrow: "SMART HOME",
    headline: "Small upgrades for a smarter space.",
    description:
      "Simple connected essentials designed to make everyday spaces more convenient.",
    ctaLabel: "Shop Smart Home",
    ctaHref: "/products?category=smart-home",
    image: "/images/banners/smart-home.png",
    imageAlt:
      "An indoor camera, smart bulb, and smart plug beneath the Nivora wordmark",
    align: "center",
  },
  {
    id: "travel-tech",
    eyebrow: "TRAVEL TECH",
    headline: "Stay organised and powered wherever you go.",
    description:
      "Compact accessories created for productive, comfortable travel.",
    ctaLabel: "Explore Travel Tech",
    ctaHref: "/products?category=travel-tech",
    image: "/images/banners/travel-tech.png",
    imageAlt:
      "A travel adapter, braided cable, tech pouch, power bank, and USB-C hub in a bright studio",
    align: "left",
  },
  {
    id: "workspace-essentials",
    eyebrow: "WORKSPACE",
    headline: "Create a workspace that works better.",
    description:
      "Practical tools selected to improve comfort, focus, and organisation.",
    ctaLabel: "Shop Workspace",
    ctaHref: "/products?category=workspace",
    image: "/images/banners/workspace-essentials.png",
    imageAlt:
      "A desk lamp, mechanical keyboard, wireless mouse, and laptop stand on a clean desk scene",
    align: "left",
  },
];
