import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Team, WheelConfiguration } from "./types";
import { DEFAULT_TEAM_TLAS, allTeams, teamsByTla } from "./defaultTeams";
import { loadWheelConfiguration, saveWheelConfiguration } from "./persistence";
import { parseUrlConfig, serializeUrlConfig } from "./urlSync";

export interface RandomTeamWheelConfigState {
  config: WheelConfiguration | null;
  includedTeams: Team[];
  setNumberOfWheels: (count: WheelConfiguration["numberOfWheels"]) => void;
  setIncludedTeamIds: (ids: number[]) => void;
  toggleTeam: (teamId: number) => void;
}

const buildInitialConfig = (
  searchParams: URLSearchParams | null,
): WheelConfiguration => {
  const persisted = loadWheelConfiguration();

  if (searchParams) {
    const urlConfig = parseUrlConfig(searchParams, {
      numberOfWheels: persisted?.numberOfWheels ?? 1,
      teamTlas:
        persisted?.includedTeamIds
          ?.map((id) =>
            allTeams.find((team) => team.id === id)?.tla ?? null,
          )
          .filter((tla): tla is string => Boolean(tla)) ?? DEFAULT_TEAM_TLAS,
    });

    const includedTeamIds = urlConfig.teamTlas
      .map((tla) => teamsByTla.get(tla)?.id ?? null)
      .filter((id): id is number => id !== null);

    if (includedTeamIds.length > 0) {
      return {
        id: persisted?.id ?? "default",
        numberOfWheels: urlConfig.numberOfWheels,
        includedLeagueOrNationIds: persisted?.includedLeagueOrNationIds ?? [],
        excludedTeamIds: [],
        includedTeamIds,
        lastUpdatedAt: persisted?.lastUpdatedAt ?? new Date().toISOString(),
        version: persisted?.version ?? "1",
        queryParamsSnapshot: serializeUrlConfig(urlConfig),
      };
    }
  }

  if (persisted) {
    return persisted;
  }

  const defaultIncludedTeamIds = DEFAULT_TEAM_TLAS.map(
    (tla) => teamsByTla.get(tla)?.id ?? null,
  ).filter((id): id is number => id !== null);

  return {
    id: "default",
    numberOfWheels: 1,
    includedLeagueOrNationIds: [],
    excludedTeamIds: [],
    includedTeamIds: defaultIncludedTeamIds,
    lastUpdatedAt: new Date().toISOString(),
    version: "1",
  };
};

export const useRandomTeamWheelConfig = (): RandomTeamWheelConfigState => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [config, setConfig] = useState<WheelConfiguration | null>(null);

  useEffect(() => {
    if (config === null) {
      setConfig(buildInitialConfig(searchParams));
    }
    // We intentionally only want this to run once on mount while config is null.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, searchParams]);

  const includedTeams = useMemo<Team[]>(() => {
    if (!config) return [];
    const excludedSet = new Set(config.excludedTeamIds);
    const explicitIncludedSet =
      config.includedTeamIds.length > 0
        ? new Set(config.includedTeamIds)
        : null;

    return allTeams.filter((team) => {
      if (excludedSet.has(team.id)) return false;
      if (explicitIncludedSet && !explicitIncludedSet.has(team.id)) {
        return false;
      }
      return true;
    });
  }, [config]);

  useEffect(() => {
    if (!config) return;

    saveWheelConfiguration(config);

    const teamTlas = config.includedTeamIds
      .map((id) => allTeams.find((team) => team.id === id)?.tla ?? null)
      .filter((tla): tla is string => Boolean(tla));

    const urlConfig = {
      numberOfWheels: config.numberOfWheels,
      teamTlas,
    };

    const query = serializeUrlConfig(urlConfig);
    const url = query ? `${pathname}?${query}` : pathname;

    router.replace(url, { scroll: false });
  }, [config, pathname, router]);

  const setNumberOfWheels: RandomTeamWheelConfigState["setNumberOfWheels"] = (
    count,
  ) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            numberOfWheels: count,
          }
        : prev,
    );
  };

  const setIncludedTeamIds: RandomTeamWheelConfigState["setIncludedTeamIds"] = (
    ids,
  ) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            includedTeamIds: ids,
          }
        : prev,
    );
  };

  const toggleTeam: RandomTeamWheelConfigState["toggleTeam"] = (teamId) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const includedSet = new Set(prev.includedTeamIds);
      if (includedSet.has(teamId)) {
        includedSet.delete(teamId);
      } else {
        includedSet.add(teamId);
      }
      return {
        ...prev,
        includedTeamIds: Array.from(includedSet),
      };
    });
  };

  return {
    config,
    includedTeams,
    setNumberOfWheels,
    setIncludedTeamIds,
    toggleTeam,
  };
};

