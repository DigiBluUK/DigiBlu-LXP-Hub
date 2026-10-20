# DigiBlu LXP Hub: launch checklist

Everything between the version 1 pilot and a launched hub on its own address. Current as of 20 October 2026.

**Where it is now**: a static Next.js site, previewed on GitHub Pages and kept out of search engines (`noindex`). It moves to Cloudflare for launch, as the DigiBlu website did.

**Who it is for**: DigiBlu employees only. It is an internal learning hub, not a marketing site: copy speaks to colleagues, nothing is written to attract outside visitors, and it stays out of public search engines for good.

**How to use it**: tick a line when it is done and checked; note who checked it and when for anything that needed a decision. Before each release, also run the release checks at the bottom on a desktop browser and on a real phone, in dark and in light theme.

## 1. Decisions first

These change how much of the rest applies.

- [x] **Audience**: internal only, for DigiBlu employees (decided 20 October 2026). Public SEO, AEO and GEO do not apply; sections 4 to 6 cover being easy to find and use inside DigiBlu instead.
- [ ] **Access control**: put the launched hub behind DigiBlu sign-in (Cloudflare Access with Microsoft Entra ID). Until then the repository and the GitHub Pages link are public, so only public course information goes in: no names, no internal material, no training-matrix data.
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
- [ ] Power Automate (added 20 October 2026 as the Automation & Low-Code area, at the manager's request). Re-check:
  - Microsoft retired PL-200 (31 August 2026), PL-600 (30 June 2026) and PL-500 (Power Automate RPA Developer), and is replacing PL-400 with AB-400. AB-620 (AI Agent Builder) is new and may still change.
  - The two Udemy course pages block automated checks; open them to confirm the details.
  - Pragmatic Works: confirm the completion certificate is included on the free plan.
  - The Microsoft Applied Skills are listed as free; Microsoft's pages do not state a price.
- [ ] Prices confirmed or written as approximate; decide whether to show GBP alongside USD.
- [ ] Roles in each area agreed with the heads of practice, with one spelling per role.
- [ ] Decide whether DigiBlu's own material (onboarding, process training, TalentLMS courses) is listed alongside external courses.
- [ ] A "start here" pick per role, so a newcomer knows the first thing to do.
- [ ] `lastReviewed` set to the date each entry was actually checked.

## 3. Copy

Follow the website's voice rules (BRAND.md §10): direct and specific, UK English, no em dashes (a spaced hyphen instead), no invented figures or quotes. Write for colleagues: say what something gives them and what it costs, never sell.

- [ ] Read-through of the home page: hero, stats labels, the three kinds of learning, "What's coming". (First internal-voice pass done 20 October 2026: example searches are labelled "Try", not "Popular", since the hub keeps no usage data.)
- [ ] Area introductions: one line on who the area is for and what to start with.
- [ ] Every course description in our own words, one or two sentences, saying who it suits.
- [ ] Empty states, the 404 page, the My list note and the footer.
- [ ] Footer: link to digiblu.com and a "Suggest a course" route (Microsoft Form or L&D mailbox).

## 4. Findability inside DigiBlu (in place of public SEO)

The hub stays `noindex` and out of public search engines permanently. What matters is that staff can find it where they already work.

- [ ] A pinned tab in the main Teams channel(s) and a link from the SharePoint intranet home page (Viva Connections if used).
- [ ] Mentioned in onboarding: new starters get the link on day one.
- [ ] Unique title and description on every page, so browser tabs, bookmarks and link previews in Teams read clearly (done for course and area pages; check home, Browse, Skill areas, My list).
- [ ] A share card image (1200x630) so links pasted into Teams show the hub's own preview. Only works once the address is reachable by Teams' link preview (check with Cloudflare Access on).
- [ ] One `h1` per page and a logical heading order (also helps screen readers).
- [ ] `robots.txt` that disallows everything on the production address, as a second guard alongside `noindex`.

## 5. AEO: answers for staff and for Copilot

Make the hub answer the questions staff actually ask, in the words they use.

- [ ] Each area page answers its obvious questions in plain sentences near the top, e.g. "Which Power BI certification should a Data Analyst take?"
- [ ] A short "Where do I start?" pick for each role.
- [ ] A short FAQ on how learning works at DigiBlu (who approves paid courses, how to claim exam fees, study time), once L&D confirms the answers. Nothing here should be guessed.
- [ ] Key facts stay as text in consistent labels (Cost, Time to complete, Level), never only in images.

## 6. GEO: AI assistants inside DigiBlu

- [ ] Decide whether Microsoft 365 Copilot should answer from the hub. Simplest route: a SharePoint page (or a document library) that carries the catalogue, which Copilot can already search; a Microsoft Graph connector is the fuller option.
- [ ] Optional: publish the catalogue as a static `courses.json` on the hub so internal tools and assistants can reuse it.
- [ ] Clear provenance on each page: who curates the list, when it was last checked, and why each course was picked.

## 7. Accessibility (WCAG 2.2 AA, as the website)

- [ ] Contrast audit with 0 failures in both themes.
- [ ] Keyboard only: skip link first, visible focus ring everywhere, filter chips and the mobile Filters button work with Enter and Space.
- [ ] Screen reader: chip on/off state, the live results count, and "opens in a new tab" on Go to course are announced.
- [ ] No sideways scrolling from 320px up; tap targets at least 24px.
- [ ] Reduced-motion setting removes the card movement.
- [ ] Accessibility statement page.

## 8. Design and quality

- [x] Navigation matches digiblu.com: transparent at rest, frosted floating panel on scroll, hamburger menu below 900px, round theme button, back-to-top button (20 October 2026).
- [x] Provider strip in the hero, built like the website's clients strip. A provider only appears when the catalogue has its courses (20 October 2026).
- [ ] Provider marks: confirm with marketing that showing them is fine. Marks come from Simple Icons (CC0 artwork, still the owners' trademarks); Microsoft, OpenAI and AWS restrict their logos, so they show as names. Official logo files can replace them if DigiBlu's partner status allows.
- [x] Installable as an app (web app manifest, app icons, offline service worker), with safe areas for notched phones and no zoom on tapping form controls (20 October 2026).
- [ ] Install it on a real iPhone, an Android phone and in Edge on Windows: check the icon, the full-screen launch, and that visited pages open with the network off. The in-app preview browser cannot run service workers, so offline mode is only proven by a simulated install so far.
- [ ] Visual pass in both themes on desktop and a real phone.
- [ ] Lighthouse: aim for 100 on desktop across all four scores, as the website reached; 90+ on mobile.
- [ ] Scheduled link checker (a GitHub Action) that reports broken course links weekly.
- [ ] Tests for the content checks in `src/lib/catalogue.ts` and a smoke test that every page builds.
- [ ] If the catalogue passes a few hundred entries, add paging to Browse.

## 9. Hosting and release

- [x] Repository in the DigiBluUK organisation (`DigiBluUK/DigiBlu-LXP-Hub`, 20 October 2026).
- [ ] Protect `main` and make changes through pull requests.
- [x] GitHub Pages preview live and `noindex`: https://digibluuk.github.io/DigiBlu-LXP-Hub/
- [ ] Move to Cloudflare like the website: custom domain, security headers, Cloudflare Access with DigiBlu sign-in. Remove `PAGES_BASE_PATH` from that build.
- [ ] Branches and releases agreed (website pattern: `main` previews, a `v*` tag deploys production).
- [ ] After cut-over, retire the GitHub Pages copy so only one version exists.

## Release checks (every release)

- [ ] `npm run lint` and `npm run build` pass. The build fails on any content mistake, naming the entry and field.
- [ ] Home: search goes to Browse with the term filled in; the six area cards open their pages; the three kinds-of-learning panels open Browse filtered.
- [ ] Browse: search, every filter group, Clear all, sort, and a copied filtered link that opens the same view.
- [ ] Area page: role chips filter the list; Certifications, Courses with a certificate and Knowledge resources appear in that order.
- [ ] Course page: every fact present, Go to course opens the provider in a new tab, Save toggles, related courses show.
- [ ] My list: saved items appear in the order saved, survive a reload, and the count in the nav matches.
- [ ] Nav: transparent at the top, frosted panel after scrolling; on a phone the menu opens, closes on Escape or a tap outside, and holds the theme switch.
- [ ] Provider strip scrolls, pauses on hover, and each name opens Browse filtered to that provider.
- [ ] Theme button flips the whole site and remembers the choice.
- [ ] A mistyped address shows the hub's own not-found page.

## Version 2 (after launch)

Sign-in with DigiBlu Microsoft accounts (Entra ID), progress tracking, My list on any device, learning paths per role. This step removes the static export and adds a small database; saved lists carry over by course id. See the roadmap in the README.
