// The shape of the hub's content. `src/lib/catalogue.ts` checks every entry in
// `src/content/courses.json` against these lists at build time.

export const SKILL_AREA_IDS = [
  "data-analytics",
  "ai",
  "automation-low-code",
  "software-development",
  "cloud-infrastructure",
  "project-product-management",
  "leadership-soft-skills",
] as const;

export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
export const FORMATS = ["Online course", "Learning path", "Video", "Guide", "Book"] as const;
export const COSTS = ["Free", "Paid"] as const;
export const OUTCOMES = ["Certification", "Completion certificate", "Knowledge"] as const;

export type SkillAreaId = (typeof SKILL_AREA_IDS)[number];
export type Level = (typeof LEVELS)[number];
export type Format = (typeof FORMATS)[number];
export type Cost = (typeof COSTS)[number];
export type Outcome = (typeof OUTCOMES)[number];

export interface Course {
  /**
   * Permanent identifier. Saved lists (and, later, progress records) point at
   * this, so never change or reuse an id once it has been published.
   */
  id: string;
  title: string;
  provider: string;
  url: string;
  description: string;
  /** Primary area first: it decides where the course is listed by default. */
  skillAreas: SkillAreaId[];
  roles: string[];
  level: Level;
  format: Format;
  cost: Cost;
  costDetails: string;
  outcome: Outcome;
  duration: string;
  prerequisites: string;
  tags: string[];
  /** Date the entry was last checked against the provider's page, YYYY-MM-DD. */
  lastReviewed: string;
}

export interface SkillArea {
  id: SkillAreaId;
  name: string;
  /** One line for cards. */
  summary: string;
  /** Intro paragraph on the area's own page. */
  description: string;
  roles: string[];
}
