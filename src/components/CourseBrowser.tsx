"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CourseCard } from "@/components/CourseCard";
import { Icon } from "@/components/Icon";
import { SKILL_AREAS } from "@/content/skill-areas";
import { COURSES } from "@/lib/catalogue";
import { COSTS, FORMATS, LEVELS, OUTCOMES, type Course } from "@/lib/types";

const GROUPS = [
  { key: "area", label: "Skill area", options: SKILL_AREAS.map((a) => ({ value: a.id, label: a.name })) },
  { key: "outcome", label: "What you get", options: OUTCOMES.map((v) => ({ value: v, label: v })) },
  { key: "cost", label: "Cost", options: COSTS.map((v) => ({ value: v, label: v })) },
  { key: "level", label: "Level", options: LEVELS.map((v) => ({ value: v, label: v })) },
  { key: "format", label: "Format", options: FORMATS.map((v) => ({ value: v, label: v })) },
] as const;

type GroupKey = (typeof GROUPS)[number]["key"];
type Filters = Record<GroupKey, string[]> & { q: string; sort: string };

const fieldOf = (course: Course, key: GroupKey): string[] =>
  key === "area" ? course.skillAreas : [course[key]];

const haystacks = new Map(
  COURSES.map((c) => [
    c.id,
    [c.title, c.provider, c.description, ...c.tags, ...c.roles, ...c.skillAreas].join(" ").toLowerCase(),
  ]),
);

function parse(params: URLSearchParams): Filters {
  const list = (key: string) => params.get(key)?.split(",").filter(Boolean) ?? [];
  return {
    q: params.get("q") ?? "",
    sort: params.get("sort") ?? "",
    area: list("area"),
    outcome: list("outcome"),
    cost: list("cost"),
    level: list("level"),
    format: list("format"),
  };
}

function toQuery(filters: Filters): string {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  for (const { key } of GROUPS) if (filters[key].length) params.set(key, filters[key].join(","));
  if (filters.sort) params.set("sort", filters.sort);
  return params.toString();
}

export function CourseBrowser() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => parse(searchParams));
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Mirror the filters into the address bar so a filtered view can be shared as a link.
  useEffect(() => {
    const query = toQuery(filters);
    window.history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }, [filters]);

  const results = useMemo(() => {
    const tokens = filters.q.toLowerCase().split(/\s+/).filter(Boolean);
    const matches = COURSES.filter(
      (course) =>
        GROUPS.every(({ key }) => !filters[key].length || fieldOf(course, key).some((v) => filters[key].includes(v))) &&
        tokens.every((t) => haystacks.get(course.id)!.includes(t)),
    );
    if (filters.sort === "title") return [...matches].sort((a, b) => a.title.localeCompare(b.title));
    if (filters.sort === "level") return [...matches].sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level));
    return matches;
  }, [filters]);

  const activeCount = GROUPS.reduce((n, { key }) => n + filters[key].length, 0) + (filters.q ? 1 : 0);

  const toggle = (key: GroupKey, value: string) =>
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value],
    }));

  const clearAll = () => setFilters({ q: "", sort: filters.sort, area: [], outcome: [], cost: [], level: [], format: [] });

  return (
    <>
      <div className="search">
        <Icon name="search" />
        <input
          type="search"
          value={filters.q}
          onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          placeholder="Search by course, skill, tool or role, e.g. Power BI, Scrum, Copilot"
          aria-label="Search courses"
        />
      </div>

      <div className="toolbar">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn btn-ghost filters-toggle"
            aria-expanded={filtersOpen}
            aria-controls="filters"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <Icon name="sliders" /> Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          <p className="muted" aria-live="polite">
            Showing <strong className="text-[var(--text)]">{results.length}</strong> of {COURSES.length} resources
          </p>
          {activeCount > 0 && (
            <button type="button" className="chip" onClick={clearAll}>
              Clear all
            </button>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm muted">
          Sort
          <select
            className="select"
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
          >
            <option value="">Recommended</option>
            <option value="title">Title, A to Z</option>
            <option value="level">Level, beginner first</option>
          </select>
        </label>
      </div>

      <div className="browse">
        <aside id="filters" className="filters" data-open={filtersOpen} aria-label="Filters">
          {GROUPS.map((group) => (
            <div key={group.key} role="group" aria-labelledby={`filter-${group.key}`}>
              <p id={`filter-${group.key}`} className="filter-group__label">
                {group.label}
              </p>
              <div className="filter-group__chips">
                {group.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="chip"
                    aria-pressed={filters[group.key].includes(option.value)}
                    onClick={() => toggle(group.key, option.value)}
                  >
                    {option.label}
                    <span className="chip__count">
                      {COURSES.filter((c) => fieldOf(c, group.key).includes(option.value)).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <div>
          {results.length ? (
            <div className="course-grid">
              {results.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <p className="text-lg">No resources match those filters.</p>
              <p className="muted mt-1">Try removing a filter or searching for something broader.</p>
              <button type="button" className="btn btn-ghost mt-5" onClick={clearAll}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
