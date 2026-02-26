"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store";
import {
  getGameStorageKey,
  loadGamesIndex,
  loadLegacyLeagueState,
  loadLeagueStateForKey,
  saveGamesIndex,
} from "@/utils/storage";
import { setTeams } from "@/store/slices/normalizeTeamSlice";
import { setMatches } from "@/store/slices/normalizeMatchSlice";
import { hydrateGames, setCurrentGame } from "@/store/slices/gamesSlice";
import { GameMeta } from "@/types";

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

  useEffect(() => {
    if (!storeRef.current) return;

    const store = storeRef.current;

    // 1. Load games index
    const gamesIndex = loadGamesIndex();

    // 2. If no games yet, try migrating from legacy single-league storage
    if (gamesIndex.length === 0) {
      const legacyState = loadLegacyLeagueState();
      if (legacyState) {
        const id = `game-${Date.now()}`;
        const storageKey = getGameStorageKey(id);
        const meta: GameMeta = {
          id,
          createdAt: new Date().toISOString(),
          storageKey,
          playerNamesSnapshot: legacyState.teams.map((t) => t.name),
        };

        // Persist migrated game index and league state
        saveGamesIndex([meta]);

        // Hydrate store with migrated data
        store.dispatch(hydrateGames([meta]));
        store.dispatch(setCurrentGame(id));
        store.dispatch(setTeams(legacyState.teams));
        store.dispatch(setMatches(legacyState.matches));
        return;
      }
    } else {
      // Hydrate games slice
      store.dispatch(hydrateGames(gamesIndex));

      const currentGameId = store.getState().games.currentGameId;
      const currentGame =
        gamesIndex.find((g) => g.id === currentGameId) ?? gamesIndex[0];

      if (currentGame) {
        const leagueState = loadLeagueStateForKey(currentGame.storageKey);
        if (leagueState) {
          store.dispatch(setCurrentGame(currentGame.id));
          store.dispatch(setTeams(leagueState.teams));
          store.dispatch(setMatches(leagueState.matches));
        }
      }
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
