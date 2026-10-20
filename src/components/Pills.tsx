import type { Cost, Outcome } from "@/lib/types";

const OUTCOME_CLASS: Record<Outcome, string> = {
  Certification: "pill pill--cert",
  "Completion certificate": "pill pill--certificate",
  Knowledge: "pill",
};

export function OutcomePill({ outcome }: { outcome: Outcome }) {
  return <span className={OUTCOME_CLASS[outcome]}>{outcome}</span>;
}

export function CostPill({ cost }: { cost: Cost }) {
  return <span className={cost === "Free" ? "pill pill--free" : "pill"}>{cost}</span>;
}
