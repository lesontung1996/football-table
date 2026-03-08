import { DEFAULT_TEAM_TLAS } from "./defaultTeams";

export interface WheelPresetItem {
  id: "default" | "champions-league" | "euro" | "world-cup";
  label: string;
  teamTlas: string[];
  logoRef?: string;
}

const worldCupTlas = [
  "ESP",
  "ENG",
  "FRA",
  "BRA",
  "POR",
  "ARG",
  "GER",
  "ITA",
  "NED",
  "BEL",
  "URU",
  "COL",
  "CRO",
  "MAR",
  "JPN",
  "USA",
  "DEN",
  "MEX",
  "SEN",
  "SUI",
  "TUR",
  "ECU",
  "KOR",
];

const euroTlas = [
  "ENG",
  "FRA",
  "GER",
  "ESP",
  "ITA",
  "POR",
  "BEL",
  "NED",
  "CRO",
  "SUI",
  "AUT",
  "SCO",
  "NOR",
  "SVK",
  "SVN",
  "SRB",
  "DEN",
  "UKR",
  "POL",
  "CZE",
  "TUR",
  "ROU",
  "HUN",
  "ALB",
  "GEO",
];

const championsLeagueTlas = [
  "ARS",
  "CHE",
  "LIV",
  "MCI",
  "MUN",
  "TOT",
  "FCB",
  "RMA",
  "ATL",
  "MIL",
  "INT",
  "JUV",
  "PSG",
  "BVB",
  "B04",
  "LYO",
  "SEV",
  "VIL",
  "BEN",
  "FCP",
  "SPO",
  "RBL",
  "AJA",
];

export const WHEEL_PRESETS: WheelPresetItem[] = [
  {
    id: "default",
    label: "Mixed",
    teamTlas: DEFAULT_TEAM_TLAS,
  },
  {
    id: "champions-league",
    label: "Champions League",
    teamTlas: championsLeagueTlas,
    logoRef: "/images/leagues/CL.png",
  },
  {
    id: "euro",
    label: "Euro",
    teamTlas: euroTlas,
    logoRef: "/images/leagues/EUR.PNG",
  },
  {
    id: "world-cup",
    label: "World Cup",
    teamTlas: worldCupTlas,
    logoRef: "/images/leagues/WC26.png",
  },
];

export function getPresetById(
  id: WheelPresetItem["id"],
): WheelPresetItem | undefined {
  return WHEEL_PRESETS.find((p) => p.id === id);
}
