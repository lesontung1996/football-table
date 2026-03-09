import type { StoredResultEntry } from "./types";

const STORAGE_KEY = "football-table/random-wheel-results:v1";

const isBrowser = (): boolean => typeof window !== "undefined";

export const loadResultHistory = (): StoredResultEntry[] => {
  if (!isBrowser()) return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored) as StoredResultEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to load result history:", error);
    return [];
  }
};

export const saveResultHistory = (entries: StoredResultEntry[]): void => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to save result history:", error);
  }
};
