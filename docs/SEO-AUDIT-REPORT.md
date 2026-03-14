# SEO Audit Report — Football Wheel

**Site:** http://localhost:3000/ (Football Wheel)  
**Audit date:** 2026-03-14  
**Scope:** Technical SEO, on-page SEO, crawlability; single-page app + league/table/schedule routes.

---

## Executive Summary

**Overall health:** **Moderate** — The site has a solid base (meta title/description, viewport, semantic HTML, good accessibility on the wheel) but is missing several standard SEO and sharing controls. For a small, localhost-first app the impact is limited; for a production domain these gaps would hurt discoverability and sharing.

**Top priorities**

1. **No `robots.txt` or sitemap** — Crawlers get no guidance; add both before going live.
2. **No Open Graph / Twitter Card meta** — Shares will show generic or poor previews.
3. **Generic, short meta description** — Expand and align with primary intent (random team picker / matchups).
4. **No structured data (JSON-LD)** — Optional but useful for rich results and clarity of purpose.
5. **Sub-pages use root metadata only** — `/table`, `/schedule`, `/league` all share the same title/description.

**Quick wins**

- Add `robots.ts` and `sitemap.ts` in the App Router.
- Enrich root metadata (description length, keywords) and add `openGraph` and `twitter` in `layout.tsx`.
- Add per-route metadata for `/table`, `/schedule`, `/league` (via route layouts or `generateMetadata` where possible).

---

## Technical SEO Findings

### 1. No `robots.txt`

| Field      | Detail |
|-----------|--------|
| **Issue** | No `robots.txt` file or dynamic `robots.ts` in the app. |
| **Impact** | Medium. Crawlers use defaults (crawl everything). You lose ability to point to a sitemap or restrict non-production paths. |
| **Evidence** | No `app/robots.ts` or static `app/robots.txt` in the repo. |
| **Fix** | Add `src/app/robots.ts` (or `robots.js`) and export a default function returning a `MetadataRoute.Robots` object. Include `sitemap` URL and, if needed, disallow any dev/admin paths. |
| **Priority** | High before production launch. |

### 2. No XML sitemap

| Field      | Detail |
|-----------|--------|
| **Issue** | No sitemap.xml or dynamic `sitemap.ts`. |
| **Impact** | Medium. Search engines discover URLs by crawling and links; a sitemap speeds and clarifies indexation. |
| **Evidence** | No `app/sitemap.ts` or static `app/sitemap.xml`. |
| **Fix** | Add `src/app/sitemap.ts` using Next.js `MetadataRoute.Sitemap` (and optional `generateSitemaps` if you grow to many URLs). List homepage and key routes (`/`, `/league`, `/schedule`, `/table`) with appropriate `lastModified` and `changeFrequency`. |
| **Priority** | High before production launch. |

### 3. No canonical URL

| Field      | Detail |
|-----------|--------|
| **Issue** | No `<link rel="canonical">` in the document. |
| **Impact** | Low–Medium. Homepage can accumulate query-string variants (e.g. `?wheel=1&teams=...`); without a canonical, engines might treat them as separate URLs. |
| **Evidence** | Browser evaluation: `document.querySelector('link[rel="canonical"]')` returned `undefined`. |
| **Fix** | Set canonical in root `layout.tsx` metadata (e.g. `metadataBase` + `alternates.canonical`) to the clean URL (e.g. `https://yourdomain.com/`). For client-rendered routes with query params, consider a canonical to the path without params. |
| **Priority** | Medium (important once live on a real domain). |

### 4. URL structure and parameterized URLs

| Field      | Detail |
|-----------|--------|
| **Issue** | Homepage (and possibly other pages) use query parameters for state (`?wheel=1&teams=57,61,...`). These can be crawled and create many URL variants. |
| **Impact** | Medium for crawl budget and duplicate-looking content if those URLs are indexed. |
| **Evidence** | Observed URL: `http://localhost:3000/?wheel=1&teams=57%2C61%2C...`. |
| **Fix** | (1) Set a canonical to the path-only URL (e.g. `https://yourdomain.com/`). (2) In `robots.ts`, you can disallow query parameters for bots if the content is the same (e.g. `Disallow: /*?*`), or rely on canonical only. Prefer canonical so shared links still work. |
| **Priority** | Medium. |

### 5. Schema / structured data (JSON-LD)

| Field      | Detail |
|-----------|--------|
| **Issue** | No JSON-LD (or other structured data) detected on the page. |
| **Impact** | Low–Medium. Optional; improves potential for rich results and clarifies site type (e.g. WebApplication, SportsEvent) for search and assistants. |
| **Evidence** | In-browser check: `document.querySelectorAll('script[type="application/ld+json"]')` returned no nodes. (Note: schema was checked in the rendered page, not via static HTML fetch.) |
| **Fix** | Add a `<script type="application/ld+json">` in the root layout or homepage with a minimal `WebApplication` or `WebSite` object (name, description, url). Optionally add `SportsEvent` or custom types if you add event/match pages. Validate with [Rich Results Test](https://search.google.com/test/rich-results). |
| **Priority** | Low–Medium (enhancement). |

### 6. Mobile and technical baseline

| Field      | Detail |
|-----------|--------|
| **Observation** | Viewport meta is present (`width=device-width, initial-scale=1`). Layout is responsive; no separate m. subdomain. Tap targets and content parity were not formally tested. |
| **Recommendation** | Run [PageSpeed Insights](https://pagespeed.web.dev/) and [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly) once deployed to a public URL. |

### 7. HTTPS and security

| Field      | Detail |
|-----------|--------|
| **Observation** | Audit was on `http://localhost:3000`. For production, ensure full HTTPS, valid certificate, and no mixed content. |
| **Recommendation** | Standard production checklist; not applicable to localhost. |

---

## On-Page SEO Findings

### 1. Title tag

| Field      | Detail |
|-----------|--------|
| **Current** | “Football Wheel” (14 characters). |
| **Issue** | Short and generic; no primary keyword like “random team picker” or “matchup generator.” |
| **Impact** | Medium. Wasted SERP space and weaker relevance signal. |
| **Evidence** | Root `layout.tsx`: `title: "Football Wheel"`. |
| **Fix** | Use a descriptive title, e.g. “Football Wheel — Random Team Picker for Matches” or “Random Team Wheel | Pick Matchups Instantly.” Keep under ~60 characters. |
| **Priority** | High (quick win). |

### 2. Meta description

| Field      | Detail |
|-----------|--------|
| **Current** | “Football wheel for quick random team selection” (~44 characters). |
| **Issue** | Short; under the 150–160 character range; no clear CTA or differentiation. |
| **Impact** | Medium. Weaker click-through and relevance. |
| **Evidence** | Root `layout.tsx`: `description: "Football wheel for quick random team selection"`. |
| **Fix** | Write a unique description (150–160 chars) that includes the main intent (e.g. random team/matchup picker), key benefit (Champions League, leagues, 2 wheels), and a light CTA. Example: “Spin the wheel to pick random football teams for your next match. Use Champions League, Premier League, or custom leagues. One or two wheels — instant matchups.” |
| **Priority** | High (quick win). |

### 3. Open Graph and Twitter Card

| Field      | Detail |
|-----------|--------|
| **Issue** | No `og:title`, `og:description`, `og:image`, `og:url`, or Twitter Card meta. |
| **Impact** | High for sharing. Links will show default or poor previews on social and messaging apps. |
| **Evidence** | No `openGraph` or `twitter` in `layout.tsx` metadata; no `og:*` or `twitter:*` in evaluated meta. |
| **Fix** | In root `layout.tsx`, set `metadataBase` to your production URL, then add `openGraph` and `twitter` (title, description, images, card type). Add at least one shared image (e.g. 1200×630) in `public` and reference it. |
| **Priority** | High for any production or shared links. |

### 4. Heading structure

| Field      | Detail |
|-----------|--------|
| **Observation** | One H1 per page: “Football Wheel” in the nav. Main content uses H2 “Random Team Wheel for Your Matches.” Hierarchy is logical. |
| **Evidence** | Snapshot: `heading "Football Wheel" [level=1]`, `heading "Random Team Wheel for Your Matches" [level=2]`. |
| **Recommendation** | Fine as-is. If you want the main content to carry the primary keyword, you could make the hero heading H1 and the logo/brand in nav an H2 or styled span; current approach is still valid. |

### 5. Sub-pages (table, schedule, league)

| Field      | Detail |
|-----------|--------|
| **Issue** | `/table`, `/schedule`, `/league` are client components with no route-level metadata. They inherit the root title “Football Wheel” and the same description. |
| **Impact** | Medium. Duplicate/same title and description across pages; weaker relevance and worse UX in SERPs and tabs. |
| **Evidence** | `app/table/page.tsx`, `app/schedule/page.tsx`, `app/league/page.tsx` are `"use client"` with no `metadata` export (metadata in App Router is typically set in server layout or `generateMetadata`). |
| **Fix** | Add a server `layout.tsx` per route (e.g. `app/table/layout.tsx`) that exports `metadata` with unique `title` and `description` (e.g. “League Table | Football Wheel”, “Schedule | Football Wheel”, “My Leagues | Football Wheel”). |
| **Priority** | Medium. |

### 6. Images and alt text

| Field      | Detail |
|-----------|--------|
| **Observation** | Logo: `alt="Football Wheel"`. Preset/team images use `alt={preset.label}` or `alt={team.name}`. Wheel UI uses `role="img"` and `aria-label` (e.g. “Wheel 1”, “Spinning wheel”). |
| **Evidence** | Grep and component read: Navigation, WheelPreset, WheelConfigPanel, ResultHistory, ResultModal use descriptive alt; SpinningWheel uses `aria-label` and team logos use `team.name` in `getImageProps`. |
| **Recommendation** | No change required for SEO; alt/aria usage is appropriate. |

---

## Content Findings

- **Primary content** is the random team wheel and presets (Champions League, Euro, World Cup, leagues). Copy is short and clear (“Choose your teams, then spin the wheel to get instant matchups”).
- **Depth** is appropriate for a single-purpose tool; no thin-content issues for the main page.
- **E-E-A-T**: No author, about, or policy pages in scope; fine for a small app. For production, consider a minimal “About” or “How it works” and link to privacy/terms if you collect data.

---

## Prioritized Action Plan

### Critical / before production

1. Add **`robots.ts`** with sitemap URL and any disallow rules you need.
2. Add **`sitemap.ts`** listing `/`, `/league`, `/schedule`, `/table` (and any other public routes).
3. Set **canonical** and **metadataBase** in root layout to the production URL.
4. Add **Open Graph and Twitter Card** meta and at least one **og:image** (e.g. 1200×630).

### High impact

5. **Improve title**: include primary keyword and keep under ~60 characters.
6. **Improve meta description**: 150–160 characters, intent + benefit + CTA.
7. **Per-route metadata** for `/table`, `/schedule`, `/league` (unique titles and descriptions).

### Quick wins

8. Consider **JSON-LD** (WebSite/WebApplication) for the homepage.
9. Ensure **favicon** (e.g. `app/icon.png` or `app/favicon.ico`) exists for production.

### Longer term

10. Run **PageSpeed Insights** and **Core Web Vitals** on the live URL; fix any LCP/INP/CLS issues.
11. After launch, use **Google Search Console** (and optional Bing Webmaster Tools) to confirm indexation and submit sitemap.
12. If you add more pages (e.g. blog, help), keep **unique titles and descriptions** and consider **internal linking** from the homepage.

---

## Summary Table

| Area              | Status   | Priority |
|-------------------|----------|----------|
| robots.txt        | Missing  | High     |
| Sitemap           | Missing  | High     |
| Canonical         | Missing  | Medium   |
| Title             | Too short| High     |
| Meta description  | Too short| High     |
| OG / Twitter      | Missing  | High     |
| Schema (JSON-LD)  | Missing  | Low–Med  |
| Per-route metadata| Missing  | Medium   |
| H1 / headings     | OK       | —        |
| Image alt         | OK       | —        |
| Viewport / mobile | OK       | —        |

---

*Audit performed using the project’s SEO audit skill: crawlability and indexation, technical foundations, on-page optimization, and in-browser checks for meta and JSON-LD.*
