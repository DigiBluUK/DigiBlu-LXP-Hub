"use client";

import { Icon } from "@/components/Icon";
import { useMyList } from "@/lib/my-list";

export function SaveButton({ courseId, title, full = false }: { courseId: string; title: string; full?: boolean }) {
  const { has, toggle } = useMyList();
  const saved = has(courseId);

  if (full) {
    return (
      <button type="button" className="btn btn-ghost" aria-pressed={saved} onClick={() => toggle(courseId)}>
        <Icon name="bookmark" filled={saved} />
        {saved ? "Saved to My list" : "Save to My list"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="icon-btn"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from My list` : `Save ${title} to My list`}
      title={saved ? "Remove from My list" : "Save to My list"}
      onClick={() => toggle(courseId)}
    >
      <Icon name="bookmark" size={16} filled={saved} />
    </button>
  );
}
