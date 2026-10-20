import Form from "next/form";
import Link from "next/link";
import { AreaCard } from "@/components/AreaCard";
import { Icon } from "@/components/Icon";
import { ProviderStrip } from "@/components/ProviderStrip";
import { OUTCOME_INFO, SKILL_AREAS } from "@/content/skill-areas";
import { COURSES, STATS } from "@/lib/catalogue";
import { OUTCOMES } from "@/lib/types";

// Example searches, not a popularity ranking: the hub keeps no usage data.
const SUGGESTIONS = ["Power BI", "Copilot", "Azure", "Scrum", "Leadership"];

const ROADMAP = [
  {
    stage: "Now",
    title: "Find and save",
    text: "Browse by skill area and role, filter by what you get and what it costs, and save courses to My list on this device.",
  },
  {
    stage: "Next",
    title: "Sign in and track",
    text: "Sign in with your DigiBlu Microsoft account, track your progress on each course, and keep your list on any device.",
  },
  {
    stage: "Later",
    title: "Learning paths",
    text: "A suggested path for each role, and new courses added as they are reviewed.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="eyebrow">DigiBlu · Learning Experience Knowledge Hub</span>
          <h1 className="h-hero mt-6 max-w-4xl">
            Find the right learning <span className="accent">for your role.</span>
          </h1>
          <p className="lede mt-6">
            Courses, certifications and free resources for everyone at DigiBlu, grouped by skill area and role. See what
            each one gives you and what it costs, and save the ones you want to come back to.
          </p>

          <Form action="/courses/" className="mt-10 max-w-2xl" role="search">
            <div className="search">
              <Icon name="search" />
              <input
                name="q"
                type="search"
                placeholder="What do you want to learn? e.g. Power BI, Scrum, Copilot"
                aria-label="Search courses"
              />
            </div>
          </Form>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="muted text-sm">Try:</span>
            {SUGGESTIONS.map((s) => (
              <Link key={s} href={`/courses/?q=${encodeURIComponent(s)}`} className="chip">
                {s}
              </Link>
            ))}
          </div>

          <div className="stats mt-16">
            {[
              [STATS.total, "learning resources"],
              [STATS.areas, "skill areas"],
              [STATS.certifications, "industry certifications"],
              [STATS.free, "free to start"],
            ].map(([value, label]) => (
              <div key={label} className="stat">
                <p className="stat__value">{value}</p>
                <p className="stat__label">{label}</p>
              </div>
            ))}
          </div>

          <ProviderStrip />
        </div>
      </section>

      <section className="section" aria-labelledby="areas-heading">
        <div className="container">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Skill areas</span>
              <h2 id="areas-heading" className="h-section mt-4">
                Start with your area of work
              </h2>
            </div>
            <Link href="/courses/" className="btn btn-ghost">
              Browse everything <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="area-grid">
            {SKILL_AREAS.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="outcomes-heading">
        <div className="container">
          <span className="eyebrow">Three kinds of learning</span>
          <h2 id="outcomes-heading" className="h-section mt-4 max-w-3xl">
            Know what you will walk away with before you start
          </h2>
          <div className="outcome-grid mt-10">
            {OUTCOMES.map((outcome) => {
              const count = COURSES.filter((c) => c.outcome === outcome).length;
              return (
                <Link
                  key={outcome}
                  href={`/courses/?outcome=${encodeURIComponent(outcome)}`}
                  className="panel flex flex-col gap-3 transition-colors hover:border-[var(--hairline)]"
                >
                  <span className="stat__value">{count}</span>
                  <h3 className="text-xl">{OUTCOME_INFO[outcome].heading}</h3>
                  <p className="muted">{OUTCOME_INFO[outcome].blurb}</p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm text-[var(--accent-text)]">
                    See all <Icon name="arrow" size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section pt-0" aria-labelledby="roadmap-heading">
        <div className="container">
          <div className="band" style={{ background: "var(--brand-fill)" }}>
            <span className="eyebrow eyebrow--on-brand">What&apos;s coming</span>
            <h2 id="roadmap-heading" className="h-section mt-4 max-w-3xl">
              This is the first version of the hub
            </h2>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {ROADMAP.map((step) => (
                <div key={step.title} className="border-t border-white/30 pt-5">
                  <p className="text-sm uppercase tracking-[1.4px] text-white/70">{step.stage}</p>
                  <h3 className="mt-2 text-xl">{step.title}</h3>
                  <p className="mt-2 text-white/80">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
