import type { Team } from "./types";

export const randomTeamSelection = (
  teams: Team[],
  rng: () => number = Math.random,
): Team => {
  const randomIndex = Math.floor(rng() * teams.length);
  return teams[randomIndex];
};
