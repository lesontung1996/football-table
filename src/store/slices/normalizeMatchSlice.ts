import {
  createEntityAdapter,
  createSlice,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Match, Team } from "@/types";
import { generateRoundRobinSchedule } from "@/utils/scheduleGenerator";
import { RootState } from "@/store";

const matchesAdapter = createEntityAdapter({
  selectId: (match: Match) => match.id,
  sortComparer: (a, b) => a.date.localeCompare(b.date),
});

const initialState = matchesAdapter.getInitialState();

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {
    setMatches: matchesAdapter.setAll,
    updateMatch: matchesAdapter.updateOne,
    updateMatches: matchesAdapter.updateMany,
    clearMatches: matchesAdapter.removeAll,
    generateSchedule: {
      prepare: (teams: Team[]) => {
        const matches = generateRoundRobinSchedule(teams);
        return { payload: matches };
      },
      reducer: (state, action: PayloadAction<Match[]>) => {
        matchesAdapter.setAll(state, action.payload);
      },
    },
  },
});

export const {
  selectAll: selectAllMatches,
  selectById: selectMatchById,
  selectEntities: selectMatchesEntities,
} = matchesAdapter.getSelectors((state: RootState) => state.matches);

const groupedMatchesByGameWeek = createSelector(
  [selectAllMatches],
  (matches) => {
    return Object.values(Object.groupBy(matches, (match) => match.gameWeek));
  },
);

export const {
  setMatches,
  updateMatch,
  updateMatches,
  clearMatches,
  generateSchedule,
} = matchesSlice.actions;

export default matchesSlice.reducer;

export { groupedMatchesByGameWeek };
