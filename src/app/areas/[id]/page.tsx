import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AreaCourses } from "@/components/AreaCourses";
import { SKILL_AREAS } from "@/content/skill-areas";
import { areaGradient, coursesInArea, getArea } from "@/lib/catalogue";

export const dynamicParams = false;

export function generateStaticParams() {
  return SKILL_AREAS.map((area) => ({ id: area.id }));
}

export async function generateMetadata({ params }: PageProps<"/areas/[id]">): Promise<Metadata> {
  const area = getArea((await params).id);
  return area ? { title: area.name, description: area.summary } : {};
}

export default async function AreaPage({ params }: PageProps<"/areas/[id]">) {
  const area = getArea((await params).id);
  if (!area) notFound();
  const courses = coursesInArea(area.id);
  const free = courses.filter((c) => c.cost === "Free").length;
  const certs = courses.filter((c) => c.outcome === "Certification").length;

  return (
    <section className="section pt-10">
      <div className="container">
        <nav aria-label="Breadcrumb" className="breadcrumb mb-6">
          <Link href="/areas/">Skill areas</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{area.name}</span>
        </nav>

        <div className="band" style={{ background: areaGradient(area.id) }}>
          <span className="eyebrow eyebrow--on-brand">Skill area</span>
          <h1 className="h-page mt-4">{area.name}</h1>
          <p className="lede mt-4">{area.description}</p>
          <p className="mt-6 text-white/85">
            {courses.length} resources · {certs} certifications · {free} free to start
          </p>
          <div className="band__roles mt-6">
            {area.roles.map((role) => (
              <span key={role} className="band__role">
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <AreaCourses areaId={area.id} />
        </div>
      </div>
    </section>
  );
}
