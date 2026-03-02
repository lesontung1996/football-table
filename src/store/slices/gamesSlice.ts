import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { GameMeta } from "@/types";
import { RootState } from "@/store";

const gamesAdapter = createEntityAdapter({
  selectId: (game: GameMeta) => game.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

type GamesState = ReturnType<typeof gamesAdapter.getInitialState> & {
  currentGameId: string | null;
  isLoading: boolean;
};

const initialState: GamesState = {
  ...gamesAdapter.getInitialState(),
  currentGameId: null,
  isLoading: true,
};

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    hydrateGames(state, action: PayloadAction<GameMeta[]>) {
      gamesAdapter.setAll(state, action.payload);
      if (!state.currentGameId && action.payload.length > 0) {
        state.currentGameId = action.payload[0].id;
      }
      state.isLoading = false;
    },
    addGame(state, action: PayloadAction<GameMeta>) {
      gamesAdapter.addOne(state, action.payload);
      state.currentGameId = action.payload.id;
    },
    updateGame(state, action: PayloadAction<GameMeta>) {
      gamesAdapter.upsertOne(state, action.payload);
    },
    deleteGame(state, action: PayloadAction<string>) {
      gamesAdapter.removeOne(state, action.payload);
      if (state.currentGameId === action.payload) {
        const allGames = gamesAdapter.getSelectors().selectAll(state);
        state.currentGameId = allGames[0]?.id ?? null;
      }
    },
    setCurrentGame(state, action: PayloadAction<string | null>) {
      state.currentGameId = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  hydrateGames,
  addGame,
  updateGame,
  deleteGame,
  setCurrentGame,
  setIsLoading,
} = gamesSlice.actions;

export const gamesSelectors = gamesAdapter.getSelectors(
  (state: RootState) => state.games,
);

export const selectCurrentGameId = (state: RootState) =>
  (state.games as GamesState).currentGameId;

export const selectCurrentGame = (state: RootState) => {
  const id = selectCurrentGameId(state);
  if (!id) return null;
  return gamesSelectors.selectById(state, id) ?? null;
};

export const selectIsLoading = (state: RootState) =>
  (state.games as GamesState).isLoading;

export default gamesSlice.reducer;
