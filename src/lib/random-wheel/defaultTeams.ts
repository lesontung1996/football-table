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

export const allTeams: Team[] = teamsData;

export const teamsByTla: Map<string, Team> = new Map(
  allTeams.map((team) => [team.tla, team]),
);

export const getTeamByTla = (tla: string): Team | undefined =>
  teamsByTla.get(tla.toUpperCase());
