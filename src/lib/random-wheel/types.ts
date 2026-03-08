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
  numberOfWheels: NumberOfWheels;
  /**
   * Optional explicit allow-list of team IDs; if non-empty,
   * only these teams are considered eligible.
   */
  teamIds: number[];
}
