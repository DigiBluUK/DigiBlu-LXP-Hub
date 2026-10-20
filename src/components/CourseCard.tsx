import Link from "next/link";
import { Icon } from "@/components/Icon";
import { CostPill, OutcomePill } from "@/components/Pills";
import { SaveButton } from "@/components/SaveButton";
import { primaryArea } from "@/lib/catalogue";
import type { Course } from "@/lib/types";

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="course-card">
      <div className="course-card__top">
        <span className="course-card__area">{primaryArea(course).name}</span>
        <SaveButton courseId={course.id} title={course.title} />
      </div>
      <h3 className="course-card__title">
        <Link href={`/courses/${course.id}/`}>{course.title}</Link>
      </h3>
      <p className="course-card__provider">{course.provider}</p>
      <p className="course-card__desc">{course.description}</p>
      <div className="course-card__pills">
        <OutcomePill outcome={course.outcome} />
        <CostPill cost={course.cost} />
        <span className="pill">{course.level}</span>
      </div>
      <p className="course-card__meta">
        <Icon name="clock" size={14} />
        {course.duration} · {course.format}
      </p>
    </article>
  );
}
