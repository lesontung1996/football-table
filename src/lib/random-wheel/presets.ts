export interface WheelPresetItem {
  id:
    | "premier-league"
    | "la-liga"
    | "bundesliga"
    | "serie-a"
    | "ligue-1"
    | "champions-league"
    | "euro"
    | "world-cup";
  label: string;
  teamIds: number[];
  logoRef?: string;
}

const premierLeagueIds = [
  57, 58, 61, 62, 63, 64, 65, 66, 67, 71, 73, 76, 328, 341, 351, 354, 397, 402,
  563, 1044,
];

const laLigaIds = [
  77, 78, 79, 80, 81, 82, 86, 87, 88, 89, 90, 92, 94, 95, 263, 285, 298, 558,
  559, 1048,
];

const bundesligaIds = [
  1, 2, 3, 4, 5, 7, 10, 11, 12, 15, 16, 17, 18, 19, 20, 28, 44, 721,
];

const serieAIds = [
  98, 99, 100, 102, 103, 104, 107, 108, 109, 110, 112, 113, 115, 450, 457, 471,
  487, 586, 5890, 7397,
];

const ligue1Ids = [
  511, 512, 516, 519, 521, 522, 523, 524, 525, 529, 532, 533, 543, 545, 546,
  548, 576, 1045,
];

const worldCupIds = [
  760, 770, 773, 764, 765, 762, 759, 784, 8601, 805, 758, 818, 799, 815, 766,
  771, 782, 769, 804, 788, 803, 791, 772,
];

const euroIds = [
  770, 773, 759, 760, 784, 765, 805, 8601, 799, 788, 816, 8873, 8872, 768, 777,
  780, 782, 790, 794, 798, 803, 811, 827, 1065, 1978,
];

export const championsLeagueIds = [
  57, 61, 64, 65, 66, 73, 81, 86, 78, 98, 108, 109, 524, 5, 4, 3, 523, 559, 94,
  1903, 503, 498, 721, 678,
];

export const WHEEL_PRESETS: WheelPresetItem[] = [
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
  {
    id: "premier-league",
    label: "Premier League",
    teamIds: premierLeagueIds,
    logoRef: "/images/leagues/PL.png",
  },
  {
    id: "la-liga",
    label: "La Liga",
    teamIds: laLigaIds,
    logoRef: "/images/leagues/laliga.png",
  },
  {
    id: "bundesliga",
    label: "Bundesliga",
    teamIds: bundesligaIds,
    logoRef: "/images/leagues/BL1.png",
  },
  {
    id: "serie-a",
    label: "Serie A",
    teamIds: serieAIds,
    logoRef: "/images/leagues/c111.png",
  },
  {
    id: "ligue-1",
    label: "Ligue 1",
    teamIds: ligue1Ids,
    logoRef: "/images/leagues/FL1.png",
  },
];

export function getPresetById(
  id: WheelPresetItem["id"],
): WheelPresetItem | undefined {
  return WHEEL_PRESETS.find((p) => p.id === id);
}
