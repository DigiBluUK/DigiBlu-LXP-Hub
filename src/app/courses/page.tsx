import type { Metadata } from "next";
import { Suspense } from "react";
import { CourseBrowser } from "@/components/CourseBrowser";

export const metadata: Metadata = { title: "Browse courses" };

export default function CoursesPage() {
  return (
    <section className="section pt-12">
      <div className="container">
        <span className="eyebrow">Browse</span>
        <h1 className="h-page mt-4">All learning resources</h1>
        <p className="lede mt-4">
          Search across every area of learning, then narrow down by what you get, cost, level and format.
        </p>
        <div className="mt-10">
          {/* The browser reads filters from the URL, which only exists in the browser. */}
          <Suspense fallback={<p className="muted">Loading courses…</p>}>
            <CourseBrowser />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
