# Data Model: Random Team Wheel

## Team

Represents a football team that can appear as a slice on the random wheel.

- **id**: stable unique identifier (string or UUID).
- **name**: display name of the team (string).
- **categoryType**: `"club"` or `"nation"` to distinguish league clubs from national
  teams.
- **leagueOrNation**: human-readable name of the league (e.g., "Premier League",
  "LaLiga") or country (e.g., "England", "Brazil").
- **logoRef**: optional logo reference (URL or asset key) used by the UI; may be empty
  if no logo is configured.
- **starRating**: numeric rating between 0 and 5 inclusive, in 0.5 increments, used for
  display and potential filtering (not for weighting randomness).
- **defaultIncluded**: boolean indicating whether the team is part of the default
  curated set when the user has not configured anything.
 - **tla**: short team code (e.g., "ARS", "MCI") used in URLs and configuration query
   parameters.

### Validation Rules

- `name` MUST be non-empty.
- `categoryType` MUST be either `"club"` or `"nation"`.
- `starRating` MUST be in the range \[0, 5] in steps of 0.5.
- `leagueOrNation` SHOULD be non-empty and consistent across teams sharing the same
  league or nation.

## WheelConfiguration

Represents how the wheel behaves for a particular user/device.

- **id**: configuration identifier (string), typically implicit (one config per device).
- **numberOfWheels**: `1` or `2`, indicating how many wheels are shown and spun.
- **includedLeagueOrNationIds**: list of identifiers (or names) for leagues/nations
  that are currently included (for UI grouping and toggling).
- **excludedTeamIds**: list of team IDs that the user has explicitly excluded.
- **includedTeamIds**: optional explicit allow-list of team IDs; if non-empty, only
  these teams are eligible (after applying other filters) and are reflected in the
  `teams` query parameter using their TLAs.
- **lastUpdatedAt**: timestamp of last configuration change.
- **version**: short string or number representing the configuration schema version
  (e.g., `"1"` or `"1.0"`), stored alongside the data to support future migrations.
- **queryParamsSnapshot**: optional derived representation of the configuration encoded
  into URL query parameters for sharing (e.g., `wheel=2&teams=ars,mun,mci`).

### Validation Rules

- `numberOfWheels` MUST be `1` or `2`.
- At least one team MUST be eligible before allowing a spin; otherwise the UI should
  present a clear message instead of spinning.

## DefaultTeamSet

Represents the curated list of popular teams shipped with the app.

- Implemented as a static list in `defaultTeams.ts` using the `Team` shape.
- Grouped logically by league and nation for use in configuration UI.
- Used whenever the user has no saved configuration.

