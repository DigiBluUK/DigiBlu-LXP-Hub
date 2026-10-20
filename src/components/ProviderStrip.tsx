import type { CSSProperties } from "react";
import Link from "next/link";
import { PROVIDERS } from "@/lib/catalogue";

// Auto-scrolling strip of course providers, built like the clients strip on
// digiblu.com: two identical groups in a track animated to -50% so the loop is
// seamless, paused on hover or keyboard focus, and static under reduced motion.
// Only the first group is exposed to assistive technology and the tab order.
export function ProviderStrip() {
  const group = (hidden: boolean) => (
    <ul className="providers__group" aria-hidden={hidden || undefined}>
      {PROVIDERS.map((p) => (
        <li key={p.slug}>
          <Link
            href={`/courses/?provider=${p.slug}`}
            className="provider"
            tabIndex={hidden ? -1 : undefined}
            title={`${p.count} ${p.count === 1 ? "resource" : "resources"} from ${p.name}`}
          >
            {p.icon && (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d={p.icon} />
              </svg>
            )}
            <span>{p.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="providers">
      <p className="providers__label">Courses and certifications from</p>
      <div className="providers__viewport">
        {/* Duration scales with the number of providers so the pace stays the same. */}
        <div className="providers__track" style={{ "--providers-duration": `${PROVIDERS.length * 3}s` } as CSSProperties}>
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  );
}
