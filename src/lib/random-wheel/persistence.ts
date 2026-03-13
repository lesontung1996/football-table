import type { WheelConfiguration } from "./types";

const STORAGE_KEY = "football-table/random-wheel:v1";

const isBrowser = (): boolean => typeof window !== "undefined";

export const loadWheelConfiguration = (): WheelConfiguration | null => {
  if (!isBrowser()) return null;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as WheelConfiguration;
    return parsed;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to load random wheel configuration:", error);
    return null;
  }
};

export const saveWheelConfiguration = (config: WheelConfiguration): void => {
  if (!isBrowser()) return;

  try {
    const next: WheelConfiguration = {
      ...config,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to save random wheel configuration:", error);
  }
};

export const clearWheelConfiguration = (): void => {
  if (!isBrowser()) return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to clear random wheel configuration:", error);
  }
};
