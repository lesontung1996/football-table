import { configureStore, Middleware } from '@reduxjs/toolkit';
import leagueReducer from './slices/leagueSlice';
import { saveLeagueState } from '@/utils/storage';

const persistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  // Save to localStorage after state update
  const state = store.getState() as { league: ReturnType<typeof leagueReducer> };
  saveLeagueState(state.league);
  return result;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      league: leagueReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(persistenceMiddleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
