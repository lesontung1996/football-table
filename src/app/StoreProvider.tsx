"use client";

import { useRef, useLayoutEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store";
import { loadGamesIndex, loadLeagueStateForKey } from "@/utils/storage";
import { setTeams } from "@/store/slices/normalizeTeamSlice";
import { setMatches } from "@/store/slices/normalizeMatchSlice";
import {
  hydrateGames,
  setCurrentGame,
  setIsLoading,
} from "@/store/slices/gamesSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  useLayoutEffect(() => {
    if (!storeRef.current) return;

    const store = storeRef.current;

    // 1. Load games index
    const gamesIndex = loadGamesIndex();

    if (gamesIndex.length === 0) {
      store.dispatch(setIsLoading(false));
      return;
    }

    store.dispatch(hydrateGames(gamesIndex));

    const currentGameId = store.getState().games.currentGameId;
    const currentGame =
      gamesIndex.find((g) => g.id === currentGameId) ?? gamesIndex[0];

    if (!currentGame) return;

    const leagueState = loadLeagueStateForKey(currentGame.storageKey);
    if (!leagueState) return;

    store.dispatch(setCurrentGame(currentGame.id));
    store.dispatch(setTeams(leagueState.teams));
    store.dispatch(setMatches(leagueState.matches));
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
