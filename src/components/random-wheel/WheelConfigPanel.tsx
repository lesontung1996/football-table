"use client";

import type { Team, WheelConfiguration } from "@/lib/random-wheel/types";

interface WheelConfigPanelProps {
  allTeams: Team[];
  config: WheelConfiguration;
  includedTeams: Team[];
  onConfigChange: (nextConfig: WheelConfiguration) => void;
}

export function WheelConfigPanel({
  allTeams,
  config,
  includedTeams,
  onConfigChange,
}: WheelConfigPanelProps) {
  const includedIdSet = new Set(includedTeams.map((t) => t.id));

  const leaguesOrNations = Array.from(
    new Set(allTeams.map((t) => t.leagueOrNation)),
  ).sort();

  const toggleLeagueOrNation = (
    leagueOrNation: string,
    includeAll: boolean,
  ) => {
    const leagueTeams = allTeams.filter(
      (team) => team.leagueOrNation === leagueOrNation,
    );
    const currentIncluded = new Set(config.includedTeamIds);

    leagueTeams.forEach((team) => {
      if (includeAll) {
        currentIncluded.add(team.id);
      } else {
        currentIncluded.delete(team.id);
      }
    });

    onConfigChange({
      ...config,
      includedTeamIds: Array.from(currentIncluded),
    });
  };

  const toggleTeam = (teamId: number) => {
    const currentIncluded = new Set(config.includedTeamIds);
    if (currentIncluded.has(teamId)) {
      currentIncluded.delete(teamId);
    } else {
      currentIncluded.add(teamId);
    }
    onConfigChange({
      ...config,
      includedTeamIds: Array.from(currentIncluded),
    });
  };

  return (
    <section className="space-y-4 rounded-xl bg-fpl-1100/80 p-4 shadow-xl">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Wheel configuration
          </h2>
          <p className="text-xs text-white/70">
            Toggle leagues/nations or individual teams for the wheel.
          </p>
        </div>
      </header>

      <div className="max-h-80 space-y-3 overflow-y-auto pr-1 text-xs">
        {leaguesOrNations.map((group) => {
          const groupTeams = allTeams.filter(
            (team) => team.leagueOrNation === group,
          );
          const total = groupTeams.length;
          const includedCount = groupTeams.filter((team) =>
            includedIdSet.has(team.id),
          ).length;
          const allIncluded = includedCount === total && total > 0;
          const noneIncluded = includedCount === 0;

          return (
            <div
              key={group}
              className="rounded-lg bg-fpl-1000/80 p-3 ring-1 ring-white/5"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-white">
                    {group === "Nation" ? "National teams" : group}
                  </p>
                  <p className="text-[11px] text-white/60">
                    {includedCount}/{total} teams included
                  </p>
                </div>
                <div className="inline-flex gap-1">
                  <button
                    type="button"
                    onClick={() => toggleLeagueOrNation(group, true)}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                      allIncluded
                        ? "bg-white text-fpl-1100"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleLeagueOrNation(group, false)}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                      noneIncluded
                        ? "bg-fpl-900 text-white"
                        : "bg-fpl-900/40 text-white hover:bg-fpl-900/70"
                    }`}
                  >
                    None
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 md:grid-cols-3">
                {groupTeams.map((team) => {
                  const isIncluded = includedIdSet.has(team.id);
                  return (
                    <button
                      key={team.id}
                      type="button"
                      onClick={() => toggleTeam(team.id)}
                      className={`flex items-center justify-between rounded-md px-2 py-1 text-[11px] transition ${
                        isIncluded
                          ? "bg-fpl-900 text-white"
                          : "bg-fpl-1000 text-white/70 hover:bg-fpl-900/70"
                      }`}
                    >
                      <span className="truncate">{team.name}</span>
                      <span className="ml-1 text-[10px] uppercase opacity-80">
                        {team.tla}
                      </span>
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
