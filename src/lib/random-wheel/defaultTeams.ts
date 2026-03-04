import teamsData from "@/data/teams.json";
import type { Team } from "./types";

/**
 * Default curated set of team TLAs used when there is no
 * prior configuration in URL or persistence.
 *
 * This skews toward well-known clubs and nations to keep
 * the first experience feeling sensible.
 */
export const DEFAULT_TEAM_TLAS: string[] = [
  // Premier League clubs
  "ARS",
  "CHE",
  "LIV",
  "MCI",
  "MUN",
  "TOT",
  // LaLiga
  "FCB",
  "RMA",
  "ATL",
  // Serie A
  "MIL",
  "INT",
  "JUV",
  // Nations
  "BRA",
  "ARG",
  "FRA",
  "GER",
  "ENG",
  "ESP",
];

const normalizeTeam = (raw: any): Team => ({
  id: Number(raw.id),
  name: String(raw.name),
  tla: String(raw.tla).toUpperCase(),
  logoRef: String(raw.logoRef),
  starRating: typeof raw.starRating === "number" ? raw.starRating : 0,
  defaultIncluded: Boolean(raw.defaultIncluded),
  leagueOrNation: String(raw.leagueOrNation),
});

export const allTeams: Team[] = (teamsData as any[]).map(normalizeTeam);

const teamsByTlaInternal: Map<string, Team> = new Map(
  allTeams.map((team) => [team.tla, team]),
);

export const teamsByTla = teamsByTlaInternal;

export const getTeamByTla = (tla: string): Team | undefined =>
  teamsByTlaInternal.get(tla.toUpperCase());

export const buildTeamsMap = (teams: Team[] = allTeams): Map<string, Team> =>
  new Map(teams.map((team) => [team.tla, team]));

export type { Team } from "./types";
