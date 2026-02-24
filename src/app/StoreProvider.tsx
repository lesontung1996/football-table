"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "@/store";
import { loadLeagueState } from "@/utils/storage";
import { setTeams } from "@/store/slices/normalizeTeamSlice";
import { setMatches } from "@/store/slices/normalizeMatchSlice";

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
    // Load state from localStorage after component mounts (client-side only)
    const savedState = loadLeagueState();
    if (savedState && storeRef.current) {
      storeRef.current.dispatch(setTeams(savedState.teams));
      storeRef.current.dispatch(setMatches(savedState.matches));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
