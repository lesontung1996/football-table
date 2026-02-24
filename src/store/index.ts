import { configureStore, Middleware } from "@reduxjs/toolkit";
import { saveLeagueState } from "@/utils/storage";
import teamsReducer from "./slices/normalizeTeamSlice";
import matchesReducer from "./slices/normalizeMatchSlice";

const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  // Save to localStorage after state update
  const state = store.getState() as {
    teams: ReturnType<typeof teamsReducer>;
    matches: ReturnType<typeof matchesReducer>;
  };
  const leagueState = {
    teams: Object.values(state.teams.entities),
    matches: Object.values(state.matches.entities),
  };
  saveLeagueState(leagueState);
  return result;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      teams: teamsReducer,
      matches: matchesReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(persistenceMiddleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
