import type { Metadata } from "next";
import { AreaCard } from "@/components/AreaCard";
import { SKILL_AREAS } from "@/content/skill-areas";

export const metadata: Metadata = { title: "Learning" };

export default function AreasPage() {
  return (
    <section className="section pt-12">
      <div className="container">
        <span className="eyebrow">Learning</span>
        <h1 className="h-page mt-4">Learning by area of expertise</h1>
        <p className="lede mt-4">
          Each area brings together certifications, structured courses and free resources for the roles in it.
        </p>
        <div className="area-grid mt-10">
          {SKILL_AREAS.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </div>
    </section>
  );
}
