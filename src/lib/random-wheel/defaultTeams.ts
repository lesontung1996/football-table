import teamsData from "@/data/teams.json";
import type { Team } from "./types";

/**
 * Default curated set of team TLAs used when there is no
 * prior configuration in URL or persistence.
 *
 * This skews toward well-known clubs and nations to keep
 * the first experience feeling sensible.
 */
export const DEFAULT_TEAM_IDS: number[] = [
  57, 61, 64, 65, 66, 73, 81, 86, 78, 98, 108, 109, 764, 762, 773, 759, 770,
  760,
];

export const allTeams: Team[] = teamsData;

export const teamsByTla: Map<string, Team> = new Map(
  allTeams.map((team) => [team.tla, team]),
);

export const teamsById: Map<number, Team> = new Map(
  allTeams.map((team) => [team.id, team]),
);

export const getTeamByTla = (tla: string): Team | undefined =>
  teamsByTla.get(tla.toUpperCase());
