import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeagueState, Team } from '@/types';
import { generateRoundRobinSchedule } from '@/utils/scheduleGenerator';

const initialState: LeagueState = {
  teams: [],
  matches: [],
};

const leagueSlice = createSlice({
  name: 'league',
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      // Check if team already exists
      const exists = state.teams.some(
        (team) => team.name.toLowerCase() === action.payload.name.toLowerCase()
      );
      if (!exists && state.teams.length < 20) {
        state.teams.push(action.payload);
      }
    },
    removeTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter((team) => team.id !== action.payload);
      // Remove matches involving this team
      state.matches = state.matches.filter(
        (match) =>
          match.homeTeamId !== action.payload && match.awayTeamId !== action.payload
      );
    },
    generateSchedule: (state) => {
      if (state.teams.length >= 2) {
        state.matches = generateRoundRobinSchedule(state.teams);
      }
    },
    updateMatchScore: (
      state,
      action: PayloadAction<{
        matchId: string;
        homeScore: number | null;
        awayScore: number | null;
      }>
    ) => {
      const match = state.matches.find((m) => m.id === action.payload.matchId);
      if (match) {
        match.homeScore = action.payload.homeScore;
        match.awayScore = action.payload.awayScore;
        match.completed =
          action.payload.homeScore !== null && action.payload.awayScore !== null;
      }
    },
    loadFromStorage: (state, action: PayloadAction<LeagueState>) => {
      return action.payload;
    },
    clearLeague: () => {
      return initialState;
    },
  },
});

export const {
  addTeam,
  removeTeam,
  generateSchedule,
  updateMatchScore,
  loadFromStorage,
  clearLeague,
} = leagueSlice.actions;

export default leagueSlice.reducer;
