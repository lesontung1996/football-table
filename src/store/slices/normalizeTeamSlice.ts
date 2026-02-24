import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Match, Team } from "@/types";
import { RootState } from "@/store";
import { generateSchedule } from "./normalizeMatchSlice";

const teamsAdapter = createEntityAdapter({
  selectId: (team: Team) => team.id,
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

const initialState = teamsAdapter.getInitialState();

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    addTeam: teamsAdapter.addOne,
    updateTeam: teamsAdapter.updateOne,
    removeTeam: teamsAdapter.removeOne,
    setTeams: teamsAdapter.setAll,
    clearTeams: teamsAdapter.removeAll,
  },
  extraReducers: (builder) => {
    builder.addCase(
      generateSchedule,
      (state, action: PayloadAction<Match[]>) => {
        const teamMatchesMap: Record<string, string[]> = {};

        action.payload.forEach((match) => {
          if (!teamMatchesMap[match.homeTeamId]) {
            teamMatchesMap[match.homeTeamId] = [];
          }
          if (!teamMatchesMap[match.awayTeamId]) {
            teamMatchesMap[match.awayTeamId] = [];
          }

          teamMatchesMap[match.homeTeamId].push(match.id);
          teamMatchesMap[match.awayTeamId].push(match.id);
        });

        const updates = Object.entries(teamMatchesMap).map(
          ([teamId, matchIds]) => ({
            id: teamId,
            changes: { matchIds },
          }),
        );

        teamsAdapter.updateMany(state, updates);
      },
    );
  },
});

export const { addTeam, updateTeam, removeTeam, setTeams, clearTeams } =
  teamsSlice.actions;

export const { selectAll: selectAllTeams, selectById: selectTeamById } =
  teamsAdapter.getSelectors((state: RootState) => state.teams);

export const selectmatchIdssByTeamId = (
  state: RootState,
  teamId: string,
): string[] => selectTeamById(state, teamId)?.matchIds ?? [];

export default teamsSlice.reducer;
