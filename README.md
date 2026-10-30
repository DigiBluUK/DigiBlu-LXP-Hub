# DigiBlu Learning Experience Hub

An interactive guide to courses, certifications and free learning for DigiBlu employees, organised by skill area and role.

**Version 1 (pilot):** browse by skill area, search and filter by what you get (certification, completion certificate or knowledge), cost, level and format, and save courses to *My list* in the browser.

## Run it

Needs Node.js 20 or later.

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

`npm run build` produces a static site in `out/` that any static web host can serve. A post-build step ([`scripts/flatten-prefetch.mjs`](scripts/flatten-prefetch.mjs)) fixes a Next.js 16.4 naming mismatch so link prefetching works on static hosts; always build with `npm run build`, not `next build` directly.

The hub installs like an app (Add to Home Screen on phones, Install in Edge or Chrome) and opens previously visited pages offline. The manifest is [`src/app/manifest.ts`](src/app/manifest.ts) and the service worker [`public/sw.js`](public/sw.js): pages are fetched from the network first, so a new release shows as soon as someone is online.

## Training matrix export

"Export training matrix" in the nav downloads an Excel workbook of every course: a How to use sheet, then one sheet per area of expertise with courses across the top and blank rows for people, graded 0 to 5. The file is generated in the browser ([`src/lib/training-matrix.ts`](src/lib/training-matrix.ts), using ExcelJS loaded only on click), so names typed into it never reach the hub. The grading scale and colours live in [`src/content/matrix.ts`](src/content/matrix.ts).

## Hosting

- **Now (temporary):** GitHub Pages. Every push to `main` runs [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml), which builds with `PAGES_BASE_PATH=/<repository name>` (Pages serves project sites from a sub-folder) and publishes `out/`.
- **Launch:** Cloudflare, as for the DigiBlu website, behind DigiBlu sign-in (Cloudflare Access). Build without `PAGES_BASE_PATH`. The hub is for DigiBlu employees only, so every page carries `noindex`.

Until the hub sits behind sign-in, this repository and the Pages link are public: add only public course information, never names or internal material.

What is left before launch, including SEO, AEO and GEO, is tracked in [`docs/launch-checklist.md`](docs/launch-checklist.md).

## Add or update a course

All course content lives in one file: [`src/content/courses.json`](src/content/courses.json). Copy an existing entry and edit it:

| Field | What to put |
|---|---|
| `id` | Permanent, lower-case words joined by hyphens, e.g. `data-pl300-power-bi-data-analyst`. **Never change or reuse an id**: saved lists point at it. |
| `title`, `provider`, `url`, `description` | The basics. `url` must start with `https://`. |
| `skillAreas` | One or more of `data-analytics`, `ai`, `automation-low-code`, `process-improvement`, `software-development`, `cloud-infrastructure`, `project-product-management`, `leadership-soft-skills`. The first is its main area. |
| `roles` | Who it suits, using the role names in [`src/content/skill-areas.ts`](src/content/skill-areas.ts). |
| `level` | `Beginner`, `Intermediate` or `Advanced` |
| `format` | `Online course`, `Learning path`, `Video`, `Guide` or `Book` |
| `cost` / `costDetails` | `Free` or `Paid`, plus a short note such as "Exam approx. US$165". |
| `outcome` | `Certification` (industry-recognised exam), `Completion certificate` or `Knowledge` (no credential). |
| `duration`, `prerequisites`, `tags` | Free text; `prerequisites` can be `""`. |
| `lastReviewed` | The date you checked the provider's page, e.g. `2026-10-20`. |

The build checks every entry. If anything is missing or misspelled, `npm run build` stops and names the entry and the field, so a broken update cannot go live. House style: no em dashes; use a spaced hyphen ( - ).

To retire a course, delete its entry. Anyone who saved it keeps the id in their list; it simply stops showing.

## How it is built

- Next.js 16 (App Router) with TypeScript and Tailwind CSS, exported as a static site (`output: "export"` in `next.config.ts`).
- Branding follows the DigiBlu website's `BRAND.md`: DM Sans, the `#1d6ef5` blue and the blue-to-navy gradients, dark theme by default with a light theme.
- `src/content/` holds the content, `src/lib/catalogue.ts` loads and validates it, and `src/lib/my-list.ts` stores saved courses in the browser.

## Roadmap

1. **Now:** version 1 pilot, run locally and shared for feedback.
2. **Next:** GitHub repository and a hosted address; sign-in with DigiBlu Microsoft accounts (Entra ID); progress tracking and My list on any device. This step removes `output: "export"` and adds a small database. Saved lists move across using the same course ids.
3. **Later:** learning paths per role, a simple way for L&D to add courses (e.g. from a spreadsheet or SharePoint list), and a link from Teams/SharePoint.
