import type { Cell, DataValidation, Workbook } from "exceljs";
import { GRADES, MATRIX_HEADERS, MATRIX_PEOPLE_ROWS } from "@/content/matrix";
import { OUTCOME_INFO, SKILL_AREAS } from "@/content/skill-areas";
import { OUTCOMES, type Course, type SkillAreaId } from "@/lib/types";

// Builds the training matrix workbook in the browser and downloads it. The hub
// never sees the names people type in: the file is a blank template that lives
// on SharePoint or Teams once filled in.
//
// Each area sheet: row 1 the area name, row 2 one column per course (linked to
// the hub), row 3 the course ids (hidden, for a later import into the hub),
// then blank rows for people with a 0 to 5 drop-down in every cell, and a team
// average row underneath.

const HEADER_ROW = 2;
const ID_ROW = 3;
const FIRST_PERSON_ROW = 4;
const FIRST_COURSE_COL = 3; // A: name, B: role

const NAVY = "0A1F6E";
const GREY = "5B6573";
const RULE = "E1E5EB";

const argb = (hex: string) => ({ argb: `FF${hex}` });
const solid = (hex: string) => ({ type: "pattern" as const, pattern: "solid" as const, fgColor: argb(hex) });
const thin = { style: "thin" as const, color: argb(RULE) };
const boxed = { top: thin, left: thin, bottom: thin, right: thin };

function columnLetter(n: number): string {
  let letters = "";
  for (let rest = n; rest > 0; rest = Math.floor((rest - 1) / 26)) {
    letters = String.fromCharCode(65 + ((rest - 1) % 26)) + letters;
  }
  return letters;
}

/** Excel sheet names: at most 31 characters and none of [ ] : * ? / \ */
const sheetName = (name: string) => name.replace(/[[\]:*?/\\]/g, "-").slice(0, 31);

function addGuideSheet(workbook: Workbook, hubUrl: string, scope: string, courseCount: number, sheets: string[]) {
  const ws = workbook.addWorksheet("How to use", { views: [{ showGridLines: false }] });
  ws.columns = [{ width: 3 }, { width: 30 }, { width: 80 }];
  let row = 2;

  const heading = (text: string) => {
    row += 1;
    const cell = ws.getCell(row, 2);
    cell.value = text;
    cell.font = { bold: true, size: 13, color: argb(NAVY) };
    row += 1;
  };
  const line = (label: string, text: string, style?: { fill: string; text: string }) => {
    const left = ws.getCell(row, 2);
    const right = ws.getCell(row, 3);
    left.value = label;
    right.value = text;
    right.alignment = { wrapText: true, vertical: "top" };
    left.alignment = { vertical: "top" };
    if (style) {
      left.fill = solid(style.fill);
      left.font = { bold: true, color: argb(style.text) };
      left.border = boxed;
    }
    row += 1;
  };

  const title = ws.getCell(row, 2);
  title.value = "DigiBlu training matrix";
  title.font = { bold: true, size: 18, color: argb(NAVY) };
  row += 1;
  const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const intro = ws.getCell(row, 2);
  intro.value = `Created from the DigiBlu Learning Experience Knowledge Hub on ${date}. ${scope}: ${courseCount} ${
    courseCount === 1 ? "course" : "courses"
  } on ${sheets.length} ${sheets.length === 1 ? "sheet" : "sheets"} (${sheets.join(", ")}).`;
  intro.font = { color: argb(GREY) };
  row += 1;
  const link = ws.getCell(row, 2);
  link.value = { text: hubUrl, hyperlink: hubUrl };
  link.font = { color: argb("1D6EF5"), underline: true };
  row += 1;

  heading("How to use it");
  line("1. Add people", "Each area of learning has its own sheet. Add one person per row: name in column A, role in column B.");
  line("2. Grade", "Use the drop-down in each cell to grade the person from 0 to 5 for that course or certification. Leave a cell blank if it does not apply to them.");
  line("3. Read across", "The Team average row under the people shows where the team is strong and where learning would help most. Course titles link to the course in the hub.");
  line("4. Keep it private", "This file will hold people's names and assessments, which is personal data. Keep it in a restricted SharePoint or Teams location, share it only with the people who need it, and never upload it to the Knowledge Hub.");
  line("5. Leave row 3 alone", "Each area sheet has a hidden row 3 holding course IDs. A later version of the hub will use them to import this matrix, so do not edit or delete it.");

  heading("Grades");
  for (const grade of GRADES) line(`${grade.value}  ${grade.label}`, grade.meaning, grade);

  heading("Column colours");
  for (const outcome of OUTCOMES) line(MATRIX_HEADERS[outcome].label, OUTCOME_INFO[outcome].blurb, MATRIX_HEADERS[outcome]);
}

function addAreaSheet(workbook: Workbook, name: string, courses: Course[], hubUrl: string) {
  const ws = workbook.addWorksheet(sheetName(name), {
    views: [{ state: "frozen", xSplit: FIRST_COURSE_COL - 1, ySplit: ID_ROW }],
  });
  ws.columns = [{ width: 28 }, { width: 24 }, ...courses.map(() => ({ width: 6.5 }))];

  const lastCol = FIRST_COURSE_COL + courses.length - 1;
  const lastPersonRow = FIRST_PERSON_ROW + MATRIX_PEOPLE_ROWS - 1;
  const averageRow = lastPersonRow + 1;

  const title = ws.getCell(1, 1);
  title.value = name;
  title.font = { bold: true, size: 14, color: argb(NAVY) };
  const hint = ws.getCell(1, 2);
  hint.value = "Grades 0 to 5: see the How to use sheet";
  hint.font = { italic: true, color: argb(GREY) };
  ws.getRow(1).height = 24;

  const header = ws.getRow(HEADER_ROW);
  header.height = 220;
  for (const [col, text] of [
    [1, "Name"],
    [2, "Role"],
  ] as const) {
    const cell = ws.getCell(HEADER_ROW, col);
    cell.value = text;
    cell.font = { bold: true, color: argb(NAVY) };
    cell.fill = solid("F6F7F9");
    cell.alignment = { vertical: "bottom" };
    cell.border = boxed;
  }
  courses.forEach((course, i) => {
    const style = MATRIX_HEADERS[course.outcome];
    const cell = ws.getCell(HEADER_ROW, FIRST_COURSE_COL + i);
    cell.value = {
      text: course.title,
      hyperlink: `${hubUrl}/courses/${course.id}/`,
      tooltip: `${course.provider} - ${MATRIX_HEADERS[course.outcome].label}`,
    };
    cell.fill = solid(style.fill);
    cell.font = { bold: true, size: 9, color: argb(style.text) };
    cell.alignment = { textRotation: 90, vertical: "bottom", horizontal: "center", wrapText: true };
    cell.border = boxed;
    ws.getCell(ID_ROW, FIRST_COURSE_COL + i).value = course.id;
  });
  ws.getCell(ID_ROW, 1).value = "Course ID (used to import this matrix later; do not edit)";
  ws.getRow(ID_ROW).hidden = true;

  for (let r = FIRST_PERSON_ROW; r <= lastPersonRow; r++) {
    ws.getRow(r).height = 20;
    for (let c = 1; c <= lastCol; c++) {
      const cell: Cell = ws.getCell(r, c);
      cell.border = boxed;
      if (c >= FIRST_COURSE_COL) cell.alignment = { horizontal: "center", vertical: "middle" };
    }
  }

  const first = `${columnLetter(FIRST_COURSE_COL)}${FIRST_PERSON_ROW}`;
  const grid = `${first}:${columnLetter(lastCol)}${lastPersonRow}`;

  // One drop-down rule for the whole grid. Set per cell instead, ExcelJS merges
  // the cells into overlapping ranges (it sorts "C10" before "C4"), which makes
  // Excel offer to repair the file. `dataValidations` is missing from its types.
  const validations = (ws as unknown as { dataValidations: { add(address: string, rule: DataValidation): void } })
    .dataValidations;
  validations.add(grid, {
    type: "list",
    allowBlank: true,
    formulae: [`"${GRADES.map((g) => g.value).join(",")}"`],
    showInputMessage: true,
    promptTitle: "Grade 0 to 5",
    prompt: GRADES.map((g) => `${g.value} ${g.label}`).join(", "),
    showErrorMessage: true,
    errorStyle: "stop",
    errorTitle: "Grade 0 to 5",
    error: "Choose a whole number from 0 to 5. The How to use sheet explains each grade.",
  });

  // Colour each grade like a heat map. The text comparison treats a grade typed
  // as text and one picked from the list the same, and leaves blanks uncoloured.
  ws.addConditionalFormatting({
    ref: grid,
    rules: GRADES.map((grade, i) => ({
      type: "expression" as const,
      priority: i + 1,
      formulae: [`AND(${first}<>"",${first}&""="${grade.value}")`],
      style: {
        fill: { type: "pattern" as const, pattern: "solid" as const, bgColor: argb(grade.fill) },
        font: { bold: true, color: argb(grade.text) },
      },
    })),
  });

  const label = ws.getCell(averageRow, 1);
  label.value = "Team average";
  label.font = { bold: true, color: argb(NAVY) };
  ws.getRow(averageRow).height = 22;
  for (let c = 1; c <= lastCol; c++) {
    const cell = ws.getCell(averageRow, c);
    cell.fill = solid("F6F7F9");
    cell.border = { ...boxed, top: { style: "medium", color: argb(NAVY) } };
    if (c < FIRST_COURSE_COL) continue;
    const col = columnLetter(c);
    cell.value = { formula: `IFERROR(AVERAGE(${col}${FIRST_PERSON_ROW}:${col}${lastPersonRow}),"")` };
    cell.numFmt = "0.0";
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.font = { bold: true, color: argb(NAVY) };
  }
}

/**
 * Downloads a matrix for the given courses: one sheet per area of learning, by each
 * course's main area. Pass `areaId` to put every course on that area's sheet
 * (used from an area page, where courses shared with another area belong there).
 */
export async function downloadTrainingMatrix({
  courses,
  scope,
  areaId,
}: {
  courses: Course[];
  scope: string;
  areaId?: SkillAreaId;
}) {
  const { default: ExcelJS } = await import("exceljs");
  const hubUrl = `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;

  const groups = SKILL_AREAS.map((area) => ({
    area,
    courses: courses.filter((c) => (areaId ? area.id === areaId : c.skillAreas[0] === area.id)),
  })).filter((g) => g.courses.length > 0);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DigiBlu Knowledge Hub";
  workbook.created = new Date();
  addGuideSheet(workbook, hubUrl, scope, courses.length, groups.map((g) => g.area.name));
  for (const group of groups) addAreaSheet(workbook, group.area.name, group.courses, hubUrl);

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const slug = (areaId ?? (groups.length === 1 ? groups[0].area.id : "all-areas")).toString();
  const date = new Date().toISOString().slice(0, 10);
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), { href: url, download: `DigiBlu-training-matrix-${slug}-${date}.xlsx` });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
