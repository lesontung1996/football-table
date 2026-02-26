import { configureStore, Middleware } from "@reduxjs/toolkit";
import { saveGamesIndex, saveLeagueStateForKey } from "@/utils/storage";
import { GameMeta, LeagueState } from "@/types";
import teamsReducer from "./slices/normalizeTeamSlice";
import matchesReducer from "./slices/normalizeMatchSlice";
import gamesReducer from "./slices/gamesSlice";

const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  // Save to localStorage after state update
  const state = store.getState() as {
    games: ReturnType<typeof gamesReducer>;
    teams: ReturnType<typeof teamsReducer>;
    matches: ReturnType<typeof matchesReducer>;
  };

  console.log("state.games.entities", state.games.entities);

  const gamesArray: GameMeta[] = Object.values(state.games.entities);

  saveGamesIndex(gamesArray);

  return result;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      games: gamesReducer,
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
