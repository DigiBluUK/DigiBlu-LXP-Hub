"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import type { Course, SkillAreaId } from "@/lib/types";

// Downloads a blank training matrix (Excel) for the courses on screen. The
// spreadsheet library is loaded only when someone clicks, so pages stay light.
export function ExportMatrixButton({ courses, scope, areaId }: { courses: Course[]; scope: string; areaId?: SkillAreaId }) {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");

  const exportMatrix = async () => {
    setState("busy");
    try {
      const { downloadTrainingMatrix } = await import("@/lib/training-matrix");
      await downloadTrainingMatrix({ courses, scope, areaId });
      setState("idle");
    } catch {
      setState("error");
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        className="btn btn-ghost"
        disabled={state === "busy" || courses.length === 0}
        onClick={exportMatrix}
        title={`Download an Excel training matrix for these ${courses.length} courses`}
      >
        <Icon name="download" />
        {state === "busy" ? "Preparing…" : "Export training matrix"}
      </button>
      {state === "error" && (
        <span role="alert" className="text-sm text-[var(--accent-text)]">
          The file could not be created. Please try again.
        </span>
      )}
    </span>
  );
}
