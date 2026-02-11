'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store';
import { loadLeagueState } from '@/utils/storage';
import { loadFromStorage } from '@/store/slices/leagueSlice';

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
      storeRef.current.dispatch(loadFromStorage(savedState));
    }
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
