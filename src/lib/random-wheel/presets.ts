import { DEFAULT_TEAM_IDS } from "./defaultTeams";

export interface WheelPresetItem {
  id: "default" | "champions-league" | "euro" | "world-cup";
  label: string;
  teamIds: number[];
  logoRef?: string;
}

const worldCupIds = [
  760, 770, 773, 764, 765, 762, 759, 784, 8601, 805, 758, 818, 799, 815, 766,
  771, 782, 769, 804, 788, 803, 791, 772,
];

const euroIds = [
  770, 773, 759, 760, 784, 765, 805, 8601, 799, 788, 816, 8873, 8872, 768, 777,
  780, 782, 790, 794, 798, 803, 811, 827, 1065, 1978,
];

const championsLeagueIds = [
  57, 61, 64, 65, 66, 73, 81, 86, 78, 98, 108, 109, 524, 5, 4, 3, 523, 559, 94,
  1903, 503, 498, 721, 678,
];

export const WHEEL_PRESETS: WheelPresetItem[] = [
  {
    id: "default",
    label: "Mixed",
    teamIds: DEFAULT_TEAM_IDS,
  },
  {
    id: "champions-league",
    label: "Champions League",
    teamIds: championsLeagueIds,
    logoRef: "/images/leagues/CL.png",
  },
  {
    id: "euro",
    label: "Euro",
    teamIds: euroIds,
    logoRef: "/images/leagues/EUR.PNG",
  },
  {
    id: "world-cup",
    label: "World Cup",
    teamIds: worldCupIds,
    logoRef: "/images/leagues/WC26.png",
  },
];

export function getPresetById(
  id: WheelPresetItem["id"],
): WheelPresetItem | undefined {
  return WHEEL_PRESETS.find((p) => p.id === id);
}
