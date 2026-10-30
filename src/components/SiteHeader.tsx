"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ExportMatrixButton } from "@/components/ExportMatrixButton";
import { useMyList } from "@/lib/my-list";
import { THEME_KEY } from "@/lib/theme";

// The navigation follows digiblu.com: fixed, transparent at rest, and an inset
// rounded frosted-glass panel once the page scrolls past 24px. Below 980px the
// links move into a menu behind a hamburger, and the bar reads My list, theme
// button, menu. "My list" is the call to action on the right.

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/courses/", label: "Learning" },
  { href: "/areas/", label: "Areas of expertise" },
  { href: "/contact/", label: "Contact" },
];

type Theme = "light" | "dark";

const themeListeners = new Set<() => void>();

function readTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === "light" || attr === "dark") return attr;
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  const media = matchMedia("(prefers-color-scheme: light)");
  media.addEventListener("change", listener);
  return () => {
    themeListeners.delete(listener);
    media.removeEventListener("change", listener);
  };
}

function toggleTheme() {
  const next: Theme = readTheme() === "light" ? "dark" : "light";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
  themeListeners.forEach((listener) => listener());
}

function subscribeScroll(listener: () => void) {
  window.addEventListener("scroll", listener, { passive: true });
  return () => window.removeEventListener("scroll", listener);
}

function ThemeIcons() {
  // Shows the theme currently in effect, as on digiblu.com.
  return (
    <>
      <svg className="icon-moon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
      <svg className="icon-sun" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const isCurrent = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const { ids } = useMyList();
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => "dark" as Theme);
  const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 24, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const barRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const themeLabel = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
  const closeMenu = () => setMenuOpen(false);

  // The browser and installed-app chrome (address bar, status bar, title bar)
  // follow the theme in use, including an explicit choice made here.
  useEffect(() => {
    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.setAttribute("content", theme === "light" ? "#ffffff" : "#000000"));
  }, [theme]);

  // Pages pad their top by the bar's real height (--nav-h), so measure it
  // rather than guess: a mismatch hides content under the bar or leaves a gap.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const sync = () => document.documentElement.style.setProperty("--nav-h", `${bar.offsetHeight}px`);
    const observer = new ResizeObserver(sync);
    observer.observe(bar);
    sync();
    return () => observer.disconnect();
  }, []);

  // While the menu is open: Escape or a click outside closes it, and widening
  // back to desktop does not leave it latched open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!barRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 980) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    <div className={scrolled || menuOpen ? "site-nav is-scrolled" : "site-nav"}>
      <nav ref={barRef} className="site-nav__bar" aria-label="Main">
        <Link href="/" className="site-nav__logo" aria-label="Learning Experience Hub, home" onClick={closeMenu}>
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__label">Learning Experience Hub</span>
        </Link>

        <ul className="site-nav__center">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="site-nav__link" aria-current={isCurrent(link.href) ? "page" : undefined}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <ExportMatrixButton className="site-nav__link" />
          </li>
        </ul>

        <div className="site-nav__right">
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            <ThemeIcons />
          </button>
          <Link
            href="/my-list/"
            className="site-nav__cta"
            aria-current={isCurrent("/my-list/") ? "page" : undefined}
            onClick={closeMenu}
          >
            My list
            {ids.length > 0 && (
              <span className="site-nav__count" aria-label={`, ${ids.length} saved`}>
                {ids.length}
              </span>
            )}
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg className="icon-open" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <svg className="icon-close" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div id="mobile-menu" className={menuOpen ? "mobile-menu open" : "mobile-menu"}>
          <ul>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} aria-current={isCurrent(link.href) ? "page" : undefined} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mobile-menu__actions">
            <ExportMatrixButton className="mobile-menu__button" onExport={closeMenu} />
          </div>
        </div>
      </nav>
    </div>
  );
}
