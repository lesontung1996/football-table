import { Team, Match } from "@/types";

export const generateRoundRobinSchedule = (teams: Team[]): Match[][] => {
  const numTeams = teams.length;
  const participants: (Team | null | undefined)[] = [...teams]; // Copy array to avoid mutation
  if (numTeams % 2 !== 0) {
    participants.push(null); // 'null' represents a bye week
  }

  const n = participants.length;
  const rounds = {};
  const totalRounds = n - 1;

  // Generate the single round robin schedule using the circle method
  for (let i = 0; i < totalRounds; i++) {
    for (let j = 0; j < n / 2; j++) {
      const home = participants[j];
      const away = participants[n - 1 - j];
      if (home !== null && away !== null) {
        const matchId = `match-${home!.id}-${away!.id}`;
        const baseDate = Date.now();
        rounds[matchId] = {
          id: matchId,
          homeTeamId: home!.id,
          awayTeamId: away!.id,
          homeTeamName: home!.name,
          awayTeamName: away!.name,
          homeScore: null,
          awayScore: null,
          date: new Date(baseDate + n * 86400000).toISOString(), // Spread matches over days
          completed: false,
          gameWeek: i + 1,
        };
      }
    }
    // Rotate teams (except the first one, which is fixed)
    participants.splice(1, 0, participants.pop());
  }

  // const secondHalf = rounds.map((round) => {
  //   return round.map((match) => ({
  //     ...match,
  //     homeTeamId: match.awayTeamId,
  //     awayTeamId: match.homeTeamId,
  //   }));
  // });

  return rounds;
};
