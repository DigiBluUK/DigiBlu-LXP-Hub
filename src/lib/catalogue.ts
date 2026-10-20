import raw from "@/content/courses.json";
import { PROVIDER_ICONS } from "@/content/provider-icons";
import { PROVIDER_LIST, type ProviderEntry } from "@/content/providers";
import { SKILL_AREAS } from "@/content/skill-areas";
import {
  COSTS,
  FORMATS,
  LEVELS,
  OUTCOMES,
  type Course,
  type SkillArea,
  type SkillAreaId,
} from "@/lib/types";

// Runs during `npm run build` (and in development). Any problem in courses.json
// stops the build with a message naming the entry and the field, so a broken
// content update can never reach users.
function validate(input: unknown): Course[] {
  if (!Array.isArray(input)) throw new Error("courses.json must contain a JSON array of courses.");

  const areaIds = new Set<string>(SKILL_AREAS.map((a) => a.id));
  const seen = new Set<string>();
  const problems: string[] = [];

  input.forEach((item: unknown, index) => {
    if (!item || typeof item !== "object") {
      problems.push(`item ${index + 1}: is not an object`);
      return;
    }
    const c = item as Record<string, unknown>;
    const label = `item ${index + 1}${typeof c.id === "string" ? ` (${c.id})` : ""}`;
    const fail = (message: string) => problems.push(`${label}: ${message}`);

    for (const key of ["id", "title", "provider", "url", "description", "duration", "lastReviewed"]) {
      if (typeof c[key] !== "string" || !(c[key] as string).trim()) fail(`"${key}" is required`);
    }
    for (const key of ["costDetails", "prerequisites"]) {
      if (typeof c[key] !== "string") fail(`"${key}" must be text (use "" when there is nothing to say)`);
    }
    if (typeof c.id === "string") {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(c.id)) fail(`"id" must be lower-case words joined by hyphens`);
      if (seen.has(c.id)) fail(`"id" is used by another course`);
      seen.add(c.id);
    }
    if (typeof c.url === "string" && !c.url.startsWith("https://")) fail(`"url" must start with https://`);
    if (typeof c.lastReviewed === "string" && !/^\d{4}-\d{2}-\d{2}$/.test(c.lastReviewed)) {
      fail(`"lastReviewed" must be a date written like 2026-10-20`);
    }

    const oneOf = (key: string, allowed: readonly string[]) => {
      if (!allowed.includes(c[key] as string)) fail(`"${key}" must be one of: ${allowed.join(", ")}`);
    };
    oneOf("level", LEVELS);
    oneOf("format", FORMATS);
    oneOf("cost", COSTS);
    oneOf("outcome", OUTCOMES);

    const textList = (key: string, required: boolean) => {
      const value = c[key];
      if (!Array.isArray(value) || value.some((v) => typeof v !== "string") || (required && value.length === 0)) {
        fail(`"${key}" must be a list of text${required ? " with at least one entry" : ""}`);
      }
    };
    textList("skillAreas", true);
    textList("roles", true);
    textList("tags", false);
    if (Array.isArray(c.skillAreas)) {
      for (const area of c.skillAreas) if (!areaIds.has(area as string)) fail(`unknown skill area "${area}"`);
    }

    if (JSON.stringify(c).includes("—")) {
      fail("contains an em dash; the DigiBlu style uses a spaced hyphen ( - )");
    }
  });

  if (problems.length) {
    throw new Error(`courses.json has ${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  }
  return input as Course[];
}

export const COURSES: Course[] = validate(raw);

const coursesById = new Map(COURSES.map((c) => [c.id, c]));

export function getCourse(id: string): Course | undefined {
  return coursesById.get(id);
}

export function getArea(id: string): SkillArea | undefined {
  return SKILL_AREAS.find((a) => a.id === id);
}

export function primaryArea(course: Course): SkillArea {
  return getArea(course.skillAreas[0])!;
}

export function coursesInArea(id: SkillAreaId): Course[] {
  return COURSES.filter((c) => c.skillAreas.includes(id));
}

/** Panels cycle through the four brand gradients by position, so neighbours never repeat. */
export function areaGradient(id: SkillAreaId): string {
  const index = SKILL_AREAS.findIndex((a) => a.id === id);
  return `var(--grad-${(index % 4) + 1})`;
}

const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export interface Provider extends ProviderEntry {
  icon?: string;
  count: number;
  pattern: RegExp;
}

export const PROVIDERS: Provider[] = PROVIDER_LIST.map((entry) => {
  const pattern = new RegExp(`\\b(${entry.match.map(escapeRegExp).join("|")})\\b`, "i");
  return {
    ...entry,
    icon: PROVIDER_ICONS[entry.slug],
    pattern,
    count: COURSES.filter((c) => pattern.test(c.provider)).length,
  };
}).filter((p) => p.count > 0);

export function getProvider(slug: string): Provider | undefined {
  return PROVIDERS.find((p) => p.slug === slug);
}

export const STATS = {
  total: COURSES.length,
  free: COURSES.filter((c) => c.cost === "Free").length,
  certifications: COURSES.filter((c) => c.outcome === "Certification").length,
  areas: SKILL_AREAS.length,
  lastReviewed: COURSES.reduce((latest, c) => (c.lastReviewed > latest ? c.lastReviewed : latest), ""),
};
