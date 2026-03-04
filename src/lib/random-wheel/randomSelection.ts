import type { Team } from "./types";

export const shuffleArray = <T>(items: T[], rng: () => number = Math.random): T[] => {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = array[i];
    array[i] = array[j];
    array[j] = tmp;
  }
  return array;
};

export interface RandomSelectionResult<T> {
  orderedItems: T[];
  selectedIndex: number | null;
  selectedItem: T | null;
}

export const randomSelection = <T>(
  items: T[],
  rng: () => number = Math.random,
): RandomSelectionResult<T> => {
  if (items.length === 0) {
    return {
      orderedItems: [],
      selectedIndex: null,
      selectedItem: null,
    };
  }

  const orderedItems = shuffleArray(items, rng);
  const selectedIndex = Math.floor(rng() * orderedItems.length);

  return {
    orderedItems,
    selectedIndex,
    selectedItem: orderedItems[selectedIndex] ?? null,
  };
};

export const randomTeamSelection = (
  teams: Team[],
  rng: () => number = Math.random,
): RandomSelectionResult<Team> => randomSelection<Team>(teams, rng);
