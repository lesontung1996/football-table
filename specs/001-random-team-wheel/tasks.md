# Tasks: Random Team Wheel

**Input**: Design documents from `/specs/001-random-team-wheel/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated unit, integration, or e2e tests for this feature initially (per user
request). Rely on manual functional testing guided by `quickstart.md`.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm baseline project setup and structure for the Random Team Wheel feature.

- [x] T001 Ensure project dependencies (Next 14.2.35, React ^18, Redux Toolkit ^2.11.2,
      react-redux ^9.2.0, tailwindcss ^3.4.1, TypeScript ^5) are installed and lockfile is up
      to date
- [x] T002 [P] Verify Tailwind FPL color theme configuration in `tailwind.config.ts` matches
      desired palette for the wheel UI
- [x] T003 Create route folder and placeholder page component for Random Team Wheel at
      `src/app/random-wheel/page.tsx`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before the Random Team Wheel user story
is implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T004 Define or confirm TypeScript `Team` type and related helpers based on
      `src/data/teams.json` in `src/lib/random-wheel/defaultTeams.ts`
- [x] T005 [P] Implement a teams loader in `src/lib/random-wheel/defaultTeams.ts` that reads
      from `src/data/teams.json` and builds a `Map<string, Team>` keyed by TLA
- [x] T006 [P] Implement `randomSelection` and shuffle utilities in
      `src/lib/random-wheel/randomSelection.ts` using uniform randomness and per‑spin
      shuffle
- [x] T007 Implement a small persistence service in `src/lib/random-wheel/persistence.ts`
      to read/write wheel configuration from browser storage under a namespaced key
- [x] T008 Implement URL sync helpers in `src/lib/random-wheel/urlSync.ts` to:
      parse `wheel` and `teams` query params into configuration and serialize configuration
      back into a query string
- [x] T009 Implement a reusable configuration hook `useRandomTeamWheelConfig` in
      `src/lib/random-wheel/useRandomTeamWheelConfig.ts` that: - Initializes state from URL + persistence - Exposes configuration state and setters - Keeps URL and local storage in sync on changes

**Checkpoint**: Foundation ready – user story implementation can now begin.

---

## Phase 3: User Story 1 - Spin a random team wheel (Priority: P1) 🎯 MVP

**Goal**: Let users open the Random Team Wheel page, spin one or two wheels, and see clearly
highlighted randomly selected team(s), with configuration shareable via URL and stored in
browser storage.

**Independent Test**: A user can open `/random-wheel` with or without query params, see a
wheel preconfigured with default or URL‑driven teams, spin once, and view the result(s) in a
modal, on both mobile and desktop, without touching other app pages.

### Implementation for User Story 1

- [x] T011 [P] [US1] Implement initial data loading in `src/app/random-wheel/page.tsx` to
      load teams via helpers in `src/lib/random-wheel/defaultTeams.ts`
- [x] T012 [P] [US1] Implement configuration initialization in
      `src/app/random-wheel/page.tsx` so the `useRandomTeamWheelConfig` hook reads `wheel`
      and `teams` query params via App Router search params and falls back to sensible
      defaults when missing
- [x] T013 [US1] Wire configuration initialization into the `useRandomTeamWheelConfig`
      hook so it becomes the single source of truth for wheel configuration state in
      this feature
- [x] T014 [P] [US1] Ensure `useRandomTeamWheelConfig` integrates with
      `src/lib/random-wheel/persistence.ts` so configuration changes are saved to
      browser storage
- [x] T015 [P] [US1] Implement `RandomTeamWheel.tsx` in
      `src/components/random-wheel/RandomTeamWheel.tsx` to render one or two wheels, using
      randomized slice ordering from `randomSelection.ts`
- [x] T016 [P] [US1] Implement `WheelConfigPanel.tsx` in
      `src/components/random-wheel/WheelConfigPanel.tsx` with: - League/nation category toggles (all/none) - Individual team toggles within each category
- [x] T017 [US1] Connect `WheelConfigPanel` to `useRandomTeamWheelConfig` so category and
      team toggles update configuration state and trigger URL + persistence updates
- [x] T018 [P] [US1] Ensure `useRandomTeamWheelConfig` (and/or a small helper in
      `src/app/random-wheel/page.tsx`) uses `urlSync` helpers and shallow navigation so
      configuration changes are reflected in the URL
- [x] T019 [P] [US1] Implement team logo display and grid styles in
      `src/components/random-wheel/RandomTeamWheel.tsx` (and related components) using
      Next.js `Image` with assets in `public/images/` and consistent width/height
- [x] T020 [US1] Implement spin interaction in `RandomTeamWheel`: - Trigger per‑spin shuffle and random selection via `randomSelection.ts` - Disable controls while animation is in progress
- [x] T021 [US1] Implement a result modal component in
      `src/components/random-wheel/ResultModal.tsx` that: - Announces the selected team for one wheel - Announces both teams for two wheels in a clear layout
- [x] T022 [US1] Wire result modal visibility and content to the spin completion event in
      `RandomTeamWheel` using local or slice state
- [x] T023 [US1] Add validation and user‑friendly error handling for: - No eligible teams (prevent spin, show message) - Invalid TLAs in the `teams` query param (ignore and fall back to defaults)
- [x] T024 [US1] Perform a manual UX pass on `/random-wheel` to ensure: - Flow is simple and obvious - Layout works on narrow mobile viewports and desktop - FPL theme and visuals are consistent with the rest of the app

**Checkpoint**: At this point, User Story 1 should be fully functional and testable
independently via manual testing.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple aspects of the Random Team Wheel experience.

- [ ] T025 [P] Refine animation timing and easing in `RandomTeamWheel.tsx` for a smooth,
      responsive spin experience
- [ ] T026 [P] Optimize logo asset usage (e.g., ensure SVGs/PNGs in `public/images/` are
      sized appropriately and not duplicated)
- [ ] T027 [P] Update or add documentation snippets in `specs/001-random-team-wheel/quickstart.md`
      if the UX or configuration behavior changes during implementation
- [ ] T028 Review configuration, URL sync, and persistence code for readability and
      maintainability; refactor small helpers into `src/lib/random-wheel/` where helpful

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies – can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion – BLOCKS all user story work.
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion.
- **Polish (Final Phase)**: Depends on User Story 1 being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) – no dependencies on
  other stories (this feature defines a single primary story).

### Within User Story 1

- Data loading, configuration init, and configuration hook wiring (T011–T013) should complete before
  advanced UI and URL/persistence integration (T014–T018).
- Core wheel rendering and logos (T015, T019) should be in place before spin interaction
  and modal wiring (T020–T022).

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational (CRITICAL – blocks user story).
3. Implement Phase 3 tasks up to and including:
   - Basic `/random-wheel` route
   - Data loading
   - Single‑wheel spin with modal result
4. **STOP and VALIDATE**: Manually test the end‑to‑end flow on mobile and desktop.

### Incremental Delivery

1. Deliver a minimal version with:
   - Single wheel
   - Default team set from `teams.json`
   - Simple spin and modal
2. Add:
   - Two‑wheel support
   - League/nation and team‑level toggles
   - URL + local storage configuration persistence
3. Polish visuals, animations, and responsive layout.
