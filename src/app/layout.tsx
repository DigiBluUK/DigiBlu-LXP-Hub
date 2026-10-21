import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { ScrollTop } from "@/components/ScrollTop";
import { ServiceWorker } from "@/components/ServiceWorker";
import { SiteHeader } from "@/components/SiteHeader";
import { STATS } from "@/lib/catalogue";
import { THEME_INIT } from "@/lib/theme";
import "./globals.css";

const dmSans = localFont({
  src: "./fonts/dmsans.woff2",
  weight: "100 1000",
  display: "swap",
  variable: "--font-dm-sans",
});

// Favicons come from the file conventions in this folder (favicon.ico, icon.svg,
// apple-icon.png) and the installed-app icons from manifest.ts. The hub is for
// DigiBlu employees only, so search engines are always kept out.
export const metadata: Metadata = {
  title: {
    default: "DigiBlu Learning Experience Knowledge Hub",
    template: "%s · DigiBlu Knowledge Hub",
  },
  description:
    "Courses, certifications and free learning for everyone at DigiBlu, organised by skill area and role.",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Knowledge Hub", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

// viewportFit "cover" lets the installed app use the full screen; the CSS keeps
// content clear of notches and the home indicator with env(safe-area-inset-*).
// SiteHeader keeps theme-color in step with the theme in use.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

const reviewed = new Date(`${STATS.lastReviewed}T00:00:00`).toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: THEME_INIT may set data-theme before React hydrates.
    <html lang="en-GB" className={dmSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <footer className="site-footer">
          <div className="container flex flex-wrap justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p>DigiBlu Learning Experience Knowledge Hub · Version 1</p>
              <p className="flex flex-wrap gap-x-5 gap-y-1">
                <Link href="/contact/?type=request" className="footer-link">
                  Request a course
                </Link>
                <Link href="/contact/?type=message" className="footer-link">
                  Contact the hub team
                </Link>
              </p>
            </div>
            <p className="max-w-xl">
              Course details last checked {reviewed}. Prices and content are set by each provider and can change, so
              check the provider&apos;s page before you book.
            </p>
          </div>
        </footer>
        <ScrollTop />
        <ServiceWorker />
      </body>
    </html>
  );
}
