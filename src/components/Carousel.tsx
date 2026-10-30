"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/Icon";

// A row of cards that swipes sideways on phones, with the next card peeking in
// and position dots underneath. `className` keeps its normal layout (such as
// area-grid) above the phone breakpoint; pass `always` to stay a row at every
// width, with previous and next buttons beside the heading on larger screens.
export function Carousel({
  label,
  className = "",
  always = false,
  heading,
  children,
}: {
  label: string;
  className?: string;
  always?: boolean;
  heading?: ReactNode;
  children: ReactNode;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [ends, setEnds] = useState({ start: true, end: false });
  const count = Children.count(children);

  const sync = () => {
    const el = track.current;
    if (!el) return;
    const start = el.getBoundingClientRect().left + parseFloat(getComputedStyle(el).paddingLeft);
    let nearest = 0;
    let distance = Infinity;
    Array.from(el.children).forEach((item, i) => {
      const gap = Math.abs(item.getBoundingClientRect().left - start);
      if (gap < distance) {
        distance = gap;
        nearest = i;
      }
    });
    setActive(nearest);
    setEnds({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  };

  // Also runs once on load, so the buttons are right before anyone scrolls.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const page = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.9, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <div className={always ? "carousel carousel--always" : "carousel"}>
      {(heading || always) && (
        <div className="carousel__head">
          {heading}
          {always && !(ends.start && ends.end) && (
            <div className="carousel__arrows">
              <button type="button" className="icon-btn" aria-label={`Previous: ${label}`} disabled={ends.start} onClick={() => page(-1)}>
                <Icon name="back" size={16} />
              </button>
              <button type="button" className="icon-btn" aria-label={`Next: ${label}`} disabled={ends.end} onClick={() => page(1)}>
                <Icon name="arrow" size={16} />
              </button>
            </div>
          )}
        </div>
      )}
      <div ref={track} className={`carousel__track ${className}`} role="group" aria-label={label} onScroll={sync}>
        {children}
      </div>
      <div className="carousel__dots" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={i === active ? "carousel__dot is-active" : "carousel__dot"} />
        ))}
      </div>
    </div>
  );
}
