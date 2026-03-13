import type { NumberOfWheels } from "./types";

export interface UrlConfig {
  numberOfWheels: NumberOfWheels;
  teamIds: number[];
}

const parseNumberOfWheels = (
  value: string | null | undefined,
): NumberOfWheels | null => {
  if (!value) return null;
  if (value === "2") return 2;
  return 1;
};

const parseTeamIds = (value: string | null | undefined): number[] | null => {
  if (!value) return null;
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  const ids: number[] = [];
  for (const p of parts) {
    const n = Number(p);
    if (Number.isInteger(n)) ids.push(n);
  }
  return ids.length > 0 ? ids : null;
};

export const parseUrlConfig = (
  searchParams: URLSearchParams | null,
): {
  numberOfWheels: NumberOfWheels | null;
  teamIds: number[] | null;
} => {
  const wheelParam = searchParams?.get("wheel");
  const teamsParam = searchParams?.get("teams");

  return {
    numberOfWheels: parseNumberOfWheels(wheelParam),
    teamIds: parseTeamIds(teamsParam),
  };
};

export const serializeUrlConfig = (config: UrlConfig): string => {
  const params = new URLSearchParams();
  params.set("wheel", String(config.numberOfWheels));
  if (config.teamIds.length > 0) {
    params.set("teams", config.teamIds.join(","));
  }
  return params.toString();
};
