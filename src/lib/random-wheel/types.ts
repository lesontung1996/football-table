export type NumberOfWheels = 1 | 2;

export interface Team {
  id: number;
  name: string;
  tla: string;
  logoRef: string;
  starRating: number;
  defaultIncluded: boolean;
  /**
   * League code (e.g. "PL", "PD", "SA") or "Nation".
   */
  leagueOrNation: string;
}

export interface WheelConfiguration {
  id: string;
  numberOfWheels: NumberOfWheels;
  /**
   * League or nation identifiers (we use leagueOrNation codes from the team data).
   */
  includedLeagueOrNationIds: string[];
  /**
   * Team IDs explicitly excluded by the user.
   */
  excludedTeamIds: number[];
  /**
   * Optional explicit allow-list of team IDs; if non-empty,
   * only these teams are considered eligible.
   */
  includedTeamIds: number[];
  lastUpdatedAt: string;
  version: string;
  /**
   * Optional derived representation of the configuration encoded
   * into URL query parameters (e.g. "wheel=2&teams=ARS,MCI").
   */
  queryParamsSnapshot?: string;
}
