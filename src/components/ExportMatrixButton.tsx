"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";

// Downloads the training matrix (Excel) for the whole catalogue. This sits in the
// nav on every page, so the catalogue and the spreadsheet library load only on click.
export function ExportMatrixButton({ className, onExport }: { className: string; onExport?: () => void }) {
  const [state, setState] = useState<"idle" | "busy" | "error">("idle");

  const exportMatrix = async () => {
    onExport?.();
    setState("busy");
    try {
      const [{ COURSES }, { downloadTrainingMatrix }] = await Promise.all([
        import("@/lib/catalogue"),
        import("@/lib/training-matrix"),
      ]);
      await downloadTrainingMatrix(COURSES);
      setState("idle");
    } catch {
      setState("error");
    }
  };

  return (
    <button
      type="button"
      className={className}
      disabled={state === "busy"}
      onClick={exportMatrix}
      title="Download the training matrix as an Excel file"
    >
      <Icon name="download" size={16} />
      <span aria-live="polite">
        {state === "busy" ? "Preparing…" : state === "error" ? "Export failed - try again" : "Export training matrix"}
      </span>
    </button>
  );
}
