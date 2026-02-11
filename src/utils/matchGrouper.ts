import { Match } from '@/types';

/**
 * Groups matches into game weeks ensuring no team plays twice in the same week
 * For n teams with double round-robin: 
 * - Total matches = n × (n-1)
 * - Matches per week = n / 2
 * - Number of weeks = 2 × (n-1)
 * 
 * Examples:
 * - 6 teams → 30 matches → 3 matches/week → 10 weeks
 * - 20 teams → 380 matches → 10 matches/week → 38 weeks
 * 
 * Uses a backtracking algorithm to ensure weeks are completely filled
 */
export const groupMatchesByGameWeek = (
  matches: Match[],
  teamCount: number
): Match[][] => {
  if (matches.length === 0 || teamCount < 2) {
    return [];
  }

  const matchesPerWeek = Math.floor(teamCount / 2);
  const usedMatches = new Set<string>();
  const gameWeeks: Match[][] = [];

  /**
   * Backtracking function to find a complete week
   */
  const buildCompleteWeek = (
    availableMatches: Match[],
    currentWeek: Match[],
    teamsUsed: Set<string>
  ): Match[] | null => {
    // Success: found a complete week
    if (currentWeek.length === matchesPerWeek) {
      return [...currentWeek];
    }

    // Not enough matches left to complete the week
    const remainingNeeded = matchesPerWeek - currentWeek.length;
    if (availableMatches.length < remainingNeeded) {
      return null;
    }

    // Try each available match
    for (let i = 0; i < availableMatches.length; i++) {
      const match = availableMatches[i];
      
      // Skip if either team is already in this week
      if (
        teamsUsed.has(match.homeTeamId) ||
        teamsUsed.has(match.awayTeamId)
      ) {
        continue;
      }

      // Try adding this match
      const newTeamsUsed = new Set(teamsUsed);
      newTeamsUsed.add(match.homeTeamId);
      newTeamsUsed.add(match.awayTeamId);
      const newWeek = [...currentWeek, match];
      const remainingMatches = availableMatches.filter((_, idx) => idx !== i);

      // Recursively try to complete the week
      const result = buildCompleteWeek(remainingMatches, newWeek, newTeamsUsed);
      
      if (result !== null) {
        return result;
      }
    }

    return null;
  };

  // Build complete weeks until all matches are used
  const matchesCopy = [...matches];
  
  while (usedMatches.size < matches.length) {
    const availableMatches = matchesCopy.filter(
      (m) => !usedMatches.has(m.id)
    );

    if (availableMatches.length === 0) {
      break;
    }

    // Try to build a complete week
    const completeWeek = buildCompleteWeek(
      availableMatches,
      [],
      new Set<string>()
    );

    if (completeWeek && completeWeek.length === matchesPerWeek) {
      gameWeeks.push(completeWeek);
      completeWeek.forEach((match) => usedMatches.add(match.id));
    } else {
      // If backtracking fails, use greedy approach for remaining matches
      // This handles edge cases
      const greedyWeek: Match[] = [];
      const teamsInWeek = new Set<string>();

      for (const match of availableMatches) {
        if (
          !teamsInWeek.has(match.homeTeamId) &&
          !teamsInWeek.has(match.awayTeamId)
        ) {
          greedyWeek.push(match);
          teamsInWeek.add(match.homeTeamId);
          teamsInWeek.add(match.awayTeamId);
          usedMatches.add(match.id);

          if (greedyWeek.length >= matchesPerWeek) {
            break;
          }
        }
      }

      if (greedyWeek.length > 0) {
        gameWeeks.push(greedyWeek);
      } else {
        // No more valid groupings
        break;
      }
    }
  }

  return gameWeeks;
};
