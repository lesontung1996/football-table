# Implementation Plan: Random Team Wheel

**Branch**: `001-random-team-wheel` | **Date**: 2026-03-03 | **Spec**: `specs/001-random-team-wheel/spec.md`
**Input**: Feature specification from `/specs/001-random-team-wheel/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a visually engaging random team wheel page that lets users spin one or two wheels
to select football teams (clubs or nations) from a configurable pool loaded from
`src/data/teams.json`, using the existing Next.js + Redux Toolkit stack and FPL-inspired
Tailwind theme. Configuration and wheel state are stored locally in the browser and
mirrored into the route URL so each device can both remember and share its configuration.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (^5) in a Next.js 14.2.35 App Router project  
**Primary Dependencies**: Next 14.2.35, React ^18, React DOM ^18, @reduxjs/toolkit ^2.11.2, react-redux ^9.2.0, tailwindcss ^3.4.1, lucide-react ^0.575.0 (icons)  
**Storage**: Browser storage (e.g., localStorage or IndexedDB) for league, team, and match data; no server-side database unless explicitly introduced by a constitution amendment  
**Testing**: Manual functional testing via the Random Team Wheel UI flows (no unit, integration, or e2e tests for this feature initially)  
**Target Platform**: Modern desktop and mobile browsers  
**Project Type**: Web application (Next.js app)  
**Performance Goals**: Wheel spin animation and result display perceived as instant (≲ 2s) on typical devices; page load comparable to existing app pages  
**Constraints**: Local-first, offline-friendly league management; minimal dependency surface; clean, typed code and simple UX as per constitution; FPL-inspired visual theme  
**Scale/Scope**: Friends’ leagues and casual competitions; multiple concurrent leagues per browser

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean, Typed, Maintainable Code**: All wheel logic, configuration handling, and
  persistence will be implemented in typed Redux Toolkit slices and small React
  components, with existing ESLint/TS checks enforced. No additional architectural
  layers are introduced.
- **Simple, Friendly UX**: The Random Team Wheel page will expose a single primary
  flow (spin one or two wheels) with lightweight controls for category/league filters
  and clear empty/error states, keeping complexity low.
- **Responsive, Mobile-First Design**: Layout will be designed mobile-first using
  Tailwind responsive utilities, ensuring that one or two wheels, controls, and
  results are fully usable on small screens without horizontal scrolling.
- **Minimal, Explicit Dependencies**: The feature will rely only on the existing
  Next.js, React, Redux Toolkit, and Tailwind stack; no new third-party animation or
  visualization libraries will be added for the wheel.
- **Local-First Browser Persistence**: Wheel configuration (leagues/nations, team
  inclusion, number of wheels) will be stored via a small persistence service backed
  by browser storage and mirrored into URL query parameters, with safe handling when
  configuration is missing, corrupt, or partially specified via the URL.

## Project Structure

### Documentation (this feature)

```text
specs/001-random-team-wheel/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # UI and state contracts for wheel components
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx                     # Existing main page
│   └── random-wheel/
│       └── page.tsx                 # Random Team Wheel route
├── components/
│   ├── TeamList.tsx                 # Existing team list UI
│   └── random-wheel/
│       ├── RandomTeamWheel.tsx      # Core wheel rendering & spin controls
│       ├── WheelConfigPanel.tsx     # Include/exclude teams, leagues, nations
│       └── TeamStarRating.tsx       # Star rating display for teams
├── store/
│   ├── index.ts                     # Redux store setup
│   └── slices/
│       ├── normalizeTeamSlice.ts    # Existing normalized team state
│       └── randomTeamWheelSlice.ts  # Wheel configuration & UI state
├── lib/
│   └── random-wheel/
│       ├── randomSelection.ts       # Pure functions for random choice & seeding
│       └── defaultTeams.ts          # Curated default teams, leagues, nations
└── styles/
    └── globals.css                  # Tailwind base and global styles
```

**Structure Decision**: Implement Random Team Wheel as a dedicated `src/app/random-wheel`
route backed by focused components under `src/components/random-wheel`, Redux slices
under `src/store/slices`, and pure helper functions in `src/lib/random-wheel`. This
keeps wheel logic and configuration isolated but consistent with existing app patterns.

## Configuration & URL Sync Design

- Use Next.js App Router search params to read configuration from the URL on initial
  load of `/random-wheel`:
  - `wheel` → `numberOfWheels` (`1` or `2`).
  - `teams` → comma-separated TLAs representing the currently included team set.
- When configuration changes in the UI (toggling categories or teams, changing wheel
  count), update:
  - The Redux slice (`randomTeamWheelSlice`) as the single source of truth.
  - Browser storage via the persistence service.
  - The route URL using shallow navigation so the page does not fully reload.
- Precedence:
  - If URL query params are present, they seed initial configuration on first load
    (defaulting to `wheel=1` and a predefined default team TLA set if missing).
  - Subsequent changes keep URL, Redux state, and local storage in sync.
  - Invalid or unknown TLAs in the URL are ignored gracefully, falling back to defaults.

## Team Data Access Strategy

- Load the full team list from `src/data/teams.json` when the `random-wheel` route is
  rendered.
- Build an in-memory `Map<string, Team>` keyed by TLA (and/or ID) for fast resolution
  of teams from the `teams` query parameter and configuration state.
- Use this map to:
  - Construct the eligible team list for each spin.
  - Derive category-level toggle states (league/nation) from the currently included
    teams.


## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
