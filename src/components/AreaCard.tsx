import Link from "next/link";
import { Icon } from "@/components/Icon";
import { areaGradient, coursesInArea } from "@/lib/catalogue";
import type { SkillArea } from "@/lib/types";

export function AreaCard({ area }: { area: SkillArea }) {
  const count = coursesInArea(area.id).length;
  return (
    <Link href={`/areas/${area.id}/`} className="area-card" style={{ background: areaGradient(area.id) }}>
      <h3 className="area-card__name">{area.name}</h3>
      <p className="area-card__summary">{area.summary}</p>
      <div className="area-card__foot">
        <span>
          {count} resources · {area.roles.length} roles
        </span>
        <span className="area-card__arrow" aria-hidden="true">
          <Icon name="arrow" size={16} />
        </span>
      </div>
    </Link>
  );
}
