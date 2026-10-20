import type { Outcome } from "@/lib/types";

// The training matrix grading scale. Change a label or its meaning here and the
// exported workbook's drop-downs, colours and key all follow. Keep the values
// 0 to 5: a later version of the hub will import completed matrices by them.
export const GRADES = [
  { value: 0, label: "Not started", meaning: "No exposure to it yet.", fill: "F2F4F7", text: "1F2933" },
  { value: 1, label: "Aware", meaning: "Knows what it is and when it is used.", fill: "DCE8FD", text: "0A1F6E" },
  { value: 2, label: "Learning", meaning: "Studying it or practising with support.", fill: "B5CEFB", text: "0A1F6E" },
  { value: 3, label: "Working knowledge", meaning: "Uses it in day-to-day work with little help.", fill: "6AA4FF", text: "0A1F6E" },
  { value: 4, label: "Advanced", meaning: "Handles complex work on their own and helps others.", fill: "1D6EF5", text: "FFFFFF" },
  { value: 5, label: "Expert", meaning: "The go-to person; holds the certification where one exists.", fill: "0A1F6E", text: "FFFFFF" },
] as const;

/** Column header colours in the workbook, by what the course gives you. */
export const MATRIX_HEADERS: Record<Outcome, { label: string; fill: string; text: string }> = {
  Certification: { label: "Certification", fill: "0A1F6E", text: "FFFFFF" },
  "Completion certificate": { label: "Course with a certificate", fill: "1D6EF5", text: "FFFFFF" },
  Knowledge: { label: "Knowledge resource", fill: "E7EDF7", text: "0A1F6E" },
};

/** Blank rows for people on each area sheet. */
export const MATRIX_PEOPLE_ROWS = 50;
