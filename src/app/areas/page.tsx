import type { Metadata } from "next";
import { AreaCard } from "@/components/AreaCard";
import { SKILL_AREAS } from "@/content/skill-areas";

export const metadata: Metadata = { title: "Areas of expertise" };

export default function AreasPage() {
  return (
    <section className="section pt-12">
      <div className="container">
        <span className="eyebrow">Areas of expertise</span>
        <h1 className="h-page mt-4">Learning by area of expertise</h1>
        <p className="lede mt-4">
          Each area brings together certifications, structured courses and free resources for the roles in it.
        </p>
        <div className="area-grid area-grid--compact mt-10">
          {SKILL_AREAS.map((area) => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </div>
    </section>
  );
}
