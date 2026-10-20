"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useMyList } from "@/lib/my-list";
import { THEME_KEY } from "@/lib/theme";

const LINKS = [
  { href: "/courses/", label: "Browse" },
  { href: "/areas/", label: "Skill areas" },
  { href: "/my-list/", label: "My list" },
];

function toggleTheme() {
  const root = document.documentElement;
  const current = root.dataset.theme ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const next = current === "light" ? "dark" : "light";
  root.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    // Storage blocked: the choice lasts for this page only.
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const { ids } = useMyList();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand" aria-label="DigiBlu Knowledge Hub, home">
          <span className="brand__mark" aria-hidden="true" />
          <span className="brand__divider" aria-hidden="true" />
          <span className="brand__label">Knowledge Hub</span>
        </Link>
        <nav aria-label="Main" className="site-nav">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="site-nav__link"
              aria-current={path.startsWith(link.href) ? "page" : undefined}
            >
              {link.label}
              {link.href === "/my-list/" && ids.length > 0 && (
                <span className="count-badge" aria-label={`${ids.length} saved`}>
                  {ids.length}
                </span>
              )}
            </Link>
          ))}
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label="Switch between light and dark theme"
            title="Switch theme"
          >
            <span className="theme-toggle__sun">
              <Icon name="sun" />
            </span>
            <span className="theme-toggle__moon">
              <Icon name="moon" />
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
