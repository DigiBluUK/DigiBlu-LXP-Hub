import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">Page not found</span>
        <h1 className="h-page mt-4">We could not find that page</h1>
        <p className="lede mt-4">The course or page may have moved. Try browsing the full catalogue instead.</p>
        <Link href="/courses/" className="btn btn-primary mt-8">
          Browse courses
        </Link>
      </div>
    </section>
  );
}
