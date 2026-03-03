<!--
Sync Impact Report
- Version: 0.0.0 (template) → 1.0.0
- Modified principles: N/A (initial definition for this project)
- Added sections:
  - Core Principles
  - Stack & Technology Constraints
  - Development Workflow & Quality Gates
- Removed sections: None
- Templates:
  - ✅ .specify/templates/plan-template.md
  - ✅ .specify/templates/spec-template.md
  - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->

# Football Table Constitution

## Core Principles

### I. Clean, Typed, Maintainable Code

- All production code MUST be written in TypeScript and compiled as part of a Next.js
  14.2.35 app.
- State management for shared UI and domain state MUST use Redux Toolkit
  (`@reduxjs/toolkit`) and `react-redux` rather than ad-hoc global variables or custom
  event systems.
- Code MUST be organized into small, focused React components and utility modules with
  clear responsibilities and no unnecessary duplication.
- ESLint (with the Next.js config) and formatting MUST pass before merge; PRs that fail
  linting or type-checking MUST NOT be merged.
- Rationale: clean, typed code makes it safe to evolve league logic, scoring rules, and
  UX flows without unexpected breakage.

### II. Simple, Friendly UX

- The core flows — creating a league, adding games, and viewing the standings table —
  MUST be completable in a small number of obvious steps, with no required "setup
  wizard" complexity.
- Screens MUST show only the information and controls needed for the current task,
  avoiding configuration overload or deeply nested navigation.
- Copy, labels, and errors MUST be understandable by casual football friends, not just
  technical users.
- Empty states, error states, and success states MUST include a clear next action so
  users are never "stuck."
- Rationale: the primary users are groups of friends; the app should feel obvious and
  lightweight, not like an enterprise admin panel.

### III. Responsive, Mobile-First Design

- The app MUST remain fully usable on small mobile screens (≥320px width) and scale
  gracefully up to tablets and desktops.
- Tailwind CSS responsive utilities MUST be used for layout and spacing; fixed-width
  layouts that break on mobile are NOT allowed.
- Core interactions (creating leagues, entering scores, checking the table) MUST be
  fully usable with touch input, without requiring hover-only affordances.
- Visual hierarchy (headings, spacing, color) SHOULD make the primary action on each
  view immediately visible without scrolling on typical mobile devices.
- Rationale: most users will update scores and check standings on their phones during
  or after matches.

### IV. Minimal, Explicit Dependencies

- Only dependencies that directly support core value (league creation, game management,
  standings display) MAY be added. Convenience-only or "nice-to-have" libraries MUST be
  justified explicitly in the implementation plan.
- The core stack versions MUST match `package.json` unless the constitution is amended:
  - Next.js: `14.2.35`
  - React: `^18`
  - React DOM: `^18`
  - Redux Toolkit: `^2.11.2`
  - React Redux: `^9.2.0`
  - Tailwind CSS: `^3.4.1`
  - TypeScript: `^5`
  - ESLint: `^8`
  - lucide-react (icons): `^0.575.0`
- Any new dependency MUST:
  - Have a clear justification in the feature plan (why it is needed now).
  - List at least one simpler alternative that was considered (e.g., implementing a
    small helper in-house).
  - Use a pinned major/minor version and avoid unstable or experimental packages.
- Rationale: keeping the dependency surface small reduces bundle size, cognitive load,
  and upgrade risk.

### V. Local-First Browser Persistence

- League, team, and match data MUST be persisted in browser storage (e.g.,
  `localStorage` or IndexedDB) so that users can manage leagues without any backend
  deployment.
- Data models for leagues, teams, and matches MUST be versioned so that future schema
  changes can be migrated safely rather than silently discarding user data.
- Features that clear or reset data MUST make the impact explicit to users and SHOULD
  require a clear confirmation step.
- Rationale: local-first storage keeps the product easy to run and experiment with
  while allowing future evolution toward server-backed sync if needed.

## Stack & Technology Constraints

- This project is a Next.js App Router application built with React 18 and TypeScript.
- Styling MUST be implemented with Tailwind CSS (plus minimal custom CSS where needed
  for browser quirks), not with additional CSS frameworks.
- Global/shared state MUST be managed with Redux Toolkit slices and `react-redux`
  hooks; other state libraries (e.g., Zustand, MobX) MUST NOT be introduced without a
  constitution amendment.
- Persistent client-side storage MUST use a small, well-encapsulated persistence module
  (e.g., a "storage" service) rather than direct `localStorage` calls scattered
  throughout components.
- Any feature that requires functionality outside this stack (e.g., server persistence,
  authentication, real-time updates) MUST either:
  - Be explicitly scoped out in the spec, or
  - Trigger a constitution amendment that updates this section and the dependency
    principle.

## Development Workflow & Quality Gates

- Every feature MUST be captured as a spec (`spec.md`), plan (`plan.md`), and tasks list
  (`tasks.md`) under a feature directory, and each artifact MUST be consistent with the
  principles in this constitution.
- The "Constitution Check" gate in implementation plans MUST, at minimum, confirm:
  - Clean, typed code (TypeScript + linting + type-checking).
  - Simple, focused UX that does not bloat flows beyond what is needed.
  - Mobile-first, responsive layouts using Tailwind utilities.
  - Minimal dependency surface with explicit justification for any additions.
  - Local-first browser storage with safe handling of existing data.
- Pull requests MUST describe how the change respects or intentionally extends these
  principles; violations MUST be called out explicitly and justified.
- Before merging, reviewers MUST verify:
  - Linting and type-checking pass.
  - Key user flows affected by the change remain simple and mobile-friendly.
  - No unapproved dependencies or backend assumptions have been introduced.
- Quickstart and README documentation SHOULD remain aligned with the actual stack and
  UX flows; significant UX or stack changes MUST update docs in the same PR.

## Governance

- This constitution is the single source of truth for technical and UX principles of
  the Football Table project. Where it conflicts with ad-hoc practices, the
  constitution prevails.
- Amendments to principles or stack constraints MUST be proposed via pull request that:
  - Clearly describes the motivation and impact.
  - Updates this document, including version number and dates.
  - Updates any affected templates (`spec-template.md`, `plan-template.md`,
    `tasks-template.md`) and relevant documentation.
- Versioning follows semantic rules:
  - MAJOR: Breaking changes to principles or governance (e.g., dropping local-first
    storage or changing the core stack).
  - MINOR: New principles or sections, or material expansions to guidance.
  - PATCH: Clarifications, wording improvements, or non-semantic refinements.
- All PR reviews MUST treat constitution violations as CRITICAL. Violations MUST be
  resolved either by:
  - Changing the implementation to comply, or
  - Explicitly amending the constitution in the same or a follow-up PR.
- Runtime developer guidance (e.g., how to run the app, how to develop features) MUST
  live in `README.md` or feature-level quickstart docs and SHOULD reference the
  relevant parts of this constitution when trade-offs are documented.

**Version**: 1.0.0 | **Ratified**: 2026-03-03 | **Last Amended**: 2026-03-03

