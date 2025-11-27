import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";

/**
 * PUBLIC_INTERFACE
 * TestimonialCarousel
 * A responsive, accessible testimonial carousel styled for the Ocean Professional theme.
 *
 * Props:
 * - items?: Array<{ id: string|number, name: string, role: string, rating?: number, text: string }>
 *   Optional array of testimonial items. If omitted, a default dataset is used.
 * - heading?: string
 *   Optional heading text. Defaults to "What our customers say".
 * - subheading?: string
 *   Optional subheading text below the heading.
 * - className?: string
 *   Optional extra class names for the outer section.
 * - showStars?: boolean
 *   Toggle displaying rating stars. Defaults to true.
 * - announceChanges?: boolean
 *   When true (default), slide changes are announced to assistive tech via a live region.
 *
 * Usage:
 * <TestimonialCarousel
 *   heading="Loved by modern teams"
 *   subheading="Real feedback from people using our product daily."
 *   items={[{ id:1, name:'Jane Doe', role:'PM, Acme', rating:5, text:'Great!' }]}
 * />
 *
 * Accessibility and Interaction:
 * - Keyboard: ArrowLeft / ArrowRight scroll one viewport width.
 * - Buttons have visible focus rings and disabled states.
 * - Scroll snapping with smooth behavior; swipe support on touch devices.
 * - ARIA: region with roledescription="carousel", slides labeled, live region for announcements.
 *
 * Theming:
 * - Colors use Tailwind tokens extended in tailwind.config.js:
 *   primary (#2563EB) and secondary (#F59E0B) accents, surface, text, background.
 */
export default function TestimonialCarousel({
  items,
  heading = "What our customers say",
  subheading = "Real feedback from teams using our platform every day.",
  className = "",
  showStars = true,
  announceChanges = true,
}) {
  const containerRef = useRef(null);
  const liveRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
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

  // Update scroll buttons and active index on scroll/resize
  const updateScrollState = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);

    // compute approximate active index based on scroll position and card width
    const children = Array.from(el.children || []);
    if (children.length) {
      // find the child whose left edge is closest to the scrollLeft
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
      {/* Section container with subtle gradient bg */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-6 sm:p-10 shadow-soft border border-gray-100/70">
          {/* Heading block */}
          <div className="text-center mb-8 sm:mb-12">
            <p className="inline-flex items-center rounded-full border border-blue-200/60 bg-white/60 px-3 py-1 text-xs font-medium text-primary">
              Testimonials
            </p>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text">
              {heading}
            </h2>
            {subheading ? (
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-600">
                {subheading}
              </p>
            ) : null}
          </div>

          {/* Carousel wrapper with arrow controls */}
          <div className="relative">
            {/* Left Arrow - desktop only */}
            <ArrowButton
              direction="left"
              onClick={() => scrollByViewport(-1)}
              disabled={!canScrollLeft}
              className="hidden md:flex left-0 -translate-x-1/2"
              ariaLabel="Previous testimonials"
            />
            {/* Right Arrow - desktop only */}
            <ArrowButton
              direction="right"
              onClick={() => scrollByViewport(1)}
              disabled={!canScrollRight}
              className="hidden md:flex right-0 translate-x-1/2"
              ariaLabel="Next testimonials"
            />

            {/* Live region for announcements */}
            <div
              ref={liveRef}
              className="sr-only"
              aria-live="polite"
              aria-atomic="true"
            />

            {/* Scrollable container with snap behavior */}
            <div
              ref={containerRef}
              className="carousel snap-container overflow-x-auto overflow-y-hidden flex gap-4 sm:gap-6 scroll-smooth px-1 md:px-2 py-1"
              role="region"
              aria-roledescription="carousel"
              aria-label="Testimonials"
              tabIndex={0}
            >
              {testimonials.map((t, idx) => (
                <article
                  key={t.id}
                  className="
                    snap-item bg-surface
                    rounded-xl md:rounded-2xl
                    shadow-soft border border-gray-100
                    p-5 sm:p-6 md:p-7
                    transition-transform duration-300
                    hover:-translate-y-0.5 focus-within:-translate-y-0.5
                    flex-shrink-0
                    w-[90%] sm:w-[100%] md:w-[60%] lg:w-[40%]
                  "
                  aria-roledescription="slide"
                  aria-label={`Slide ${idx + 1} of ${totalSlides}`}
                >
                  {/* Card header: avatar initials and author info */}
                  <div className="flex items-center gap-4">
                    <AvatarInitials name={t.name} />
                    <div className="min-w-0">
                      <h3 className="text-base md:text-lg font-semibold text-text truncate">
                        {t.name}
                      </h3>
                      <p className="text-sm md:text-base text-gray-500 truncate">
                        {t.role}
                      </p>
                    </div>
                  </div>

                  {/* Optional star rating */}
                  {showStars && (
                    <div
                      className="mt-4 flex items-center"
                      aria-label={`${t.rating ?? 0} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} filled={i < (t.rating ?? 0)} />
                      ))}
                    </div>
                  )}

                  {/* Quote text */}
                  <p className="mt-4 md:mt-5 text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                    “{t.text}”
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
function ArrowButton({ direction, onClick, disabled, className = "", ariaLabel }) {
  /** Accessible arrow button with visible focus ring and disabled state. */
  const common =
    "absolute top-1/2 -translate-y-1/2 z-10 h-11 w-11 md:h-12 md:w-12 rounded-full bg-white border border-gray-200 shadow-soft text-primary hover:bg-primary hover:text-white transition-colors focus-ring disabled:opacity-40 disabled:cursor-not-allowed";
  const pos = direction === "left" ? "left-0" : "right-0";
  const icon =
    direction === "left" ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 md:h-6 md:w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 md:h-6 md:w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
      </svg>
    );

  return (
    <button
      type="button"
      className={`${common} ${pos} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon}
    </button>
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
   * Avatar placeholder with colored circle and initials.
   * No images are used; initials are derived from name (first two letters).
   */
  const initials = (name || "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Color ring effect using primary/secondary tones for subtle visual interest
  return (
    <div className="relative">
      <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center text-primary font-semibold ring-1 ring-primary/20">
        {initials}
      </div>
    </div>
  );
}
