import type { NumberOfWheels } from "./types";

export interface UrlConfig {
  numberOfWheels: NumberOfWheels;
  teamTlas: string[];
}

const parseNumberOfWheels = (
  value: string | null | undefined,
): NumberOfWheels => {
  if (value === "2") return 2;
  return 1;
};

const parseTeamTlas = (value: string | null | undefined): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((tla) => tla.toUpperCase());
};

export const parseUrlConfig = (
  searchParams: URLSearchParams,
  defaults: { numberOfWheels: NumberOfWheels; teamTlas: string[] },
): UrlConfig => {
  const wheelParam = searchParams.get("wheel");
  const teamsParam = searchParams.get("teams");

  const numberOfWheels =
    parseNumberOfWheels(wheelParam) || defaults.numberOfWheels;
  const fromParams = parseTeamTlas(teamsParam);

  return {
    numberOfWheels,
    teamTlas: fromParams.length > 0 ? fromParams : defaults.teamTlas,
  };
};

export const serializeUrlConfig = (config: UrlConfig): string => {
  const params = new URLSearchParams();
  params.set("wheel", String(config.numberOfWheels));
  if (config.teamTlas.length > 0) {
    params.set("teams", config.teamTlas.join(","));
  }
  return params.toString();
};
