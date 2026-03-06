import type { NumberOfWheels } from "./types";

export interface UrlConfig {
  numberOfWheels: NumberOfWheels;
  teamTlas: string[];
}

const parseNumberOfWheels = (
  value: string | null | undefined,
): NumberOfWheels | null => {
  if (!value) return null;
  if (value === "2") return 2;
  return 1;
};

const parseTeamTlas = (value: string | null | undefined): string[] | null => {
  if (!value) return null;
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((tla) => tla.toUpperCase());
};

export const parseUrlConfig = (
  searchParams: URLSearchParams | null,
): {
  numberOfWheels: NumberOfWheels | null;
  teamTlas: string[] | null;
} => {
  const wheelParam = searchParams?.get("wheel");
  const teamsParam = searchParams?.get("teams");

  return {
    numberOfWheels: parseNumberOfWheels(wheelParam),
    teamTlas: parseTeamTlas(teamsParam),
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
