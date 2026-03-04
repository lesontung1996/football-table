# Research: Random Team Wheel

## Random Selection Strategy

- **Decision**: Use `Math.random`-based selection in a small pure helper
  (`randomSelection.ts`) to pick a team uniformly from the eligible pool for each spin.
- **Rationale**: Uniform randomness is sufficient for a casual friends app; no need for
  cryptographic randomness or server coordination.
- **Alternatives considered**:
  - Cryptographically secure randomness (e.g., `crypto.getRandomValues`) — rejected as
    unnecessary complexity for this use case.
  - Seeded randomness for reproducible spins — can be added later if users request
    replayable sessions.

## Random Slice Ordering

- **Decision**: Before each spin, generate a randomized ordering of the eligible teams
  (e.g., via a Fisher–Yates shuffle) and use that order to lay out slices on the wheel.
- **Rationale**: Ensures that teams from the same league or nation are not consistently
  adjacent, and that visual placement feels fresh each spin.
- **Alternatives considered**:
  - Static ordering by league or name — rejected because it would cluster teams from the
    same league together and feel less random.
  - Per-session shuffle only — acceptable but less dynamic than per-spin shuffling.

## Wheel Animation Approach

- **Decision**: Implement wheel animation with CSS transforms and transitions (or
  keyframe animations) driven by React state, without pulling in external animation or
  canvas libraries.
- **Rationale**: Keeps dependency surface minimal and leverages existing React + Tailwind
  styling; good enough for simple spin/settle animations.
- **Alternatives considered**:
  - Dedicated spinning wheel/roulette libraries — rejected to honor the minimal
    dependency principle.
  - Canvas/WebGL-based rendering — rejected as overkill for a static set of slices and
    text labels.

## Local Storage & Configuration

- **Decision**: Store wheel configuration (included leagues/nations, included/excluded
  team IDs, number of wheels) in browser storage under a namespaced key (e.g.,
  `football-table/random-wheel:v1`) with a simple version field.
- **Rationale**: Aligns with the constitution’s local-first storage principle and
  ensures per-device preferences persist without backend work.
- **Alternatives considered**:
  - IndexedDB with a richer schema — can be introduced later if configuration grows,
    but key–value is sufficient initially.
  - No persistence — rejected because users expect their filters to "stick" across
    sessions.

## URL-Based Configuration Sharing

- **Decision**: Mirror the wheel configuration into the route URL as query parameters
  using:
  - `wheel`: number of wheels (`1` or `2`).
  - `teams`: comma-separated list of team TLAs representing the currently included team
    set.
- **Rationale**: This keeps URLs easy to share and reason about while still allowing the
  full configuration (including category toggles) to be derived from the included team
  set.
- **Alternatives considered**:
  - Encoding all config as a base64 JSON blob — more compact but opaque and harder to
    debug.
  - Using more granular parameters for categories and explicit include/exclude lists —
    more precise but leads to longer, harder-to-read URLs.

## Star Rating Usage

- **Decision**: Star rating (0–5 in 0.5 steps) is used for display and filtering only,
  not to weight random selection probabilities; every included team has equal chance.
- **Rationale**: Keeps fairness simple and predictable while still showing perceived
  strength/popularity; avoids users feeling the draw is "rigged."
- **Alternatives considered**:
  - Weighting selection by rating — rejected for now as it complicates mental model and
    may feel unfair.

## Testing Strategy

- **Decision**: For this feature, rely on manual functional testing of the Random Team
  Wheel flows (single and double wheel, configuration, edge cases) during development.
- **Rationale**: The user explicitly requested no unit, integration, or e2e tests for
  now; we still respect linting and type-checking to maintain baseline quality.
- **Alternatives considered**:
  - Adding React Testing Library/Jest-based tests now — deferred to keep scope small,
    but the design keeps logic in pure helpers and slices so tests can be added later.

