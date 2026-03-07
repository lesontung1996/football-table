"use client";

import Image from "next/image";
import type { Team, WheelConfiguration } from "@/lib/random-wheel/types";
import leagues from "@/data/leagues.json";

interface WheelConfigPanelProps {
  allTeams: Team[];
  config: WheelConfiguration;
  includedTeams: Team[];
  onConfigChange: (nextConfig: WheelConfiguration) => void;
}

export default function WheelConfigPanel({
  allTeams,
  config,
  includedTeams,
  onConfigChange,
}: WheelConfigPanelProps) {
  const includedTlaSet = new Set(includedTeams.map((t) => t.tla));

  const leaguesOrNations = Array.from(
    new Set(allTeams.map((t) => t.leagueOrNation)),
  ).sort();

  const toggleLeagueOrNation = (
    leagueOrNation: string,
    includeAll: boolean,
  ) => {
    let result: string[] = [];
    const leagueTeamTlas = allTeams
      .filter((team) => team.leagueOrNation === leagueOrNation)
      .map((team) => team.tla);
    if (includeAll) {
      result = Array.from(new Set([...config.teamTlas, ...leagueTeamTlas]));
    } else {
      result = config.teamTlas.filter((tla) => !leagueTeamTlas.includes(tla));
    }
    onConfigChange({
      ...config,
      teamTlas: result,
    });
  };

  const toggleTeam = (teamTla: string) => {
    const currentIncluded = new Set(config.teamTlas);
    if (currentIncluded.has(teamTla)) {
      currentIncluded.delete(teamTla);
    } else {
      currentIncluded.add(teamTla);
    }
    onConfigChange({
      ...config,
      teamTlas: Array.from(currentIncluded),
    });
  };

  return (
    <section className="space-y-4 rounded-xl bg-fpl-1100/80 p-4 shadow-xl">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">Wheel configuration</h2>
          <p className="text-white/70">
            Toggle leagues/nations or individual teams for the wheel.
          </p>
        </div>
      </header>

      <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
        {leagues.map((league) => {
          const groupTeams = allTeams.filter(
            (team) => team.leagueOrNation === league.code,
          );
          const total = groupTeams.length;
          const includedCount = groupTeams.filter((team) =>
            includedTlaSet.has(team.tla),
          ).length;
          const allIncluded = includedCount === total && total > 0;
          const noneIncluded = includedCount === 0;

          return (
            <div
              key={league.code}
              className="rounded-lg bg-fpl-1000/80 p-3 ring-1 ring-white/5"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  {league.logoRef && (
                    <Image
                      src={league.logoRef}
                      alt={league.name}
                      width={20}
                      height={20}
                      className="h-4 w-4"
                    />
                  )}
                  <p className="font-semibold text-white">{league.name}</p>
                  <p className="text-sm text-white/60">
                    {includedCount}/{total} teams included
                  </p>
                </div>
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => toggleLeagueOrNation(league.code, true)}
                    className={`rounded-md px-2 py-1 text-sm font-semibold transition ${
                      allIncluded
                        ? "bg-white text-fpl-1100"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLeagueOrNation(league.code, false)}
                    className={`rounded-md px-2 py-1 text-sm font-semibold transition ${
                      noneIncluded
                        ? "bg-fpl-900 text-white"
                        : "bg-fpl-900/40 text-white hover:bg-fpl-900/70"
                    }`}
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
                {groupTeams.map((team) => {
                  const isIncluded = includedTlaSet.has(team.tla);
                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => toggleTeam(team.tla)}
                      className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm transition ${
                        isIncluded
                          ? "bg-fpl-900 text-white"
                          : "bg-fpl-1000 text-white/70 hover:bg-fpl-900/70"
                      }`}
                    >
                      <Image
                        src={team.logoRef}
                        alt={team.name}
                        width={50}
                        height={50}
                        className="h-6 w-6"
                      />
                      <span className="truncate">{team.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
