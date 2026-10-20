"use client";

import { useSyncExternalStore } from "react";

// The round back-to-top button from digiblu.com: appears after 480px of scroll.
function subscribe(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  return () => window.removeEventListener("scroll", listener);
}

export function ScrollTop() {
  const visible = useSyncExternalStore(subscribe, () => window.scrollY > 480, () => false);

  return (
    <button
      type="button"
      className={visible ? "scroll-top visible" : "scroll-top"}
      aria-label="Back to top"
      tabIndex={visible ? undefined : -1}
      onClick={() => {
        const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
