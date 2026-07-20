"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { heroBanners } from "@/data/hero-slides";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "@/components/ui/icons";

const SLIDE_INTERVAL_MS = 4000;
const SWIPE_THRESHOLD_PX = 48;

// Dark navy vignette: strongest behind the centred copy, lighter toward the
// top (so the transparent navbar stays legible) and bottom, so banner detail
// still reads at the edges.
const OVERLAY_BACKGROUND = [
  "radial-gradient(ellipse 70% 78% at 50% 52%, rgba(4,9,22,0.82) 0%, rgba(4,9,22,0.55) 48%, rgba(4,9,22,0.24) 100%)",
  "linear-gradient(to bottom, rgba(4,9,22,0.30) 0%, rgba(4,9,22,0.12) 20%, rgba(4,9,22,0.16) 78%, rgba(4,9,22,0.40) 100%)",
].join(", ");

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Small glass control button shared by prev/next/play-pause. */
function ControlButton({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-sm backdrop-blur-md transition-colors duration-200 hover:border-white/50 hover:bg-white/20 focus-visible:outline-white",
        className,
      )}
      {...props}
    />
  );
}

export function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const count = heroBanners.length;
  // Hover/focus-pause covers pointer and keyboard users; `paused` is the
  // WCAG 2.2.2 mechanism for everyone else (touch-only visitors can't hover).
  const autoplay = !hovered && !focusWithin && !prefersReducedMotion && !paused;

  useEffect(() => {
    if (!autoplay) return;
    const timer = setTimeout(
      () => setIndex((current) => (current + 1) % count),
      SLIDE_INTERVAL_MS,
    );
    return () => clearTimeout(timer);
  }, [autoplay, index, count]);

  const goTo = (target: number) => setIndex(((target % count) + count) % count);

  return (
    <section
      className="relative -mt-16 border-b border-line bg-ink"
      onPointerEnter={(event) => {
        // Filter to real mice: iOS/Android dispatch a synthetic pointer
        // event on tap, and without this check a tap would "stick" the
        // hover-pause on and silently stop autoplay for the rest of the visit.
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setHovered(false);
      }}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
    >
      <div
        className="relative h-[600px] overflow-hidden sm:h-[650px] lg:h-[720px]"
        onTouchStart={(event) => {
          const touch = event.touches[0];
          touchStart.current = { x: touch.clientX, y: touch.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touchStart.current;
          touchStart.current = null;
          if (!start) return;
          const touch = event.changedTouches[0];
          const deltaX = touch.clientX - start.x;
          const deltaY = touch.clientY - start.y;
          if (
            Math.abs(deltaX) > SWIPE_THRESHOLD_PX &&
            Math.abs(deltaX) > Math.abs(deltaY)
          ) {
            goTo(index + (deltaX < 0 ? 1 : -1));
          }
        }}
      >
        {/* Background slideshow — purely decorative; the fixed block below
            carries all of the hero's actual content, so the rotating
            banners are hidden from assistive tech rather than announced
            as a "slide N of 4" carousel. */}
        <div aria-hidden="true" className="absolute inset-0">
          {heroBanners.map((banner, slideIndex) => {
            const active = slideIndex === index;
            return (
              <div
                key={banner.id}
                className={cn(
                  "absolute inset-0 transition-opacity duration-[900ms] ease-out",
                  active ? "opacity-100" : "opacity-0",
                )}
              >
                <Image
                  src={banner.image}
                  alt=""
                  fill
                  priority={slideIndex === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            );
          })}
        </div>

        {/* One consistent overlay — never changes with the slide. */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: OVERLAY_BACKGROUND }}
        />

        {/* Fixed content — identical regardless of the active banner. */}
        <div className="relative z-10 flex h-full items-center justify-center px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7dc3ff] sm:text-sm">
              Premium Everyday Technology
            </p>
            <h1
              className="mt-4 text-balance text-[clamp(2.25rem,1.4rem+3.4vw,4rem)] font-bold leading-[1.15] tracking-tight text-white [text-shadow:0_2px_28px_rgba(37,99,235,0.35),0_4px_18px_rgba(0,0,0,0.55)]"
            >
              Thoughtful technology, selected for{" "}
              <span className="text-[#60a5fa]">everyday life.</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Discover reliable essentials for work, home, mobile life, and travel.
            </p>
            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/products"
                className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
              >
                Browse Products
              </Link>
              <Link
                href="#categories"
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-white/40 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:border-white/70 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
              >
                Shop by Category
              </Link>
            </div>
          </div>
        </div>

        {/* Slideshow controls */}
        <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-1.5 sm:bottom-6">
          <ControlButton onClick={() => goTo(index - 1)} aria-label="Previous slide">
            <ChevronLeftIcon className="h-5 w-5" />
          </ControlButton>
          <div className="flex items-center gap-0.5">
            {heroBanners.map((banner, slideIndex) => (
              <button
                key={banner.id}
                type="button"
                onClick={() => goTo(slideIndex)}
                aria-label={`Go to slide ${slideIndex + 1}`}
                aria-current={slideIndex === index ? "true" : undefined}
                className="group flex h-11 w-8 cursor-pointer items-center justify-center"
              >
                <span
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    slideIndex === index
                      ? "w-6 bg-white"
                      : "w-2.5 bg-white/40 group-hover:bg-white/60",
                  )}
                />
              </button>
            ))}
          </div>
          <ControlButton onClick={() => goTo(index + 1)} aria-label="Next slide">
            <ChevronRightIcon className="h-5 w-5" />
          </ControlButton>
          <ControlButton
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
          >
            {paused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
          </ControlButton>
        </div>
      </div>
    </section>
  );
}
