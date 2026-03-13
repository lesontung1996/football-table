# UI Contract: RandomTeamWheel Component

This contract describes the core RandomTeamWheel UI component that renders one or two
random selection wheels and exposes configuration and result events.

## Props

- **teams**: `Team[]`
  - The list of eligible teams (after applying global app filters).
  - Each item follows the `Team` shape from `data-model.md`.

- **config**: `WheelConfiguration`
  - Current wheel configuration for this view (number of wheels, filters, etc.).

- **onConfigChange**: `(nextConfig: WheelConfiguration) => void`
  - Called when the user updates configuration via the UI (e.g., toggling leagues,
    changing number of wheels).

- **onSpin**: `() => void`
  - Called when the user initiates a spin. Component is responsible for handling UI
  state (e.g., disabling controls during animation) and will trigger `onResult` when
  the spin completes.

- **onResult**: `(result: { wheelCount: 1 | 2; teams: Team[] }) => void`
  - Called after the wheel animation completes with the selected team(s) for this spin.

## Behavior

- If `config.numberOfWheels` is `1`, render a single wheel and a single result.
- If `config.numberOfWheels` is `2`, render two wheels and two results, but still use a
  single `onSpin` to spin both together.
- If `teams` is empty, do not allow spinning and instead render a clear message that the
  user must include at least one team.
- The special "Select your favorite team" slice is treated like any other team slice and
  surfaced via `onResult` when selected.
- Star ratings are displayed for teams in the UI but do not change selection
  probabilities.

