import { GameMeta, LeagueState } from "@/types";

const LEGACY_STORAGE_KEY = "football-league-state";
const GAMES_INDEX_KEY = "football-league-games";
const GAME_STORAGE_PREFIX = "football-league-state:";

export const getGameStorageKey = (gameId: string): string =>
  `${GAME_STORAGE_PREFIX}${gameId}`;

export const saveLeagueStateForKey = (
  storageKey: string,
  state: LeagueState,
): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save league state to localStorage:", error);
    }
  }
};

export const loadLeagueStateForKey = (
  storageKey: string,
): LeagueState | null => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as LeagueState;
      }
    } catch (error) {
      console.error("Failed to load league state from localStorage:", error);
    }
  }
  return null;
};

export const saveGamesIndex = (games: GameMeta[]): void => {
  if (typeof window !== "undefined") {
    try {
      const sorted = [...games].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
      localStorage.setItem(GAMES_INDEX_KEY, JSON.stringify(sorted));
    } catch (error) {
      console.error("Failed to save games index to localStorage:", error);
    }
  }
};

export const loadGamesIndex = (): GameMeta[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(GAMES_INDEX_KEY);
      if (stored) {
        return JSON.parse(stored) as GameMeta[];
      }
    } catch (error) {
      console.error("Failed to load games index from localStorage:", error);
    }
  }
  return [];
};

// Legacy helpers kept for one-time migration from single-league storage
export const loadLegacyLeagueState = (): LeagueState | null => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as LeagueState;
      }
    } catch (error) {
      console.error(
        "Failed to load legacy league state from localStorage:",
        error,
      );
    }
  }
  return null;
};
