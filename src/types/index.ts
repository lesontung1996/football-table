export interface Team {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number | null;
  awayScore: number | null;
  date: string;
  completed: boolean;
}

export interface TeamStats {
  teamId: string;
  teamName: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  recentResults: string[]; // Array of 'W', 'D', 'L'
}

export interface LeagueState {
  teams: Team[];
  matches: Match[];
}
