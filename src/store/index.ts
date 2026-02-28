import { configureStore, Middleware, PayloadAction } from "@reduxjs/toolkit";
import teamsReducer from "./slices/normalizeTeamSlice";
import matchesReducer from "./slices/normalizeMatchSlice";
import gamesReducer from "./slices/gamesSlice";
import { GameMeta } from "@/types";
import { saveGamesIndex } from "@/utils/storage";

const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  // Save to localStorage after state update
  const state = store.getState() as {
    games: ReturnType<typeof gamesReducer>;
    teams: ReturnType<typeof teamsReducer>;
    matches: ReturnType<typeof matchesReducer>;
  };
  const gamesArray: GameMeta[] = Object.values(state.games.entities);

  if ((action as PayloadAction).type.startsWith("games/")) {
    saveGamesIndex(gamesArray);
  }

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
