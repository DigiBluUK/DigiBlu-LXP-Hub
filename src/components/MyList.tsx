"use client";

import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { COURSES } from "@/lib/catalogue";
import { useMyList } from "@/lib/my-list";

export function MyList() {
  const { ids } = useMyList();
  // Keep the order people saved things in; ignore ids for courses no longer listed.
  const saved = ids.map((id) => COURSES.find((c) => c.id === id)).filter((c) => c !== undefined);

  if (!saved.length) {
    return (
      <div className="empty">
        <p className="text-lg">Nothing saved yet.</p>
        <p className="muted mx-auto mt-1 max-w-md">
          Use the bookmark on any course to keep it here, so you can come back to it when you are ready.
        </p>
        <Link href="/courses/" className="btn btn-primary mt-5">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="muted mb-6">
        {saved.length} saved {saved.length === 1 ? "resource" : "resources"}
      </p>
      <div className="course-grid">
        {saved.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </>
  );
}
