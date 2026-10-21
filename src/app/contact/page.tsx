import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForms } from "@/components/ContactForms";

export const metadata: Metadata = { title: "Contact and requests" };

export default function ContactPage() {
  return (
    <section className="section pt-12">
      <div className="container">
        <span className="eyebrow">Contact</span>
        <h1 className="h-page mt-4">Help us keep the hub complete</h1>
        <p className="lede mt-4">
          The hub should hold every course and resource that matters for your role. Request what is missing, or tell
          us about anything that needs fixing.
        </p>
        <div className="mt-10">
          {/* The forms read their pre-filled values from the URL, which only exists in the browser. */}
          <Suspense fallback={<p className="muted">Loading the form…</p>}>
            <ContactForms />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
