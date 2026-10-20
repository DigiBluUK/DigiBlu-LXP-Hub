"use client";

import { useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { OUTCOME_INFO } from "@/content/skill-areas";
import { coursesInArea, getArea } from "@/lib/catalogue";
import { OUTCOMES, type SkillAreaId } from "@/lib/types";

export function AreaCourses({ areaId }: { areaId: SkillAreaId }) {
  const area = getArea(areaId)!;
  const all = coursesInArea(areaId);
  const roles = area.roles.filter((role) => all.some((c) => c.roles.includes(role)));
  const [role, setRole] = useState<string | null>(null);
  const courses = role ? all.filter((c) => c.roles.includes(role)) : all;

  return (
    <>
      <div role="group" aria-label="Filter by role" className="flex flex-wrap items-center gap-2">
        <span className="filter-group__label !mb-0 mr-2">I am a</span>
        <button type="button" className="chip" aria-pressed={role === null} onClick={() => setRole(null)}>
          Any role
        </button>
        {roles.map((r) => (
          <button key={r} type="button" className="chip" aria-pressed={role === r} onClick={() => setRole(r)}>
            {r}
          </button>
        ))}
      </div>

      {OUTCOMES.map((outcome) => {
        const group = courses.filter((c) => c.outcome === outcome);
        if (!group.length) return null;
        return (
          <section key={outcome} className="mt-14" aria-labelledby={`group-${outcome}`}>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id={`group-${outcome}`} className="h-section">
                  {OUTCOME_INFO[outcome].heading} <span className="muted text-[0.6em]">{group.length}</span>
                </h2>
                <p className="muted mt-2 max-w-2xl">{OUTCOME_INFO[outcome].blurb}</p>
              </div>
            </div>
            <div className="course-grid">
              {group.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
