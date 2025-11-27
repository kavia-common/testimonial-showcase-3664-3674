import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * TestimonialCarousel
 * A responsive, accessible testimonial carousel styled for the Ocean Professional theme.
 *
 * Props:
 * - items?: Array<{ id: string|number, name: string, role: string, rating?: number, text: string }>
 *   Optional array of testimonial items. If omitted, a default dataset is used.
 * - pill?: string
 *   Optional small pill tag above the heading. Defaults to "What clients say".
 * - heading?: string
 *   Optional heading text. Defaults to "Testimonials that speak for themselves".
 * - subheading?: string
 *   Optional subheading text for supportive context.
 * - className?: string
 *   Optional extra class names for the outer section.
 * - showStars?: boolean
 *   Toggle displaying rating stars. Defaults to true.
 * - announceChanges?: boolean
 *   When true (default), slide changes are announced to assistive tech via a live region.
 *
 * Usage:
 * <TestimonialCarousel
 *   pill="What clients say"
 *   heading="Loved by modern teams"
 *   subheading="Real feedback from people using our product daily."
 *   items={[{ id:1, name:'Jane Doe', role:'PM, Acme', rating:5, text:'Great!' }]}
 * />
 *
 * Accessibility and Interaction:
 * - Keyboard: ArrowLeft / ArrowRight scroll one viewport width.
 * - Scroll snapping with smooth behavior; swipe support on touch devices.
 * - ARIA: region with roledescription="carousel", slides labeled, live region for announcements.
 *
 * Visual Design:
 * - Section has subtle gradient bg, soft border, rounded container.
 * - Cards: glassmorphism-esque with 1px border, backdrop blur, gradient overlay.
 * - Larger quote with opening quote SVG accent in secondary color (#F59E0B).
 */
export default function TestimonialCarousel({
  items,
  pill = "What clients say",
  heading = "Testimonials that speak for themselves",
  subheading = "Modern teams across industries rely on our platform every day.",
  className = "",
  showStars = true,
  announceChanges = true,
}) {
  const containerRef = useRef(null);
  const liveRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Default testimonials when no props.items provided
  const testimonials = useMemo(
    () =>
      items && items.length
        ? items
        : [
            {
              id: 1,
              name: "Alex Johnson",
              role: "Product Manager, Bluewave",
              rating: 5,
              text:
                "The carousel is slick and intuitive. Our customers love browsing reviews!",
            },
            {
              id: 2,
              name: "Priya Singh",
              role: "Founder, Horizon Labs",
              rating: 5,
              text: "Clean design with accessible controls. Exactly what we needed.",
            },
            {
              id: 3,
              name: "Marcus Lee",
              role: "CTO, NorthStar",
              rating: 4,
              text: "Solid performance and smooth transitions across devices.",
            },
            {
              id: 4,
              name: "Emily Chen",
              role: "Design Lead, Aurora",
              rating: 5,
              text:
                "Ocean Professional theme shines—subtle gradients and great legibility.",
            },
            {
              id: 5,
              name: "Diego Martinez",
              role: "Marketing, WavePoint",
              rating: 4,
              text: "Setup was straightforward and the UI feels premium.",
            },
            {
              id: 6,
              name: "Sofia Rossi",
              role: "Operations, TerraCore",
              rating: 5,
              text:
                "Love the keyboard navigation and the swipe gestures on mobile!",
            },
            {
              id: 7,
              name: "Hannah Kim",
              role: "Engineer, FinEdge",
              rating: 5,
              text: "Great balance of aesthetics and accessibility.",
            },
            {
              id: 8,
              name: "Liam O'Connor",
              role: "CEO, BrightPath",
              rating: 5,
              text:
                "The best testimonial section we’ve tried. Fast, simple, beautiful.",
            },
          ],
    [items]
  );

  const totalSlides = testimonials.length;

  // Update active index on scroll/resize
  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { scrollLeft } = el;
    const children = Array.from(el.children || []);
    if (children.length) {
      let closestIdx = 0;
      let closestDelta = Number.POSITIVE_INFINITY;
      children.forEach((child, idx) => {
        const delta = Math.abs(child.offsetLeft - scrollLeft);
        if (delta < closestDelta) {
          closestDelta = delta;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    }
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  // Live region announcements when activeIndex changes
  useEffect(() => {
    if (!announceChanges) return;
    const live = liveRef.current;
    if (!live) return;
    const current = testimonials[activeIndex];
    if (!current) return;
    live.textContent = `Showing testimonial ${activeIndex + 1} of ${totalSlides}: ${current.name}, ${current.role}`;
  }, [activeIndex, testimonials, totalSlides, announceChanges]);

  const scrollByViewport = (dir = 1) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  // Keyboard navigation: arrow keys while focus is within the scroll container or section
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByViewport(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByViewport(-1);
    }
  };

  return (
    <section
      className={`relative w-full ${className}`}
      aria-label="Customer testimonials"
      onKeyDown={onKeyDown}
    >
      {/* Section container with subtle gradient bg and soft border */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-6 sm:p-10 border border-gray-200/60 shadow-soft">
          {/* Inner subtle ring and rounded container for glass pane illusion */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none [mask-image:radial-gradient(white,transparent_72%)]" />
          {/* Heading block */}
          <div className="text-center mb-8 sm:mb-10">
            <p className="inline-flex items-center rounded-full border border-gray-300/60 bg-white/60 backdrop-blur px-3 py-1 text-[11px] sm:text-xs font-medium text-primary tracking-wide">
              {pill}
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text">
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">
                {subheading}
              </p>
            ) : null}
          </div>

          {/* Live region for announcements */}
          <div
            ref={liveRef}
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          />

          {/* Scrollable container with snap behavior; padding adjusted now that arrows/dots are removed */}
          <div
            ref={containerRef}
            className="carousel snap-container overflow-x-auto overflow-y-hidden flex gap-3 sm:gap-4 md:gap-5 scroll-smooth px-1 sm:px-2 py-1 md:py-2"
            role="region"
            aria-roledescription="carousel"
            aria-label="Testimonials"
            tabIndex={0}
          >
            {testimonials.map((t, idx) => (
              <article
                key={t.id}
                className="
                  snap-item relative
                  rounded-xl md:rounded-2xl
                  border border-gray-200/70
                  bg-white/70 backdrop-blur
                  p-5 sm:p-6 md:p-7
                  transition-transform duration-300
                  hover:-translate-y-0.5 focus-within:-translate-y-0.5
                  flex-shrink-0
                  w-[100%] sm:w-[100%] md:w-[66%] lg:w-[45%]
                  group
                  overflow-hidden
                "
                aria-roledescription="slide"
                aria-label={`Slide ${idx + 1} of ${totalSlides}`}
              >
                {/* subtle gradient overlay for glassmorphism depth */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-gray-50" />
                {/* Card header: avatar initials and author info */}
                <div className="relative flex items-center gap-4">
                  <AvatarInitials name={t.name} />
                  <div className="min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-text truncate">
                      {t.name}
                    </h3>
                    <p className="text-sm md:text-[15px] text-gray-500 truncate">
                      {t.role}
                    </p>
                  </div>
                </div>

                {/* Optional star rating */}
                {showStars && (
                  <div
                    className="relative mt-3 sm:mt-4 flex items-center"
                    aria-label={`${t.rating ?? 0} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} filled={i < (t.rating ?? 0)} />
                    ))}
                  </div>
                )}

                {/* Quote with leading SVG accent */}
                <div className="relative mt-4 md:mt-5">
                  <span className="inline-block align-top mr-2" aria-hidden="true">
                    <QuoteIcon />
                  </span>
                  <p className="inline text-gray-800 text-[17px] sm:text-[18px] md:text-[20px] leading-[1.6]">
                    {t.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
          {/* No arrows or dots; spacing already balanced via surrounding padding/margins */}
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function Star({ filled }) {
  /** Pure SVG star with primary/secondary theming, no external images. */
  const className = filled ? "text-secondary" : "text-gray-300";
  return (
    <svg
      className={`h-5 w-5 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

// PUBLIC_INTERFACE
function AvatarInitials({ name }) {
  /**
   * Avatar placeholder with colored circle and initials (no images).
   * Initials derived from name (first two letters).
   */
  const initials = (name || "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative">
      <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center text-primary font-semibold ring-1 ring-primary/20">
        {initials}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function QuoteIcon() {
  /** Decorative opening quote SVG in secondary color. */
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 md:h-7 md:w-7 text-secondary inline-block translate-y-[-2px]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M7.17 6C5.42 6 4 7.43 4 9.2c0 1.54 1.13 2.8 2.67 2.8.2 0 .4-.02.6-.06-.3 1.7-1.7 3-3.4 3.06v2c3.3-.07 6-2.8 6.1-6.1V6H7.17zm9 0c-1.76 0-3.17 1.43-3.17 3.2 0 1.54 1.13 2.8 2.67 2.8.2 0 .4-.02.6-.06-.3 1.7-1.7 3-3.4 3.06v2c3.3-.07 6-2.8 6.1-6.1V6h-2.8z" />
    </svg>
  );
}
