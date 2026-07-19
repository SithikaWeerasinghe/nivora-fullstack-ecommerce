"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { heroSlides } from "@/data/hero-slides";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PauseIcon,
  PlayIcon,
} from "@/components/ui/icons";

const SLIDE_INTERVAL_MS = 6000;
const SWIPE_THRESHOLD_PX = 48;

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

export function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const count = heroSlides.length;
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
      aria-roledescription="carousel"
      aria-label="Nivora collections"
      className="border-b border-line bg-surface"
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
      <h1 className="sr-only">Nivora — thoughtful tech for everyday life</h1>
      <div
        className="relative mx-auto h-[500px] max-w-[1800px] overflow-hidden sm:h-[540px] lg:h-[600px]"
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
        <div aria-live={autoplay ? "off" : "polite"} className="h-full">
          {heroSlides.map((slide, slideIndex) => {
            const active = slideIndex === index;
            return (
              <div
                key={slide.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}: ${slide.headline}`}
                inert={!active}
                className={cn(
                  "absolute inset-0 transition-opacity duration-500 ease-out",
                  active ? "opacity-100" : "pointer-events-none opacity-0",
                )}
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  priority={slideIndex === 0}
                  sizes="(min-width: 1800px) 1800px, 100vw"
                  className="object-cover object-[center_75%]"
                />
                {/* The banners keep their centre clear; a soft light gradient
                    guarantees text contrast without darkening the image. It
                    spans the full slide and never fully clears so the
                    bottom-anchored copy always has a contrast floor, even
                    when a wrapped headline pushes the eyebrow text higher. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-white/92 via-white/55 to-white/15"
                />
                <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-24 sm:px-6">
                  <div className="w-full max-w-2xl text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
                      {slide.eyebrow}
                    </p>
                    <h2 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
                      {slide.headline}
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-7 text-ink/80 sm:text-lg sm:leading-8">
                      {slide.description}
                    </p>
                    <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                      <Link
                        href={slide.ctaHref}
                        className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
                      >
                        {slide.ctaLabel}
                      </Link>
                      {slide.secondaryCtaLabel && slide.secondaryCtaHref ? (
                        <Link
                          href={slide.secondaryCtaHref}
                          className={buttonClasses("outline", "lg", "w-full sm:w-auto")}
                        >
                          {slide.secondaryCtaLabel}
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5 sm:bottom-5">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface/90 text-ink shadow-sm backdrop-blur transition-colors duration-200 hover:border-primary hover:text-primary"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-0.5">
            {heroSlides.map((slide, slideIndex) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(slideIndex)}
                aria-label={`Go to slide ${slideIndex + 1}: ${slide.headline}`}
                aria-current={slideIndex === index ? "true" : undefined}
                className="group flex h-11 w-8 cursor-pointer items-center justify-center"
              >
                <span
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    slideIndex === index
                      ? "w-6 bg-primary"
                      : "w-2.5 bg-ink/40 group-hover:bg-ink/60",
                  )}
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface/90 text-ink shadow-sm backdrop-blur transition-colors duration-200 hover:border-primary hover:text-primary"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line bg-surface/90 text-ink shadow-sm backdrop-blur transition-colors duration-200 hover:border-primary hover:text-primary"
          >
            {paused ? (
              <PlayIcon className="h-5 w-5" />
            ) : (
              <PauseIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
