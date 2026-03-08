import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Team, WheelConfiguration } from "./types";
import { DEFAULT_TEAM_IDS, teamsById } from "./defaultTeams";
import { loadWheelConfiguration, saveWheelConfiguration } from "./persistence";
import { parseUrlConfig, serializeUrlConfig } from "./urlSync";

export interface RandomTeamWheelConfigState {
  config: WheelConfiguration | null;
  includedTeams: Team[];
  setNumberOfWheels: (count: WheelConfiguration["numberOfWheels"]) => void;
  setTeamIds: (ids: number[]) => void;
  toggleTeam: (teamId: number) => void;
}

const buildInitialConfig = (
  searchParams: URLSearchParams | null,
): WheelConfiguration => {
  const persisted = loadWheelConfiguration();

  const { numberOfWheels: numberOfWheelsFromUrl, teamIds: teamIdsFromUrl } =
    parseUrlConfig(searchParams);
  return {
    numberOfWheels: numberOfWheelsFromUrl ?? persisted?.numberOfWheels ?? 1,
    teamIds: teamIdsFromUrl ?? persisted?.teamIds ?? DEFAULT_TEAM_IDS,
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
  }, []);

  const includedTeams = useMemo<Team[]>(() => {
    if (!config) return [];
    return config.teamIds
      .map((id) => teamsById.get(id))
      .filter((team): team is Team => Boolean(team));
  }, [config?.teamIds]);

  useEffect(() => {
    if (!config) return;

    saveWheelConfiguration(config);

    const urlConfig = {
      numberOfWheels: config.numberOfWheels,
      teamIds: config.teamIds,
    };

    const query = serializeUrlConfig(urlConfig);
    const url = query ? `${pathname}?${query}` : pathname;

    router.replace(url, { scroll: false });
  }, [config, pathname]);

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

  const setTeamIds: RandomTeamWheelConfigState["setTeamIds"] = (ids) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            teamIds: ids,
          }
        : prev,
    );
  };

  const toggleTeam: RandomTeamWheelConfigState["toggleTeam"] = (teamId) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const includedSet = new Set(prev.teamIds);
      if (includedSet.has(teamId)) {
        includedSet.delete(teamId);
      } else {
        includedSet.add(teamId);
      }
      return {
        ...prev,
        teamIds: Array.from(includedSet),
      };
    });
  };

  return {
    config,
    includedTeams,
    setNumberOfWheels,
    setTeamIds,
    toggleTeam,
  };
};
