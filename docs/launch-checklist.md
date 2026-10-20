# DigiBlu LXP Hub: launch checklist

Everything between the version 1 pilot and a launched hub on its own address. Current as of 20 October 2026.

**Where it is now**: a static Next.js site, previewed on GitHub Pages and kept out of search engines (`noindex`). It moves to Cloudflare for launch, as the DigiBlu website did.

**How to use it**: tick a line when it is done and checked; note who checked it and when for anything that needed a decision. Before each release, also run the release checks at the bottom on a desktop browser and on a real phone, in dark and in light theme.

## 1. Decisions first

These change how much of the rest applies.

- [ ] **Audience**: public site (indexed, so SEO, AEO and GEO apply in full) or internal only (behind sign-in or Cloudflare Access, `noindex`, and sections 4 to 6 shrink to page titles and structured data for Copilot/SharePoint search).
- [ ] **Address**: e.g. `learn.digiblu.com`, or a path on digiblu.com.
- [ ] **Name**: final product name and short name (currently "DigiBlu Learning Experience Knowledge Hub" and "Knowledge Hub").
- [ ] **Ownership**: who owns the content (L&D), who approves new courses, and how often links and prices are re-checked (suggest quarterly).
- [ ] **Analytics**: none, privacy-first Cloudflare Web Analytics, or GA4 with Consent Mode like the website. A cookie banner is needed only if analytics sets cookies.

## 2. Content

- [ ] Replace the researched starter list with DigiBlu's own course list. Keep the `id` of anything already shared, because saved lists point at it.
- [ ] Every link opens the right, current page. Re-check the three flagged in research:
  - AWS Cloud Practitioner Essentials links to AWS's course-description page, not the course itself.
  - ILM Level 7 links to ILM's overview of all levels.
  - Google "Foundations of Project Management" is marked Free; confirm whether completing it needs a Coursera subscription.
- [ ] Prices confirmed or written as approximate; decide whether to show GBP alongside USD.
- [ ] Roles in each area agreed with the heads of practice, with one spelling per role.
- [ ] Decide whether DigiBlu's own material (onboarding, process training, TalentLMS courses) is listed alongside external courses.
- [ ] A "start here" pick per role, so a newcomer knows the first thing to do.
- [ ] `lastReviewed` set to the date each entry was actually checked.

## 3. Copy

Follow the website's voice rules (BRAND.md §10): direct and specific, UK English, no em dashes (a spaced hyphen instead), no invented figures or quotes.

- [ ] Read-through of the home page: hero, stats labels, the three kinds of learning, roadmap.
- [ ] Area introductions: one line on who the area is for and what to start with.
- [ ] Every course description in our own words, one or two sentences, saying who it suits.
- [ ] Empty states, the 404 page, the My list note and the footer.
- [ ] Footer: link to digiblu.com and a "Suggest a course" route (Microsoft Form or L&D mailbox).

## 4. SEO

Mirrors the website's setup (`lib/site.ts`, `app/sitemap.ts`, `app/robots.ts`).

- [ ] One `SITE_ORIGIN` setting drives every canonical URL, share image URL, sitemap entry and `robots.txt` line, overridable per environment.
- [ ] Unique title and description on every page (done for course and area pages; check home, Browse, Skill areas, My list).
- [ ] `sitemap.xml` and `robots.txt` generated at build.
- [ ] Share cards: a purpose-built 1200x630 image for the site and one per skill area, with `og:` and `twitter:` tags.
- [ ] One `h1` per page and a logical heading order.
- [ ] Indexing switched on (`ALLOW_INDEXING=true`) on the production build only. The GitHub Pages copy stays `noindex`.
- [ ] Google Search Console and Bing Webmaster Tools verified, sitemap submitted.

## 5. AEO (answer engines: featured snippets, AI overviews, Copilot)

- [ ] Each area page answers its obvious questions in plain sentences near the top, e.g. "Which Power BI certification should a Data Analyst take?"
- [ ] A short visible FAQ per area, with `FAQPage` structured data (only for questions shown on the page, as on the website).
- [ ] `Course` structured data on every course page: name, description, provider, level, `timeRequired`, free or paid, and the credential awarded.
- [ ] `BreadcrumbList` on course and area pages, `ItemList` on area and Browse pages.
- [ ] `Organization` structured data matching the website's (name, legal name, logo, LinkedIn).
- [ ] Key facts stay as text in consistent labels (Cost, Time to complete, Level), never only in images.

## 6. GEO (generative engines: ChatGPT, Copilot, Perplexity, Gemini)

- [ ] `llms.txt` at the site root: what the hub is, who curates it, and links to the main pages.
- [ ] AI crawler policy decided in `robots.txt` (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).
- [ ] Clear provenance on the page: who curated the list, when it was last reviewed, and why each course was picked.
- [ ] Optional: publish the catalogue as a static `courses.json` so assistants and internal tools can reuse it.
- [ ] Links to the hub from digiblu.com (careers or about) and LinkedIn.
- [ ] After launch, ask the main assistants a few real questions (e.g. "DigiBlu Power BI training") and record what they return.

## 7. Accessibility (WCAG 2.2 AA, as the website)

- [ ] Contrast audit with 0 failures in both themes.
- [ ] Keyboard only: skip link first, visible focus ring everywhere, filter chips and the mobile Filters button work with Enter and Space.
- [ ] Screen reader: chip on/off state, the live results count, and "opens in a new tab" on Go to course are announced.
- [ ] No sideways scrolling from 320px up; tap targets at least 24px.
- [ ] Reduced-motion setting removes the card movement.
- [ ] Accessibility statement page.

## 8. Design and quality

- [ ] Visual pass in both themes on desktop and a real phone. Version 1 was verified by measurement rather than screenshots.
- [ ] Lighthouse: aim for 100 on desktop across all four scores, as the website reached; 90+ on mobile.
- [ ] Scheduled link checker (a GitHub Action) that reports broken course links weekly.
- [ ] Tests for the content checks in `src/lib/catalogue.ts` and a smoke test that every page builds.
- [ ] If the catalogue passes a few hundred entries, add paging to Browse.

## 9. Hosting and release

- [ ] Repository in the DigiBluUK organisation, `main` protected, changes through pull requests.
- [ ] GitHub Pages preview live and `noindex`.
- [ ] Move to Cloudflare like the website: custom domain, security headers, Cloudflare Access if internal. Remove `PAGES_BASE_PATH` from that build.
- [ ] Branches and releases agreed (website pattern: `main` previews, a `v*` tag deploys production).
- [ ] After cut-over, retire the GitHub Pages copy so only one version exists.

## Release checks (every release)

- [ ] `npm run lint` and `npm run build` pass. The build fails on any content mistake, naming the entry and field.
- [ ] Home: search goes to Browse with the term filled in; the six area cards open their pages; the three kinds-of-learning panels open Browse filtered.
- [ ] Browse: search, every filter group, Clear all, sort, and a copied filtered link that opens the same view.
- [ ] Area page: role chips filter the list; Certifications, Courses with a certificate and Knowledge resources appear in that order.
- [ ] Course page: every fact present, Go to course opens the provider in a new tab, Save toggles, related courses show.
- [ ] My list: saved items appear in the order saved, survive a reload, and the count in the nav matches.
- [ ] Theme button flips the whole site and remembers the choice.
- [ ] A mistyped address shows the hub's own not-found page.

## Version 2 (after launch)

Sign-in with DigiBlu Microsoft accounts (Entra ID), progress tracking, My list on any device, learning paths per role. This step removes the static export and adds a small database; saved lists carry over by course id. See the roadmap in the README.
