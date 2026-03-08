import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Team, WheelConfiguration } from "./types";
import { DEFAULT_TEAM_TLAS, teamsByTla } from "./defaultTeams";
import { loadWheelConfiguration, saveWheelConfiguration } from "./persistence";
import { parseUrlConfig, serializeUrlConfig } from "./urlSync";

export interface RandomTeamWheelConfigState {
  config: WheelConfiguration | null;
  includedTeams: Team[];
  setNumberOfWheels: (count: WheelConfiguration["numberOfWheels"]) => void;
  setTeamTlas: (tlas: string[]) => void;
  toggleTeam: (teamTla: string) => void;
}

const buildInitialConfig = (
  searchParams: URLSearchParams | null,
): WheelConfiguration => {
  const persisted = loadWheelConfiguration();

  const { numberOfWheels: numberOfWheelsFromUrl, teamTlas: teamTlasFromUrl } =
    parseUrlConfig(searchParams);

  return {
    numberOfWheels: numberOfWheelsFromUrl ?? persisted?.numberOfWheels ?? 1,
    teamTlas: teamTlasFromUrl ?? persisted?.teamTlas ?? DEFAULT_TEAM_TLAS,
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
    return config.teamTlas
      .map((tla) => teamsByTla.get(tla))
      .filter((team): team is Team => Boolean(team));
  }, [config?.teamTlas]);

  useEffect(() => {
    if (!config) return;

    saveWheelConfiguration(config);

    const urlConfig = {
      numberOfWheels: config.numberOfWheels,
      teamTlas: config.teamTlas,
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

  const setTeamTlas: RandomTeamWheelConfigState["setTeamTlas"] = (tlas) => {
    setConfig((prev) =>
      prev
        ? {
            ...prev,
            teamTlas: tlas,
          }
        : prev,
    );
  };

  const toggleTeam: RandomTeamWheelConfigState["toggleTeam"] = (teamTla) => {
    setConfig((prev) => {
      if (!prev) return prev;
      const includedSet = new Set(prev.teamTlas);
      if (includedSet.has(teamTla)) {
        includedSet.delete(teamTla);
      } else {
        includedSet.add(teamTla);
      }
      return {
        ...prev,
        teamTlas: Array.from(includedSet),
      };
    });
  };

  return {
    config,
    includedTeams,
    setNumberOfWheels,
    setTeamTlas,
    toggleTeam,
  };
};
