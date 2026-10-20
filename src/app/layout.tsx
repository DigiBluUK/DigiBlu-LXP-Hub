import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ScrollTop } from "@/components/ScrollTop";
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
// apple-icon.png). Search engines are kept out until launch: set ALLOW_INDEXING=true
// on the production build when the hub goes live.
export const metadata: Metadata = {
  title: {
    default: "DigiBlu Learning Experience Knowledge Hub",
    template: "%s · DigiBlu Knowledge Hub",
  },
  description:
    "A curated guide to courses, certifications and free learning for everyone at DigiBlu, organised by skill area.",
  robots: process.env.ALLOW_INDEXING === "true" ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#000000" };

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
            <p>DigiBlu Learning Experience Knowledge Hub · Version 1</p>
            <p className="max-w-xl">
              Course details last checked {reviewed}. Prices and content are set by each provider and can change, so
              check the provider&apos;s page before you book.
            </p>
          </div>
        </footer>
        <ScrollTop />
      </body>
    </html>
  );
}
