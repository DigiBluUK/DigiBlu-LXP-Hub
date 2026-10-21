import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/CourseCard";
import { Icon } from "@/components/Icon";
import { CostPill, OutcomePill } from "@/components/Pills";
import { SaveButton } from "@/components/SaveButton";
import { OUTCOME_INFO } from "@/content/skill-areas";
import { COURSES, coursesInArea, getArea, getCourse, primaryArea } from "@/lib/catalogue";

// One page per course is written at build time; unknown ids are a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return COURSES.map((course) => ({ id: course.id }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[id]">): Promise<Metadata> {
  const course = getCourse((await params).id);
  return course ? { title: course.title, description: course.description } : {};
}

export default async function CoursePage({ params }: PageProps<"/courses/[id]">) {
  const course = getCourse((await params).id);
  if (!course) notFound();

  const area = primaryArea(course);
  const related = coursesInArea(area.id)
    .filter((c) => c.id !== course.id)
    .sort((a, b) => Number(b.outcome === course.outcome) - Number(a.outcome === course.outcome))
    .slice(0, 3);
  const reviewed = new Date(`${course.lastReviewed}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const facts: { label: string; value: string; wide?: boolean }[] = [
    { label: "What you get", value: course.outcome },
    { label: "Cost", value: course.costDetails ? `${course.cost} · ${course.costDetails}` : course.cost },
    { label: "Level", value: course.level },
    { label: "Format", value: course.format },
    { label: "Time to complete", value: course.duration },
    { label: "Provider", value: course.provider },
    { label: "Suitable for", value: course.roles.join(", "), wide: true },
    { label: "Before you start", value: course.prerequisites || "No prerequisites", wide: true },
  ];

  return (
    <section className="section pt-10">
      <div className="container">
        <nav aria-label="Breadcrumb" className="breadcrumb">
          <Link href="/courses/">Browse</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/areas/${area.id}/`}>{area.name}</Link>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-wrap gap-2">
              <OutcomePill outcome={course.outcome} />
              <CostPill cost={course.cost} />
              <span className="pill">{course.level}</span>
            </div>
            <h1 className="h-page mt-5">{course.title}</h1>
            <p className="muted mt-3 text-lg">{course.provider}</p>
            <p className="lede mt-6 !text-[var(--text)]">{course.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={course.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Go to course <Icon name="external" size={16} />
                <span className="sr-only">(opens the provider&apos;s site in a new tab)</span>
              </a>
              <SaveButton courseId={course.id} title={course.title} full />
            </div>

            <dl className="facts mt-10">
              {facts.map((fact) => (
                <div key={fact.label} className={fact.wide ? "fact fact--wide" : "fact"}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>

            {course.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
                {course.tags.map((tag) => (
                  <Link key={tag} href={`/courses/?q=${encodeURIComponent(tag)}`} className="chip">
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <div className="panel">
              <p className="filter-group__label">About this type</p>
              <h2 className="text-lg">{OUTCOME_INFO[course.outcome].heading}</h2>
              <p className="muted mt-2">{OUTCOME_INFO[course.outcome].blurb}</p>
            </div>
            <div className="panel">
              <p className="filter-group__label">Skill areas</p>
              <div className="flex flex-wrap gap-2">
                {course.skillAreas.map((id) => (
                  <Link key={id} href={`/areas/${id}/`} className="chip">
                    {getArea(id)!.name}
                  </Link>
                ))}
              </div>
            </div>
            <p className="muted px-1 text-sm">
              Last checked {reviewed}. Details are set by the provider and can change.{" "}
              <Link
                href={`/contact/?type=message&topic=problem&course=${course.id}`}
                className="text-[var(--accent-text)] underline-offset-4 hover:underline"
              >
                Something wrong or out of date? Tell us
              </Link>
            </p>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="h-section">More in {area.name}</h2>
            <div className="course-grid mt-8">
              {related.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
