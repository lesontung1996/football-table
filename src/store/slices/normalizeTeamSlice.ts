import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Team } from "@/types";
import { RootState } from "@/store";

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
    removeTeam: teamsAdapter.removeOne,
    setTeams: teamsAdapter.setAll,
    clearTeams: teamsAdapter.removeAll,
  },
});

export const { addTeam, removeTeam, setTeams, clearTeams } = teamsSlice.actions;

export const { selectAll: selectAllTeams, selectById: selectTeamById } =
  teamsAdapter.getSelectors((state: RootState) => state.teams);

export default teamsSlice.reducer;
