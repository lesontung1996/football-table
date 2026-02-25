import { Match, TeamStats, Team } from "@/types";

export const calculateTeamStats = (
  teamMatches: Match[],
  team: Team,
): TeamStats => {
  const teamName = team.name;
  const teamId = team.id;

  let played = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let goalsFor = 0;
  let goalsAgainst = 0;

  teamMatches.forEach((match) => {
    if (
      match.completed &&
      match.homeScore !== null &&
      match.awayScore !== null
    ) {
      played++;

      const isHome = match.homeTeamId === teamId;
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;

      goalsFor += teamScore;
      goalsAgainst += opponentScore;

      if (teamScore > opponentScore) {
        wins++;
      } else if (teamScore === opponentScore) {
        draws++;
      } else {
        losses++;
      }
    }
  });

  const goalDifference = goalsFor - goalsAgainst;
  const points = wins * 3 + draws;

  return {
    teamId,
    teamName,
    played,
    wins,
    draws,
    losses,
    goalsFor,
    goalsAgainst,
    goalDifference,
    points,
    recentResults: [],
  };
};

export const getRecentResults = (
  matches: Match[],
  teamId: string,
  limit: number = 5,
): (string | null)[] => {
  const teamMatches = matches
    .filter(
      (match) =>
        match.completed && match.homeScore !== null && match.awayScore !== null,
    )
    .sort((a, b) => b.gameWeek - a.gameWeek)
    .slice(0, limit);

  return Array.from({ length: limit }).map((_, index) => {
    const match = teamMatches[teamMatches.length - 1 - index];
    if (!match) return null;
    const isHome = match.homeTeamId === teamId;
    const teamScore = isHome ? match.homeScore! : match.awayScore!;
    const opponentScore = isHome ? match.awayScore! : match.homeScore!;

    if (teamScore > opponentScore) return "W";
    if (teamScore === opponentScore) return "D";
    return "L";
  });
};

export const sortTeamsByRanking = (stats: TeamStats[]): TeamStats[] => {
  return [...stats].sort((a, b) => {
    // Sort by points (descending)
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    // Then by goal difference (descending)
    if (b.goalDifference !== a.goalDifference) {
      return b.goalDifference - a.goalDifference;
    }
    // Then by goals for (descending)
    return b.goalsFor - a.goalsFor;
  });
};
