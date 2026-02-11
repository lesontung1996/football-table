import { LeagueState } from '@/types';

const STORAGE_KEY = 'football-league-state';

export const saveLeagueState = (state: LeagueState): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save league state to localStorage:', error);
    }
  }
};

export const loadLeagueState = (): LeagueState | null => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as LeagueState;
      }
    } catch (error) {
      console.error('Failed to load league state from localStorage:', error);
    }
  }
  return null;
};
