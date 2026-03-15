# SEO Audit Report — Football Wheel

**Site:** Football Wheel (footballwheel.com)  
**Audit date:** 2026-03-15  
**Scope:** Full site; technical, on-page, and content tone aligned with **playful, fun, casual use with friends** to pick a random football team.

---

## Executive Summary

**Overall health:** **Good** — Robots, sitemap, metadataBase, Open Graph, Twitter cards, JSON-LD, and per-route titles/descriptions are in place since the last audit. Remaining work is mainly **tone** (more playful and friend-focused), **canonicals on inner pages**, and **one clear H1 + short crawlable intro** on the homepage so the main value proposition is obvious to users and crawlers.

**Top priorities**

1. **Content vibe** — Titles and descriptions are clear but could feel more playful and “for friends” rather than generic product copy.
2. **Canonicals on inner pages** — Only the root layout sets a canonical; `/league`, `/schedule`, `/table` should each set their own canonical URL.
3. **Homepage H1 and intro** — The only H1 is “Football Wheel” in the nav on every page. The wheel page has no static, crawlable intro; adding a short line + H1 in main content would reinforce “random team picker for you and your mates.”
4. **Sub-page copy tone** — League/Schedule/Table meta descriptions are functional; a light playful touch would match the brand.

**Quick wins**

- Add `alternates.canonical` to table, schedule, and league layouts.
- Soften and warm up root and sub-page title/description copy (playful, friends, no login, instant fun).
- Add a one-line intro and H1 on the wheel page (e.g. “Pick a random team — spin the wheel with your mates”).

---

## Technical SEO Findings

### 1. Canonicals on inner pages

| Field      | Detail |
|-----------|--------|
| **Issue** | Root layout sets `alternates.canonical: "/"` only. `/league`, `/schedule`, `/table` do not set a canonical, so search engines may not get an explicit canonical URL for those paths. |
| **Impact** | Low–Medium. Helps avoid duplicate signals if URLs are ever accessed with query params or trailing slashes. |
| **Evidence** | `src/app/layout.tsx` has `alternates: { canonical: "/" }`; `table/layout.tsx`, `schedule/layout.tsx`, `league/layout.tsx` do not set `alternates`. |
| **Fix** | In each of `table`, `schedule`, and `league` layout.tsx, add `metadataBase` (or rely on root) and `alternates: { canonical: "/table" }`, etc. |
| **Priority** | Medium. |

### 2. Robots and sitemap

| Field      | Detail |
|-----------|--------|
| **Status** | **OK.** `robots.ts` allows `/` and points to sitemap; `sitemap.ts` lists `/`, `/league`, `/schedule`, `/table` with sensible priorities and changeFrequency. |
| **Recommendation** | No change. |

### 3. Schema (JSON-LD)

| Field      | Detail |
|-----------|--------|
| **Status** | **OK.** Root layout includes WebApplication JSON-LD (name, description, keywords, url). |
| **Recommendation** | Optional: add BreadcrumbList for inner pages later if you want richer SERP display. |

### 4. Mobile, HTTPS, URL structure

| Field      | Detail |
|-----------|--------|
| **Observation** | Viewport and responsive layout in place; production should use HTTPS. URLs are clean and descriptive. |
| **Recommendation** | Run PageSpeed Insights and Mobile-Friendly Test on the live URL when deployed. |

---

## On-Page SEO Findings

### 1. Title and description tone (playful, friends, casual)

| Field      | Detail |
|-----------|--------|
| **Current (root)** | Title: “Football Wheel — Random Football Team Picker \| Fast & fun”. Description: “Pick a random team in 1 click! Use our football wheel spinner for Premier League, Champions League, National Teams, & more. No login needed. Fast, fun, and fully customizable.” |
| **Issue** | Already good; can lean more into “with friends” and “for your next game” to match the desired vibe. |
| **Impact** | Medium for CTR and brand fit. |
| **Fix** | Slight rewrites to stress “with friends,” “for your next kickabout,” or “no sign-up — just spin” while keeping primary keywords (random football team picker, wheel, etc.). |
| **Priority** | High (quick win). |

### 2. Sub-page titles and descriptions

| Field      | Detail |
|-----------|--------|
| **Current** | Table: “League Table \| Football Wheel” + “View your league standings…”. Schedule: “Schedule \| Football Wheel” + “View your fixtures…”. League: “My Leagues \| Football Wheel” + “Create and manage your leagues…”. |
| **Issue** | Clear but a bit formal; a friendlier line can match the casual vibe (e.g. “Your league table,” “Fixtures for your game,” “Your games with mates”). |
| **Impact** | Low–Medium. |
| **Fix** | Keep titles; optionally shorten and warm up descriptions. |
| **Priority** | Medium. |

### 3. Heading structure and homepage content

| Field      | Detail |
|-----------|--------|
| **Issue** | Single H1 site-wide is “Football Wheel” in the nav. The wheel page has no visible H1 in the main content and no short, crawlable intro (e.g. “Pick a random team” + one sentence). |
| **Impact** | Medium. A clear H1 and one line of copy in main content would reinforce the page topic and “for friends” use case for both users and crawlers. |
| **Evidence** | `Navigation.tsx` uses `<h1>Football Wheel</h1>`; wheel page is client-only with no intro block. |
| **Fix** | Add a small intro block on the wheel page (e.g. H1 “Pick a random team” + one playful sentence like “Spin the wheel with your mates — no sign-up, no fuss.”). Optionally reduce the nav to a styled link or aria-label so the main H1 is in the content. |
| **Priority** | High. |

### 4. Images and internal links

| Field      | Detail |
|-----------|--------|
| **Observation** | Logo has descriptive alt; nav links to `/`, `/league`, `/schedule`, `/table`. Structure is fine. |
| **Recommendation** | No change. |

---

## Content Findings (Playful / Casual / Friends)

- **Primary content** is the random team wheel and presets. The value proposition (“pick a random team with friends, no login”) is strong but could be stated once in plain text on the homepage.
- **Tone** — Avoid sounding like corporate or generic SaaS. Prefer:
  - “with your mates” / “with friends”
  - “for your next game” / “for your kickabout”
  - “no sign-up” / “no login”
  - “spin and play”
  - Short, punchy sentences.
- **AI-writing tells** (from project reference): E.g. avoid overuse of “delve,” “leverage,” “comprehensive,” “seamless,” em dashes. Current copy is already clean; keep new copy conversational.

---

## Prioritized Action Plan

### Critical / high impact

1. **Canonicals** — Add `alternates.canonical` for `/table`, `/schedule`, `/league` in their layouts.
2. **Homepage H1 + intro** — Add a short crawlable block on the wheel page: H1 (e.g. “Pick a random team”) + one sentence (playful, friends, no sign-up).
3. **Root title/description** — Tweak for a more “playful, with friends” vibe while keeping keywords and length (title ~50–60 chars, description ~150–160).

### Quick wins

4. **Sub-page descriptions** — Slightly warmer, shorter descriptions for table/schedule/league.
5. **JSON-LD description** — If you change the root meta description, keep the JSON-LD `description` in sync.

### Longer term

6. Run **PageSpeed Insights** and **Core Web Vitals** on the live domain.
7. Use **Google Search Console** to confirm indexation and monitor queries.
8. Consider **BreadcrumbList** schema on inner pages if you want richer SERPs.

---

## Summary Table

| Area                    | Status   | Priority |
|-------------------------|----------|----------|
| robots.txt              | OK       | —        |
| Sitemap                 | OK       | —        |
| Root canonical          | OK       | —        |
| Inner-page canonicals   | Missing  | Medium   |
| Root title/description  | Good     | Tone tweak (High) |
| OG / Twitter            | OK       | —        |
| Schema (JSON-LD)        | OK       | —        |
| Per-route metadata      | OK       | Tone tweak (Medium) |
| Homepage H1 + intro     | Missing  | High     |
| Content vibe            | Functional | Playful/friends (High) |

---

*Audit performed using the project’s SEO audit skill. Focus: crawlability, on-page SEO, and content tone aligned with playful, fun, casual use with friends to pick a random football team.*
