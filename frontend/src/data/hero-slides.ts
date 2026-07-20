export interface HeroBanner {
  id: string;
  image: string;
}

/**
 * Background-only slideshow banners. The hero's text and CTAs are fixed
 * (see Hero component) — these images rotate behind them, purely
 * decorative, and carry no copy of their own.
 */
export const heroBanners: HeroBanner[] = [
  { id: "new-arrivals", image: "/images/banners/new-arrivals.png" },
  { id: "smart-home", image: "/images/banners/smart-home.png" },
  { id: "travel-tech", image: "/images/banners/travel-tech.png" },
  { id: "workspace-essentials", image: "/images/banners/workspace-essentials.png" },
];
