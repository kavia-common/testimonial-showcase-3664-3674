import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * PUBLIC_INTERFACE
 * TestimonialCarousel
 * A responsive testimonial carousel using native scroll snapping with programmatic arrow navigation.
 * - Desktop: arrow buttons to scroll by one viewport width (smoothly).
 * - Mobile: native swipe/drag with scroll-snap.
 * Accessibility: keyboard arrows for navigation; buttons with aria-labels and focus styles.
 */
export default function TestimonialCarousel() {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Product Manager, Bluewave",
      rating: 5,
      text: "The carousel is slick and intuitive. Our customers love browsing reviews!",
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
      text: "Ocean Professional theme shines—subtle gradients and great legibility.",
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
      text: "Love the keyboard navigation and the swipe gestures on mobile!",
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
      text: "The best testimonial section we’ve tried. Fast, simple, beautiful.",
    },
  ];

  const updateScrollButtons = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollButtons();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons]);

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
      className="relative w-full"
      aria-label="Customer testimonials"
      onKeyDown={onKeyDown}
    >
      {/* Gradient background container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 to-gray-50 p-6 sm:p-10 shadow-soft">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-text">
              What our customers say
            </h2>
            <p className="mt-3 text-sm sm:text-base text-gray-600">
              Real feedback from teams using our platform every day.
            </p>
          </div>

          {/* Carousel wrapper with arrows */}
          <div className="relative">
            {/* Left Arrow - hidden on small screens */}
            <ArrowButton
              direction="left"
              onClick={() => scrollByViewport(-1)}
              disabled={!canScrollLeft}
              className="hidden md:flex left-0 -translate-x-1/2"
              ariaLabel="Scroll testimonials left"
            />
            {/* Right Arrow - hidden on small screens */}
            <ArrowButton
              direction="right"
              onClick={() => scrollByViewport(1)}
              disabled={!canScrollRight}
              className="hidden md:flex right-0 translate-x-1/2"
              ariaLabel="Scroll testimonials right"
            />

            {/* Scrollable container */}
            <div
              ref={containerRef}
              className="carousel snap-container overflow-x-auto overflow-y-hidden flex gap-4 sm:gap-6 scroll-smooth scrollbar-thin py-2 px-1 md:px-2"
              role="region"
              aria-roledescription="carousel"
              aria-label="Testimonials"
              tabIndex={0}
            >
              {testimonials.map((t) => (
                <article
                  key={t.id}
                  className="snap-item bg-surface min-w-[280px] md:min-w-[360px] lg:min-w-[420px] max-w-sm rounded-2xl shadow-soft border border-gray-100 p-5 sm:p-6 transition-transform duration-300 hover:-translate-y-1 focus-within:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center text-primary font-semibold">
                      {/* Placeholder avatar initial */}
                      {t.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-text">{t.name}</h3>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} filled={i < t.rating} />
                    ))}
                  </div>

                  <p className="mt-3 text-gray-700 text-sm sm:text-base leading-relaxed">
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

function ArrowButton({ direction, onClick, disabled, className = "", ariaLabel }) {
  const common =
    "absolute top-1/2 -translate-y-1/2 z-10 h-11 w-11 rounded-full bg-white border border-gray-200 shadow-soft text-primary hover:bg-primary hover:text-white transition-colors focus-ring disabled:opacity-40 disabled:cursor-not-allowed";
  const pos = direction === "left" ? "left-0" : "right-0";
  const icon = direction === "left" ? (
    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
    </svg>
  ) : (
    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
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

function Star({ filled }) {
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
