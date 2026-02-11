import { Team, Match } from '@/types';

export const generateRoundRobinSchedule = (teams: Team[]): Match[] => {
  if (teams.length < 2) {
    return [];
  }

  const matches: Match[] = [];
  const teamCount = teams.length;
  const baseDate = Date.now();

  // Generate matches: each team plays every other team twice (home and away)
  for (let i = 0; i < teamCount; i++) {
    for (let j = 0; j < teamCount; j++) {
      if (i !== j) {
        // Home match: team i vs team j
        const homeMatchId = `match-${teams[i].id}-${teams[j].id}-home`;
        matches.push({
          id: homeMatchId,
          homeTeamId: teams[i].id,
          awayTeamId: teams[j].id,
          homeScore: null,
          awayScore: null,
          date: new Date(baseDate + matches.length * 86400000).toISOString(), // Spread matches over days
          completed: false,
        });
      }
    }
  }

  return matches;
};
